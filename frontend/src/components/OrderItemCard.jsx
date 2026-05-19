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
    <div className="bg-white rounded-2xl p-4 shadow-sm">

      {/* Mobile layout */}
      <div className="flex flex-col gap-1.5 md:hidden">
        <h5 className="font-black text-[#0B3D4A]">โต๊ะ {order.tableNumber}</h5>
        <h5 className="font-black text-[#0B3D4A]">{order.name}</h5>
        <p className="text-[10px] text-slate-500">Option: {order.option}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#0B3D4A]">x{order.quantity}</span>
          <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[order.status]}`}>
            {order.status}
          </span>
        </div>
        {order.status !== 'served' && (
          <button
            onClick={() => onAccept(order.id)}
            className="w-full mt-1 py-2 bg-white border border-[#AEE1D3] rounded-xl text-sm font-bold text-[#0B3D4A] shadow-sm hover:bg-slate-50 transition-all"
          >
            {BUTTON_LABEL[order.status]}
          </button>
        )}
        <p className="text-xs font-semibold text-slate-500 text-right">{order.time}</p>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex items-center justify-between">
        {/* Left */}
        <div>
          <h5 className="font-black text-[#0B3D4A]">โต๊ะ {order.tableNumber}</h5>
          <div className="flex items-center gap-3 mt-1 mb-2">
            <span className={`text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[order.status]}`}>
              {order.status}
            </span>
          </div>
          <h5 className="font-black text-[#0B3D4A]">{order.name} × {order.quantity}</h5>
          <p className="text-[10px] text-slate-500 mb-2">Option: {order.option}</p>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-1 md:flex-row md:items-center md:gap-4">
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

    </div>
  );
}
