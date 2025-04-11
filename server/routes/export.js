// server/routes/export.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const router = express.Router();

const ATTENDANCE_DIR = path.join(__dirname, '../db/attendance');

router.get('/export/:subject', async (req, res) => {
  const subject = req.params.subject;
  const filePath = path.join(ATTENDANCE_DIR, `${subject}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Attendance data not found for this subject.");
  }

  const rawData = JSON.parse(fs.readFileSync(filePath));
  const students = rawData.students;

  const sessionKeys = [...new Set(
    students.flatMap(s => Object.keys(s).filter(k => k !== 'userId' && k !== 'name'))
  )].sort();

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(`${subject} Attendance`);

  const headers = ['USN', 'Name', ...sessionKeys, 'Total Classes', 'Present', 'Attendance %'];
  sheet.addRow(headers);

  students.forEach(student => {
    const row = [student.userId, student.name];
    let presentCount = 0;

    sessionKeys.forEach(key => {
      const status = student[key] || 'A';
      row.push(status);
      if (status === 'P') presentCount++;
    });

    const totalClasses = sessionKeys.length;
    const percentage = totalClasses ? ((presentCount / totalClasses) * 100).toFixed(2) + '%' : '0%';
    row.push(totalClasses, presentCount, percentage);
    sheet.addRow(row);
  });

  sheet.columns.forEach(col => {
    col.width = 15;
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=${subject}_attendance.xlsx`);

  await workbook.xlsx.write(res);
  res.end();
});

module.exports = router;
