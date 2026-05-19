import React from 'react';
import { imgSrc } from '../../utils/api';

export default function CustomerMenuCard({ item, onSelect }) {
  return (
    <div className="bg-white rounded-[20px] p-4 flex flex-col shadow-sm border border-slate-100 relative">
      <div className="bg-[#dcdfe4] h-[120px] md:h-[140px] rounded-[14px] mb-4 w-full overflow-hidden">
        {item.image && (
          <img
            src={imgSrc(item.image)}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <h3 className="font-black text-[#0B3D4A] text-[17px] leading-tight mb-1">{item.name}</h3>
      <p className="text-xs text-[#0B3D4A]/70 font-bold mb-4">฿ {item.price}</p>
      <div className="absolute bottom-4 right-4 flex justify-end">
        <button
          onClick={() => onSelect(item)}
          className="w-8 h-8 rounded-full bg-[#dcdfe4] text-slate-700 font-bold flex items-center justify-center hover:bg-slate-300 transition-colors shadow-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
