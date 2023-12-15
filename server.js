if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const jwt = require('jsonwebtoken');
const db = require('./database/db');
const { generateTokens } = require('./handlers/authHandlers');

//Routes
const assignmentRoutes = require('./routes/assignmentRoutes');
const courseRoutes = require('./routes/courseRoutes');
const presenceRoutes = require('./routes/presenceRoutes');
const resultRoutes = require('./routes/resultRoutes');
const studentRoutes = require('./routes/studentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const teacherRoutes = require('./routes/teacherRoutes');


const initializePassport = require('./passport-config');
initializePassport(
  passport,
  email => getUserByEmail(email),
  id => getUserById(id)
);

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', checkAuthenticated, (req, res) => {
  const { accessToken } = generateTokens(req.user.user_id, req.user.email, req.user.name);
  res.render('index.ejs', { name: req.user.name, accessToken });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

app.post('/login', checkNotAuthenticated, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login');
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      const role = req.user.role;
      switch (role) {
        case 'teacher':
          return res.redirect('/teacher');
        case 'student':
          return res.redirect('/student');
        case 'admin':
          return res.redirect('/admin');
        case 'parent':
          return res.redirect('/parent');
        default:
          return res.redirect('/');
      }
    });
  })(req, res, next);
});


app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs');
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const { nanoid } = require('nanoid');
    const user_id = nanoid(8);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const connection = await db.getConnection();
    await connection.query('INSERT INTO users (user_id, name, email, password, role) VALUES (?, ?, ?, ?, ?)', [user_id, req.body.name, req.body.email, hashedPassword, req.body.role]);
    connection.release();
    res.redirect('/login');
  } catch (error) {
    console.error('Error occurred during registration:', error);
    res.redirect('/register');
  }
});

app.delete('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
});


app.get('/teacher', checkAuthenticated, (req, res) => {
  const { accessToken } = generateTokens(req.user.user_id, req.user.email, req.user.name, req.user.role);
  res.render('teacher.ejs', { name: req.user.name, accessToken });
});


app.get('/student', checkAuthenticated, (req, res) => {
  const { accessToken } = generateTokens(req.user.user_id, req.user.email, req.user.name, req.user.role);
  res.render('student.ejs', { name: req.user.name, accessToken });
});


app.get('/parent', checkAuthenticated, (req, res) => {
  const { accessToken } = generateTokens(req.user.user_id, req.user.email, req.user.name, req.user.role);
  res.render('parent.ejs', { name: req.user.name, accessToken });
});



app.use('/admin', checkAuthenticated, (req, res) => {
  const { accessToken } = generateTokens(req.user.user_id, req.user.email, req.user.name, req.user.role);
  res.render('admin.ejs', { name: req.user.name, accessToken });
})


// ini untuk endpoint
app.use('/assignment', checkAuthenticated, assignmentRoutes);
app.use('/course', checkAuthenticated, courseRoutes);
app.use('/presence', checkAuthenticated, presenceRoutes);
app.use('/result', checkAuthenticated, resultRoutes);
app.use('/get-student', checkAuthenticated, studentRoutes);
app.use('/submission', checkAuthenticated, submissionRoutes);
app.use('/get-teacher', checkAuthenticated, teacherRoutes);

//dibawah ni function Middleware
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  next();
}

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
