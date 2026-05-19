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
  const [pinVerified, setPinVerified] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [verifying, setVerifying] = useState(false);

  const [restaurant, setRestaurant] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [tableCount, setTableCount] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!pinVerified) setPinInput('');
  }, [pinVerified]);

  const handleVerifyPin = async () => {
    if (!pinInput.trim()) {
      toast.error('กรุณากรอก password');
      return;
    }
    setVerifying(true);
    try {
      // re-authenticate ด้วย email + password ของ user ที่ login อยู่
      const loginRes = await call('POST', '/api/auth/login', {
        email: user?.email,
        password: pinInput.trim(),
      });

      // ใช้ token จาก login response หรือ token prop (อย่างใดอย่างหนึ่ง)
      const authToken = loginRes?.token || token;

      // ถ้าผ่าน → fetch ข้อมูลร้าน
      const res = await call('GET', `/api/restaurant/${user?.restaurantId}`, null, authToken);
      setRestaurant(res);
      setName(res.name || '');
      setAddress(res.address || '');
      setPhone(res.phone || '');
      setTableCount(res.tableCount ?? '');
      setPinVerified(true);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        toast.error('Password ไม่ถูกต้อง');
      } else {
        toast.error('ไม่สามารถตรวจสอบได้');
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
        `/api/restaurant/${user?.restaurantId}`,
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

  if (!pinVerified) {
    return (
      <div className="space-y-5">
        <p className="text-[15px] font-black text-[#0B3D4A]">โปรดกรอก PIN</p>
        <div className="flex items-center gap-3">
          <input
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !verifying && handleVerifyPin()}
            className="w-64 bg-white border border-[#E6EEF0] rounded-xl px-4 py-3 text-[15px] outline-none focus:border-[#0B3D4A] shadow-sm"
          />
          <button
            onClick={handleVerifyPin}
            disabled={verifying}
            className="px-5 py-3 border border-[#0B7285] text-[#0B3D4A] rounded-xl font-bold hover:bg-slate-50 transition-colors disabled:opacity-60"
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

        <div className="flex items-center gap-6 flex-wrap">
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

          <div className="flex items-center gap-3 ml-4">
            <span className="text-[13px] font-bold text-[#0B3D4A] border border-[#AEE1D3] rounded-full px-3 py-1 bg-white">
              Restaurant ID (ใช้ในการทดสอบ)
            </span>
            <span className="text-[13px] font-mono text-[#0B3D4A] bg-white border border-[#E6EEF0] rounded-xl px-4 py-2 shadow-sm select-all">
              {restaurant?._id || restaurant?.id || '-'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
        <span className="text-sm text-slate-400">
          สร้างเมื่อ {formatDate(restaurant?.createdAt)}
        </span>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-white border border-[#AEE1D3] rounded-xl text-[#0B3D4A] font-bold shadow-sm hover:bg-slate-50 transition-all disabled:opacity-60"
        >
          {saving ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
      </div>
    </div>
  );
}
