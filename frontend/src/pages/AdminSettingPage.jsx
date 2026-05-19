import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImage from '../components/BG.png';
import TopNavBar from '../components/TopNavBar';
import AdminTabBar from '../components/AdminTabBar';
import TableOrderBlock from '../components/TableOrderBlock';
import RefreshButton from '../components/RefreshButton';
import CheckoutModal from '../components/CheckoutModal';
import { call } from '../utils/api';
import { toast } from 'react-hot-toast';
import MenuManagementPage from './MenuManagementPage';
import RestaurantManagementPage from './RestaurantManagementPage';
import ReportsPage from './ReportsPage';

const TABS = [
  { id: 'orders_tables', label: 'ออเดอร์และโต๊ะ' },
  { id: 'menu', label: 'จัดการเมนูอาหาร' },
  { id: 'restaurant', label: 'จัดการร้านอาหาร' },
  { id: 'reports', label: 'รายงาน' }
];

export default function AdminSettingPage({ user, onLogout, token }) {
  const [activeTab, setActiveTab] = useState('orders_tables');
  const navigate = useNavigate();

  // --- State ---
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedCheckoutTable, setSelectedCheckoutTable] = useState('');
  const [tables, setTables] = useState([]);
  const [checkoutData, setCheckoutData] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('ทั้งหมด');
  const [rawOrders, setRawOrders] = useState([]);

  // flatten API orders → รูปแบบที่ OrderItemCard ใช้
  const flatOrders = rawOrders.flatMap(order => {
    const tableNum = tables.find(t => t._id === order.tableId?.toString() || t._id === order.tableId)?.tableNumber ?? '?';
    return order.items.map((item, idx) => ({
      id: `${order._id}_${idx}`,
      orderId: order._id,
      tableNumber: tableNum,
      name: item.name,
      quantity: item.quantity,
      option: item.options?.length > 0 ? item.options.map(o => `${o.name}: ${o.choice}`).join(', ') : '-',
      status: order.status,
      time: new Date(order.createdAt).toLocaleString('th-TH'),
    }));
  });

  const fetchTables = async () => {
    if (!user?.restaurantId) return;
    try {
      const res = await call('GET', `/api/restaurant/${user.restaurantId}/tables`, null, token);
      setTables(res || []);
    } catch {
      toast.error('โหลดโต๊ะล้มเหลว');
    }
  };

  const fetchOrders = async () => {
    if (!user?.restaurantId) return;
    try {
      const res = await call('GET', `/api/restaurant/${user.restaurantId}/orders`, null, token);
      setRawOrders(res || []);
    } catch {
      toast.error('โหลดออเดอร์ล้มเหลว');
    }
  };

  useEffect(() => {
    if (user?.restaurantId) {
      fetchTables();
      fetchOrders();
    }
  }, [user?.restaurantId]);
  // เมื่อเลือกโต๊ะใน Modal
  const handleSelectTable = async (tableNum) => {
    setSelectedTable(tableNum);
    if (!tableNum) {
      setCheckoutData(null);
      return;
    }
    try {
      const res = await call('GET', `/api/restaurant/${user?.restaurantId}/tables/${tableNum}/checkout`, null, token);
      setCheckoutData(res);
    } catch (err) {
      toast.error('โหลดข้อมูลยอดชำระล้มเหลว');
    }
  };

  const confirmCheckout = async (paymentMethod) => {
    try {
      await call(
        'POST',
        `/api/restaurant/${user?.restaurantId}/tables/${selectedTable}/checkout`,
        {
          paymentMethod
        },
        token
      );

      toast.success(`ชำระเงินโต๊ะ ${selectedTable} สำเร็จ`);

      handleCloseModal();
      fetchTables();
    } catch (err) {
      toast.error('การชำระเงินล้มเหลว');
    }
  };

  const handleCloseModal = () => {
    setShowCheckoutModal(false);
    setCheckoutData(null);
    setSelectedTable('');
  };

  const NEXT_STATUS = { pending: 'accepted', accepted: 'cooking', cooking: 'ready', ready: 'served' };

  const handleUpdateOrderStatus = async (flatId) => {
    const flat = flatOrders.find(o => o.id === flatId);
    if (!flat || !NEXT_STATUS[flat.status]) return;
    try {
      await call('PATCH', `/api/orders/${flat.orderId}/status`, { status: NEXT_STATUS[flat.status] }, token);
      setRawOrders(prev =>
        prev.map(o => o._id === flat.orderId ? { ...o, status: NEXT_STATUS[flat.status] } : o)
      );
    } catch {
      toast.error('อัปเดตสถานะล้มเหลว');
    }
  };

  const filteredOrders =
    selectedFilter === 'ทั้งหมด'
      ? flatOrders
      : flatOrders.filter(order => order.status === selectedFilter);

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
                  <RefreshButton onClick={() => { fetchTables(); fetchOrders(); }} />
                </div>

                {/* จัดการโต๊ะ */}
                <div className="space-y-2">
                  <h3 className="text-sm font-black text-[#0B3D4A]">จัดการโต๊ะ:</h3>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setActiveTab('restaurant')}
                      className="px-4 py-2 bg-white border border-[#AEE1D3] rounded-xl text-sm font-bold text-[#0B3D4A] shadow-sm hover:bg-slate-50 transition-colors"
                    >
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

                    {/* Select Table */}
                    <div className="flex-1 relative">
                      <select
                        value={selectedCheckoutTable}
                        onChange={(e) => setSelectedCheckoutTable(e.target.value)}
                        className="w-full appearance-none bg-white border border-[#AEE1D3] rounded-xl px-4 py-2 text-sm font-bold text-[#0B3D4A] shadow-sm outline-none focus:border-[#0B3D4A]"
                      >
                        <option value="">เลือกโต๊ะ</option>

                        {tables.map((table) => (
                          <option key={table._id} value={table.tableNumber}>
                            โต๊ะ {table.tableNumber} • {table.status === 'available' ? 'Available' : table.status === 'payment' ? 'Payment' : 'Occupied'}
                          </option>
                        ))}
                      </select>

                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-[#0B3D4A]"
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={async () => {
                        if (!selectedCheckoutTable) {
                          toast.error('กรุณาเลือกโต๊ะ');
                          return;
                        }

                        try {
                          await handleSelectTable(selectedCheckoutTable);

                          setShowCheckoutModal(true);

                        } catch (err) {
                          toast.error('โหลดข้อมูลยอดชำระล้มเหลว');
                        }
                      }}
                      className="px-6 py-2 bg-white border border-[#AEE1D3] rounded-xl text-[#0B3D4A] font-bold shadow-sm hover:bg-slate-50 transition-colors"
                    >
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
                        onClick={() => setSelectedFilter(filter)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedFilter === filter
                          ? 'bg-[#0B3D4A] text-white border-[#0B3D4A]'
                          : 'bg-transparent border-[#0B3D4A] text-[#0B3D4A] hover:bg-[#0B3D4A]/10'
                          }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {/* ออเดอร์ของโต๊ะ */}
                  <TableOrderBlock
                    orders={filteredOrders}
                    onAccept={handleUpdateOrderStatus}
                  />
                </div>

              </div>
            )}

            {activeTab === 'menu' && (
              <MenuManagementPage user={user} token={token} />
            )}
            {activeTab === 'restaurant' && (
              <RestaurantManagementPage user={user} token={token} />
            )}
            {activeTab === 'reports' && (
              <ReportsPage user={user} token={token} />
            )}
          </div>
        </div>
      </main>
      <CheckoutModal
        show={showCheckoutModal}
        onClose={handleCloseModal}
        tables={tables}
        selectedTable={selectedTable}
        onSelectTable={handleSelectTable}
        checkoutData={checkoutData}
        onConfirm={confirmCheckout}
      />
    </div>
  );
}
