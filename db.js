const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',      // เปลี่ยนตามการตั้งค่าจริง
  user: 'root',           // เปลี่ยนตามการตั้งค่าจริง
  password: '',           // เปลี่ยนตามการตั้งค่าจริง
  database: 'club_db'     // ชื่อตรงกับฐานข้อมูลที่สร้าง
});

db.connect((err) => {
  if (err) {
    console.error('❌ ไม่สามารถเชื่อมต่อฐานข้อมูล:', err);
  } else {
    console.log('✅ MySQL Connected...');
  }
});

module.exports = db;
