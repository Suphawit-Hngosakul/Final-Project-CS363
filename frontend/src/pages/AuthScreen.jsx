import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { call } from '../utils/api';
import bgImage from '../components/BG.png';

const Inp = ({ label, className = '', ...p }) => (
  <div className={`space-y-1.5 ${className}`}>
    {label && <label className="block text-[10px] font-bold text-[#134455] uppercase tracking-widest ml-1">{label}</label>}
    <input
      className="w-full bg-white border border-transparent rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#134455]/20 focus:border-transparent transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
      {...p}
    />
  </div>
);

const Btn = ({ children, className = '', ...p }) => (
  <button
    className={`rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-slate-50 text-[#134455] border border-[#48c7a6] shadow-sm px-5 py-2.5 text-sm ${className}`}
    {...p}
  >
    {children}
  </button>
);

export default function AuthScreen({ onLogin }) {
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ restaurantName: '', name: '', email: '', password: '' });

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const path = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = tab === 'login' ? { email: form.email, password: form.password } : form;
      const data = await call('POST', path, body);
      localStorage.setItem('token', data.token);
      toast.success(tab === 'login' ? 'เข้าสู่ระบบสำเร็จ' : 'ลงทะเบียนสำเร็จ');
      onLogin(data.token, data.user);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#eff2f9]">
      {/* Background Image */}
      <div className="absolute inset-0 pointer-events-none">
        <img src={bgImage} alt="Background" className="w-full h-full object-cover" />
      </div>

      <div className="relative w-full max-w-[400px] z-10">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-black text-[#0c313f] tracking-tight">EzyOrder</h1>
        </div>
        <div className="bg-white/50 border border-white/70 rounded-[28px] p-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
          {/* Tab */}
          <div className="flex gap-1 bg-white/40 rounded-2xl p-1 mb-8 border border-white/50 shadow-sm">
            {['login', 'register'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-[14px] text-sm font-bold transition-all duration-300 ${tab === t ? 'bg-[#0f3a46] text-white shadow-md' : 'text-[#0f3a46]/70 hover:text-[#0f3a46] hover:bg-white/40'}`}>
                {t === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="space-y-4">
            {tab === 'register' && (
              <>
                <Inp label="ชื่อร้านอาหาร" placeholder="" value={form.restaurantName} onChange={set('restaurantName')} required />
                <Inp label="ชื่อผู้ใช้" placeholder="" value={form.name} onChange={set('name')} required />
              </>
            )}
            <Inp label="EMAIL" type="email" placeholder="" value={form.email} onChange={set('email')} required />
            <Inp label="PASSWORD" type="password" placeholder="" value={form.password} onChange={set('password')} required />

            <div className="pt-2">
              <Btn className="w-full flex justify-center items-center h-[46px]" disabled={loading}>
                {loading ? 'กำลังดำเนินการ…' : tab === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
              </Btn>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
