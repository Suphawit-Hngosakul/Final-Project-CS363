import React from 'react';

export default function AdminTabBar({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex bg-[#F4F6F8] shadow-sm relative border-b border-slate-200 rounded-t-[18px]">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 py-4 text-center font-bold text-[15px] transition-all duration-300 ${
              isActive
                ? 'bg-[#0B3D4A] text-white rounded-t-[18px] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-10'
                : 'text-[#0B3D4A] hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
