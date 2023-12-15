Cloud Backend
Cloud Backend is a Node.js web application designed for educational institutions. It facilitates the management of assignments, courses, presence, results, students, submissions, and teachers. With an intuitive interface and a robust backend, this application is an essential tool for administrators, teachers, students, and parents.

Features
User Authentication: Secure login and registration system for users.
Role-Based Access Control: Different interfaces and functionalities for teachers, students, parents, and administrators.
Course Management: Creation and management of courses.
Assignment Management: Posting and tracking of assignments.
Presence Tracking: Record and monitor student attendance.
Results Management: Enter and view student academic results.
Student and Teacher Profiles: Manage student and teacher information.
Getting Started
These instructions will get you a copy of the project up and running on your local machine.

Prerequisites
Node.js
npm (Node Package Manager)
MySQL Database


Installing
Clone the repository:

git clone https://github.com/CH2-PS162/Cloud-Backend.git
cd Cloud-Backend

Install dependencies:
npm install

Set up the environment variables:
Create a .env file in the root directory and add the following:


makefile (.env)
SESSION_SECRET=YourSessionSecret

Start the server:
npm start
The server will start running on http://localhost:4000.

File Structure
Cloud-Backend/
│
├── database/              # Database configuration and scripts
│   └── db.js
│
├── handlers/              # Business logic
│   ├── authHandlers.js
│   ├── assignmentHandlers.js
│   ├── courseHandlers.js
│   ├── presenceHandlers.js
│   ├── resultHandlers.js
│   ├── studentHandlers.js
│   ├── submissionHandlers.js
│   └── teacherHandlers.js
│
├── models/                # Database models
│   ├── assignments.js
│   ├── courses.js
│   ├── presences.js
│   ├── results.js
│   ├── students.js
│   ├── submissions.js
│   └── teachers.js
│
├── routes/                # Express routes
│   ├── assignmentRoutes.js
│   ├── courseRoutes.js
│   ├── presenceRoutes.js
│   ├── resultRoutes.js
│   ├── studentRoutes.js
│   ├── submissionRoutes.js
│   └── teacherRoutes.js
│
│
├── passport-config.js     # Passport.js configuration
├── app.js                 # Main application file
└── package.json


Fetch Presence Records (check test.rest - install .rest extension in visual studio code)
  GET http://localhost:4000/presence/date/2023-12-06
  
  POST http://localhost:4000/presence/mark

Mark Presence
  {
    "studentId": "student_id",
    "courseId": "course_id",
    "date": "2023-12-20T09:00:00.000Z"
  }
