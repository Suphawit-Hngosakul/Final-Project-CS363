import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export default function CustomerMenuModal({ item, onClose, onAdd }) {
  const [quantity, setQuantity] = useState(1);
  const [details, setDetails] = useState('');
  const [selectedChoices, setSelectedChoices] = useState(() => {
    const initial = {};
    item.options?.forEach((opt, i) => {
      if (opt.choices?.length > 0) initial[i] = 0;
    });
    return initial;
  });

  const extraPrice = (item.options || []).reduce((sum, opt, i) => {
    const idx = selectedChoices[i];
    return sum + (idx !== undefined ? (opt.choices[idx]?.extraPrice || 0) : 0);
  }, 0);
  const total = (Number(item.price) + extraPrice) * quantity;

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-[720px] rounded-[18px] bg-[#F9FAFB] shadow-2xl animate-in fade-in duration-200 flex flex-col"
        style={{ maxHeight: 'calc(100vh - 80px)' }}
      >
        
        {/* Header Image (Optional, if item has image) */}
        <div className="bg-[#dcdfe4] h-48 w-full relative rounded-t-[18px]">
          {item.image && (
            <img src={item.image.startsWith('http') ? item.image : `/uploads/${item.image}`} alt={item.name} className="w-full h-full object-cover rounded-t-[18px]" />
          )}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-sm hover:bg-slate-100 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pt-6 pr-5">
          <h2 className="text-2xl font-black text-[#0B3D4A] mb-1">{item.name}</h2>
          <p className="text-sm text-slate-500 mb-2">{item.description || 'ไม่มีคำอธิบาย'}</p>
          <p className="font-bold text-[#0B3D4A] mb-6">฿ {item.price}</p>

          {/* Options จริงจาก API */}
          {(item.options || []).map((opt, optIdx) => (
            <div key={optIdx} className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-[#0B3D4A]">{opt.name}</h3>
                {opt.required && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-slate-300 text-slate-500">ต้องระบุ</span>
                )}
              </div>
              {opt.choices.map((choice, choiceIdx) => (
                <label key={choiceIdx} className="flex justify-between items-center py-2 border-b border-slate-200 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`opt_${optIdx}`}
                      className="w-4 h-4 accent-[#0B3D4A]"
                      checked={selectedChoices[optIdx] === choiceIdx}
                      onChange={() => setSelectedChoices(prev => ({ ...prev, [optIdx]: choiceIdx }))}
                    />
                    <span className="text-sm text-slate-700">{choice.name}</span>
                  </div>
                  <span className="text-sm text-slate-500">
                    {choice.extraPrice > 0 ? `+฿${choice.extraPrice}` : '฿ 0'}
                  </span>
                </label>
              ))}
            </div>
          ))}

          {/* Details */}
          <div className="mb-6">
            <label className="block text-[15px] font-black text-[#0B3D4A] mb-3">รายละเอียดเพิ่มเติม</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              className="w-full bg-white border border-[#E6EEF0] rounded-xl px-5 py-3 text-[15px] outline-none focus:border-[#0B3D4A] shadow-sm resize-none"
              placeholder="เช่น ไม่ใส่ผัก, เผ็ดน้อย"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 pb-6 pt-4 flex-shrink-0">
          <div className="border-t border-slate-200 pt-6 flex items-center justify-between" style={{ gap: 12 }}>
            <div className="flex items-center gap-4 bg-white border border-[#E6EEF0] shadow-sm rounded-xl px-3 py-1.5 h-12">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-[#0B3D4A] hover:bg-slate-100 rounded-lg font-bold text-xl"
              >-</button>
              <span className="w-6 text-center font-black text-[#0B3D4A]">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-[#0B3D4A] hover:bg-slate-100 rounded-lg font-bold text-xl"
              >+</button>
            </div>
            <button
              onClick={() => {
                const selectedOptions = (item.options || []).map((opt, i) => {
                  const idx = selectedChoices[i];
                  if (idx === undefined) return null;
                  const choice = opt.choices[idx];
                  return { name: opt.name, choice: choice.name, extraPrice: choice.extraPrice || 0 };
                }).filter(Boolean);
                onAdd(item, quantity, selectedOptions, details);
              }}
              className="flex-1 h-12 bg-[#0B3D4A] text-white rounded-xl font-black shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              เพิ่มลงตะกร้า — ฿{total}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
