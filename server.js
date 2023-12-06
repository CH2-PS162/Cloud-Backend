const express = require('express');
const app = express();
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const resultsRoutes = require('./routes/resultRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const presenceRoutes = require('./routes/presenceRoutes');


app.use(express.json()); // Middleware to parse JSON request bodies

app.use('/courses', courseRoutes); // Use course routes
app.use('/students', studentRoutes); // Use student routes
app.use('/assignment', assignmentRoutes); // Use assignment routes
app.use('/teachers', teacherRoutes);
app.use('/results', resultsRoutes);
app.use('/submission', submissionRoutes);
app.use('/presence', presenceRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});