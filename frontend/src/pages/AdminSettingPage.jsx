import React, { useState, useEffect, useCallback } from 'react';
import bgImage from '../components/BG.png';
import TopNavBar from '../components/TopNavBar';
import AdminTabBar from '../components/AdminTabBar';
import MobileDrawer from '../components/MobileDrawer';
import TableOrderBlock from '../components/TableOrderBlock';
import TableCard from '../components/TableCard';
import RefreshButton from '../components/RefreshButton';
import CheckoutModal from '../components/CheckoutModal';
import Select from '../components/Select';
import { call } from '../utils/api';
import { getSocket } from '../utils/socket';
import { NEXT_STATUS, ORDER_STATUSES } from '../utils/orderStatus';
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

const FILTERS = ['ทั้งหมด', ...ORDER_STATUSES];

export default function AdminSettingPage({ user, onLogout, token }) {
  const [activeTab, setActiveTab] = useState('orders_tables');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showTableSelect, setShowTableSelect] = useState(false);
  const [showCategoryView, setShowCategoryView] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedCheckoutTable, setSelectedCheckoutTable] = useState('');
  const [tables, setTables] = useState([]);
  const [checkoutData, setCheckoutData] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('ทั้งหมด');
  const [rawOrders, setRawOrders] = useState([]);
  const flatOrders = rawOrders.flatMap(order => {
    const table = tables.find(t => t._id === order.tableId?.toString() || t._id === order.tableId);
    if (!table?.currentSessionId) return [];
    if (table.currentSessionId.toString() !== order.sessionId?.toString()) return [];
    return [{
      id: order._id,
      orderId: order._id,
      tableNumber: table.tableNumber ?? '?',
      items: order.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        option: item.options?.length > 0 ? item.options.map(o => `${o.name}: ${o.choice}`).join(', ') : '-',
      })),
      status: order.status,
      time: new Date(order.createdAt).toLocaleString('th-TH'),
    }];
  });

  const fetchTables = useCallback(async () => {
    if (!user?.restaurantId) return;
    try {
      const res = await call('GET', `/api/restaurant/${user.restaurantId}/tables`, null, token);
      setTables(res || []);
    } catch {
      toast.error('โหลดโต๊ะล้มเหลว');
    }
  }, [user?.restaurantId, token]);

  const fetchOrders = useCallback(async () => {
    if (!user?.restaurantId) return;
    try {
      const res = await call('GET', `/api/restaurant/${user.restaurantId}/orders`, null, token);
      setRawOrders(res || []);
    } catch {
      toast.error('โหลดออเดอร์ล้มเหลว');
    }
  }, [user?.restaurantId, token]);

  useEffect(() => {
    if (!user?.restaurantId) return;
    fetchTables();
    fetchOrders();
  }, [user?.restaurantId, fetchTables, fetchOrders]);

  useEffect(() => {
    if (!user?.restaurantId) return;
    const socket = getSocket();
    const restaurantId = user.restaurantId;
    const joinRoom = () => socket.emit('join_restaurant', restaurantId);

    joinRoom();
    socket.on('connect', joinRoom);

    const onNewOrder = () => {
      fetchTables();
      fetchOrders();
    };
    const onStatusUpdate = ({ orderId, status }) => {
      setRawOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    };

    socket.on('new_order', onNewOrder);
    socket.on('order_status_updated', onStatusUpdate);

    return () => {
      socket.off('connect', joinRoom);
      socket.off('new_order', onNewOrder);
      socket.off('order_status_updated', onStatusUpdate);
    };
  }, [user?.restaurantId, fetchTables, fetchOrders]);
  const handleSelectTable = async (tableNum) => {
    setSelectedTable(tableNum);
    if (!tableNum) {
      setCheckoutData(null);
      return;
    }
    const table = tables.find(t => String(t.tableNumber) === String(tableNum));
    if (!table) { toast.error('ไม่พบโต๊ะ'); return; }
    try {
      const res = await call('GET', `/api/tables/${table._id}/bill`, null, token);
      setCheckoutData(res);
    } catch (err) {
      if (err?.response?.status === 404) {
        setCheckoutData(null);
      } else {
        toast.error('โหลดข้อมูลยอดชำระล้มเหลว');
      }
    }
  };

  const confirmCheckout = async (paymentMethod) => {
    const table = tables.find(t => String(t.tableNumber) === String(selectedTable));
    if (!table) return;
    try {
      await call('POST', `/api/tables/${table._id}/bill/checkout`, { paymentMethod }, token);
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
    setSelectedCheckoutTable('');
  };

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
      className="min-h-screen min-w-[375px] bg-cover bg-center bg-no-repeat bg-fixed font-sans text-slate-800"
      style={{ backgroundImage: `url(${bgImage})`, backgroundColor: '#f0f4f8' }}
    >
      {/* Header */}
      <TopNavBar user={user} onLogout={onLogout} onOpenMenu={() => setDrawerOpen(true)} />

      {/* Mobile drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <main className="max-w-[500px] md:max-w-3xl lg:max-w-6xl mx-auto px-4 pb-8">

        {/* ปุ่มย้อนกลับนอกกล่องขาว */}
        {activeTab === 'orders_tables' && showTableSelect && (
          <div className="md:hidden mt-4 mb-3">
            <button
              onClick={() => setShowTableSelect(false)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#AEE1D3] rounded-xl text-sm font-bold text-[#0B3D4A] shadow-sm hover:bg-slate-50"
            >
              ← ย้อนกลับ
            </button>
          </div>
        )}
        {activeTab === 'menu' && showCategoryView && (
          <div className="md:hidden mt-4 mb-3">
            <button
              onClick={() => setShowCategoryView(false)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#AEE1D3] rounded-xl text-sm font-bold text-[#0B3D4A] shadow-sm hover:bg-slate-50"
            >
              ← ย้อนกลับ
            </button>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-white/40 overflow-hidden md:min-h-[600px] flex flex-col">
          <AdminTabBar
            tabs={TABS}
            activeTab={activeTab}
            onTabChange={(tab) => { setActiveTab(tab); setShowTableSelect(false); setShowCategoryView(false); }}
          />
          <div className="p-4 md:p-8 flex-1">
            {activeTab === 'orders_tables' && showTableSelect && (
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-4 border-b border-slate-100 pb-4 md:hidden">
                  <h2 className="text-2xl font-black text-[#0B3D4A]">เลือกโต๊ะให้ลูกค้า</h2>
                  <RefreshButton onClick={fetchTables} />
                </div>
                <div className="hidden md:flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setShowTableSelect(false)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#AEE1D3] rounded-xl text-sm font-bold text-[#0B3D4A] shadow-sm hover:bg-slate-50"
                    >
                      ← ย้อนกลับ
                    </button>
                    <h2 className="text-2xl font-black text-[#0B3D4A]">เลือกโต๊ะให้ลูกค้า</h2>
                  </div>
                  <RefreshButton onClick={fetchTables} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tables.map(table => (
                    <TableCard key={table._id} table={table} token={token} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders_tables' && !showTableSelect && (
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
                      onClick={() => setShowTableSelect(true)}
                      className="px-4 py-2 bg-[#E6F7F1] border border-[#AEE1D3] rounded-xl text-sm font-bold text-[#0B3D4A] shadow-sm hover:bg-[#D4F0E6]"
                    >
                      เลือกโต๊ะให้ลูกค้า
                    </button>
                  </div>
                </div>

                {/* ชำระเงิน */}
                <div className="space-y-2">
                  <h3 className="text-sm font-black text-[#0B3D4A]">ชำระเงิน:</h3>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:max-w-sm">

                    {/* Select table */}
                    <div className="flex-1">
                      <Select
                        value={selectedCheckoutTable}
                        onChange={(e) => setSelectedCheckoutTable(e.target.value)}
                        placeholder="เลือกโต๊ะ"
                        options={tables.map((table) => ({
                          value: table.tableNumber,
                          label: `โต๊ะ ${table.tableNumber} • ${table.status === 'available' ? 'Available' : table.status === 'payment' ? 'Payment' : 'Occupied'}`,
                        }))}
                        className="bg-white border border-[#AEE1D3] rounded-xl px-4 py-2 text-sm font-bold text-[#0B3D4A] shadow-sm focus:border-[#0B3D4A]"
                        chevronSize={12}
                      />
                    </div>

                    {/* Checkout button */}
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
                      className="w-full sm:w-auto px-6 py-2 bg-white border border-[#AEE1D3] rounded-xl text-[#0B3D4A] font-bold shadow-sm hover:bg-slate-50 transition-colors"
                    >
                      Checkout
                    </button>
                  </div>
                </div>

                {/* จัดการออเดอร์ */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-black text-[#0B3D4A]">จัดการออเดอร์:</h3>
                  <div className="flex items-center gap-2 md:hidden">
                    <span className="text-xs text-[#0B3D4A] font-bold shrink-0">กรอง:</span>
                    <div className="flex-1 max-w-[180px]">
                      <Select
                        value={selectedFilter}
                        onChange={(e) => setSelectedFilter(e.target.value)}
                        options={FILTERS.map(f => ({ value: f, label: f }))}
                        className="bg-[#0B3D4A] text-white rounded-full px-4 py-1.5 text-xs font-bold shadow-sm"
                        chevronSize={10}
                        chevronColor="white"
                      />
                    </div>
                  </div>

                  {/* Filter butons */}
                  <div className="hidden md:flex flex-wrap items-center gap-2">
                    <span className="text-xs text-[#0B3D4A] font-bold mr-1">กรอง:</span>
                    {FILTERS.map(filter => (
                      <button
                        key={filter}
                        onClick={() => setSelectedFilter(filter)}
                        className={`shrink-0 px-3 md:px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedFilter === filter
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
              <MenuManagementPage user={user} token={token} showCategoryView={showCategoryView} setShowCategoryView={setShowCategoryView} />
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
