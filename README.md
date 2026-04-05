# EzyOrder

ระบบสั่งอาหารผ่าน QR Code สำหรับร้านอาหาร ลูกค้าสแกน QR Code ที่โต๊ะแล้วสั่งอาหารได้ทันทีโดยไม่ต้องสมัครสมาชิก

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|-----------|
| Frontend | React (Vite), Tailwind CSS, React Router, Axios, Socket.IO Client |
| Backend | Node.js, Express.js, MongoDB (Mongoose), Socket.IO |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Real-time | Socket.IO |
| File Upload | Multer |
| QR Code | qrcode |
| API Docs | Swagger UI (OpenAPI 3.0) |

---

## Project Structure

```
Final-Project-CS363/
├── backend/
│   ├── config/          # DB connection, Swagger definition
│   ├── controllers/     # Request handlers
│   ├── middleware/      # auth, errorHandler, upload, requireOwnership
│   ├── models/          # Mongoose schemas
│   ├── repositories/    # DB query layer
│   ├── routes/          # Express routers
│   ├── services/        # Business logic
│   ├── uploads/         # Uploaded images
│   └── utils/           # createError helper
└── frontend/
    └── src/
```

---

## Setup & Installation

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (หรือ local MongoDB)

### 1. Clone & ติดตั้ง dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. ตั้งค่า Environment Variables

สร้างไฟล์ `backend/.env` โดย copy จาก `.env.example`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=<random-string-min-32-chars>
PORT=8080
FRONTEND_URL=http://localhost:5173
```

### 3. รันโปรเจกต์

```bash
# Backend (port 8080)
cd backend
npm run dev

