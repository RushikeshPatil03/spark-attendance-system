const express = require('express');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const router = express.Router();

const ATTENDANCE_DIR = path.join(__dirname, '../db/attendance');

// GET /attendance/export/:subject
router.get('/export/:subject', async (req, res) => {
  try {
    const subject = req.params.subject;
    const safeSubject = subject.replace(/[^a-zA-Z0-9-_ ]/g, '');
    const filePath = path.join(ATTENDANCE_DIR, `${safeSubject}.json`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("❌ Attendance data not found for this subject.");
    }

    const rawData = JSON.parse(fs.readFileSync(filePath));
    const students = rawData.students;

    const sessionKeys = [...new Set(
      students.flatMap(s => Object.keys(s).filter(k => k !== 'userId' && k !== 'name'))
    )].sort();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`${safeSubject} Attendance`);

    const headers = ['USN', 'Name', ...sessionKeys, 'Total Classes', 'Present', 'Attendance %'];
    const headerRow = sheet.addRow(headers);
    headerRow.font = { bold: true };

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
    res.setHeader('Content-Disposition', `attachment; filename=${safeSubject}_attendance.xlsx`);

    await workbook.xlsx.write(res);
    res.end();

    console.log(`✅ Attendance exported for subject: ${subject}`);
  } catch (err) {
    console.error('❌ Export error:', err);
    res.status(500).send("⚠️ Server error during export.");
  }
});

module.exports = router;

