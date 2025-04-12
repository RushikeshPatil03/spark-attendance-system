const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const router = express.Router();

const USERS_FILE = path.join(__dirname, '../db/users.json');
const REGISTERED_FILE = path.join(__dirname, '../db/registered_users.json');

// Load allowed user list (faculty/students)
function loadUserList() {
  if (!fs.existsSync(USERS_FILE)) return { students: [], faculty: [] };
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// Load already registered users
function loadRegisteredUsers() {
  if (!fs.existsSync(REGISTERED_FILE)) return [];
  return JSON.parse(fs.readFileSync(REGISTERED_FILE));
}

// Save registered users
function saveRegisteredUsers(data) {
  fs.writeFileSync(REGISTERED_FILE, JSON.stringify(data, null, 2));
}

// POST /register/student
router.post('/student', async (req, res) => {
  const { userId, mobile, password } = req.body;

  if (!userId || !mobile || !password) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const users = loadUserList();
  const registered = loadRegisteredUsers();

  if (!users.students.find(s => s.userId === userId && s.mobile === mobile)) {
    return res.status(400).json({ success: false, message: "Student userId/mobile not allowed." });
  }

  if (registered.find(u => u.userId === userId)) {
    return res.status(409).json({ success: false, message: "User already registered." });
  }

  const hashed = await bcrypt.hash(password, 10);
  registered.push({ userId, password: hashed, role: 'student' });
  saveRegisteredUsers(registered);

  res.json({ success: true });
});

// POST /register/faculty
router.post('/faculty', async (req, res) => {
  const { userId, mobile, password } = req.body;

  if (!userId || !mobile || !password) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const users = loadUserList();
  const registered = loadRegisteredUsers();

  if (!users.faculty.find(f => f.userId === userId && f.mobile === mobile)) {
    return res.status(400).json({ success: false, message: "Faculty userId/mobile not allowed." });
  }

  if (registered.find(u => u.userId === userId)) {
    return res.status(409).json({ success: false, message: "User already registered." });
  }

  const hashed = await bcrypt.hash(password, 10);
  registered.push({ userId, password: hashed, role: 'faculty' });
  saveRegisteredUsers(registered);

  res.json({ success: true });
});

module.exports = router;



