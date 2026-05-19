import React, { useState, useEffect } from 'react';
import CustomerMenuModal from './CustomerMenuModal';
import { call } from '../../utils/api';
import toast from 'react-hot-toast';

export default function CustomerMenuTab({ onAddToCart, user }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  
  const [categories, setCategories] = useState([{ _id: 'all', name: 'เมนูทั้งหมด' }]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
      } catch (err) {
        toast.error('ไม่สามารถโหลดข้อมูลเมนูได้');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user?.restaurantId]);

  const handleAddToCart = (item, quantity, selectedOptions, note) => {
    onAddToCart({ ...item, quantity, options: selectedOptions, note });
    setSelectedItem(null);
  };

  const filteredMenus = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => (item.categoryId?._id || item.categoryId) === activeCategory);

  return (
    <div className="flex flex-col h-full pt-4">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-6 overflow-y-auto">
          {filteredMenus.map((item) => (
            <div key={item._id} className="bg-white rounded-[20px] p-4 flex flex-col shadow-sm border border-slate-100 relative">
              <div className="bg-[#dcdfe4] h-[140px] rounded-[14px] mb-4 w-full overflow-hidden">
                {item.image && (
                  <img src={item.image.startsWith('http') ? item.image : `/uploads/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <h3 className="font-black text-[#0B3D4A] text-[17px] leading-tight mb-1">{item.name}</h3>
              <p className="text-xs text-[#0B3D4A]/70 font-bold mb-4">฿ {item.price}</p>
              <div className="absolute bottom-4 right-4 flex justify-end">
                <button 
                  onClick={() => setSelectedItem(item)}
                  className="w-8 h-8 rounded-full bg-[#dcdfe4] text-slate-700 font-bold flex items-center justify-center hover:bg-slate-300 transition-colors shadow-sm"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>
            </div>
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
