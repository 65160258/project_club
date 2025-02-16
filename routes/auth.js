const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db'); // ไฟล์เชื่อมต่อฐานข้อมูล
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phone, role } = req.body;

    // ตรวจสอบค่าที่จำเป็น
    if (!username || !email || !password || !phone) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ' });
    }

    // ตรวจสอบว่า username หรือ email ถูกใช้ไปแล้ว
    const checkUserSql = "SELECT * FROM users WHERE username = ? OR email = ?";
    db.query(checkUserSql, [username, email], async (err, results) => {
      if (err) {
        console.log("SQL Error:", err);
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการตรวจสอบข้อมูล' });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "ชื่อผู้ใช้หรืออีเมลถูกใช้ไปแล้ว" });
      }

      // เข้ารหัสรหัสผ่าน
      const hashedPassword = await bcrypt.hash(password, 10);
      const userRole = role || 'member';

      // เพิ่มข้อมูลลงฐานข้อมูล
      const insertSql = "INSERT INTO users (username, email, password, phone, role) VALUES (?, ?, ?, ?, ?)";
      const values = [username, email, hashedPassword, phone, userRole];

      db.query(insertSql, values, (err, result) => {
        if (err) {
          console.log("SQL Error:", err);
          return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' });
        }
        // สมัครสมาชิกสำเร็จ -> ไปหน้า Login
        return res.redirect('/');
      });
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาด' });
  }
});

// Login Route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบ' });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // เข้าสู่ระบบสำเร็จ -> เก็บ user ไว้ใน session
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    // ไปหน้า dashboard
    res.redirect('/index');
  });
});

// Logout Route (ถ้าต้องการให้ผู้ใช้ logout ได้)
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;
