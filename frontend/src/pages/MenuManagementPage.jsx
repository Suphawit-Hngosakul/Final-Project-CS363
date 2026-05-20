import React, { useState, useEffect, useCallback } from 'react';
import MenuCard from '../components/MenuCard';
import MenuPopup from '../components/MenuPopup';
import CategoryManagement from '../components/CategoryManagement';
import { call } from '../utils/api';
import { toast } from 'react-hot-toast';

export default function MenuManagementPage({ user, token }) {
    const restaurantId = user?.restaurantId;

    const [menus, setMenus] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);
    const [showCategoryView, setShowCategoryView] = useState(false);

    const fetchMenus = useCallback(async () => {
        if (!restaurantId) return;
        setLoading(true);
        try {
            const [menuRes, catRes] = await Promise.all([
                call('GET', `/api/restaurant/${restaurantId}/menu`, null, token),
                call('GET', `/api/restaurant/${restaurantId}/categories`, null, token),
            ]);
            setMenus(menuRes ?? []);
            setCategories(catRes ?? []);
        } catch {
            toast.error('โหลดข้อมูลล้มเหลว');
        } finally {
            setLoading(false);
        }
    }, [restaurantId, token]);

    useEffect(() => { fetchMenus(); }, [fetchMenus]);

    const handleEdit = (menu) => {
        setEditingMenu(menu);
        setShowEditPopup(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('ลบเมนูนี้ไหม?')) return;
        try {
            await call('DELETE', `/api/menu/${id}`, null, token);
            setMenus(prev => prev.filter(m => m._id !== id));
            toast.success('ลบเมนูสำเร็จ');
        } catch {
            toast.error('ลบเมนูล้มเหลว');
        }
    };

    const handleToggleSale = async (menu) => {
        try {
            const updated = await call(
                'PATCH',
                `/api/menu/${menu._id}/availability`,
                { isAvailable: !menu.isAvailable },
                token
            );
            setMenus(prev => prev.map(m => m._id === menu._id ? updated : m));
        } catch {
            toast.error('อัปเดตสถานะล้มเหลว');
        }
    };

    const handleSaveMenu = (saved) => {
        setMenus(prev => {
            const exists = prev.find(m => m._id === saved._id);
            return exists ? prev.map(m => m._id === saved._id ? saved : m) : [...prev, saved];
        });
    };

    return (
        <div className="space-y-8">
            {!showCategoryView && (
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-[#0B3D4A]">จัดการเมนูอาหาร</h2>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => setShowCategoryView(true)}
                            className="px-5 py-3 bg-white border border-[#AEE1D3] text-[#0B3D4A] rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-colors"
                        >
                            จัดการหมวดหมู่
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAddPopup(true)}
                            className="px-5 py-3 bg-[#0B3D4A] text-white rounded-2xl font-bold shadow-sm hover:opacity-90 transition-opacity"
                        >
                            เพิ่ม
                        </button>
                    </div>
                </div>
            )}

            {!showCategoryView && (
                loading ? (
                    <p className="text-sm text-slate-400">กำลังโหลด...</p>
                ) : menus.length === 0 ? (
                    <p className="text-sm text-slate-400">ยังไม่มีเมนู — กด "เพิ่ม" เพื่อเริ่มต้น</p>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {menus.map((menu) => (
                            <MenuCard
                                key={menu._id}
                                menu={menu}
                                onEdit={() => handleEdit(menu)}
                                onDelete={() => handleDelete(menu._id)}
                                onToggleSale={() => handleToggleSale(menu)}
                            />
                        ))}
                    </div>
                )
            )}

            {showCategoryView && (
                <div className="p-2">
                    <CategoryManagement
                        categories={categories}
                        restaurantId={restaurantId}
                        token={token}
                        onCategoriesChange={setCategories}
                        onClose={() => setShowCategoryView(false)}
                    />
                </div>
            )}

            <MenuPopup
                show={showAddPopup}
                type="add"
                restaurantId={restaurantId}
                token={token}
                categories={categories}
                menus={menus}
                onSave={handleSaveMenu}
                onClose={() => setShowAddPopup(false)}
            />

            <MenuPopup
                show={showEditPopup}
                type="edit"
                menu={editingMenu}
                restaurantId={restaurantId}
                token={token}
                categories={categories}
                menus={menus}
                onSave={handleSaveMenu}
                onClose={() => {
                    setShowEditPopup(false);
                    setEditingMenu(null);
                }}
            />
        </div>
    );
}
