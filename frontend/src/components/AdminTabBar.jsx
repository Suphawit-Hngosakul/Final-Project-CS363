import React from 'react';

export default function AdminTabBar({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex bg-[#F0F4F8]/80 border-b border-white/40">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        const isFirst = index === 0;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-8 py-4 text-center font-bold text-sm transition-all ${isActive
                ? `bg-[#0B3D4A] text-white ${isFirst ? 'rounded-br-2xl' : 'rounded-b-2xl'} shadow-md z-10`
                : 'text-[#0B3D4A] hover:bg-white/50'
              }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
