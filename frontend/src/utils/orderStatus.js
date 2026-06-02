export const ORDER_STATUSES = ['pending', 'accepted', 'cooking', 'ready', 'served'];

export const STATUS_LABEL = {
  pending: 'รอรับออเดอร์',
  accepted: 'รับออเดอร์แล้ว',
  cooking: 'กำลังทำ',
  ready: 'พร้อมเสิร์ฟ',
  served: 'เสิร์ฟแล้ว',
};

export const STATUS_COLOR = {
  pending: 'bg-[#D99A29]',
  accepted: 'bg-[#4B8BFF]',
  cooking: 'bg-[#F28C28]',
  ready: 'bg-[#38B26C]',
  served: 'bg-[#0B3D4A]',
};

export const NEXT_STATUS = {
  pending: 'accepted',
  accepted: 'cooking',
  cooking: 'ready',
  ready: 'served',
};

export const NEXT_STATUS_LABEL = {
  pending: 'Accept',
  accepted: 'Cooking',
  cooking: 'Ready',
  ready: 'Served',
};
