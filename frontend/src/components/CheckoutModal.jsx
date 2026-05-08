import React, { useEffect, useMemo, useState } from 'react';

const STATUS_STYLE = {
    pending: 'bg-[#D9B24C] text-white',
    accepted: 'bg-[#4B8BFF] text-white',
    cooking: 'bg-[#F28C28] text-white',
    ready: 'bg-[#38B26C] text-white',
    served: 'bg-[#0B3D4A] text-white'
};

export default function CheckoutModal({
    show,
    onClose,
    tables,
    selectedTable,
    onSelectTable,
    checkoutData,
    onConfirm
}) {
    const [paymentMethod, setPaymentMethod] = useState('cash');

    useEffect(() => {
        if (!show) {
            setPaymentMethod('cash');
        }
    }, [show]);

    const totalAmount = useMemo(() => {
        return checkoutData?.totalAmount || 0;
    }, [checkoutData]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-[600px] rounded-[32px] bg-[#F9FAFB] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="px-8 pt-8 pb-4 flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 border border-[#0B7285] text-[#0B3D4A] bg-white px-5 py-2.5 rounded-2xl font-black shadow-sm hover:bg-slate-50 transition-all"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        ย้อนกลับ
                    </button>

                    <h2 className="text-[20px] md:text-[24px] font-black text-[#0B3D4A]">
                        Checkout
                    </h2>
                </div>

                <div className="px-8 pb-8 space-y-6">

                    {/* เลือกโต๊ะ */}
                    <div>
                        <label className="block text-[15px] font-black text-[#0B3D4A] mb-3">
                            เลือกโต๊ะ
                        </label>

                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <select
                                    value={selectedTable}
                                    onChange={(e) => onSelectTable(e.target.value)}
                                    className="w-full appearance-none bg-white border border-[#A7D8CC] rounded-2xl px-5 py-3.5 text-[15px] text-[#222] shadow-sm outline-none focus:border-[#0B3D4A]"
                                >
                                    <option value="">เลือกโต๊ะ</option>

                                    {tables.map((table) => (
                                        <option
                                            key={table._id || table.number}
                                            value={table.number || table.tableNumber}
                                        >
                                            โต๊ะ {table.number || table.tableNumber} - {table.status}
                                        </option>
                                    ))}
                                </select>

                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#0B3D4A]">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* รายการอาหาร */}
                    <div>
                        <h3 className="text-[15px] font-black text-[#0B3D4A] mb-4">
                            บิลโต๊ะ {selectedTable || '-'}
                        </h3>

                        <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
                            {checkoutData?.orders?.length > 0 ? (
                                checkoutData.orders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="bg-white rounded-[24px] px-5 py-4 border border-[#E4ECEA] shadow-sm"
                                    >
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
                                                            className={`px-4 py-1 rounded-full text-[12px] font-bold ${STATUS_STYLE[order.status] || 'bg-slate-300 text-white'}`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-[24px] border border-dashed border-[#C9D9D4] py-12 text-center text-[#6B7280] font-semibold">
                                    ยังไม่มีรายการอาหาร
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[#D7E4E0]" />

                    {/* Total */}
                    <div className="flex items-center justify-between">
                        <span className="text-[18px] font-black text-[#0B3D4A]">
                            ยอดรวม
                        </span>

                        <span className="text-[36px] leading-none font-black text-[#0B3D4A]">
                            ฿{totalAmount}
                        </span>
                    </div>

                    {/* วิธีชำระเงิน */}
                    <div>
                        <label className="block text-[15px] font-black text-[#0B3D4A] mb-3">
                            วิธีชำระเงิน
                        </label>

                        <div className="relative">
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full appearance-none bg-white border border-[#A7D8CC] rounded-2xl px-5 py-3.5 text-[15px] text-[#222] shadow-sm outline-none focus:border-[#0B3D4A]"
                            >
                                <option value="cash">เงินสด</option>
                                <option value="promptpay">PromptPay / QR Code</option>
                            </select>

                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#0B3D4A]">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-between gap-5 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 border border-[#0B7285] bg-white text-[#0B3D4A] py-3.5 rounded-2xl font-black shadow-sm hover:bg-slate-50 transition-all"
                        >
                            ยกเลิก
                        </button>

                        <button
                            onClick={() => onConfirm(paymentMethod)}
                            disabled={!selectedTable || !checkoutData}
                            className={`flex-1 py-3.5 rounded-2xl font-black transition-all shadow-sm ${selectedTable && checkoutData
                                ? 'bg-white border border-[#0B7285] text-[#0B3D4A] hover:bg-[#ECF8F5]'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            ชำระเงิน
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
