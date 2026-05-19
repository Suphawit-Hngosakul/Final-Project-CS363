import React, { useEffect, useMemo, useState } from 'react';
import CheckoutBillCard from './CheckoutBillCard';
import Select from './Select';

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
    const [pendingTable, setPendingTable] = useState('');

    useEffect(() => {
        if (!show) {
            setPaymentMethod('cash');
            setPendingTable('');
        } else {
            setPendingTable(selectedTable || '');
        }
    }, [show]);

    const servedOrders = useMemo(() => {
        return checkoutData?.orders?.filter(o => o.status === 'served') ?? [];
    }, [checkoutData]);

    const totalAmount = useMemo(() => {
        return servedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    }, [servedOrders]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-[600px] rounded-[32px] bg-[#F9FAFB] shadow-2xl overflow-y-auto max-h-[calc(100dvh-2rem)] animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="px-4 pt-6 pb-4 md:px-8 md:pt-8 flex items-center justify-between gap-4">
                    {/* ย้อนกลับ — mobile only */}
                    <button
                        onClick={onClose}
                        className="md:hidden flex items-center gap-1.5 px-3 py-2 bg-white border border-[#AEE1D3] rounded-xl text-sm font-bold text-[#0B3D4A] shadow-sm"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                        ย้อนกลับ
                    </button>

                    <h2 className="text-[20px] md:text-[24px] font-black text-[#0B3D4A]">
                        Checkout
                    </h2>
                </div>

                <div className="px-4 pb-6 md:px-8 md:pb-8 space-y-6">

                    {/* เลือกโต๊ะ */}
                    <div>
                        <label className="block text-[15px] font-black text-[#0B3D4A] mb-3">
                            เลือกโต๊ะ
                        </label>

                        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">

                            {/* Dropdown */}
                            <div className="flex-1">
                                <Select
                                    value={pendingTable}
                                    onChange={(e) => setPendingTable(e.target.value)}
                                    placeholder="เลือกโต๊ะ"
                                    options={tables.map((table) => ({
                                        value: table.tableNumber,
                                        label: `โต๊ะ ${table.tableNumber} - ${table.status}`,
                                    }))}
                                    className="bg-white border border-[#A7D8CC] rounded-2xl px-5 py-3.5 text-[15px] text-[#222] shadow-sm focus:border-[#0B3D4A]"
                                    chevronSize={16}
                                />
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={() => {
                                    if (pendingTable) onSelectTable(pendingTable);
                                }}
                                className="w-full sm:w-auto px-6 py-3.5 bg-white border border-[#0B7285] rounded-2xl text-[#0B3D4A] font-black shadow-sm hover:bg-[#ECF8F5] transition-all whitespace-nowrap"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>

                    {/* รายการอาหาร */}
                    <div>
                        <h3 className="text-[15px] font-black text-[#0B3D4A] mb-4">
                            บิลโต๊ะ {selectedTable || '-'}
                        </h3>

                        <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
                            {servedOrders.length > 0 ? (
                                servedOrders.map((order) => (
                                    <CheckoutBillCard
                                        key={order._id}
                                        order={order}
                                    />
                                ))
                            ) : (
                                <div className="bg-white rounded-[24px] border border-dashed border-[#C9D9D4] py-12 text-center text-[#6B7280] font-semibold">
                                    ยังไม่มีรายการที่เสิร์ฟแล้ว
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

                        <Select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            options={[
                                { value: 'cash', label: 'เงินสด' },
                                { value: 'promptpay', label: 'PromptPay / QR Code' },
                            ]}
                            className="bg-white border border-[#A7D8CC] rounded-2xl px-5 py-3.5 text-[15px] text-[#222] shadow-sm focus:border-[#0B3D4A]"
                            chevronSize={16}
                        />
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center justify-between gap-5 pt-2">
                        <button
                            onClick={onClose}
                            className="hidden sm:block sm:flex-1 border border-[#0B7285] bg-white text-[#0B3D4A] py-3.5 rounded-2xl font-black shadow-sm hover:bg-slate-50 transition-all"
                        >
                            ยกเลิก
                        </button>

                        <button
                            onClick={() => onConfirm(paymentMethod)}
                            disabled={!selectedTable || servedOrders.length === 0}
                            className={`flex-1 py-3.5 rounded-2xl font-black transition-all shadow-sm ${selectedTable && servedOrders.length > 0
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