# Frontend (port 5173)
cd frontend
npm run dev
```

### 4. เข้าใช้ API Docs

เปิด [http://localhost:8080/api-docs](http://localhost:8080/api-docs) เพื่อดู Swagger UI

---

## User Roles

| Role | สิทธิ์ |
|------|--------|
| `admin` | จัดการร้าน / เมนู / หมวดหมู่ / โต๊ะ / ดูรายงาน / ชำระเงิน |
| `staff` | ดูและอัพเดตสถานะออเดอร์ / ชำระเงิน |
| ลูกค้า (ไม่ต้อง login) | ดูเมนู / สั่งอาหาร / ดูบิล |

---

## API Endpoints

> ดูรายละเอียด request/response schema ทั้งหมดได้ที่ **Swagger UI** (`/api-docs`)

### Public (ไม่ต้อง login)

| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET | `/api/public/restaurant/:id` | ข้อมูลพื้นฐานร้าน |
| GET | `/api/public/restaurant/:id/categories` | หมวดหมู่ที่เปิดใช้งาน |
| GET | `/api/public/restaurant/:id/menu` | เมนูที่พร้อมขาย |
| GET | `/api/public/restaurant/:id/table-by-number/:num` | ค้นหาโต๊ะจากหมายเลข (ใช้ตอนสแกน QR) |
| POST | `/api/tables/:id/orders` | สั่งอาหาร |
| GET | `/api/tables/:id/orders` | ดูออเดอร์ของโต๊ะ (session ปัจจุบัน) |
| GET | `/api/tables/:id/bill` | ดูบิลสรุปของโต๊ะ |

### Auth

| Method | Path | คำอธิบาย |
|--------|------|----------|
| POST | `/api/auth/register` | ลงทะเบียนร้าน (สร้าง Admin account) |
| POST | `/api/auth/login` | เข้าสู่ระบบ |
| GET | `/api/auth/me` | ดูข้อมูลตัวเอง |

### Restaurant (Admin)

| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET | `/api/restaurant/:id` | ดูข้อมูลร้าน |
| PUT | `/api/restaurant/:id` | แก้ไขข้อมูลร้าน |

### Category (Admin)

| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET | `/api/restaurant/:id/categories` | ดูหมวดหมู่ทั้งหมด |
| POST | `/api/restaurant/:id/categories` | สร้างหมวดหมู่ใหม่ |
| PUT | `/api/categories/:id` | แก้ไขหมวดหมู่ (name / sortOrder / isActive) |
| DELETE | `/api/categories/:id` | ลบหมวดหมู่ (ต้องไม่มีเมนูอยู่) |

### Menu (Admin)

| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET | `/api/restaurant/:id/menu` | ดูเมนูทั้งหมด |
| POST | `/api/restaurant/:id/menu` | เพิ่มเมนูใหม่ (multipart/form-data) |
| PUT | `/api/menu/:id` | แก้ไขเมนู (multipart/form-data) |
| DELETE | `/api/menu/:id` | ลบเมนูและไฟล์รูป |
| PATCH | `/api/menu/:id/availability` | เปิด/ปิดการขายเมนู |

### Table (Admin/Staff)

| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET | `/api/restaurant/:id/tables` | ดูโต๊ะทั้งหมด |
| GET | `/api/restaurant/:id/qr/:tableNo` | ดึง QR Code สำหรับโต๊ะ |
| PATCH | `/api/tables/:id/status` | อัพเดตสถานะโต๊ะ |

### Order (Admin/Staff)

| Method | Path | คำอธิบาย |
|--------|------|----------|
| PATCH | `/api/orders/:id/status` | อัพเดตสถานะออเดอร์ |
| GET | `/api/restaurant/:id/orders` | ดูออเดอร์ทั้งหมดของร้าน |

### Bill (Admin/Staff)

| Method | Path | คำอธิบาย |
|--------|------|----------|
| POST | `/api/tables/:id/bill/checkout` | ชำระเงินและปิดโต๊ะ |

### Report (Admin)

| Method | Path | คำอธิบาย |
|--------|------|----------|
| GET | `/api/restaurant/:id/reports/daily` | รายงานยอดขายรายวัน |
| GET | `/api/restaurant/:id/reports/popular-items` | รายงานเมนูขายดี |

---

## Socket.IO Events

### Client → Server

| Event | Payload | คำอธิบาย |
|-------|---------|----------|
| `join_restaurant` | `restaurantId: string` | Staff/Admin เข้าห้องร้าน เพื่อรับแจ้งเตือนออเดอร์ใหม่ |
| `join_table` | `tableId: string` | ลูกค้าเข้าห้องโต๊ะ เพื่อรับอัพเดตสถานะออเดอร์ |

### Server → Client

| Event | ห้อง | คำอธิบาย |
|-------|------|----------|
| `new_order` | `restaurant:<id>` | มีออเดอร์ใหม่เข้ามา |
| `order_status_updated` | `table:<id>` | สถานะออเดอร์เปลี่ยน |
| `bill_paid` | `table:<id>` | ชำระเงินสำเร็จ |

---

## Table Status Flow

```
available → occupied → payment → available
```

| สถานะ | ความหมาย |
|-------|----------|
| `available` | โต๊ะว่าง พร้อมรับลูกค้า |
| `occupied` | มีลูกค้านั่งอยู่ กำลังสั่งอาหาร |
| `payment` | รอชำระเงิน (ไม่สามารถสั่งอาหารเพิ่มได้) |

---

## Order Status Flow

```
pending → accepted → cooking → ready → served
```

---

## Dependencies

### Frontend
```bash
npm install tailwindcss @tailwindcss/vite
npm install lucide-react@next react-router-dom socket.io-client axios react-hot-toast
```

| Package | ใช้ทำอะไร |
|---------|----------|
| tailwindcss | Utility-first CSS framework |
| lucide-react | Icon library |
| react-router-dom | Client-side routing |
| socket.io-client | รับ real-time events จาก server |
| axios | HTTP client สำหรับเรียก API |
| react-hot-toast | Toast notification |

### Backend
```bash
npm install express mongoose dotenv cors jsonwebtoken bcryptjs socket.io multer qrcode express-validator swagger-ui-express uuid
npm install -D nodemon
```

| Package | ใช้ทำอะไร |
|---------|----------|
| express | Web framework |
| mongoose | MongoDB ODM |
| dotenv | อ่านค่าจากไฟล์ .env |
| cors | อนุญาต Cross-Origin requests |
| jsonwebtoken | สร้างและตรวจสอบ JWT |
| bcryptjs | Hash รหัสผ่าน |
| socket.io | Real-time bidirectional events |
| multer | รับไฟล์ที่ upload มา |
| qrcode | สร้าง QR Code |
| express-validator | Validate request body/params |
| swagger-ui-express | แสดง API documentation |
| uuid | สร้าง unique session ID สำหรับโต๊ะ |
