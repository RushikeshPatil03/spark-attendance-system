const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const router = express.Router();

const REGISTERED_FILE = path.join(__dirname, '../db/registered_users.json');

function loadRegisteredUsers() {
  if (!fs.existsSync(REGISTERED_FILE)) return [];
  return JSON.parse(fs.readFileSync(REGISTERED_FILE));
}

router.post('/', async (req, res) => {
  const { role, userId, password } = req.body;

  try {
    const users = loadRegisteredUsers();
    const user = users.find(u => u.userId === userId && u.role === role);

    if (!user) return res.status(401).json({ success: false, message: 'Invalid user or role' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Incorrect password' });

    // ✅ Send success response
    res.json({ success: true, role: user.role });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;


