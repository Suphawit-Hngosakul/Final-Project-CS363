import React from 'react';

/**
 * Dropdown มาตรฐาน — รวม markup ของ <select> + ลูกศร chevron ไว้ที่เดียว
 *
 * props:
 *  - value, onChange, disabled : ส่งต่อให้ <select> ตรง ๆ
 *  - options      : [{ value, label }]
 *  - placeholder  : ข้อความ option ว่างตัวแรก (ไม่ใส่ = ไม่มี)
 *  - className    : class ของ <select> (กำหนดสี/ขอบ/ระยะเองได้)
 *  - chevronSize  : ขนาดลูกศร (px)
 *  - chevronColor : สีลูกศร
 */
export default function Select({
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
  className = '',
  chevronSize = 14,
  chevronColor = '#0B3D4A',
}) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full appearance-none outline-none ${className}`}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          width={chevronSize}
          height={chevronSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke={chevronColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
