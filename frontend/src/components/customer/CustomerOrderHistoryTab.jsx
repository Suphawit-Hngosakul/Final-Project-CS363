import React, { useState, useEffect, useCallback } from 'react';
import { call } from '../../utils/api';
import { toast } from 'react-hot-toast';

const STATUS_LABEL = {
  pending: 'รอรับออเดอร์',
  accepted: 'รับออเดอร์แล้ว',
  cooking: 'กำลังทำ',
  ready: 'พร้อมเสิร์ฟ',
  served: 'เสิร์ฟแล้ว',
};

const STATUS_COLOR = {
  pending: 'bg-[#d69f3d]',
  accepted: 'bg-[#3d8dd6]',
  cooking: 'bg-[#d6633d]',
  ready: 'bg-[#3dd67a]',
  served: 'bg-[#888]',
};

export default function CustomerOrderHistoryTab({ tableId }) {
  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    if (!tableId) return;
    try {
      const res = await call('GET', `/api/tables/${tableId}/orders`);
      setOrders(res || []);
    } catch {
      toast.error('โหลดรายการสั่งอาหารไม่สำเร็จ');
    }
  }, [tableId]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const allItems = orders.flatMap(order =>
    order.items.map(item => ({ ...item, status: order.status }))
  );

  const total = allItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex flex-col h-full relative pt-4">
      {/* PC/Medium header */}
      <div className="hidden md:flex justify-between items-center mb-6 px-2">
        <h2 className="text-[26px] font-black text-[#0B3D4A]">รายการที่สั่งไป</h2>
        <button onClick={fetchOrders} className="px-6 py-2 bg-white border border-[#48c7a6] rounded-[10px] text-[13px] font-bold text-[#0B3D4A] shadow-sm hover:bg-slate-50 transition-colors">
          Refresh
        </button>
      </div>

      {/* Mobile header */}
      <div className="md:hidden flex flex-col items-center gap-3 mb-6">
        <h2 className="text-2xl font-black text-[#0B3D4A]">รายการที่สั่งไป</h2>
        <button onClick={fetchOrders} className="px-10 py-2 bg-white border border-[#48c7a6] rounded-[10px] text-[13px] font-bold text-[#0B3D4A] shadow-sm hover:bg-slate-50 transition-colors">
          Refresh
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pb-[100px]">
        {allItems.length === 0 ? (
          <div className="text-center text-[#0B3D4A]/50 font-bold mt-20 text-xl">ยังไม่มีรายการสั่งอาหาร</div>
        ) : (
          allItems.map((item, idx) => (
            <div key={idx} className="bg-white rounded-[20px] p-6 flex justify-between items-center shadow-sm border border-slate-100">
              <div>
                <h3 className="font-black text-[#0B3D4A] text-[17px] mb-0.5">{item.name}</h3>
                {item.note && <p className="text-[13px] text-slate-500 mb-3">{item.note}</p>}
                <span className={`px-4 py-1.5 ${STATUS_COLOR[item.status] || 'bg-[#d69f3d]'} text-white text-[10px] font-bold rounded-full uppercase tracking-wider`}>
                  {STATUS_LABEL[item.status] || item.status}
                </span>
              </div>
              <div className="text-[15px] font-bold text-slate-700 mt-auto">
                ฿{item.price} x{item.quantity}
              </div>
            </div>
          ))
        )}
      </div>

      {allItems.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 pt-6 mt-16 flex justify-between items-center pb-2">
          <span className="text-2xl font-black text-[#0B3D4A] pl-2">ยอดรวม</span>
          <span className="text-[28px] font-black text-[#0B3D4A] pr-2">฿{total}</span>
        </div>
      )}
    </div>
  );
}
