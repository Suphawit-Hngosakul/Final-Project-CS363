import React, { useState, useEffect, useCallback } from 'react';
import { call } from '../utils/api';
import { toast } from 'react-hot-toast';

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E6EEF0] p-6 flex flex-col items-center justify-center gap-2 w-full">
      <span className="text-[15px] font-bold text-[#0B3D4A]">{label}</span>
      <span className="text-4xl font-black text-[#0B3D4A]">{value}</span>
    </div>
  );
}

function RankCard({ rank, item, large = false }) {
  const name = item?.name ?? 'Name';
  const qty = item?.totalQuantity ?? '...';

  if (large) {
    return (
      <div className="flex bg-white rounded-2xl shadow-sm border border-[#E6EEF0] overflow-hidden h-full">
        <div className="w-28 bg-[#F0F4F8] flex items-center justify-center shrink-0">
          <span className="text-3xl font-black text-[#0B3D4A]">#{rank}</span>
        </div>
        <div className="flex flex-col justify-center px-6 py-5 gap-1">
          <span className="text-xl font-black text-[#0B3D4A]">{name}</span>
          <span className="text-sm text-[#4A7C8A]">ขายได้ {qty} ชิ้น</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-white rounded-2xl shadow-sm border border-[#E6EEF0] overflow-hidden">
      <div className="w-20 bg-[#F0F4F8] flex items-center justify-center shrink-0 py-4">
        <span className="text-xl font-black text-[#0B3D4A]">#{rank}</span>
      </div>
      <div className="flex flex-col justify-center px-5 py-4 gap-0.5">
        <span className="text-base font-black text-[#0B3D4A]">{name}</span>
        <span className="text-sm text-[#4A7C8A]">ขายได้ {qty} ชิ้น</span>
      </div>
    </div>
  );
}

export default function ReportsPage({ user, token }) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [report, setReport] = useState(null);
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user?.restaurantId) return;
    setLoading(true);
    try {
      const [dailyRes, popularRes] = await Promise.all([
        call('GET', `/api/restaurant/${user.restaurantId}/reports/daily?date=${date}`, null, token),
        call('GET', `/api/restaurant/${user.restaurantId}/reports/popular-items?limit=3`, null, token),
      ]);
      setReport(dailyRes);
      setPopularItems(popularRes ?? []);
    } catch {
      toast.error('โหลดรายงานล้มเหลว');
    } finally {
      setLoading(false);
    }
  }, [date, user?.restaurantId, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (n) =>
    (n ?? 0).toLocaleString('th-TH', { minimumFractionDigits: 0 });

  return (
    <div className="space-y-6">
      {/* Date picker */}
      <div className="space-y-3">
        <h2 className="text-[15px] font-black text-[#0B3D4A]">รายงานยอดขายรายวัน:</h2>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full sm:w-auto bg-white border border-[#E6EEF0] rounded-xl px-4 py-2.5 text-[15px] text-[#0B3D4A] outline-none focus:border-[#0B3D4A] shadow-sm"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="ยอดรวม"
          value={loading ? '...' : `฿${formatCurrency(report?.totalRevenue)}`}
        />
        <StatCard
          label="จำนวนบิล"
          value={loading ? '...' : (report?.totalBills ?? 0)}
        />
      </div>

      {/* Popular items */}
      <div className="space-y-3">
        <h2 className="text-[15px] font-black text-[#0B3D4A]">เมนูขายดี 3 อันดับแรก:</h2>

        {popularItems.length === 0 && !loading ? (
          <p className="text-sm text-slate-400">ยังไม่มีข้อมูล</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ minHeight: 160 }}>
            {/* #1 large */}
            <div>
              <RankCard rank={1} item={popularItems[0]} large />
            </div>

            {/* #2 and #3 stacked */}
            <div className="flex flex-col gap-4">
              <RankCard rank={2} item={popularItems[1]} />
              <RankCard rank={3} item={popularItems[2]} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
