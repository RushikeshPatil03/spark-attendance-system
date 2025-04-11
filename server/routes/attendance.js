// server/routes/attendance.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const USERS_FILE = path.join(__dirname, '../db/registered_users.json');
const ATTENDANCE_DIR = path.join(__dirname, '../db/attendance');

if (!fs.existsSync(ATTENDANCE_DIR)) fs.mkdirSync(ATTENDANCE_DIR);

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

function getStudentName(userId) {
  const users = loadUsers();
  const student = users.find(u => u.userId === userId);
  return student ? student.name || 'Unknown' : 'Unknown';
}

// POST /attendance (QR Scan)
router.post('/', (req, res) => {
  const { userId, qrData } = req.body;
  try {
    const parsed = JSON.parse(qrData);
    const { sessionId, subject, time } = parsed;
    const today = new Date().toISOString().slice(0, 10);
    const sessionKey = `${today} (${time})`;

    const filename = path.join(ATTENDANCE_DIR, `${subject}.json`);
    let data = fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename)) : { students: [] };

    let student = data.students.find(s => s.userId === userId);
    if (!student) {
      student = { userId, name: getStudentName(userId) };
      data.students.push(student);
    }

    student[sessionKey] = 'P';
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    res.send("Attendance marked as Present.");
  } catch (err) {
    console.error('QR Parse Error or Save Error:', err);
    res.status(400).send("Invalid QR Code or attendance failed.");
  }
});

// PATCH /attendance/manual (Manual update)
router.patch('/manual', (req, res) => {
  const { userId, subject, date, time } = req.body;
  const sessionKey = `${date} (${time})`;
  const filename = path.join(ATTENDANCE_DIR, `${subject}.json`);

  try {
    if (!fs.existsSync(filename)) return res.status(404).send("Subject attendance file not found.");

    let data = JSON.parse(fs.readFileSync(filename));
    let student = data.students.find(s => s.userId === userId);

    if (!student) {
      student = { userId, name: getStudentName(userId) };
      data.students.push(student);
    }

    student[sessionKey] = 'P';
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
    res.send("Attendance manually updated to Present.");
  } catch (err) {
    console.error('Manual update failed:', err);
    res.status(500).send("Error updating attendance.");
  }
});

module.exports = router;
