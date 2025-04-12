// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Serve frontend (adjust if you're using /frontend instead of /client)
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/db', express.static(path.join(__dirname, 'db'))); // To serve attendance data

// ✅ Routes
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const attendanceRoutes = require('./routes/attendance');
const exportRoutes = require('./routes/export');

app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/attendance', exportRoutes); // combined under same base path

// ✅ Redirect base path to login page
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


