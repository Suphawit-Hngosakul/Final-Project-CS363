import React from 'react';
import OrderItemCard from './OrderItemCard';

export default function TableOrderBlock({ orders, onAccept }) {
  return (
    <div className="bg-[#F8FAF9] rounded-3xl p-3 md:p-6 shadow-sm border border-white/60">

      <div className="space-y-3">
        {orders.length > 0 ? (
          orders.map(order => (
            <OrderItemCard
              key={order.id}
              order={order}
              onAccept={onAccept}
            />
          ))
        ) : (
          <div className="text-sm text-slate-500 text-center py-6">
            ไม่มีออเดอร์
          </div>
        )}
      </div>

    </div>
  );
}