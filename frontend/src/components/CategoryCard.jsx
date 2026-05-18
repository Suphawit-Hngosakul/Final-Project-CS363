import React, { useState, useEffect } from 'react';

export default function CategoryCard({ category, onEdit, onDelete, editing = false, onSave, onCancel }) {
    const [name, setName] = useState(category?.name || '');

    useEffect(() => {
        setName(category?.name || '');
    }, [category]);

    if (editing) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-4 flex items-center gap-4">
                <input
                    className="flex-1 bg-white border border-[#E6EEF0] rounded-lg px-4 py-2 outline-none text-[#0B3D4A] font-bold"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onSave && onSave(category.id, name)}
                        className="px-4 py-2 bg-white border border-[#AEE1D3] text-[#0B3D4A] rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-colors"
                    >
                        บันทึก
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-3 py-2 bg-white border border-red-200 text-red-500 rounded-lg font-bold shadow-sm hover:bg-red-50 transition-colors"
                    >
                        X
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between px-6 py-4">
            <div className="text-lg font-bold text-[#0B3D4A]">{category?.name || 'หมวดหมู่'}</div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => onEdit && onEdit(category.id)}
                    className="px-4 py-2 bg-white border border-[#AEE1D3] text-[#0B3D4A] rounded-lg font-bold shadow-sm hover:bg-slate-50 transition-colors"
                >
                    แก้ไข
                </button>
                <button
                    onClick={() => onDelete && onDelete(category.id)}
                    className="px-3 py-2 bg-white border border-red-200 text-red-500 rounded-lg font-bold shadow-sm hover:bg-red-50 transition-colors"
                >
                    ลบ
                </button>
            </div>
        </div>
    );
}
