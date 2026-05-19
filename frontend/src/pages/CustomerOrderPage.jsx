import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bgImage from '../components/BG.png';
import CustomerMenuTab from '../components/customer/CustomerMenuTab';
import CustomerCartTab from '../components/customer/CustomerCartTab';
import CustomerOrderHistoryTab from '../components/customer/CustomerOrderHistoryTab';
import AdminTabBar from '../components/AdminTabBar';

export default function CustomerOrderPage({ user }) {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const submitOrder = () => {
    if (cart.length === 0) return;
    setOrders([...orders, ...cart.map(item => ({...item, status: 'pending', id: Date.now() + Math.random()}))]);
    setCart([]);
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed font-sans text-slate-800 flex flex-col"
         style={{ backgroundImage: `url(${bgImage})`, backgroundColor: '#f0f4f8' }}>
      
      {/* Header */}
      <header className="flex justify-between items-center p-6 pb-2">
        <h1 className="text-[28px] font-black text-[#0B3D4A]">EzyOrder</h1>
        <div className="flex items-center gap-6">
          <span className="font-bold text-[#0B3D4A]">Table: {tableId || '1'}</span>
          <button 
            onClick={() => navigate('/select-table')}
            className="px-4 py-1.5 bg-white border border-[#0B3D4A] rounded-xl text-sm font-bold text-[#0B3D4A] hover:bg-slate-50 transition shadow-sm"
          >
            กลับไปที่ admin
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1000px] mx-auto w-full px-4 pb-8 flex flex-col mt-2">
        <div className="bg-white/50 backdrop-blur-xl rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/60 flex-1 flex flex-col min-h-[600px] overflow-hidden">
          
          {/* Shared TabBar Component */}
          <AdminTabBar 
            tabs={[
              { id: 'menu', label: 'เมนู' },
              { id: 'cart', label: 'ตะกร้า' },
              { id: 'history', label: 'รายการที่สั่งไป' }
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab Content */}
          <div className="flex-1 flex flex-col relative h-full p-6">
            {activeTab === 'menu' && <CustomerMenuTab onAddToCart={addToCart} user={user} />}
            {activeTab === 'cart' && <CustomerCartTab cart={cart} onRemove={removeFromCart} onSubmit={submitOrder} />}
            {activeTab === 'history' && <CustomerOrderHistoryTab orders={orders} />}
          </div>
        </div>
      </main>
    </div>
  );
}
