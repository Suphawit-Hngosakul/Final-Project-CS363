import React from 'react';
import { useParams } from 'react-router-dom';

export default function CustomerOrderHistoryTab({ orders }) {
  const { tableId } = useParams();
  const total = orders.reduce((sum, item) => sum + (item.price === 'NA' ? 199 : Number(item.price)) * item.quantity, 0);

  return (
    <div className="flex flex-col h-full relative pt-4">
      {/* Table Header / Refresh */}
      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-[26px] font-black text-[#0B3D4A]">โต๊ะ: {tableId || '1'}</h2>
        <button className="px-6 py-2 bg-white border border-[#48c7a6] rounded-[10px] text-[13px] font-bold text-[#0B3D4A] shadow-sm hover:bg-slate-50 transition-colors">
          Refresh
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pb-[100px]">
        {orders.length === 0 ? (
          <div className="text-center text-[#0B3D4A]/50 font-bold mt-20 text-xl">ยังไม่มีรายการสั่งอาหาร</div>
        ) : (
          orders.map((item, idx) => (
            <div key={idx} className="bg-white rounded-[20px] p-6 flex justify-between items-center shadow-sm border border-slate-100">
              <div>
                <h3 className="font-black text-[#0B3D4A] text-[17px] mb-0.5">{item.name.replace(/\d/g, '').trim() || 'ชื่อเมนู 1'}</h3>
                <p className="text-[13px] text-slate-500 mb-3">{item.option || 'Options 1'}</p>
                <span className="px-4 py-1.5 bg-[#d69f3d] text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {item.status || 'pending'}
                </span>
              </div>
              <div className="text-[15px] font-bold text-slate-700 mt-auto">
                ฿{item.price === 'NA' ? '199' : item.price} x{item.quantity}
              </div>
            </div>
          ))
        )}
      </div>

      {orders.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 pt-6 flex justify-between items-center bg-[#f2f4f7] pb-2">
          <span className="text-2xl font-black text-[#0B3D4A] pl-2">ยอดรวม</span>
          <span className="text-[28px] font-black text-[#0B3D4A] pr-2">฿{total}</span>
        </div>
      )}
    </div>
  );
}
