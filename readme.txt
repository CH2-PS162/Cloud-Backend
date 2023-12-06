Learning Management System (LMS)
This Learning Management System (LMS) project provides APIs to manage courses, students, assignments, teachers, results, submissions, and presence tracking.

Features
Courses: CRUD operations for courses.
Students: Manage student data.
Assignments: Create, update, and delete assignments.
Teachers: Add, edit, and delete teacher details.
Results: API for managing student results.
Submissions: Functionality to handle student submissions for assignments.
Presence Tracking: Track student presence for courses.


File Structure
projectlms/
│
├── models/
│   ├── course.js
│   ├── student.js
│   ├── assignment.js
│   ├── teacher.js
│   ├── result.js
│   ├── submission.js
│   └── presence.js
│
├── handlers/
│   ├── courseHandlers.js
│   ├── studentHandlers.js
│   ├── assignmentHandlers.js
│   ├── teacherHandlers.js
│   ├── resultHandlers.js
│   ├── submissionHandlers.js
│   └── presenceHandlers.js
│
├── routes/
│   ├── courseRoutes.js
│   ├── studentRoutes.js
│   ├── assignmentRoutes.js
│   ├── teacherRoutes.js
│   ├── resultRoutes.js
│   ├── submissionRoutes.js
│   └── presenceRoutes.js
│
└── server.js



1. Setup: Install dependencies with npm install.
npm install nanoid
npm install express

2. Start Server: Run the server with node server.js.

3. API Endpoints:
- Courses: /courses
- Students: /students
- Assignments: /assignment
- Teachers: /teachers
- Results: /results
- Submissions: /submission
- Presence Tracking: /presence/mark, /presence/date/:date

Fetch Presence Records
GET http://localhost:5000/presence/date/2023-12-06

POST http://localhost:5000/presence/mark

Mark Presence
{
  "studentId": "student_id",
  "courseId": "course_id",
  "date": "2023-12-20T09:00:00.000Z"
}
