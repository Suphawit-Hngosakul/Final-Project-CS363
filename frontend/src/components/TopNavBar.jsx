import React from 'react';

export default function TopNavBar({ user, onLogout }) {
  return (
    <header className="px-8 py-4 flex items-center justify-between w-full">
      <div className="text-2xl font-black text-[#0B3D4A]">EzyOrder</div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-[#0B3D4A]">
          {user?.name || 'ชื่อ user'}
        </span>
        <button 
          onClick={onLogout}
          className="px-4 py-1.5 rounded-lg border border-[#AEE1D3] bg-white text-[#0B3D4A] text-sm font-bold shadow-sm hover:bg-slate-50 transition-all"
        >
          ออกจากระบบ
        </button>
      </div>
    </header>
  );
}
