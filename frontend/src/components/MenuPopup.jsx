import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { call } from '../utils/api';
import { toast } from 'react-hot-toast';

export default function MenuPopup({ show, onClose, type = 'add', menu = null, restaurantId, token, categories = [], onSave }) {
    const isEdit = type === 'edit';
    const fileRef = useRef(null);

    const [menuName, setMenuName] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageFileName, setImageFileName] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!show) {
            setMenuName(''); setPrice(''); setCategoryId('');
            setDescription(''); setImageFile(null); setImageFileName('');
            return;
        }
        if (isEdit && menu) {
            setMenuName(menu.name || '');
            setPrice(menu.price ?? '');
            setCategoryId(menu.categoryId?._id || menu.categoryId || '');
            setDescription(menu.description || '');
            setImageFileName(menu.image || '');
        } else {
            setCategoryId(categories[0]?._id || '');
        }
    }, [show, isEdit, menu]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImageFileName(file.name);
    };

    const handleSubmit = async () => {
        if (!menuName.trim()) { toast.error('กรุณากรอกชื่อเมนู'); return; }
        if (!price) { toast.error('กรุณากรอกราคา'); return; }
        if (!categoryId) { toast.error('กรุณาเลือกหมวดหมู่'); return; }

        setSaving(true);
        try {
            const fd = new FormData();
            fd.append('name', menuName.trim());
            fd.append('price', price);
            fd.append('categoryId', categoryId);
            fd.append('description', description);
            if (imageFile) fd.append('image', imageFile);

            let result;
            if (isEdit) {
                result = await call('PUT', `/api/menu/${menu._id}`, fd, token, true);
            } else {
                result = await call('POST', `/api/restaurant/${restaurantId}/menu`, fd, token, true);
            }
            toast.success(isEdit ? 'แก้ไขเมนูสำเร็จ' : 'เพิ่มเมนูสำเร็จ');
            onSave?.(result);
            onClose();
        } catch (err) {
            toast.error(err?.response?.data?.errors?.[0]?.msg || 'บันทึกล้มเหลว');
        } finally {
            setSaving(false);
        }
    };

    if (!show) return null;

    const modal = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div
                className="w-full max-w-[720px] rounded-[18px] bg-[#F9FAFB] shadow-2xl animate-in fade-in duration-200 flex flex-col"
                style={{ maxHeight: 'calc(100vh - 80px)' }}
            >
                <div className="flex-1 overflow-y-auto px-6 pt-6 pr-5">
                    <h3 className="text-center text-2xl font-black text-[#0B3D4A] mb-6">{isEdit ? 'แก้ไขเมนู' : 'เพิ่มเมนู'}</h3>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-[15px] font-black text-[#0B3D4A] mb-3">ชื่อเมนู</label>
                            <input
                                type="text"
                                value={menuName}
                                onChange={(e) => setMenuName(e.target.value)}
                                placeholder="กรอกชื่อเมนู"
                                className="w-full bg-white border border-[#E6EEF0] rounded-xl px-5 py-3 text-[15px] outline-none focus:border-[#0B3D4A] shadow-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2">
                                <label className="block text-[15px] font-black text-[#0B3D4A] mb-3">ราคา (บาท)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="กรอกราคา"
                                    className="w-full bg-white border border-[#E6EEF0] rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#0B3D4A] shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-[15px] font-black text-[#0B3D4A] mb-3">หมวดหมู่</label>
                                <select
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    className="w-full bg-white border border-[#E6EEF0] rounded-xl px-4 py-3 outline-none focus:border-[#0B3D4A] shadow-sm"
                                >
                                    {categories.length === 0 && <option value="">-- ไม่มีหมวดหมู่ --</option>}
                                    {categories.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[15px] font-black text-[#0B3D4A] mb-3">คำอธิบาย</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="กรอกรายละเอียด"
                                rows={3}
                                className="w-full resize-none bg-white border border-[#E6EEF0] rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#0B3D4A] shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-[15px] font-black text-[#0B3D4A] mb-3">รูปภาพ (ไม่บังคับ)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    placeholder="URL หรือ ชื่อไฟล์"
                                    value={imageFileName}
                                    readOnly
                                    className="flex-1 bg-white border border-[#E6EEF0] rounded-xl px-4 py-3 outline-none shadow-sm"
                                />
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                <button
                                    type="button"
                                    onClick={() => fileRef.current?.click()}
                                    className="px-4 py-2 bg-white border border-[#AEE1D3] rounded-lg text-[#0B3D4A] font-bold shadow-sm"
                                >
                                    อัปโหลดไฟล์
                                </button>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">หมายเหตุ: การอัปโหลดไฟล์ (file จะถูกใช้แทน URL)</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6 pt-4 flex-shrink-0">
                    <div className="border-t border-slate-200 pt-6 flex items-center justify-between" style={{ gap: 12 }}>
                        <button
                            onClick={onClose}
                            disabled={saving}
                            className="px-6 py-3 bg-white border border-[#0B7285] text-[#0B3D4A] rounded-2xl font-black shadow-sm hover:bg-slate-50 transition-all disabled:opacity-60"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="px-6 py-3 bg-[#0B3D4A] text-white rounded-2xl font-black shadow-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                        >
                            {saving ? 'กำลังบันทึก...' : isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มเมนู'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}
