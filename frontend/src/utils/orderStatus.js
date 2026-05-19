// สถานะออเดอร์ — แหล่งข้อมูลเดียวสำหรับทั้งแอป (label / สี / สถานะถัดไป)

// ลำดับสถานะออเดอร์
export const ORDER_STATUSES = ['pending', 'accepted', 'cooking', 'ready', 'served'];

// ป้ายภาษาไทย
export const STATUS_LABEL = {
  pending: 'รอรับออเดอร์',
  accepted: 'รับออเดอร์แล้ว',
  cooking: 'กำลังทำ',
  ready: 'พร้อมเสิร์ฟ',
  served: 'เสิร์ฟแล้ว',
};

// สี badge (Tailwind bg class)
export const STATUS_COLOR = {
  pending: 'bg-[#D99A29]',
  accepted: 'bg-[#4B8BFF]',
  cooking: 'bg-[#F28C28]',
  ready: 'bg-[#38B26C]',
  served: 'bg-[#0B3D4A]',
};

// สถานะถัดไปเมื่อกดปุ่มเลื่อนสถานะ
export const NEXT_STATUS = {
  pending: 'accepted',
  accepted: 'cooking',
  cooking: 'ready',
  ready: 'served',
};

// ป้ายปุ่มเลื่อนสถานะ
export const NEXT_STATUS_LABEL = {
  pending: 'Accept',
  accepted: 'Cooking',
  cooking: 'Ready',
  ready: 'Served',
};
