import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { call } from '../utils/api';

const Inp = ({ label, className = '', ...p }) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>}
    <input 
      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all" 
      {...p} 
    />
  </div>
);

const Btn = ({ children, variant = 'primary', size = 'md', className = '', ...p }) => {
  const v = { 
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white', 
    danger: 'bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/20', 
    ghost: 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10', 
    success: 'bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/20', 
    warning: 'bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 border border-yellow-500/20' 
  };
  const s = { 
    sm: 'px-2.5 py-1 text-[11px]', 
    md: 'px-3.5 py-1.5 text-xs', 
    lg: 'px-5 py-2.5 text-sm' 
  };
  return (
    <button className={`rounded-lg font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${v[variant]} ${s[size]} ${className}`} {...p}>
      {children}
    </button>
  );
};

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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px]" />
      </div>
      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍽️</div>
          <h1 className="text-2xl font-black text-white">EzyOrder</h1>
          <p className="text-slate-500 text-sm mt-1">Backend Test Dashboard</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
          {/* Tab */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6">
            {['login', 'register'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${tab === t ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                {t === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
              </button>
            ))}
          </div>
          <form onSubmit={submit} className="space-y-3">
            {tab === 'register' && (
              <>
                <Inp label="ชื่อร้านอาหาร" placeholder="ร้านอาหารของฉัน" value={form.restaurantName} onChange={set('restaurantName')} required />
                <Inp label="ชื่อผู้ใช้" placeholder="สมชาย ใจดี" value={form.name} onChange={set('name')} required />
              </>
            )}
            <Inp label="Email" type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} required />
            <Inp label="Password" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
            <Btn size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? 'กำลังดำเนินการ…' : tab === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
            </Btn>
          </form>
        </div>
      </div>
    </div>
  );
}
