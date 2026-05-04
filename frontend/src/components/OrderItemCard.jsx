import React from 'react';

export default function OrderItemCard() {
  return (
    <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm">
      <div>
        <h5 className="font-black text-[#0B3D4A]">Name</h5>
        <p className="text-[10px] text-slate-500 mb-2">Option :Option1</p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-[#0B3D4A]">x1</span>
          <span className="bg-[#D99A29] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            pending
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold text-slate-500">4/5/2569 00:03:13</span>
        <button className="px-6 py-2 bg-white border border-[#AEE1D3] rounded-xl text-sm font-bold text-[#0B3D4A] shadow-sm hover:bg-slate-50">
          Accept
        </button>
      </div>
    </div>
  );
}
