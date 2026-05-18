import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function MenuPopup({ show, onClose, type = 'add', menu = null }) {
    const isEdit = type === 'edit';

    const [menuName, setMenuName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [stock, setStock] = useState('');

    useEffect(() => {
        if (!show) {
            setMenuName('');
            setPrice('');
            setDescription('');
            setStock('');
            return;
        }

        if (show && isEdit && menu) {
            setMenuName(menu.name || '');
            setPrice(menu.price || '');
            setDescription(menu.description || '');
            setStock(menu.stock || '');
        }
    }, [show, isEdit, menu]);

    if (!show) return null;

    const modal = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div
                className="w-full max-w-[720px] rounded-[18px] bg-[#F9FAFB] shadow-2xl animate-in fade-in duration-200 overflow-hidden"
                style={{ maxHeight: 'calc(100vh - 80px)' }}
            >
                <div style={{ maxHeight: 'calc(100vh - 160px)', overflow: 'auto', paddingRight: 20 }} className="px-6 pt-6">
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
                                <select className="w-full bg-white border border-[#E6EEF0] rounded-xl px-4 py-3 outline-none focus:border-[#0B3D4A] shadow-sm">
                                    <option>v</option>
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
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-[15px] font-black text-[#0B3D4A]">ตัวเลือก (OPTIONS)</label>
                                <button className="text-sm px-3 py-1 border border-[#AEE1D3] rounded-full text-[#0B3D4A] bg-white">+ เพิ่ม Option</button>
                            </div>
                            <textarea className="w-full h-24 resize-none bg-white border border-[#E6EEF0] rounded-xl px-4 py-3 outline-none shadow-sm" />
                        </div>

                        <div>
                            <label className="block text-[15px] font-black text-[#0B3D4A] mb-3">รูปภาพ (ไม่บังคับ)</label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    placeholder="URL หรือ ชื่อไฟล์"
                                    value={''}
                                    readOnly
                                    className="flex-1 bg-white border border-[#E6EEF0] rounded-xl px-4 py-3 outline-none shadow-sm"
                                />
                                <button className="px-4 py-2 bg-white border border-[#AEE1D3] rounded-lg text-[#0B3D4A] font-bold shadow-sm">อัปโหลดไฟล์</button>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">หมายเหตุ: การอัปโหลดไฟล์ (file จะถูกใช้แทน URL)</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6 pt-4" style={{ paddingRight: 20 }}>
                    <div className="border-t border-slate-200 pt-6 flex items-center justify-between" style={{ gap: 12 }}>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 bg-white border border-[#0B7285] text-[#0B3D4A] rounded-2xl font-black shadow-sm hover:bg-slate-50 transition-all"
                        >
                            ยกเลิก
                        </button>

                        <button
                            className="px-6 py-3 bg-[#0B3D4A] text-white rounded-2xl font-black shadow-sm hover:opacity-90 transition-opacity"
                        >
                            {isEdit ? 'บันทึกการแก้ไข' : 'เพิ่มเมนู'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}