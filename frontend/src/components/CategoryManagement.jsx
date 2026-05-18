import React, { useState } from 'react';
import CategoryCard from './CategoryCard';

export default function CategoryManagement({ categories: initialCategories = [], onClose }) {
    const [categories, setCategories] = useState(initialCategories || []);
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState(null);

    const handleAdd = () => {
        if (!newName.trim()) return;
        setCategories(prev => [...prev, { id: Date.now(), name: newName.trim() }]);
        setNewName('');
    };

    const handleEdit = (id) => setEditingId(id);

    const handleSave = (id, name) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
        setEditingId(null);
    };

    const handleCancel = () => setEditingId(null);

    const handleDelete = (id) => {
        if (!confirm('ลบหมวดหมู่นี้ไหม?')) return;
        setCategories(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 border border-[#0B7285] text-[#0B3D4A] bg-white px-4 py-2 rounded-2xl font-black shadow-sm hover:bg-slate-50 transition-all"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    ย้อนกลับ
                </button>

                <h2 className="text-3xl font-black text-[#0B3D4A]">จัดการหมวดหมู่</h2>
            </div>

            <div className="flex items-center gap-3">
                <input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="เพิ่มหมวดหมู่ใหม่"
                    className="flex-1 bg-white border border-[#AEE1D3] rounded-2xl px-4 py-3 outline-none focus:border-[#0B3D4A]"
                />
                <button onClick={handleAdd} className="px-5 py-3 bg-[#0B3D4A] text-white rounded-2xl font-bold">เพิ่ม</button>
            </div>

            <h3 className="text-lg font-black text-[#0B3D4A]">หมวดหมู่ทั้งหมด</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {categories.map(cat => (
                    <CategoryCard
                        key={cat.id}
                        category={cat}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        editing={editingId === cat.id}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                ))}
            </div>
        </div>
    );
}
