import React, { useState, useEffect } from 'react';
import bgImage from '../components/BG.png';
import TopNavBar from '../components/TopNavBar';
import BackButton from '../components/BackButton';
import TableCard from '../components/TableCard';
import { call } from '../utils/api';
import { toast } from 'react-hot-toast';

export default function SelectTablePage({ user, onLogout, token }) {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    if (!user?.restaurantId) return;
    call('GET', `/api/restaurant/${user.restaurantId}/tables`, null, token)
      .then(res => setTables(res || []))
      .catch(() => toast.error('โหลดโต๊ะล้มเหลว'));
  }, [user?.restaurantId]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed font-sans text-slate-800"
      style={{ backgroundImage: `url(${bgImage})`, backgroundColor: '#f0f4f8' }}
    >
      <TopNavBar user={user} onLogout={onLogout} />

      <main className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-sm border border-white/40 p-4 md:p-8 min-h-[600px]">

          {/* Header */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 mb-4 sm:mb-8 border-b border-slate-100 pb-4 sm:pb-6">
            <BackButton to="/" />
            <h2 className="text-xl sm:text-2xl font-black text-[#0B3D4A]">เลือกโต๊ะให้ลูกค้า</h2>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map(table => (
              <TableCard key={table._id} table={table} token={token} />
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
