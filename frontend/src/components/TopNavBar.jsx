import React from 'react';

export default function TopNavBar({ user, onLogout, onOpenMenu }) {
  return (
    <header className="px-4 md:px-8 py-4 flex items-center justify-between w-full">
      {/* Mobile: hamburger + logo */}
      <div className="flex items-center gap-3">
        {onOpenMenu && (
          <button
            onClick={onOpenMenu}
            className="md:hidden flex flex-col justify-center gap-1.5 w-8 h-8 p-1"
            aria-label="เปิดเมนู"
          >
            <span className="block w-full h-0.5 bg-[#0B3D4A] rounded" />
            <span className="block w-full h-0.5 bg-[#0B3D4A] rounded" />
            <span className="block w-full h-0.5 bg-[#0B3D4A] rounded" />
          </button>
        )}
        <div className="text-2xl font-black text-[#0B3D4A]">EzyOrder</div>
      </div>

      {/* Desktop: user + logout (ซ่อนบน mobile) */}
      <div className="hidden md:flex items-center gap-4">
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
