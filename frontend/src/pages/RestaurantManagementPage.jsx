import React, { useState, useEffect } from 'react';
import { call } from '../utils/api';
import { toast } from 'react-hot-toast';

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function FieldRow({ label, value, onChange, type = 'text', readOnly = false }) {
  return (
    <div className="flex items-center gap-6">
      <span className="w-24 text-[15px] font-bold text-[#0B3D4A] shrink-0">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        readOnly={readOnly}
        className={`flex-1 bg-white border border-[#E6EEF0] rounded-xl px-4 py-3 text-[15px] outline-none shadow-sm transition-colors ${
          readOnly
            ? 'text-slate-400 cursor-default'
            : 'focus:border-[#0B3D4A]'
        }`}
      />
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
}

export default function RestaurantManagementPage({ user, token }) {
  const restaurantId = user?.restaurantId;

  const [unlocked, setUnlocked] = useState(false);
  const [hasPin, setHasPin] = useState(null); // null = ยังโหลดไม่เสร็จ
  const [credInput, setCredInput] = useState('');
  const [verifying, setVerifying] = useState(false);

  const [restaurant, setRestaurant] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [tableCount, setTableCount] = useState('');
  const [saving, setSaving] = useState(false);

  const [newPin, setNewPin] = useState('');
  const [savingPin, setSavingPin] = useState(false);

  // โหลดข้อมูลร้าน — ใช้รู้ว่าตั้ง PIN ไว้หรือยัง (hasPin) และเตรียมข้อมูลฟอร์ม
  const loadRestaurant = async () => {
    if (!restaurantId) return;
    const res = await call('GET', `/api/restaurant/${restaurantId}`, null, token);
    setRestaurant(res);
    setName(res.name || '');
    setAddress(res.address || '');
    setPhone(res.phone || '');
    setTableCount(res.tableCount ?? '');
    setHasPin(!!res.hasPin);
  };

  useEffect(() => {
    loadRestaurant().catch(() => {
      toast.error('โหลดข้อมูลร้านล้มเหลว');
      setHasPin(false);
    });
  }, [restaurantId]);

  const handleUnlock = async () => {
    const value = credInput.trim();
    if (!value) {
      toast.error(hasPin ? 'กรุณากรอก PIN' : 'กรุณากรอกรหัสผ่าน');
      return;
    }
    setVerifying(true);
    try {
      if (hasPin) {
        await call('POST', `/api/restaurant/${restaurantId}/pin/verify`, { pin: value }, token);
      } else {
        // ร้านยังไม่ได้ตั้ง PIN → ปลดล็อกครั้งแรกด้วยรหัสผ่านบัญชี
        await call('POST', '/api/auth/verify-password', { password: value }, token);
      }
      setUnlocked(true);
      setCredInput('');
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        toast.error(hasPin ? 'PIN ไม่ถูกต้อง' : 'รหัสผ่านไม่ถูกต้อง');
      } else {
        toast.error('ตรวจสอบไม่สำเร็จ');
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await call(
        'PUT',
        `/api/restaurant/${restaurantId}`,
        { name, address, phone, tableCount: Number(tableCount) },
        token
      );
      toast.success('บันทึกสำเร็จ');
    } catch {
      toast.error('บันทึกล้มเหลว');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePin = async () => {
    if (!/^\d{4,6}$/.test(newPin)) {
      toast.error('PIN ต้องเป็นตัวเลข 4-6 หลัก');
      return;
    }
    setSavingPin(true);
    try {
      await call('PUT', `/api/restaurant/${restaurantId}/pin`, { pin: newPin }, token);
      toast.success(hasPin ? 'เปลี่ยน PIN สำเร็จ' : 'ตั้ง PIN สำเร็จ');
      setHasPin(true);
      setNewPin('');
    } catch {
      toast.error('บันทึก PIN ล้มเหลว');
    } finally {
      setSavingPin(false);
    }
  };

  if (!unlocked) {
    if (hasPin === null) {
      return <p className="text-sm text-slate-400">กำลังโหลด...</p>;
    }
    return (
      <div className="space-y-5">
        <p className="text-[15px] font-black text-[#0B3D4A]">
          {hasPin
            ? 'โปรดกรอก PIN เพื่อเข้าหน้าตั้งค่า'
            : 'ยังไม่ได้ตั้ง PIN — กรอกรหัสผ่านบัญชีเพื่อเข้าครั้งแรก'}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="password"
            value={credInput}
            onChange={(e) => setCredInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !verifying && handleUnlock()}
            placeholder={hasPin ? 'PIN' : 'รหัสผ่าน'}
            className="w-full sm:w-64 bg-white border border-[#E6EEF0] rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#0B3D4A] shadow-sm"
          />
          <button
            onClick={handleUnlock}
            disabled={verifying}
            className="w-full sm:w-auto px-5 py-3 border border-[#0B7285] text-[#0B3D4A] rounded-xl font-bold hover:bg-slate-50 transition-colors disabled:opacity-60"
          >
            {verifying ? 'กำลังตรวจสอบ...' : 'ดำเนินการต่อ'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ตั้งค่าขั้นพื้นฐาน */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 text-[#0B3D4A]">
          <SettingsIcon />
          <span className="font-black text-base">ตั้งค่าขั้นพื้นฐาน</span>
        </div>

        <div className="space-y-4">
          <FieldRow label="ชื่อร้าน" value={name} onChange={setName} />
          <FieldRow label="ที่อยู่" value={address} onChange={setAddress} />
          <FieldRow label="โทรศัพท์" value={phone} onChange={setPhone} />
        </div>
      </div>

      {/* ตั้งค่าอื่น ๆ */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 text-[#0B3D4A]">
          <SettingsIcon />
          <span className="font-black text-base">ตั้งค่าอื่น ๆ</span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-6">
            <span className="w-24 text-[15px] font-bold text-[#0B3D4A] shrink-0">จำนวนโต๊ะ</span>
            <input
              type="number"
              min="1"
              value={tableCount}
              onChange={(e) => setTableCount(e.target.value)}
              className="w-40 bg-white border border-[#E6EEF0] rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#0B3D4A] shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[13px] font-bold text-[#0B3D4A] border border-[#AEE1D3] rounded-full px-3 py-1 bg-white">
              Restaurant ID (ใช้ในการทดสอบ)
            </span>
            <span className="text-[13px] font-mono text-[#0B3D4A] bg-white border border-[#E6EEF0] rounded-xl px-4 py-2 shadow-sm select-all">
              {restaurant?._id || restaurant?.id || '-'}
            </span>
          </div>
        </div>
      </div>

      {/* PIN ปลดล็อก */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 text-[#0B3D4A]">
          <SettingsIcon />
          <span className="font-black text-base">PIN สำหรับปลดล็อก</span>
        </div>

        <p className="text-sm text-slate-500">
          {hasPin
            ? 'PIN ใช้สำหรับเข้าหน้าตั้งค่านี้ และกลับหน้า Admin จากหน้าสั่งอาหารของลูกค้า — กรอกใหม่เพื่อเปลี่ยน'
            : 'ยังไม่ได้ตั้ง PIN — แนะนำให้ตั้งเพื่อไม่ต้องใช้รหัสผ่านบัญชีจริง'}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="password"
            inputMode="numeric"
            value={newPin}
            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="ตัวเลข 4-6 หลัก"
            className="w-full sm:w-64 bg-white border border-[#E6EEF0] rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#0B3D4A] shadow-sm"
          />
          <button
            onClick={handleSavePin}
            disabled={savingPin}
            className="w-full sm:w-auto px-5 py-3 border border-[#0B7285] text-[#0B3D4A] rounded-xl font-bold hover:bg-slate-50 transition-colors disabled:opacity-60"
          >
            {savingPin ? 'กำลังบันทึก...' : hasPin ? 'เปลี่ยน PIN' : 'ตั้ง PIN'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-slate-200">
        <span className="text-sm text-slate-400">
          สร้างเมื่อ {formatDate(restaurant?.createdAt)}
        </span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto px-6 py-2.5 bg-white border border-[#AEE1D3] rounded-xl text-[#0B3D4A] font-bold shadow-sm hover:bg-slate-50 transition-all disabled:opacity-60"
        >
          {saving ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
      </div>
    </div>
  );
}
