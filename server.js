const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const authenticateToken = require('./middleware/authMiddleware');
const authorize = require('./middleware/authorize');
const User = require('./models/User');

const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const resultsRoutes = require('./routes/resultRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const presenceRoutes = require('./routes/presenceRoutes');


app.use(express.json()); // Middleware to parse JSON request bodies



//login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = new User();
    const foundUser = await user.findOneByUsername(username);

    if (!foundUser) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!bcrypt.compareSync(password, foundUser.password)) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Generate a token
    const token = jwt.sign({ username: foundUser.username, role: foundUser.role }, 'yourSecretKey', { expiresIn: '1h' });

    // Send the token in the response
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/courses', authenticateToken, authorize(['admin', 'teacher']), courseRoutes);
app.use('/students', authenticateToken, authorize(['admin', 'parent']), studentRoutes);
app.use('/assignment', authenticateToken, authorize(['admin', 'teacher']), assignmentRoutes);
app.use('/teachers', authenticateToken, authorize(['admin', 'teacher']), teacherRoutes);
app.use('/results', authenticateToken, authorize(['admin', 'teacher', 'student']), resultsRoutes);
app.use('/submission', authenticateToken, authorize(['admin', 'student']), submissionRoutes);
app.use('/presence', authenticateToken, authorize(['admin', 'teacher', 'student', 'parent']), presenceRoutes);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});