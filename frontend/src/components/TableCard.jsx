import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function TableCard({ table }) {
  const navigate = useNavigate();
  
  return (
    <div className="bg-[#F8FAF9] rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-shadow duration-300 flex flex-col items-center w-full max-w-[260px] mx-auto border border-white">

      <span className="text-2xl font-black text-[#0B3D4A] mb-2 tracking-wide">โต๊ะ</span>

      <span className="text-[80px] leading-none font-black text-[#0B3D4A] mb-8">
        {table?.tableNumber || '1'}
      </span>

      <div className="relative w-full mb-6">
        <select
          className="w-full appearance-none bg-white border-none rounded-2xl px-4 py-3.5 text-[15px] font-medium text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-[#AEE1D3] cursor-pointer"
          defaultValue={table?.status || "occupied"}
        >
          <option value="occupied">occupied</option>
          <option value="available">available</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0B3D4A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      <button
        onClick={() => navigate(`/order/${table?._id || '1'}`)}
        className="px-6 py-2 bg-white border border-[#AEE1D3] rounded-xl text-sm font-bold text-[#0B3D4A] shadow-sm hover:bg-[#F2F9F7] transition-colors"
      >
        เริ่มสั่งอาหาร
      </button>

    </div>
  );
}
