import React, { useState } from 'react';
import CategoryCard from './CategoryCard';
import { call } from '../utils/api';
import { toast } from 'react-hot-toast';

export default function CategoryManagement({ categories: initialCategories = [], restaurantId, token, onCategoriesChange, onClose }) {
    const [categories, setCategories] = useState(initialCategories);
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const update = (updated) => {
        setCategories(updated);
        onCategoriesChange?.(updated);
    };

    const handleAdd = async () => {
        if (!newName.trim()) return;
        setLoading(true);
        try {
            const created = await call('POST', `/api/restaurant/${restaurantId}/categories`, { name: newName.trim() }, token);
            const updated = [...categories, created];
            update(updated);
            setNewName('');
            toast.success('เพิ่มหมวดหมู่สำเร็จ');
        } catch {
            toast.error('เพิ่มหมวดหมู่ล้มเหลว');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (id, name) => {
        setLoading(true);
        try {
            const updated_cat = await call('PUT', `/api/categories/${id}`, { name }, token);
            const updated = categories.map(c => c._id === id ? updated_cat : c);
            update(updated);
            setEditingId(null);
            toast.success('แก้ไขสำเร็จ');
        } catch {
            toast.error('แก้ไขล้มเหลว');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('ลบหมวดหมู่นี้ไหม?')) return;
        setLoading(true);
        try {
            await call('DELETE', `/api/categories/${id}`, null, token);
            const updated = categories.filter(c => c._id !== id);
            update(updated);
            toast.success('ลบสำเร็จ');
        } catch {
            toast.error('ลบล้มเหลว');
        } finally {
            setLoading(false);
        }
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

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <input
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !loading && handleAdd()}
                    placeholder="เพิ่มหมวดหมู่ใหม่"
                    className="flex-1 bg-white border border-[#AEE1D3] rounded-2xl px-4 py-3 outline-none focus:border-[#0B3D4A]"
                />
                <button onClick={handleAdd} disabled={loading} className="w-full sm:w-auto px-5 py-3 bg-[#0B3D4A] text-white rounded-2xl font-bold disabled:opacity-60">
                    เพิ่ม
                </button>
            </div>

            <h3 className="text-lg font-black text-[#0B3D4A]">หมวดหมู่ทั้งหมด</h3>

            {categories.length === 0 ? (
                <p className="text-sm text-slate-400">ยังไม่มีหมวดหมู่</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categories.map(cat => (
                        <CategoryCard
                            key={cat._id}
                            category={{ ...cat, id: cat._id }}
                            onEdit={() => setEditingId(cat._id)}
                            onDelete={() => handleDelete(cat._id)}
                            editing={editingId === cat._id}
                            onSave={(id, name) => handleSave(id, name)}
                            onCancel={() => setEditingId(null)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
