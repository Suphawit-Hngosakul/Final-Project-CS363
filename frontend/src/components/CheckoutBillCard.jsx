import React from 'react';

const STATUS_STYLE = {
    pending: 'bg-[#D9B24C] text-white',
    accepted: 'bg-[#4B8BFF] text-white',
    cooking: 'bg-[#F28C28] text-white',
    ready: 'bg-[#38B26C] text-white',
    served: 'bg-[#0B3D4A] text-white'
};

export default function CheckoutBillCard({ order }) {
    return (
        <div className="bg-white rounded-[24px] px-5 py-4 border border-[#E4ECEA] shadow-sm">
            <div className="space-y-3">

                {order.items?.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between gap-4"
                    >
                        <div>
                            <p className="font-black text-[#111] text-[15px] leading-none">
                                {item.name}
                            </p>

                            <p className="text-[14px] text-[#444] mt-1">
                                x{item.quantity}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <span
                                className={`px-4 py-1 rounded-full text-[12px] font-bold ${STATUS_STYLE[order.status] || 'bg-slate-300 text-white'
                                    }`}
                            >
                                {order.status}
                            </span>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}