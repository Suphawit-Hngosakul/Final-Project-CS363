# Final-Project-CS363
## Setup Project
### Frontend
```
    npm create vite@latest
    npm install tailwindcss @tailwindcss/vite
    npm install lucide-react@next react-router-dom socket.io-client axios react-hot-toast
```
- lucide-react@next : ใช้ไอคอน
- react-router-dom : Routing
- socket.io-client : เชื่อมต่อข้อมูลแบบเรียลไทม์
- axios : ยิง API หรือเรียกใช้งาน Backend
- react-hot-toast : ทำป๊อปอัปแจ้งเตือน (Toast)

### Backend
```
    npm install express mongoose dotenv cors jsonwebtoken bcryptjs socket.io multer qrcode express-validator
    npm install -D nodemon 
```
- mongoose : เชื่อมตต่อ MongoDB
- dotenv : อ่าน .env
- cors : อนุญาตให้ Frontend เรียกใช้ Backend
- jsonwebtoken : ใช้สร้าง Token สำหรับยืนยันตัวตน
- bcryptjs : ใช้เข้ารหัสรหัสผ่าน (Password Hashing)
- socket.io : ทำระบบแชทแบบ Real-time (ฝั่ง Server)
- multer : ใช้รับไฟล์รูปภาพ/เอกสารที่ผู้ใช้ส่งมา
- qrcode : ใช้สร้าง QR Code (เช่น สำหรับ Login หรือจ่ายเงิน)
- express-validator : ใช้ตรวจสอบความถูกต้องของข้อมูลที่ส่งมา (Validation)

## Run Project
### Frontend
```
    npm run dev
```
### Backend
```
    npm run dev
```