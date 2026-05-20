import React, { useState, useEffect, useCallback } from 'react';
import CustomerMenuModal from './CustomerMenuModal';
import CustomerMenuCard from './CustomerMenuCard';
import RefreshButton from '../RefreshButton';
import { call } from '../../utils/api';
import toast from 'react-hot-toast';

export default function CustomerMenuTab({ onAddToCart, user }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const [categories, setCategories] = useState([{ _id: 'all', name: 'เมนูทั้งหมด' }]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user?.restaurantId) return;
    try {
      setLoading(true);
      const [cats, menus] = await Promise.all([
        call('GET', `/api/public/restaurant/${user.restaurantId}/categories`),
        call('GET', `/api/public/restaurant/${user.restaurantId}/menu`)
      ]);
      if (cats && Array.isArray(cats)) {
        setCategories([{ _id: 'all', name: 'เมนูทั้งหมด' }, ...cats]);
      }
      if (menus && Array.isArray(menus)) {
        setMenuItems(menus);
      }
    } catch {
      toast.error('ไม่สามารถโหลดข้อมูลเมนูได้');
    } finally {
      setLoading(false);
    }
  }, [user?.restaurantId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddToCart = (item, quantity, selectedOptions, note) => {
    onAddToCart({ ...item, quantity, options: selectedOptions, note });
    setSelectedItem(null);
  };

  const filteredMenus = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => (item.categoryId?._id || item.categoryId) === activeCategory);

  return (
    <div className="flex flex-col h-full pt-4">
      {/* Desktop header */}
      <div className="hidden md:flex justify-between items-center mb-6 px-2">
        <h2 className="text-[26px] font-black text-[#0B3D4A]">เมนู</h2>
        <RefreshButton onClick={fetchData} />
      </div>

      {/* Mobile header */}
      <div className="md:hidden flex flex-col items-center gap-3 mb-4">
        <h2 className="text-2xl font-black text-[#0B3D4A]">เมนู</h2>
        <RefreshButton onClick={fetchData} />
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <span className="text-sm font-bold text-[#0B3D4A] mr-2">กรอง:</span>
        {categories.map(cat => (
          <button
            key={cat._id}
            onClick={() => setActiveCategory(cat._id)}
            className={`px-5 py-1.5 rounded-full text-[13px] font-bold border transition-colors ${
              activeCategory === cat._id
                ? 'bg-[#0B3D4A] text-white border-[#0B3D4A]'
                : 'bg-transparent text-[#0B3D4A] border-[#0B3D4A] hover:bg-white/50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <p className="text-[#0B3D4A]/60 font-bold">กำลังโหลดข้อมูล...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-6 overflow-y-auto">
          {filteredMenus.map((item) => (
            <CustomerMenuCard
              key={item._id}
              item={item}
              onSelect={setSelectedItem}
            />
          ))}
        </div>
      )}

      {selectedItem && (
        <CustomerMenuModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onAdd={handleAddToCart}
        />
      )}
    </div>
  );
}
