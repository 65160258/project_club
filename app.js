const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth');

// สร้างเซิร์ฟเวอร์ Express
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// ตั้งค่า Session (In-Memory สำหรับทดสอบ/พัฒนา)
app.use(session({
  secret: 'my_secret_key',  // ควรเปลี่ยนเป็น secret จริง
  resave: false,
  saveUninitialized: false
}));

// Serve Static Files
app.use(express.static(path.join(__dirname, 'public')));

// ใช้ router จากไฟล์ auth.js ที่ prefix ด้วย '/auth'
app.use('/auth', authRoutes);

// ตั้งค่า View Engine เป็น EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------------------- Routes ----------------------
// หน้าแรก -> แสดงหน้า Login
app.get('/', (req, res) => {
  res.render('auth/login');
});

// หน้า Register
app.get('/register', (req, res) => {
  res.render('auth/register');
});

// หน้า Index -> ตัวอย่าง: แสดงชื่อผู้ใช้จาก session
app.get('/index', (req, res) => {
  // ถ้าล็อกอินแล้ว session จะมี user เก็บไว้
  // ส่ง user ไปให้หน้า EJS เพื่อแสดงผล
  res.render('pages/index', { user: req.session.user });
});

// หน้า Booking
app.get('/booking', (req, res) => {
  res.render('pages/booking', { user: req.session.user });
});

// หน้า Chat
app.get('/chat', (req, res) => {
  res.render('pages/chat', { user: req.session.user });
});

// หน้า Dashboard
app.get('/dashboard', (req, res) => {
  // หากยังไม่ได้ login ให้ redirect ไปหน้า login
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render('pages/dashboard', { user: req.session.user });
});

// หน้า Settings
app.get('/settings', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render('pages/settings', { user: req.session.user });
});

// รันเซิร์ฟเวอร์
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
