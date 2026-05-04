import React from 'react';

export default function RefreshButton({ onClick }) {
  return (
    <button 
      onClick={onClick}
      className="px-6 py-2 bg-white border border-[#AEE1D3] rounded-xl text-[#0B3D4A] font-bold shadow-sm hover:bg-slate-50 transition-colors"
    >
      Refresh
    </button>
  );
}
