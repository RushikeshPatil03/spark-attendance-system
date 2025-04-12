# 📘 BITM College Bellary - Smart Attendance System

A secure, efficient, and modern web-based **Faculty–Student attendance portal** developed as a SparkTank prototype project. This system aims to solve issues related to **manual attendance**, **proxy entries**, and **lack of verifiability** in academic institutions.

---

## ✨ Features

- 🔐 **Secure Login** for Students and Faculty with role-based redirection
- 📝 **Registration Forms** for both students and faculty (with validation)
- 📸 **Live QR Code Attendance** using HTML5 camera (no photo uploads)
- 🔁 **Dynamic QR Code** (expires every 15 sec)
- 📍 **Location Awareness** *(future enhancement)* to verify real proximity
- 📊 **Faculty Dashboard** to:
  - View attendance list (per subject)
  - Manually update entries (e.g., if a student forgot their phone)
  - Export attendance to Excel with % calculation
- 📦 **Single active session enforcement** per user with 1-hour login lock

---

## 🏗️ Tech Stack

| Layer     | Tech Used                         |
|-----------|----------------------------------|
| 🌐 Frontend | HTML, CSS, JavaScript, Tailwind CSS |
| ⚙️ Backend  | Node.js (Express) + JSON-based DB  |
| 🔐 Security | CORS, Session validation          |
| 🌍 Hosting  | Vercel (Frontend), Render (Backend) |

---

## 🧪 Demo Links

| Component      | URL                                            |
|----------------|------------------------------------------------|
| 🔑 Login Page  | [login.html](https://your-vercel-url/login.html) |
| 🧑‍🎓 Register Student | [student_register.html](https://your-vercel-url/student_register.html) |
| 👨‍🏫 Register Faculty | [faculty_register.html](https://your-vercel-url/faculty_register.html) |
| 🧾 Dashboard    | [faculty_dashboard.html](https://your-vercel-url/faculty_dashboard.html) |
| 📷 QR Scanner  | [scan_qr.html](https://your-vercel-url/scan_qr.html) |

> Replace `your-vercel-url` with your actual project domain.

---

## 📁 Project Structure

```bash
spark-attendance-system/
├── frontend/                # Vercel-ready frontend
│   ├── login.html
│   ├── student_register.html
│   ├── faculty_register.html
│   ├── faculty_dashboard.html
│   ├── scan_qr.html
│   └── style.css
├── server/                  # Backend logic (Node.js)
│   ├── index.js
│   └── routes/
│       ├── login.js
│       ├── register.js
│       ├── attendance.js
│       └── export.js
│   └── db/
│       ├── users.json
│       └── attendance/
├── package.json
├── .gitignore
└── README.md
