import React from 'react';
import bgImage from '../components/BG.png';
import TopNavBar from '../components/TopNavBar';
import BackButton from '../components/BackButton';
import TableCard from '../components/TableCard';

export default function SelectTablePage({ user, onLogout }) {
  // Mock tables
  const tables = [
    { id: 1, number: '1', capacity: 4, status: 'available' },
    { id: 2, number: '2', capacity: 2, status: 'occupied' },
    { id: 3, number: '3', capacity: 4, status: 'available' },
    { id: 4, number: '4', capacity: 6, status: 'available' },
    { id: 5, number: '5', capacity: 4, status: 'available' },
    { id: 6, number: '6', capacity: 8, status: 'occupied' },
  ];

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed font-sans text-slate-800"
      style={{ backgroundImage: `url(${bgImage})`, backgroundColor: '#f0f4f8' }}
    >
      <TopNavBar user={user} onLogout={onLogout} />

      <main className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-sm border border-white/40 p-8 min-h-[600px]">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
            <BackButton />
            <h2 className="text-2xl font-black text-[#0B3D4A]">เลือกโต๊ะให้ลูกค้า</h2>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tables.map(table => (
              <TableCard key={table.id} table={table} />
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
