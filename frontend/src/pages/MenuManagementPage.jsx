import React, { useState } from 'react';
import MenuCard from '../components/MenuCard';
import MenuPopup from '../components/MenuPopup';
import CategoryManagement from '../components/CategoryManagement';

export default function MenuManagementPage() {

    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);
    const [menus, setMenus] = useState([
        { id: 1, name: 'Name', price: 'NA', status: 'Available' },
        { id: 2, name: 'Name', price: 'NA', status: 'Available' }
    ]);
    const [showCategoryView, setShowCategoryView] = useState(false);
    const [categories] = useState([
        { id: 1, name: 'ทั้งหมด' },
        { id: 2, name: 'ของว่าง' },
        { id: 3, name: 'จานหลัก' }
    ]);
    const handleEdit = (menu) => {
        setEditingMenu(menu);
        setShowEditPopup(true);
    };

    const handleDelete = (id) => {
        setMenus((prev) => prev.filter((menu) => menu.id !== id));
    };

    const handleToggleSale = (id) => {
        setMenus((prev) =>
            prev.map((menu) =>
                menu.id === id
                    ? {
                          ...menu,
                          status: menu.status === 'Available' ? 'Unavailable' : 'Available'
                      }
                    : menu
            )
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h2 className="text-3xl font-black text-[#0B3D4A]">จัดการเมนูอาหาร</h2>
                    <p className="mt-3 text-sm text-[#475569] max-w-2xl">
                        เพิ่ม แก้ไข และจัดการเมนูอาหารของร้าน พร้อมตรวจสอบสถานะการขายได้ทันที
                    </p>
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

            {!showCategoryView && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {menus.map((menu) => (
                        <MenuCard
                            key={menu.id}
                            menu={menu}
                            onEdit={() => handleEdit(menu)}
                            onDelete={() => handleDelete(menu.id)}
                            onToggleSale={() => handleToggleSale(menu.id)}
                        />
                    ))}
                </div>
            )}

            {showCategoryView && (
                <div className="p-2">
                    <CategoryManagement categories={categories} onClose={() => setShowCategoryView(false)} />
                </div>
            )}

            <MenuPopup
                show={showAddPopup}
                type="add"
                onClose={() => setShowAddPopup(false)}
            />

            <MenuPopup
                show={showEditPopup}
                type="edit"
                menu={editingMenu}
                onClose={() => {
                    setShowEditPopup(false);
                    setEditingMenu(null);
                }}
            />

            {/* CategoryPopup removed; CategoryManagement is shown inline when `showCategoryView` is true */}
        </div>
    );
}