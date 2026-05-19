import React from 'react';

const STATUS_STYLE = {
  pending: 'bg-[#D99A29]',
  accepted: 'bg-[#4B8BFF]',
  cooking: 'bg-[#F28C28]',
  ready: 'bg-[#38B26C]',
  served: 'bg-[#0B3D4A]'
};

const BUTTON_LABEL = {
  pending: 'Accept',
  accepted: 'Cooking',
  cooking: 'Ready',
  ready: 'Served'
};

export default function OrderItemCard({ order, onAccept }) {
  return (
    <div className="bg-white rounded-2xl p-4 flex items-start justify-between shadow-sm gap-4">

      {/* Left */}
      <div className="flex-1 min-w-0">
        {/* Table + Status */}
        <div className="flex items-center gap-2 mb-2">
          <h5 className="font-black text-[#0B3D4A]">โต๊ะ {order.tableNumber}</h5>
          <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[order.status]}`}>
            {order.status}
          </span>
        </div>

        {/* Items */}
        <div className="space-y-1">
          {order.items?.map((item, idx) => (
            <div key={idx}>
              <p className="font-black text-[#0B3D4A] text-sm">{item.name} × {item.quantity}</p>
              <p className="text-[10px] text-slate-500">Option: {item.option}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-xs font-semibold text-slate-500">{order.time}</span>
        {order.status !== 'served' && (
          <button
            onClick={() => onAccept(order.id)}
            className="px-6 py-2 bg-white border border-[#AEE1D3] rounded-xl text-sm font-bold text-[#0B3D4A] shadow-sm hover:bg-slate-50 transition-all"
          >
            {BUTTON_LABEL[order.status]}
          </button>
        )}
      </div>
    </div>
  );
}
