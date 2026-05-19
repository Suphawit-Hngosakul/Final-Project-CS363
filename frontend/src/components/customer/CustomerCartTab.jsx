import React from 'react';

export default function CustomerCartTab({ cart, onRemove, onUpdateQuantity, onSubmit }) {
  if (cart.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[400px]">
        <h2 className="text-[28px] font-bold text-[#0B3D4A]/90">ตะกร้าว่าง</h2>
      </div>
    );
  }

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <div className="flex flex-col h-full relative pt-4">
      <div className="flex-1 space-y-4 overflow-y-auto pb-[100px]">
        {cart.map((item, idx) => (
          <div key={idx} className="bg-white rounded-[20px] p-6 flex justify-between items-center shadow-sm border border-slate-100">
            <div>
              <h3 className="font-black text-[#0B3D4A] text-lg mb-0.5">{item.name}</h3>
              {item.options?.length > 0 && (
                <p className="text-[13px] text-slate-500 mb-3">
                  {item.options.map(o => `${o.name}: ${o.choice}`).join(', ')}
                </p>
              )}
              <p className="text-[15px] font-bold text-slate-700">฿{item.price} x{item.quantity}</p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-3 bg-[#e2e8f0] rounded-full px-1.5 py-0.5">
                <button onClick={() => onUpdateQuantity(idx, -1)} className="w-6 h-6 flex items-center justify-center text-slate-600 font-bold">-</button>
                <span className="w-4 text-center text-xs font-bold text-slate-700">{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(idx, +1)} className="w-6 h-6 flex items-center justify-center text-slate-600 font-bold">+</button>
              </div>
              <button 
                onClick={() => onRemove(idx)}
                className="px-6 py-1.5 bg-white border border-[#48c7a6] text-[#cc4c4c] rounded-[10px] text-[11px] font-bold shadow-sm hover:bg-slate-50"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 pt-6 flex justify-between items-center bg-[#f2f4f7] pb-2">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-black text-[#0B3D4A]">ยอดรวม</span>
          <span className="text-[28px] font-black text-[#0B3D4A]">฿{total}</span>
        </div>
        <button 
          onClick={onSubmit}
          className="px-10 py-4 bg-[#4db8a6] hover:bg-[#3ca493] text-white rounded-[16px] text-xl font-bold shadow-md transition-colors"
        >
          สั่งอาหาร
        </button>
      </div>
    </div>
  );
}
