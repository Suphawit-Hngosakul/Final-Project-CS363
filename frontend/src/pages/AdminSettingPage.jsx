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

const TABS = [
  { id: 'orders_tables', label: 'ออเดอร์และโต๊ะ' },
  { id: 'menu', label: 'จัดการเมนูอาหาร' },
  { id: 'restaurant', label: 'จัดการร้านอาหาร' },
  { id: 'reports', label: 'รายงาน' }
];

export default function AdminSettingPage({ user, onLogout, token }) {
  const [activeTab, setActiveTab] = useState('orders_tables');
  const navigate = useNavigate();

  // --- เพิ่ม State สำหรับควบคุม Modal ---
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [selectedCheckoutTable, setSelectedCheckoutTable] = useState('');
  // const [tables, setTables] = useState([]);
  const [tables] = useState([
    { id: 1, number: '1', capacity: 4, status: 'available' },
    { id: 2, number: '2', capacity: 2, status: 'occupied' },
    { id: 3, number: '3', capacity: 4, status: 'available' },
    { id: 4, number: '4', capacity: 6, status: 'available' },
    { id: 5, number: '5', capacity: 4, status: 'available' },
    { id: 6, number: '6', capacity: 8, status: 'occupied' },
  ]);
  const [checkoutData, setCheckoutData] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('ทั้งหมด');
  const [orders, setOrders] = useState([
    {
      id: 1,
      tableNumber: '1',
      name: 'ชาเขียวมิ้นต์',
      quantity: 1,
      option: '0',
      status: 'pending',
      time: '4/5/2569 00:03:13'
    },
    {
      id: 2,
      tableNumber: '2',
      name: 'ชาไทย',
      quantity: 2,
      option: 'หวานน้อย',
      status: 'accepted',
      time: '4/5/2569 00:05:10'
    }
  ]);

  // --- เพิ่ม Logic สำหรับจัดการข้อมูล ---

  // ดึงรายชื่อโต๊ะ
  /*const fetchTables = async () => {
    try {
      const res = await call('GET', `/api/restaurants/${user?.restaurantId}/tables`, null, token);
      setTables(res || []);
      console.log(tables);
    } catch (err) {
      console.error('Fetch tables failed');
    }
  };

  useEffect(() => {
    if (user?.restaurantId) fetchTables();
  }, [user]);
*/
  // เมื่อเลือกโต๊ะใน Modal
  const handleSelectTable = async (tableNum) => {
    setSelectedTable(tableNum);
    if (!tableNum) {
      setCheckoutData(null);
      return;
    }
    try {
      const res = await call('GET', `/api/restaurants/${user?.restaurantId}/tables/${tableNum}/checkout`, null, token);
      setCheckoutData(res);
    } catch (err) {
      toast.error('โหลดข้อมูลยอดชำระล้มเหลว');
    }
  };

  const confirmCheckout = async (paymentMethod) => {
    try {
      await call(
        'POST',
        `/api/restaurants/${user?.restaurantId}/tables/${selectedTable}/checkout`,
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

  const handleUpdateOrderStatus = (orderId) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;

        let nextStatus = order.status;

        switch (order.status) {
          case 'pending':
            nextStatus = 'accepted';
            break;

          case 'accepted':
            nextStatus = 'cooking';
            break;

          case 'cooking':
            nextStatus = 'ready';
            break;

          case 'ready':
            nextStatus = 'served';
            break;

          default:
            nextStatus = order.status;
        }

        return {
          ...order,
          status: nextStatus
        };
      })
    );
  };

  const filteredOrders =
    selectedFilter === 'ทั้งหมด'
      ? orders
      : orders.filter(order => order.status === selectedFilter);

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

                    {/* Select Table */}
                    <div className="flex-1 relative">
                      <select
                        value={selectedCheckoutTable}
                        onChange={(e) => setSelectedCheckoutTable(e.target.value)}
                        className="w-full appearance-none bg-white border border-[#AEE1D3] rounded-xl px-4 py-2 text-sm font-bold text-[#0B3D4A] shadow-sm outline-none focus:border-[#0B3D4A]"
                      >
                        <option value="">เลือกโต๊ะ</option>

                        {tables.map((table) => {
                          const tableNo = table.number || table.tableNumber;

                          return (
                            <option
                              key={table._id || tableNo}
                              value={tableNo}
                            >
                              โต๊ะ {tableNo}
                              {' • '}
                              {table.status === 'available'
                                ? 'Available'
                                : 'Occupied'}
                            </option>
                          );
                        })}
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
              <MenuManagementPage />
            )}
            {activeTab === 'restaurant' && (
              <RestaurantManagementPage user={user} token={token} />
            )}
            {activeTab === 'reports' && <div className="text-[#0B3D4A]">กำลังพัฒนาส่วน รายงาน...</div>}
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
