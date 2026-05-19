import React from 'react';
import { STATUS_COLOR } from '../utils/orderStatus';

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
                                className={`px-4 py-1 rounded-full text-[12px] font-bold text-white ${STATUS_COLOR[order.status] || 'bg-slate-300'
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