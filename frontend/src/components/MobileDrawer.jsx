import React from 'react';

export default function MobileDrawer({ open, onClose, tabs, activeTab, onTabChange, user, onLogout }) {
  if (!open) return null;

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex md:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="relative w-4/5 max-w-[320px] h-full bg-white/95 backdrop-blur-md shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <span className="text-2xl font-black text-[#0B3D4A]">EzyOrder</span>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-[#0B3D4A] font-bold text-xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <nav className="flex-1 px-4 pt-2 space-y-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-[16px] transition-colors ${
                  isActive
                    ? 'text-[#0B3D4A] underline underline-offset-4 decoration-2'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Footer — user + logout */}
        <div className="px-6 pb-8 pt-4 border-t border-slate-100 flex flex-col items-center gap-3">
          <span className="text-sm font-semibold text-[#0B3D4A]">
            {user?.name || 'ชื่อ user'}
          </span>
          <button
            onClick={() => { onLogout(); onClose(); }}
            className="w-full px-4 py-2.5 rounded-xl border border-[#AEE1D3] bg-white text-[#0B3D4A] text-sm font-bold shadow-sm hover:bg-slate-50 transition-all"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
}
