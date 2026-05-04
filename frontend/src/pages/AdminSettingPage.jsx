import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../components/BG.png';
import TopNavBar from '../components/TopNavBar';
import AdminTabBar from '../components/AdminTabBar';
import TableOrderBlock from '../components/TableOrderBlock';
import RefreshButton from '../components/RefreshButton';

const TABS = [
  { id: 'orders_tables', label: 'ออเดอร์และโต๊ะ' },
  { id: 'menu', label: 'จัดการเมนูอาหาร' },
  { id: 'restaurant', label: 'จัดการร้านอาหาร' },
  { id: 'reports', label: 'รายงาน' }
];

export default function AdminSettingPage({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('orders_tables');
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed font-sans text-slate-800"
      style={{ backgroundImage: `url(${bgImage})`, backgroundColor: '#f0f4f8' }}
    >
      {/* Header */}
      <TopNavBar user={user} onLogout={onLogout} />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 pb-8">
        
        {/* Unified White Board */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-white/40 overflow-hidden min-h-[600px] flex flex-col">
          
          <AdminTabBar 
            tabs={TABS} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />

          {/* Content Area */}
          <div className="p-8 flex-1">
          {activeTab === 'orders_tables' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-[#0B3D4A]">ออเดอร์และโต๊ะ</h2>
                <RefreshButton />
              </div>

              {/* จัดการโต๊ะ */}
              <div className="space-y-2">
                <h3 className="text-sm font-black text-[#0B3D4A]">จัดการโต๊ะ:</h3>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-white border border-[#AEE1D3] rounded-xl text-sm font-bold text-[#0B3D4A] shadow-sm">
                    แก้ไขจำนวนโต๊ะ
                  </button>
                  <button 
                    onClick={() => navigate('/select-table')}
                    className="px-4 py-2 bg-[#E6F7F1] border border-[#AEE1D3] rounded-xl text-sm font-bold text-[#0B3D4A] shadow-sm hover:bg-[#D4F0E6]"
                  >
                    เลือกโต๊ะให้ลูกค้า
                  </button>
                </div>
              </div>

              {/* ชำระเงิน */}
              <div className="space-y-2">
                <h3 className="text-sm font-black text-[#0B3D4A]">ชำระเงิน:</h3>
                <div className="flex gap-3 max-w-sm">
                  <div className="flex-1 relative">
                    <select className="w-full appearance-none bg-white border border-[#AEE1D3] rounded-xl px-4 py-2 text-sm font-bold text-[#0B3D4A] shadow-sm outline-none focus:border-[#0B3D4A]">
                      <option>โต๊ะ 1 - occupied</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#0B3D4A]"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                  <button className="px-6 py-2 bg-white border border-[#AEE1D3] rounded-xl text-sm font-bold text-[#0B3D4A] shadow-sm">
                    Checkout
                  </button>
                </div>
              </div>

              {/* จัดการออเดอร์ */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-black text-[#0B3D4A]">จัดการออเดอร์:</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#0B3D4A] font-bold mr-2">กรอง:</span>
                  {['ทั้งหมด', 'pending', 'accepted', 'cooking', 'ready', 'served'].map(filter => (
                    <button 
                      key={filter}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                        filter === 'ทั้งหมด'
                          ? 'bg-[#0B3D4A] text-white border-[#0B3D4A]'
                          : 'bg-transparent border-[#0B3D4A] text-[#0B3D4A] hover:bg-[#0B3D4A]/10'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* ออเดอร์ของโต๊ะ */}
                <TableOrderBlock tableNumber="1" />
              </div>

            </div>
          )}

          {activeTab === 'menu' && <div className="text-[#0B3D4A]">กำลังพัฒนาส่วน จัดการเมนูอาหาร...</div>}
          {activeTab === 'restaurant' && <div className="text-[#0B3D4A]">กำลังพัฒนาส่วน จัดการร้านอาหาร...</div>}
          {activeTab === 'reports' && <div className="text-[#0B3D4A]">กำลังพัฒนาส่วน รายงาน...</div>}
          </div>
        </div>
      </main>
    </div>
  );
}
