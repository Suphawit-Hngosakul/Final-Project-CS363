import React from 'react';
import { imgSrc } from '../utils/api';

export default function MenuCard({ menu, onEdit, onDelete, onToggleSale }) {
    const available = menu?.isAvailable !== false;

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full w-[260px]">
            <div className="h-40 bg-gray-200 w-full relative overflow-hidden">
                {menu?.image ? (
                    <img
                        src={imgSrc(menu.image)}
                        alt={menu.name}
                        className="w-full h-full object-cover"
                    />
                ) : null}
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-[#0B3D4A] text-lg leading-tight truncate pr-2">
                        {menu?.name || 'Name'}
                    </h3>
                    <span className={`text-white text-[10px] font-bold px-3 py-1 rounded-full shrink-0 ${available ? 'bg-[#10B981]' : 'bg-slate-400'}`}>
                        {available ? 'Available' : 'Unavailable'}
                    </span>
                </div>

                <div className="text-sm text-[#0B3D4A] mb-8 font-semibold">
                    ฿ {menu?.price ?? 'NA'}
                </div>

                <div className="mt-auto flex justify-between gap-2">
                    <button
                        onClick={onToggleSale}
                        className="flex-1 py-1.5 px-1 bg-white border border-[#AEE1D3] rounded-lg text-[#0B3D4A] font-bold text-[11px] shadow-sm hover:bg-slate-50 transition-colors"
                    >
                        {available ? 'ปิดการขาย' : 'เปิดการขาย'}
                    </button>
                    <button
                        onClick={onEdit}
                        className="flex-1 py-1.5 px-1 bg-white border border-[#AEE1D3] rounded-lg text-[#0B3D4A] font-bold text-[11px] shadow-sm hover:bg-slate-50 transition-colors"
                    >
                        แก้ไข
                    </button>
                    <button
                        onClick={onDelete}
                        className="flex-1 py-1.5 px-1 bg-white border border-red-300 rounded-lg text-red-500 font-bold text-[11px] shadow-sm hover:bg-red-50 transition-colors"
                    >
                        ลบ
                    </button>
                </div>
            </div>
        </div>
    );
}
