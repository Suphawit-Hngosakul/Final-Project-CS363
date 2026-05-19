import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { call } from '../utils/api';
import { toast } from 'react-hot-toast';

export default function TableCard({ table, token }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(table?.status || 'available');
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await call('PATCH', `/api/tables/${table._id}/status`, { status: newStatus }, token);
      setStatus(newStatus);
    } catch {
      toast.error('อัปเดตสถานะล้มเหลว');
    } finally {
      setUpdating(false);
    }
  };

  const canOrder = status === 'available';

  return (
    <div className="bg-[#F8FAF9] rounded-[32px] p-5 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-shadow duration-300 flex flex-col items-center w-full border border-white">

      <span className="text-2xl font-black text-[#0B3D4A] mb-2 tracking-wide">โต๊ะ</span>

      <span className="text-[60px] md:text-[80px] leading-none font-black text-[#0B3D4A] mb-6 md:mb-8">
        {table?.tableNumber || '1'}
      </span>

      <div className="relative w-full mb-6">
        <select
          className="w-full appearance-none bg-white border-none rounded-2xl px-4 py-3.5 text-[15px] font-medium text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-[#AEE1D3] cursor-pointer disabled:opacity-60"
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={updating}
        >
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0B3D4A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>

      <button
        onClick={() => canOrder && navigate(`/order/${table?._id}`)}
        disabled={!canOrder}
        className={`px-6 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors border ${
          canOrder
            ? 'bg-white border-[#AEE1D3] text-[#0B3D4A] hover:bg-[#F2F9F7] cursor-pointer'
            : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        เริ่มสั่งอาหาร
      </button>

    </div>
  );
}
