const express = require('express');
const app = express();
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');


app.use(express.json()); // Middleware to parse JSON request bodies

app.use('/courses', courseRoutes); // Use course routes
app.use('/students', studentRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});