// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3001;

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../client')));
app.use('/db', express.static(path.join(__dirname, 'db'))); // For testing view

// Routes
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const attendanceRoutes = require('./routes/attendance');
const exportRoutes = require('./routes/export');

app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/attendance', exportRoutes); // merged with same path

// Server start
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  app.get('/', (req, res) => {
    res.redirect('/login.html');
  });
  
});

