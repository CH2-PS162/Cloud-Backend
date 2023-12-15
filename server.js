if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database/db');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
const assignmentRoutes = require('./routes/assignmentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const presenceRoutes = require('./routes/presenceRoutes');
const resultRoutes = require('./routes/resultRoutes');
const studentRoutes = require('./routes/studentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const teacherRoutes = require('./routes/teacherRoutes');


// Utility Functions
async function getUserByEmail(email) {
  const connection = await db.getConnection();
  const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
  connection.release();
  return users.length > 0 ? users[0] : null;
}

// JWT Middleware
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
  console.log(req.body); // Log the request body to the console
  res.json({ message: 'Received', data: req.body });
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);

  if (user == null || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send('Incorrect email or password');
  }

  const accessToken = jwt.sign({ user_id: user.user_id, email: user.email }, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken });
});

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const { nanoid } = require('nanoid');
    const user_id = nanoid(8);

    const connection = await db.getConnection();
    await connection.query('INSERT INTO users (user_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)', [user_id, name, email, hashedPassword, role || 'student']);
    connection.release();

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
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
app.use('/assignment', authenticateToken, assignmentRoutes);
app.use('/course', authenticateToken, courseRoutes);
app.use('/presence', authenticateToken, presenceRoutes);
app.use('/result', authenticateToken, resultRoutes);
app.use('/get-student', authenticateToken, studentRoutes);
app.use('/submission', authenticateToken, submissionRoutes);
app.use('/get-teacher', authenticateToken, teacherRoutes);


async function getUserByEmail(email) {
  const connection = await db.getConnection();
  const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
  connection.release();
  return users.length > 0 ? users[0] : null;
}

async function getUserById(id) {
  const connection = await db.getConnection();
  const [users] = await connection.query('SELECT * FROM users WHERE user_id = ?', [id]);
  connection.release();
  return users.length > 0 ? users[0] : null;
}

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
