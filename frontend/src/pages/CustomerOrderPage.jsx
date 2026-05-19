import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bgImage from '../components/BG.png';
import CustomerMenuTab from '../components/customer/CustomerMenuTab';
import CustomerCartTab from '../components/customer/CustomerCartTab';
import CustomerOrderHistoryTab from '../components/customer/CustomerOrderHistoryTab';
import AdminTabBar from '../components/AdminTabBar';
import { call } from '../utils/api';
import { toast } from 'react-hot-toast';

export default function CustomerOrderPage({ user }) {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');
  const [cart, setCart] = useState([]);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const ADMIN_PIN = '1234';

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index, delta) => {
    setCart(prev => prev.map((item, i) => {
      if (i !== index) return item;
      const newQty = item.quantity + delta;
      return newQty < 1 ? null : { ...item, quantity: newQty };
    }).filter(Boolean));
  };

  const submitOrder = async () => {
    if (cart.length === 0) return;
    try {
      const items = cart.map(item => ({
        menuItemId: item._id,
        quantity: item.quantity,
        options: item.options || [],
        note: item.note || '',
      }));
      await call('POST', `/api/tables/${tableId}/orders`, { items });
      toast.success('สั่งอาหารสำเร็จ');
      setCart([]);
      setActiveTab('history');
    } catch {
      toast.error('สั่งอาหารไม่สำเร็จ กรุณาลองใหม่');
    }
  };

  const handleBackToAdmin = () => {
    setShowPinModal(true);
    setPinInput('');
  };

  const confirmPin = () => {
    if (pinInput === ADMIN_PIN) {
      setShowPinModal(false);
      navigate('/select-table');
    } else {
      toast.error('PIN ไม่ถูกต้อง');
      setPinInput('');
    }
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
            onClick={handleBackToAdmin}
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
            {activeTab === 'cart' && <CustomerCartTab cart={cart} onRemove={removeFromCart} onUpdateQuantity={updateCartQuantity} onSubmit={submitOrder} />}
            {activeTab === 'history' && <CustomerOrderHistoryTab tableId={tableId} />}
          </div>
        </div>
      </main>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-80 shadow-2xl flex flex-col items-center gap-4">
            <h2 className="text-xl font-black text-[#0B3D4A]">ใส่ PIN เพื่อกลับหน้า Admin</h2>
            <input
              type="password"
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && confirmPin()}
              maxLength={4}
              placeholder="PIN 4 หลัก"
              className="w-full border border-[#AEE1D3] rounded-xl px-4 py-3 text-center text-2xl font-black tracking-[0.5em] outline-none focus:border-[#0B3D4A]"
              autoFocus
            />
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowPinModal(false)}
                className="flex-1 py-2 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmPin}
                className="flex-1 py-2 bg-[#0B3D4A] text-white rounded-xl font-bold hover:opacity-90"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
