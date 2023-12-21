if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database/db');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const {getAllUsers} = require('./handlers/userHandlers.js')
app.get('/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error retrieving all users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const assignmentRoutes = require('./routes/assignmentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const presenceRoutes = require('./routes/presenceRoutes');
const resultRoutes = require('./routes/resultRoutes');
const studentRoutes = require('./routes/studentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const parentRoutes = require('./routes/parentRoutes');

async function getUserByEmail(email) {
  const connection = await db.getConnection();
  const [users] = await connection.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  connection.release();
  return users.length > 0 ? users[0] : null;
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

//test
app.post('/test', (req, res) => {
  console.log(req.body); 
  res.json({ message: 'Received', data: req.body });
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);

  if (user == null || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send('Incorrect email or password');
  }

  const accessToken = jwt.sign(
    { user_id: user.user_id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET
  );
  res.json({ accessToken, role: user.role });
});

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Name, email, and password are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const { nanoid } = require('nanoid');
    const user_id = nanoid(8);

    const connection = await db.getConnection();
    await connection.query(
      'INSERT INTO users (user_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [user_id, name, email, hashedPassword, role || 'student']
    );
    connection.release();

    const user = await getUserByEmail(email);

    const accessToken = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({ accessToken, role: user.role });
  } catch (error) {
    res.status(500).json({
      message: 'Server error during registration',
      error: error.message,
    });
  }
});

app.get('/me', authenticateToken, async (req, res) => {
  try {
      const user = await getUserById(req.user.user_id);
      if (user) {
          res.json(user);
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  } catch (error) {
      res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
});

app.get('/teacher', authenticateToken, (req, res) => {
  res.json({ message: 'Access to protected route!', user: req.user });
});
app.get('/student', authenticateToken, (req, res) => {
  res.json({ message: 'Access to protected route!', user: req.user });
});
app.get('/admin', authenticateToken, (req, res) => {
  res.json({ message: 'Access to protected route!', user: req.user });
});
app.get('/parent', authenticateToken, (req, res) => {
  res.json({ message: 'Access to protected route!', user: req.user });
});



// ini untuk endpoint
app.use('/assignment', assignmentRoutes);
app.use('/course', courseRoutes);
app.use('/presence', presenceRoutes);
app.use('/result', resultRoutes);
app.use('/get-student', studentRoutes);
app.use('/submission', submissionRoutes);
app.use('/get-teacher', teacherRoutes);
app.use('/get-parent', parentRoutes);

async function getUserById(id) {
  const connection = await db.getConnection();
  const [users] = await connection.query('SELECT user_id, name, email FROM users WHERE user_id = ?', [id]);
  connection.release();
  return users.length > 0 ? users[0] : null;
}


async function getUserById(id) {
  const connection = await db.getConnection();
  const [users] = await connection.query(
    'SELECT * FROM users WHERE user_id = ?',
    [id]
  );
  connection.release();
  return users.length > 0 ? users[0] : null;
}

const PORT = process.env.PORT || 8080;

var server = app.listen(PORT, function() {
  console.log(`Server listening on port ${PORT}`);
});
