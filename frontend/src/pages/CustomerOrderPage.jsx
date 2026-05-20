import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bgImage from '../components/BG.png';
import CustomerMenuTab from '../components/customer/CustomerMenuTab';
import CustomerCartTab from '../components/customer/CustomerCartTab';
import CustomerOrderHistoryTab from '../components/customer/CustomerOrderHistoryTab';
import AdminTabBar from '../components/AdminTabBar';
import { call } from '../utils/api';
import { toast } from 'react-hot-toast';

export default function CustomerOrderPage({ user, token }) {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');
  const [cart, setCart] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [hasPin, setHasPin] = useState(false);

  // เช็คว่าร้านตั้ง PIN ไว้หรือยัง — ถ้ายังจะ fallback ไปใช้รหัสผ่านบัญชี
  useEffect(() => {
    if (!user?.restaurantId || !token) return;
    call('GET', `/api/restaurant/${user.restaurantId}`, null, token)
      .then(res => setHasPin(!!res.hasPin))
      .catch(() => {});
  }, [user?.restaurantId, token]);

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

  const [showDrawer, setShowDrawer] = useState(false);

  const handleBackToAdmin = () => {
    setShowDrawer(false);
    setShowPasswordModal(true);
    setPasswordInput('');
  };

  const confirmPassword = async () => {
    if (!passwordInput || verifying) return;
    setVerifying(true);
    try {
      // มี PIN → ตรวจด้วย PIN ของร้าน, ยังไม่มี → fallback เป็นรหัสผ่านบัญชี
      if (hasPin) {
        await call('POST', `/api/restaurant/${user.restaurantId}/pin/verify`, { pin: passwordInput }, token);
      } else {
        await call('POST', '/api/auth/verify-password', { password: passwordInput }, token);
      }
      setShowPasswordModal(false);
      navigate('/');
    } catch {
      toast.error(hasPin ? 'PIN ไม่ถูกต้อง' : 'รหัสผ่านไม่ถูกต้อง');
      setPasswordInput('');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen min-w-[375px] bg-cover bg-center bg-no-repeat bg-fixed font-sans text-slate-800 flex flex-col"
         style={{ backgroundImage: `url(${bgImage})`, backgroundColor: '#f0f4f8' }}>
      
      {/* Header */}
      <header className="flex justify-between items-center p-6 pb-2">
        <div className="flex items-center gap-4">
          {/* Hamburger — แสดงเฉพาะ mobile */}
          <button
            onClick={() => setShowDrawer(true)}
            className="md:hidden flex flex-col gap-1.5 p-1"
          >
            <span className="block w-6 h-0.5 bg-[#0B3D4A]" />
            <span className="block w-6 h-0.5 bg-[#0B3D4A]" />
            <span className="block w-6 h-0.5 bg-[#0B3D4A]" />
          </button>
          <h1 className="text-[28px] font-black text-[#0B3D4A]">EzyOrder</h1>
        </div>

        {/* Tab bar + info — แสดงเฉพาะ md ขึ้นไป */}
        <div className="hidden md:flex items-center gap-6">
          <span className="font-bold text-[#0B3D4A]">Table: {tableId || '1'}</span>
          <button
            onClick={handleBackToAdmin}
            className="px-4 py-1.5 bg-white border border-[#0B3D4A] rounded-xl text-sm font-bold text-[#0B3D4A] hover:bg-slate-50 transition shadow-sm"
          >
            กลับไปที่ admin
          </button>
        </div>
      </header>

      {/* Side Drawer — mobile only */}
      {showDrawer && (
        <div className="fixed inset-0 z-[9998] md:hidden">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowDrawer(false)} />
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-[24px] font-black text-[#0B3D4A]">EzyOrder</h1>
              <button onClick={() => setShowDrawer(false)} className="text-[#0B3D4A] font-bold text-xl">✕</button>
            </div>

            {/* Nav items */}
            <nav className="flex flex-col gap-6 flex-1">
              {[
                { id: 'menu', label: 'เมนู' },
                { id: 'cart', label: 'ตะกร้า' },
                { id: 'history', label: 'รายการที่สั่งไป' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setShowDrawer(false); }}
                  className={`text-left text-lg font-bold pb-1 ${
                    activeTab === tab.id
                      ? 'text-[#0B3D4A] border-b-2 border-[#0B3D4A] w-fit'
                      : 'text-slate-500'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Bottom: Table + กลับ admin */}
            <div className="flex flex-col items-center gap-3 pt-6 border-t border-slate-200">
              <span className="font-bold text-[#0B3D4A]">Table: {tableId || '1'}</span>
              <button
                onClick={handleBackToAdmin}
                className="w-full px-4 py-2 bg-white border border-[#0B3D4A] rounded-xl text-sm font-bold text-[#0B3D4A] hover:bg-slate-50 transition"
              >
                กลับไปที่ admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 w-full mx-auto px-4 pb-8 flex flex-col mt-2 max-w-[500px] md:max-w-[720px] lg:max-w-[1000px]">
        <div className="bg-white/50 backdrop-blur-xl rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/60 flex-1 flex flex-col min-h-[600px] overflow-hidden">
          
          {/* Tab bar — ซ่อนที่ mobile ใช้ drawer แทน */}
          <div className="hidden md:block">
            <AdminTabBar
              tabs={[
                { id: 'menu', label: 'เมนู' },
                { id: 'cart', label: 'ตะกร้า' },
                { id: 'history', label: 'รายการที่สั่งไป' }
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Tab Content */}
          <div className="flex-1 flex flex-col relative h-full p-6">
            {activeTab === 'menu' && <CustomerMenuTab onAddToCart={addToCart} user={user} />}
            {activeTab === 'cart' && <CustomerCartTab cart={cart} onRemove={removeFromCart} onUpdateQuantity={updateCartQuantity} onSubmit={submitOrder} />}
            {activeTab === 'history' && <CustomerOrderHistoryTab tableId={tableId} />}
          </div>
        </div>
      </main>

      {/* Admin Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 w-80 shadow-2xl flex flex-col items-center gap-4">
            <h2 className="text-xl font-black text-[#0B3D4A] text-center">
              {hasPin ? 'ใส่ PIN เพื่อกลับหน้า Admin' : 'ใส่รหัสผ่าน Admin เพื่อกลับ'}
            </h2>
            <input
              type="password"
              inputMode={hasPin ? 'numeric' : 'text'}
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && confirmPassword()}
              placeholder={hasPin ? 'PIN' : 'รหัสผ่าน'}
              className="w-full border border-[#AEE1D3] rounded-xl px-4 py-3 text-center text-lg font-bold outline-none focus:border-[#0B3D4A]"
              autoFocus
            />
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowPasswordModal(false)}
                disabled={verifying}
                className="flex-1 py-2 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-60"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmPassword}
                disabled={verifying}
                className="flex-1 py-2 bg-[#0B3D4A] text-white rounded-xl font-bold hover:opacity-90 disabled:opacity-60"
              >
                {verifying ? 'กำลังตรวจสอบ...' : 'ยืนยัน'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
