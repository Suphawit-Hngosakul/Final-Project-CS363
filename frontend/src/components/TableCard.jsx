import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { call } from '../utils/api';
import { toast } from 'react-hot-toast';
import Select from './Select';

export default function TableCard({ table, token }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState(table?.status || 'available');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setStatus(table?.status || 'available');
  }, [table?.status]);

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
    <div className={`rounded-[32px] p-5 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col items-center w-full border ${
      status === 'occupied' ? 'bg-[#F0F0F0] border-slate-300' : 'bg-[#F8FAF9] border-white'
    }`}>

      <span className={`text-2xl font-black mb-2 tracking-wide ${status === 'occupied' ? 'text-slate-500' : 'text-[#0B3D4A]'}`}>โต๊ะ</span>

      <span className={`text-[60px] md:text-[80px] leading-none font-black mb-6 md:mb-8 ${status === 'occupied' ? 'text-slate-400' : 'text-[#0B3D4A]'}`}>
        {table?.tableNumber || '1'}
      </span>

      <div className="w-full mb-6">
        <Select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={updating}
          options={[
            { value: 'available', label: 'Available' },
            { value: 'occupied', label: 'Occupied' },
          ]}
          className={`border-none rounded-2xl px-4 py-3.5 text-[15px] font-medium shadow-sm cursor-pointer disabled:opacity-60 ${
            status === 'occupied'
              ? 'bg-slate-200 text-slate-600 focus:ring-2 focus:ring-slate-300'
              : 'bg-white text-slate-800 focus:ring-2 focus:ring-[#AEE1D3]'
          }`}
        />
      </div>

      <button
        onClick={() => canOrder && navigate(`/order/${table?._id}`)}
        disabled={!canOrder}
        className={`px-6 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors border ${
          canOrder
            ? 'bg-white border-[#AEE1D3] text-[#0B3D4A] hover:bg-[#F2F9F7] cursor-pointer'
            : 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed'
        }`}
      >
        เริ่มสั่งอาหาร
      </button>

    </div>
  );
}
