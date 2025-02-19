// เพิ่มฟังก์ชันสำหรับสลับการแสดงผล Confirm Password
function toggleConfirmPassword() {
    var confirmInput = document.getElementById('confirm_password');
    if (confirmInput.type === 'password') {
      confirmInput.type = 'text';
    } else {
      confirmInput.type = 'password';
    }
  }
  
// ฟังก์ชันสำหรับสลับการแสดงผลรหัสผ่านและเปลี่ยนข้อความปุ่ม
function togglePassword(button) {
    var input = button.previousElementSibling; // รับ input ที่อยู่ก่อนปุ่ม
    if (input.type === 'password') {
      input.type = 'text';
      button.textContent = 'Hide'; // เปลี่ยนข้อความปุ่มเป็น Hide
    } else {
      input.type = 'password';
      button.textContent = 'Show'; // เปลี่ยนข้อความปุ่มเป็น Show
    }
  }
  
  // ฟังก์ชันตรวจสอบความตรงกันของรหัสผ่าน
  function validatePasswords() {
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm_password').value;
    
    if (password !== confirmPassword) {
      alert('รหัสผ่านไม่ตรงกัน! กรุณาตรวจสอบอีกครั้ง');
      return false;
    }
    return true;
  }