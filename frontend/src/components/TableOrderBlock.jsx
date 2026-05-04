import React from 'react';
import OrderItemCard from './OrderItemCard';

export default function TableOrderBlock({ tableNumber = '1' }) {
  return (
    <div className="bg-[#F8FAF9] rounded-3xl p-6 shadow-sm border border-white/60">
      <h4 className="text-lg font-black text-[#0B3D4A] mb-4">โต๊ะ {tableNumber}</h4>
      
      {/* List of Order Items */}
      <div className="space-y-3">
        <OrderItemCard />
      </div>
    </div>
  );
}
