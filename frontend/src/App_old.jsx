import { useState, useEffect, useCallback, useRef } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { io } from 'socket.io-client'

const BASE = 'http://localhost:8080'
const imgSrc = (image) => image.startsWith('http') ? image : `${BASE}${image}`

// ─── API helper ───────────────────────────────────────────────────────────────
const call = async (method, path, data, token, isForm = false) => {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (!isForm && data) headers['Content-Type'] = 'application/json'
  const res = await axios({
    method, url: `${BASE}${path}`,
    data: isForm ? data : data ? data : undefined,
    headers,
  })
  return res.data
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
const STATUS_COLOR = {
  pending:   'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  accepted:  'bg-blue-500/20   text-blue-300   border-blue-500/30',
  cooking:   'bg-orange-500/20 text-orange-300 border-orange-500/30',
  ready:     'bg-green-500/20  text-green-300  border-green-500/30',
  served:    'bg-slate-500/20  text-slate-400  border-slate-500/30',
  available: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  occupied:  'bg-red-500/20    text-red-300    border-red-500/30',
  payment:   'bg-amber-500/20  text-amber-300  border-amber-500/30',
  paid:      'bg-green-500/20  text-green-300  border-green-500/30',
}

const Badge = ({ status }) => (
  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_COLOR[status] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
    {status}
  </span>
)

const Inp = ({ label, className = '', ...p }) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>}
    <input className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all" {...p} />
  </div>
)

const Sel = ({ label, children, className = '', ...p }) => (
  <div className={`space-y-1 ${className}`}>
    {label && <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>}
    <select className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500/60 transition-all" {...p}>{children}</select>
  </div>
)

const Btn = ({ children, variant = 'primary', size = 'md', className = '', ...p }) => {
  const v = { primary: 'bg-indigo-600 hover:bg-indigo-500 text-white', danger: 'bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/20', ghost: 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10', success: 'bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/20', warning: 'bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 border border-yellow-500/20' }
  const s = { sm: 'px-2.5 py-1 text-[11px]', md: 'px-3.5 py-1.5 text-xs', lg: 'px-5 py-2.5 text-sm' }
  return <button className={`rounded-lg font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${v[variant]} ${s[size]} ${className}`} {...p}>{children}</button>
}

const Card = ({ title, action, children, className = '' }) => (
  <div className={`bg-white/[0.04] border border-white/10 rounded-2xl ${className}`}>
    {(title || action) && (
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/8">
        {title && <h3 className="text-sm font-bold text-white">{title}</h3>}
        {action}
      </div>
    )}
    <div className="p-5">{children}</div>
  </div>
)

const Divider = () => <hr className="border-white/8 my-4" />

// ═════════════════════════════════════════════════════════════════════════════
// AUTH SCREEN
// ═════════════════════════════════════════════════════════════════════════════
function AuthScreen({ onLogin }) {
  const [tab, setTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ restaurantName: '', name: '', email: '', password: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const path = tab === 'login' ? '/api/auth/login' : '/api/auth/register'
      const body = tab === 'login' ? { email: form.email, password: form.password } : form
      const data = await call('POST', path, body)
      localStorage.setItem('token', data.token)
      toast.success(tab === 'login' ? 'เข้าสู่ระบบสำเร็จ' : 'ลงทะเบียนสำเร็จ')
      onLogin(data.token, data.user)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    }
    setLoading(false)
  }

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
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN — Restaurant
// ═════════════════════════════════════════════════════════════════════════════
function AdminRestaurant({ token, restaurantId }) {
  const [data, setData] = useState(null)
  const [form, setForm] = useState({})
  const [editing, setEditing] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const load = useCallback(async () => {
    try {
      const r = await call('GET', `/api/restaurant/${restaurantId}`, null, token)
      setData(r)
      setForm({ name: r.name, address: r.address || '', phone: r.phone || '', tableCount: r.tableCount || 0 })
    } catch (err) { toast.error(err.response?.data?.message || err.message) }
  }, [token, restaurantId])

  useEffect(() => { load() }, [load])

  const save = async () => {
    try {
      await call('PUT', `/api/restaurant/${restaurantId}`, { ...form, tableCount: Number(form.tableCount) }, token)
      toast.success('อัพเดตข้อมูลร้านสำเร็จ')
      setEditing(false)
      load()
    } catch (err) { toast.error(err.response?.data?.message || err.message) }
  }

  if (!data) return <p className="text-slate-500 text-sm">กำลังโหลด…</p>
  return (
    <div className="space-y-4 max-w-xl">
      <Card title="ข้อมูลร้านอาหาร" action={
        <Btn variant={editing ? 'ghost' : 'primary'} onClick={() => setEditing(!editing)}>
          {editing ? 'ยกเลิก' : 'แก้ไข'}
        </Btn>
      }>
        {editing ? (
          <div className="space-y-3">
            <Inp label="ชื่อร้าน" value={form.name} onChange={set('name')} />
            <Inp label="ที่อยู่" value={form.address} onChange={set('address')} />
            <Inp label="โทรศัพท์" value={form.phone} onChange={set('phone')} />
            <Inp label="จำนวนโต๊ะ" type="number" value={form.tableCount} onChange={set('tableCount')} />
            <Btn size="lg" className="w-full" onClick={save}>บันทึก</Btn>
          </div>
        ) : (
          <dl className="space-y-2 text-sm">
            {[['ชื่อร้าน', data.name], ['ID', data._id], ['ที่อยู่', data.address || '—'], ['โทรศัพท์', data.phone || '—'], ['จำนวนโต๊ะ', data.tableCount]].map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <dt className="text-slate-500 w-24 flex-shrink-0">{k}</dt>
                <dd className="text-white font-medium break-all">{v}</dd>
              </div>
            ))}
            <div className="flex gap-3">
              <dt className="text-slate-500 w-24 flex-shrink-0">สร้างเมื่อ</dt>
              <dd className="text-white font-medium">{new Date(data.createdAt).toLocaleDateString('th-TH')}</dd>
            </div>
          </dl>
        )}
      </Card>
      <Card title="Restaurant ID (ใช้ในการทดสอบ)">
        <code className="text-xs text-indigo-400 break-all font-mono bg-indigo-500/10 px-2 py-1 rounded-lg block">{restaurantId}</code>
      </Card>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN — Categories
// ═════════════════════════════════════════════════════════════════════════════
function AdminCategories({ token, restaurantId }) {
  const [cats, setCats] = useState([])
  const [newName, setNewName] = useState('')
  const [editing, setEditing] = useState({})

  const load = useCallback(async () => {
    try { setCats(await call('GET', `/api/restaurant/${restaurantId}/categories`, null, token)) }
    catch (err) { toast.error(err.response?.data?.message || err.message) }
  }, [token, restaurantId])

  useEffect(() => { load() }, [load])

  const create = async () => {
    if (!newName.trim()) return
    try {
      await call('POST', `/api/restaurant/${restaurantId}/categories`, { name: newName }, token)
      toast.success('สร้างหมวดหมู่สำเร็จ')
      setNewName('')
      load()
    } catch (err) { toast.error(err.response?.data?.message || err.message) }
  }

  const update = async (id) => {
    try {
      await call('PUT', `/api/categories/${id}`, { name: editing[id] }, token)
      toast.success('อัพเดตสำเร็จ')
      setEditing(e => { const n = { ...e }; delete n[id]; return n })
      load()
    } catch (err) { toast.error(err.response?.data?.message || err.message) }
  }

  const remove = async (id) => {
    if (!confirm('ลบหมวดหมู่นี้?')) return
    try {
      await call('DELETE', `/api/categories/${id}`, null, token)
      toast.success('ลบสำเร็จ')
      load()
    } catch (err) { toast.error(err.response?.data?.message || err.message) }
  }

  return (
    <div className="max-w-xl space-y-4">
      <Card title="เพิ่มหมวดหมู่ใหม่">
        <div className="flex gap-2">
          <Inp placeholder="ชื่อหมวดหมู่ เช่น เครื่องดื่ม" className="flex-1" value={newName} onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && create()} />
          <Btn onClick={create}>เพิ่ม</Btn>
        </div>
      </Card>
      <Card title={`หมวดหมู่ทั้งหมด (${cats.length})`}>
        {cats.length === 0 ? <p className="text-slate-500 text-sm">ยังไม่มีหมวดหมู่</p> : (
          <div className="space-y-2">
            {cats.map(c => (
              <div key={c._id} className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/8">
                {editing[c._id] !== undefined ? (
                  <>
                    <input className="flex-1 bg-white/10 border border-indigo-500/40 rounded-lg px-2 py-1 text-sm text-white outline-none"
                      value={editing[c._id]} onChange={e => setEditing(ed => ({ ...ed, [c._id]: e.target.value }))} />
                    <Btn variant="success" size="sm" onClick={() => update(c._id)}>บันทึก</Btn>
                    <Btn variant="ghost" size="sm" onClick={() => setEditing(ed => { const n = { ...ed }; delete n[c._id]; return n })}>ยกเลิก</Btn>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm text-white font-medium">{c.name}</span>
                    <Btn variant="ghost" size="sm" onClick={() => setEditing(ed => ({ ...ed, [c._id]: c.name }))}>แก้ไข</Btn>
                    <Btn variant="danger" size="sm" onClick={() => remove(c._id)}>ลบ</Btn>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

// ─── Options Builder UI ───────────────────────────────────────────────────────
function OptionsBuilder({ options, onChange }) {
  const addOpt = () => onChange([...options, { name: '', required: false, choices: [] }])
  const removeOpt = (i) => onChange(options.filter((_, idx) => idx !== i))
  const setOpt = (i, field, val) => {
    const next = [...options]; next[i] = { ...next[i], [field]: val }; onChange(next)
  }
  const addChoice = (i) => {
    const next = [...options]
    next[i] = { ...next[i], choices: [...next[i].choices, { name: '', extraPrice: 0 }] }
    onChange(next)
  }
  const removeChoice = (oi, ci) => {
    const next = [...options]
    next[oi] = { ...next[oi], choices: next[oi].choices.filter((_, idx) => idx !== ci) }
    onChange(next)
  }
  const setChoice = (oi, ci, field, val) => {
    const next = [...options]
    const choices = [...next[oi].choices]
    choices[ci] = { ...choices[ci], [field]: val }
    next[oi] = { ...next[oi], choices }
    onChange(next)
  }

  return (
    <div className="col-span-2 space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ตัวเลือก (Options)</label>
        <Btn variant="ghost" size="sm" onClick={addOpt}>+ เพิ่ม Option</Btn>
      </div>

      {options.length === 0 && (
        <p className="text-xs text-slate-600 text-center py-4 bg-white/[0.02] rounded-xl border border-dashed border-white/10">
          ยังไม่มีตัวเลือก — กด &quot;+ เพิ่ม Option&quot; เพื่อเพิ่ม เช่น ความเผ็ด, ขนาด
        </p>
      )}

      {options.map((opt, i) => (
        <div key={i} className="bg-white/[0.04] border border-white/10 rounded-xl p-3 space-y-2.5">
          {/* Option header */}
          <div className="flex items-center gap-2">
            <input
              className="flex-1 bg-white/8 border border-white/10 rounded-lg px-2.5 py-1.5 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500/60 transition-all"
              placeholder="ชื่อ option เช่น ความเผ็ด, ขนาด"
              value={opt.name}
              onChange={e => setOpt(i, 'name', e.target.value)}
            />
            <label className="flex items-center gap-1.5 text-[11px] text-slate-400 cursor-pointer select-none flex-shrink-0 bg-white/5 rounded-lg px-2 py-1.5 border border-white/8">
              <input type="checkbox" checked={opt.required}
                onChange={e => setOpt(i, 'required', e.target.checked)}
                className="w-3 h-3 accent-indigo-500" />
              บังคับเลือก
            </label>
            <button onClick={() => removeOpt(i)}
              className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold flex-shrink-0 transition-all flex items-center justify-center">
              ✕
            </button>
          </div>

          {/* Choices */}
          <div className="pl-3 border-l-2 border-white/8 space-y-1.5">
            {opt.choices.length === 0 && (
              <p className="text-[11px] text-slate-700">ยังไม่มีตัวเลือกย่อย</p>
            )}
            {opt.choices.map((ch, j) => (
              <div key={j} className="flex items-center gap-2">
                <input
                  className="flex-1 bg-white/5 border border-white/8 rounded-lg px-2 py-1 text-xs text-white placeholder-slate-600 outline-none focus:border-indigo-500/60 transition-all"
                  placeholder={`ตัวเลือก เช่น ${['ไม่เผ็ด','เผ็ดน้อย','เผ็ดมาก'][j] || 'ชื่อตัวเลือก'}`}
                  value={ch.name}
                  onChange={e => setChoice(i, j, 'name', e.target.value)}
                />
                <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-lg px-2 py-1 flex-shrink-0">
                  <span className="text-[10px] text-slate-600 font-bold">+฿</span>
                  <input
                    type="number" min="0"
                    className="w-14 bg-transparent text-xs text-white outline-none text-right"
                    placeholder="0"
                    value={ch.extraPrice}
                    onChange={e => setChoice(i, j, 'extraPrice', Number(e.target.value))}
                  />
                </div>
                <button onClick={() => removeChoice(i, j)}
                  className="text-slate-600 hover:text-red-400 text-xs font-bold w-5 text-center flex-shrink-0 transition-all">
                  ✕
                </button>
              </div>
            ))}
            <button onClick={() => addChoice(i)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold transition-all">
              + เพิ่มตัวเลือกย่อย
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN — Menu
// ═════════════════════════════════════════════════════════════════════════════
function AdminMenu({ token, restaurantId }) {
  const [items, setItems] = useState([])
  const [cats, setCats] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', categoryId: '', description: '', imageUrl: '' })
  const [options, setOptions] = useState([])
  const [file, setFile] = useState(null)
  const fileRef = useRef()
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const loadAll = useCallback(async () => {
    try {
      const [m, c] = await Promise.all([
        call('GET', `/api/restaurant/${restaurantId}/menu`, null, token),
        call('GET', `/api/restaurant/${restaurantId}/categories`, null, token),
      ])
      setItems(m); setCats(c)
    } catch (err) { toast.error(err.response?.data?.message || err.message) }
  }, [token, restaurantId])

  useEffect(() => { loadAll() }, [loadAll])

  const openCreate = () => {
    setEditItem(null)
    setForm({ name: '', price: '', categoryId: cats[0]?._id || '', description: '', imageUrl: '' })
    setOptions([])
    setFile(null)
    setShowForm(true)
  }

  const openEdit = (item) => {
    setEditItem(item)
    const existingUrl = item.image && !item.image.startsWith('/uploads/') ? item.image : ''
    setForm({ name: item.name, price: item.price, categoryId: getCatId(item), description: item.description, imageUrl: existingUrl })
    setOptions(item.options?.length ? JSON.parse(JSON.stringify(item.options)) : [])
    setFile(null)
    setShowForm(true)
  }

  const submit = async () => {
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('price', form.price)
    fd.append('categoryId', form.categoryId)
    if (form.description) fd.append('description', form.description)
    if (options.length) fd.append('options', JSON.stringify(options))
    if (file) fd.append('image', file)
    else if (form.imageUrl) fd.append('imageUrl', form.imageUrl)
    try {
      if (editItem) {
        await call('PUT', `/api/menu/${editItem._id}`, fd, token, true)
        toast.success('อัพเดตเมนูสำเร็จ')
      } else {
        await call('POST', `/api/restaurant/${restaurantId}/menu`, fd, token, true)
        toast.success('เพิ่มเมนูสำเร็จ')
      }
      setShowForm(false); loadAll()
    } catch (err) { toast.error(err.response?.data?.message || err.message) }
  }

  const remove = async (id) => {
    if (!confirm('ลบเมนูนี้?')) return
    try { await call('DELETE', `/api/menu/${id}`, null, token); toast.success('ลบสำเร็จ'); loadAll() }
    catch (err) { toast.error(err.response?.data?.message || err.message) }
  }

  const toggle = async (item) => {
    try {
      await call('PATCH', `/api/menu/${item._id}/availability`, { isAvailable: !item.isAvailable }, token)
      toast.success(`${!item.isAvailable ? 'เปิด' : 'ปิด'}การขายแล้ว`)
      loadAll()
    } catch (err) { toast.error(err.response?.data?.message || err.message) }
  }

  const catMap = Object.fromEntries(cats.map(c => [c._id, c.name]))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-400">เมนูทั้งหมด ({items.length})</h3>
        <Btn onClick={openCreate}>+ เพิ่มเมนู</Btn>
      </div>

      {showForm && (
        <Card title={editItem ? 'แก้ไขเมนู' : 'เพิ่มเมนูใหม่'} action={<Btn variant="ghost" size="sm" onClick={() => setShowForm(false)}>✕ ปิด</Btn>}>
          <div className="grid grid-cols-2 gap-3">
            <Inp label="ชื่อเมนู" className="col-span-2" value={form.name} onChange={set('name')} required />
            <Inp label="ราคา (บาท)" type="number" value={form.price} onChange={set('price')} required />
            <Sel label="หมวดหมู่" value={form.categoryId} onChange={set('categoryId')}>
              {cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </Sel>
            <Inp label="คำอธิบาย" className="col-span-2" value={form.description} onChange={set('description')} placeholder="ไม่บังคับ" />
            <OptionsBuilder options={options} onChange={setOptions} />
            <div className="col-span-2 space-y-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">รูปภาพ (ไม่บังคับ)</label>
              {/* URL input */}
              <Inp
                placeholder="https://example.com/image.jpg"
                value={form.imageUrl}
                onChange={e => { set('imageUrl')(e); setFile(null); if (fileRef.current) fileRef.current.value = '' }}
                disabled={!!file}
              />
              {/* File upload */}
              <div className="flex items-center gap-2">
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { setFile(e.target.files[0]); setForm(f => ({ ...f, imageUrl: '' })) }} />
                <Btn variant="ghost" size="sm" onClick={() => fileRef.current.click()} disabled={!!form.imageUrl}>
                  อัปโหลดไฟล์
                </Btn>
                {file
                  ? <span className="text-xs text-emerald-400">{file.name}</span>
                  : editItem?.image && !form.imageUrl
                    ? <span className="text-xs text-slate-500">รูปปัจจุบัน: {editItem.image.split('/').pop()}</span>
                    : <span className="text-xs text-slate-600">หรืออัปโหลดไฟล์ (file จะใช้แทน URL)</span>
                }
                {file && <button onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = '' }} className="text-xs text-red-400 hover:text-red-300">✕</button>}
              </div>
            </div>
            <Btn size="lg" className="col-span-2" onClick={submit}>
              {editItem ? 'บันทึกการแก้ไข' : 'เพิ่มเมนู'}
            </Btn>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map(item => (
          <div key={item._id} className={`bg-white/[0.04] border rounded-2xl p-4 transition-all ${item.isAvailable ? 'border-white/10' : 'border-red-500/20 opacity-60'}`}>
            {item.image && (
              <img src={imgSrc(item.image)} alt={item.name} className="w-full h-28 object-cover rounded-xl mb-3 bg-slate-800" />
            )}
            {!item.image && <div className="w-full h-20 rounded-xl mb-3 bg-white/5 flex items-center justify-center text-3xl">🍽️</div>}
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-bold text-white leading-tight">{item.name}</p>
              <span className="text-sm font-black text-indigo-400 flex-shrink-0">฿{item.price}</span>
            </div>
            <p className="text-xs text-slate-500 mb-1">{catMap[getCatId(item)] || '—'}</p>
            {item.description && <p className="text-xs text-slate-400 mb-2 line-clamp-2">{item.description}</p>}
            <div className="flex gap-1 flex-wrap mt-2">
              <Badge status={item.isAvailable ? 'available' : 'occupied'} />
              <Btn variant="ghost" size="sm" onClick={() => toggle(item)}>{item.isAvailable ? 'ปิดการขาย' : 'เปิดการขาย'}</Btn>
              <Btn variant="ghost" size="sm" onClick={() => openEdit(item)}>แก้ไข</Btn>
              <Btn variant="danger" size="sm" onClick={() => remove(item._id)}>ลบ</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN — Tables
// ═════════════════════════════════════════════════════════════════════════════
function AdminTables({ token, restaurantId }) {
  const [tables, setTables] = useState([])
  const [qrModal, setQrModal] = useState(null)

  const load = useCallback(async () => {
    try { setTables(await call('GET', `/api/restaurant/${restaurantId}/tables`, null, token)) }
    catch (err) { toast.error(err.response?.data?.message || err.message) }
  }, [token, restaurantId])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id, status) => {
    try {
      await call('PATCH', `/api/tables/${id}/status`, { status }, token)
      toast.success(`เปลี่ยนสถานะเป็น ${status}`)
      load()
    } catch (err) { toast.error(err.response?.data?.message || err.message) }
  }

  const getQR = async (tableNo) => {
    try {
      const data = await call('GET', `/api/restaurant/${restaurantId}/qr/${tableNo}`, null, token)
      setQrModal(data)
    } catch (err) { toast.error(err.response?.data?.message || err.message) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-400">โต๊ะทั้งหมด ({tables.length})</h3>
        <Btn variant="ghost" onClick={load}>รีเฟรช</Btn>
      </div>

      {qrModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setQrModal(null)}>
          <div className="bg-slate-900 border border-white/20 rounded-3xl p-6 text-center max-w-xs w-full" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-black text-white mb-4">QR Code</h3>
            <img src={qrModal.qr} alt="QR" className="w-48 h-48 mx-auto rounded-xl border-4 border-white/10 mb-4" />
            <p className="text-xs text-slate-500 font-mono break-all bg-slate-800 rounded-lg px-3 py-2 mb-4">{qrModal.url}</p>
            <div className="flex gap-2">
              <a href={qrModal.url} target="_blank" rel="noreferrer" className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold text-center hover:bg-indigo-500 transition-all">เปิด URL</a>
              <Btn variant="ghost" className="flex-1" onClick={() => setQrModal(null)}>ปิด</Btn>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {tables.map(t => (
          <div key={t._id} className={`bg-white/[0.04] border rounded-2xl p-4 text-center transition-all ${t.status === 'available' ? 'border-emerald-500/30' : t.status === 'occupied' ? 'border-red-500/30' : 'border-amber-500/30'}`}>
            <div className="text-3xl font-black text-white mb-1">{t.tableNumber}</div>
            <p className="text-[10px] text-slate-500 mb-1">โต๊ะ</p>
            <Badge status={t.status} />
            <button
              onClick={() => { navigator.clipboard.writeText(t._id); toast.success(`Copy Table ID โต๊ะ ${t.tableNumber} แล้ว`) }}
              title={t._id}
              className="block w-full mt-2 text-[10px] text-slate-600 hover:text-indigo-400 font-mono truncate transition-all cursor-copy"
            >
              {t._id.slice(-8)}… 📋
            </button>
            {t.currentSessionId && <p className="text-[10px] text-slate-700 mt-0.5 truncate font-mono">session: {t.currentSessionId.slice(0, 8)}…</p>}
            <div className="flex flex-col gap-1.5 mt-3">
              <Sel value={t.status} onChange={e => updateStatus(t._id, e.target.value)}>
                <option value="available">available</option>
                <option value="occupied">occupied</option>
                <option value="payment">payment</option>
              </Sel>
              <Btn variant="ghost" size="sm" className="w-full" onClick={() => getQR(t.tableNumber)}>📱 QR</Btn>
            </div>
          </div>
        ))}
      </div>

      {tables.length === 0 && (
        <Card><p className="text-slate-500 text-sm text-center">ยังไม่มีโต๊ะ — อัพเดต tableCount ในหน้าร้านเพื่อสร้างโต๊ะ</p></Card>
      )}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// ADMIN — Reports
// ═════════════════════════════════════════════════════════════════════════════
function AdminReports({ token, restaurantId }) {
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [limit, setLimit] = useState(10)
  const [daily, setDaily] = useState(null)
  const [popular, setPopular] = useState([])

  const loadDaily = useCallback(async () => {
    try { setDaily(await call('GET', `/api/restaurant/${restaurantId}/reports/daily?date=${date}`, null, token)) }
    catch (err) { toast.error(err.response?.data?.message || err.message) }
  }, [restaurantId, token, date])

  const loadPopular = useCallback(async () => {
    try { setPopular(await call('GET', `/api/restaurant/${restaurantId}/reports/popular-items?limit=${limit}`, null, token)) }
    catch (err) { toast.error(err.response?.data?.message || err.message) }
  }, [restaurantId, token, limit])

  useEffect(() => { loadDaily() }, [loadDaily])
  useEffect(() => { loadPopular() }, [loadPopular])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Daily */}
      <Card title="รายงานยอดขายรายวัน">
        <div className="flex gap-2 mb-4">
          <Inp type="date" value={date} onChange={e => setDate(e.target.value)} className="flex-1" />
          <Btn onClick={loadDaily}>ดึงข้อมูล</Btn>
        </div>
        {daily && (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-indigo-400">฿{daily.totalRevenue.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 mt-1">ยอดรวม</div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <div className="text-2xl font-black text-emerald-400">{daily.totalBills}</div>
                <div className="text-[10px] text-slate-500 mt-1">จำนวนบิล</div>
              </div>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {daily.bills.map(b => (
                <div key={b._id} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2">
                  <div>
                    <p className="text-xs font-semibold text-white">{b.paymentMethod}</p>
                    <p className="text-[10px] text-slate-500">{new Date(b.paidAt).toLocaleTimeString('th-TH')}</p>
                  </div>
                  <span className="text-sm font-black text-indigo-400">฿{b.totalAmount}</span>
                </div>
              ))}
              {daily.bills.length === 0 && <p className="text-slate-500 text-xs text-center">ไม่มีข้อมูลวันนี้</p>}
            </div>
          </>
        )}
      </Card>

      {/* Popular */}
      <Card title="เมนูขายดี">
        <div className="flex gap-2 mb-4">
          <Inp type="number" label="แสดง N อันดับ" value={limit} onChange={e => setLimit(e.target.value)} className="flex-1" />
          <Btn onClick={loadPopular} className="self-end">ดึงข้อมูล</Btn>
        </div>
        <div className="space-y-2">
          {popular.map((item, i) => (
            <div key={item._id} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2">
              <span className="text-lg font-black text-slate-600 w-6">#{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{item.name}</p>
                <p className="text-[10px] text-slate-500">ขายได้ {item.totalQuantity} ชิ้น</p>
              </div>
              <span className="text-xs font-black text-indigo-400">฿{item.totalRevenue.toLocaleString()}</span>
            </div>
          ))}
          {popular.length === 0 && <p className="text-slate-500 text-xs text-center">ยังไม่มีข้อมูล</p>}
        </div>
      </Card>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// STAFF — Orders
// ═════════════════════════════════════════════════════════════════════════════
const ORDER_STATUSES = ['pending', 'accepted', 'cooking', 'ready', 'served']
const NEXT_STATUS = { pending: 'accepted', accepted: 'cooking', cooking: 'ready', ready: 'served' }

function StaffOrders({ token, restaurantId, socket }) {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')

  const load = useCallback(async () => {
    try { setOrders(await call('GET', `/api/restaurant/${restaurantId}/orders`, null, token)) }
    catch (err) { toast.error(err.response?.data?.message || err.message) }
  }, [token, restaurantId])

  useEffect(() => {
    load()
    if (socket) {
      socket.emit('join_restaurant', restaurantId)
      socket.on('new_order', (order) => {
        toast.success(`🔔 ออเดอร์ใหม่ โต๊ะ ${order.tableId}`)
        setOrders(prev => [order, ...prev])
      })
      return () => socket.off('new_order')
    }
  }, [load, socket, restaurantId])

  const advance = async (order) => {
    const next = NEXT_STATUS[order.status]
    if (!next) return
    try {
      const updated = await call('PATCH', `/api/orders/${order._id}/status`, { status: next }, token)
      toast.success(`อัพเดตเป็น ${next}`)
      setOrders(prev => prev.map(o => o._id === updated._id ? updated : o))
    } catch (err) { toast.error(err.response?.data?.message || err.message) }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-slate-500">กรอง:</span>
        {['all', ...ORDER_STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all ${filter === s ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}>
            {s === 'all' ? 'ทั้งหมด' : s}
          </button>
        ))}
        <Btn variant="ghost" size="sm" className="ml-auto" onClick={load}>รีเฟรช</Btn>
      </div>

      <div className="space-y-3">
        {filtered.map(order => (
          <div key={order._id} className={`bg-white/[0.04] border rounded-2xl p-4 transition-all ${order.status === 'pending' ? 'border-yellow-500/30' : order.status === 'served' ? 'border-white/5' : 'border-white/10'}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge status={order.status} />
                  <span className="text-[10px] text-slate-500">{new Date(order.createdAt).toLocaleString('th-TH')}</span>
                </div>
                <p className="text-[10px] text-slate-600 font-mono">#{order._id.slice(-8)}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-black text-indigo-400">฿{order.totalAmount}</div>
                {NEXT_STATUS[order.status] && (
                  <Btn variant="success" size="sm" onClick={() => advance(order)} className="mt-1">
                    → {NEXT_STATUS[order.status]}
                  </Btn>
                )}
              </div>
            </div>
            <div className="space-y-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs text-slate-400">
                  <span>{item.name} × {item.quantity}{item.note && <span className="text-slate-600"> ({item.note})</span>}</span>
                  <span>฿{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <Card><p className="text-slate-500 text-sm text-center">ไม่มีออเดอร์</p></Card>}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// STAFF — Checkout
// ═════════════════════════════════════════════════════════════════════════════
function StaffCheckout({ token, restaurantId }) {
  const [tables, setTables] = useState([])
  const [selectedTable, setSelectedTable] = useState('')
  const [bill, setBill] = useState(null)
  const [payMethod, setPayMethod] = useState('cash')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    call('GET', `/api/restaurant/${restaurantId}/tables`, null, token)
      .then(t => { setTables(t); if (t.length) setSelectedTable(t[0]._id) })
      .catch(err => toast.error(err.response?.data?.message || err.message))
  }, [token, restaurantId])

  const loadBill = async () => {
    if (!selectedTable) return
    try { setBill(await call('GET', `/api/tables/${selectedTable}/bill`)) }
    catch (err) { toast.error(err.response?.data?.message || err.message); setBill(null) }
  }

  const checkout = async () => {
    setLoading(true)
    try {
      const result = await call('POST', `/api/tables/${selectedTable}/bill/checkout`, { paymentMethod: payMethod }, token)
      toast.success(`ชำระเงิน ฿${result.totalAmount} สำเร็จ!`)
      setBill(null)
    } catch (err) { toast.error(err.response?.data?.message || err.message) }
    setLoading(false)
  }

  return (
    <div className="max-w-lg space-y-4">
      <Card title="เลือกโต๊ะ">
        <div className="flex gap-2">
          <Sel className="flex-1" value={selectedTable} onChange={e => setSelectedTable(e.target.value)}>
            {tables.map(t => <option key={t._id} value={t._id}>โต๊ะ {t.tableNumber} — {t.status}</option>)}
          </Sel>
          <Btn onClick={loadBill}>ดูบิล</Btn>
        </div>
      </Card>

      {bill && (
        <Card title={`บิลโต๊ะ ${bill.tableNumber}`}>
          <div className="space-y-2 mb-4">
            {bill.orders.map(order => (
              <div key={order._id} className="bg-white/5 rounded-xl p-3">
                <div className="flex justify-between mb-2">
                  <Badge status={order.status} />
                  <span className="text-xs font-bold text-indigo-400">฿{order.totalAmount}</span>
                </div>
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs text-slate-400">
                    <span>{item.name} × {item.quantity}</span>
                    <span>฿{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <Divider />
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-400">ยอดรวม</span>
            <span className="text-2xl font-black text-white">฿{bill.totalAmount}</span>
          </div>
          <Sel label="วิธีชำระเงิน" value={payMethod} onChange={e => setPayMethod(e.target.value)}>
            <option value="cash">เงินสด (Cash)</option>
            <option value="promptpay">พร้อมเพย์ (PromptPay)</option>
          </Sel>
          <Btn size="lg" variant="success" className="w-full mt-3" onClick={checkout} disabled={loading}>
            {loading ? 'กำลังชำระ…' : `✓ ชำระเงิน ฿${bill.totalAmount}`}
          </Btn>
        </Card>
      )}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// CUSTOMER — Browse & Order
// ═════════════════════════════════════════════════════════════════════════════

// Helper: ดึง categoryId จริง (รองรับทั้ง string และ populated object)
const getCatId = (item) => {
  if (!item.categoryId) return ''
  return typeof item.categoryId === 'object' ? item.categoryId._id : item.categoryId
}
const getCatName = (item) => {
  if (!item.categoryId) return '—'
  return typeof item.categoryId === 'object' ? item.categoryId.name : ''
}

// ── Menu Item Detail Modal ──────────────────────────────────────────────
function MenuItemModal({ item, catMap, onClose, onAdd }) {
  const [itemQty, setItemQty] = useState(1)
  const [itemNote, setItemNote] = useState('')
  const [selectedOptions, setSelectedOptions] = useState({}) // { optionName: { choice, extraPrice } }

  if (!item) return null

  const hasOptions = item.options && item.options.length > 0

  const handleOptionChange = (optName, choice, extraPrice) => {
    setSelectedOptions(prev => ({ ...prev, [optName]: { choice, extraPrice: extraPrice || 0 } }))
  }

  const totalExtra = Object.values(selectedOptions).reduce((s, o) => s + (o.extraPrice || 0), 0)
  const totalPrice = (item.price + totalExtra) * itemQty

  // ตรวจสอบว่า required options ถูกเลือกครบหรือยัง
  const missingRequired = hasOptions
    ? item.options.filter(o => o.required && !selectedOptions[o.name])
    : []

  const handleAdd = () => {
    const opts = Object.entries(selectedOptions).map(([name, { choice, extraPrice }]) => ({
      name, choice, extraPrice
    }))
    onAdd(item, itemQty, itemNote, opts)
    onClose()
  }

  const catName = getCatName(item) || catMap[getCatId(item)] || '—'

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 border border-white/20 rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Image */}
        {item.image
          ? <img src={imgSrc(item.image)} alt={item.name} className="w-full h-48 object-cover rounded-t-3xl bg-slate-800" />
          : <div className="w-full h-32 rounded-t-3xl bg-white/5 flex items-center justify-center text-5xl">🍽️</div>
        }

        <div className="p-5 space-y-4">
          {/* Header */}
          <div>
            <h3 className="text-lg font-black text-white">{item.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{catName}</p>
            {item.description && <p className="text-sm text-slate-400 mt-2 leading-relaxed">{item.description}</p>}
            <p className="text-xl font-black text-indigo-400 mt-2">฿{item.price}</p>
          </div>

          {/* Options */}
          {hasOptions && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ตัวเลือก</p>
              {item.options.map((opt, oi) => (
                <div key={oi} className="bg-white/[0.04] border border-white/10 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-white">{opt.name}</span>
                    {opt.required && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold">จำเป็น</span>}
                  </div>
                  <div className="space-y-1.5">
                    {opt.choices.map((ch, ci) => {
                      const isSelected = selectedOptions[opt.name]?.choice === ch.name
                      return (
                        <button
                          key={ci}
                          onClick={() => handleOptionChange(opt.name, ch.name, ch.extraPrice)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${isSelected
                            ? 'bg-indigo-600/30 border border-indigo-500/50 text-indigo-300'
                            : 'bg-white/5 border border-white/8 text-slate-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600'}`}>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                            {ch.name}
                          </span>
                          {ch.extraPrice > 0 && <span className="text-indigo-400 font-bold">+฿{ch.extraPrice}</span>}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Note */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">หมายเหตุ</label>
            <input
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/60 transition-all"
              placeholder="เช่น ไม่ใส่ผัก, เผ็ดน้อย"
              value={itemNote}
              onChange={e => setItemNote(e.target.value)}
            />
          </div>

          {/* Qty + Add */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
              <button onClick={() => setItemQty(q => Math.max(1, q - 1))} className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 font-bold text-lg transition-all">−</button>
              <span className="text-sm text-white w-8 text-center font-bold">{itemQty}</span>
              <button onClick={() => setItemQty(q => q + 1)} className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 font-bold text-lg transition-all">+</button>
            </div>
            <button
              onClick={handleAdd}
              disabled={missingRequired.length > 0}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {missingRequired.length > 0
                ? `เลือก ${missingRequired.map(o => o.name).join(', ')}`
                : `เพิ่มลงตะกร้า — ฿${totalPrice}`
              }
            </button>
          </div>

          {/* Close */}
          <button onClick={onClose} className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-bold transition-all border border-white/10">
            ปิด
          </button>
        </div>
      </div>
    </div>
  )
}

function CustomerView({ initialRestaurantId = '', initialTableId = '' }) {
  const [restaurantId, setRestaurantId] = useState(initialRestaurantId)
  const [tableId, setTableId] = useState(initialTableId)
  const [ready, setReady] = useState(false)
  const [menu, setMenu] = useState([])
  const [cats, setCats] = useState([])
  const [orders, setOrders] = useState([])
  const [bill, setBill] = useState(null)
  const [cart, setCart] = useState([])
  const [selectedCat, setSelectedCat] = useState('all')
  const [section, setSection] = useState('menu')
  const [detailItem, setDetailItem] = useState(null)
  const socketRef = useRef(null)

  useEffect(() => {
    return () => { socketRef.current?.disconnect() }
  }, [])

  const loadMenu = useCallback(async (rid) => {
    try {
      const [m, c] = await Promise.all([
        call('GET', `/api/public/restaurant/${rid}/menu`),
        call('GET', `/api/public/restaurant/${rid}/categories`),
      ])
      setMenu(m.filter(i => i.isAvailable))
      setCats(c)
    } catch (err) { toast.error('โหลดเมนูไม่สำเร็จ: ' + (err.response?.data?.message || err.message)) }
  }, [])

  const loadOrders = useCallback(async (tid) => {
    try { setOrders(await call('GET', `/api/tables/${tid}/orders`)) }
    catch { /* โต๊ะใหม่ยังไม่มี order */ }
  }, [])

  const loadBill = useCallback(async (tid) => {
    try { setBill(await call('GET', `/api/tables/${tid}/bill`)) }
    catch { setBill(null) }
  }, [])

  // แยก session logic ออกมาเพื่อให้ทั้ง handleStart และ auto-start (QR flow) เรียกใช้ได้
  const startSession = useCallback(async (rid, tid) => {
    await loadMenu(rid)
    await loadOrders(tid)
    setRestaurantId(rid)
    setTableId(tid)
    setReady(true)

    socketRef.current = io(BASE)
    socketRef.current.emit('join_table', tid)
    socketRef.current.on('order_status_updated', ({ orderId, status }) => {
      toast.success(`ออเดอร์ #${orderId.slice(-6)} → ${status}`)
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o))
    })
    socketRef.current.on('bill_paid', () => {
      toast.success('✓ ชำระเงินแล้ว ขอบคุณ!')
      loadBill(tid)
    })
  }, [loadMenu, loadOrders, loadBill])

  // Auto-start เมื่อมาจาก QR code (initial values ถูกส่งเข้ามาจาก CustomerPage)
  useEffect(() => {
    if (initialRestaurantId && initialTableId) {
      startSession(initialRestaurantId, initialTableId)
    }
  }, [initialRestaurantId, initialTableId, startSession])

  const handleStart = async () => {
    if (!restaurantId.trim()) return toast.error('กรุณาใส่ Restaurant ID')
    if (!tableId.trim()) return toast.error('กรุณาใส่ Table ID')
    await startSession(restaurantId, tableId)
  }

  const addToCartWithOptions = (item, quantity, note, options) => {
    const extraTotal = options.reduce((s, o) => s + (o.extraPrice || 0), 0)
    const cartKey = `${item._id}_${options.map(o => o.choice).join('_')}_${note}`
    setCart(prev => {
      const exists = prev.find(c => c.cartKey === cartKey)
      if (exists) return prev.map(c => c.cartKey === cartKey ? { ...c, quantity: c.quantity + quantity } : c)
      return [...prev, {
        _id: item._id,
        cartKey,
        name: item.name,
        price: item.price,
        quantity,
        note,
        options,
        extraPrice: extraTotal,
      }]
    })
    toast.success(`เพิ่ม ${item.name} ×${quantity}`)
  }

  const removeFromCart = (cartKey) => setCart(prev => prev.filter(c => c.cartKey !== cartKey))

  const placeOrder = async () => {
    if (cart.length === 0) return toast.error('ตะกร้าว่างเปล่า')
    try {
      await call('POST', `/api/tables/${tableId}/orders`, {
        items: cart.map(c => ({
          menuItemId: c._id,
          quantity: c.quantity,
          note: c.note,
          options: c.options || [],
        }))
      })
      toast.success('สั่งอาหารสำเร็จ! 🎉')
      setCart([])
      setSection('orders')
      loadOrders(tableId)
    } catch (err) { toast.error(err.response?.data?.message || err.message) }
  }

  // ใช้ getCatId เพื่อเปรียบเทียบ category ที่ถูกต้อง (รองรับ populated object)
  const filteredMenu = selectedCat === 'all' ? menu : menu.filter(m => getCatId(m) === selectedCat)
  const catMap = Object.fromEntries(cats.map(c => [c._id, c.name]))

  // ── Setup screen ──────────────────────────────────────────────────────────
  if (!ready) {
    return (
      <div className="max-w-sm space-y-3">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🛒</div>
          <h2 className="text-lg font-black text-white">จำลองหน้าลูกค้า</h2>
          <p className="text-xs text-slate-500 mt-1">ต้องการทั้ง Restaurant ID และ Table ID เพื่อโหลดเมนูและสั่งอาหาร</p>
        </div>
        <Card>
          <div className="space-y-3">
            <Inp
              label="Restaurant ID"
              placeholder="copy จาก Admin → ร้านอาหาร → ID"
              value={restaurantId}
              onChange={e => setRestaurantId(e.target.value)}
            />
            <Inp
              label="Table ID"
              placeholder="copy จาก Admin → โต๊ะ → คลิกที่ ID ใต้หมายเลขโต๊ะ"
              value={tableId}
              onChange={e => setTableId(e.target.value)}
            />
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-xs text-indigo-300 space-y-1">
              <p className="font-bold">วิธี copy IDs:</p>
              <p>• <span className="text-white">Restaurant ID</span> — Admin → 🏠 ร้านอาหาร → ดูช่อง ID</p>
              <p>• <span className="text-white">Table ID</span> — Admin → 🪑 โต๊ะ → คลิกตัวเลข ID ใต้หมายเลขโต๊ะ</p>
            </div>
            <Btn size="lg" className="w-full" onClick={handleStart}>เริ่มสั่งอาหาร →</Btn>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Menu Item Detail Modal */}
      {detailItem && (
        <MenuItemModal
          item={detailItem}
          catMap={catMap}
          onClose={() => setDetailItem(null)}
          onAdd={addToCartWithOptions}
        />
      )}

      {/* Sub nav */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 max-w-sm">
        {[['menu', '📖 เมนู'], ['cart', `🛒 ตะกร้า (${cart.length})`], ['orders', `📋 ออเดอร์`], ['bill', '🧾 บิล']].map(([k, label]) => (
          <button key={k} onClick={() => { setSection(k); if (k === 'orders') loadOrders(tableId); if (k === 'bill') loadBill(tableId) }}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap px-1 ${section === k ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>
      <p className="text-[10px] text-slate-600 font-mono">Table: {tableId}</p>

      {/* Menu */}
      {section === 'menu' && (
        <div className="space-y-4">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setSelectedCat('all')} className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${selectedCat === 'all' ? 'bg-indigo-600 text-white border-transparent' : 'bg-white/5 text-slate-400 border-white/10'}`}>ทั้งหมด</button>
            {cats.map(c => (
              <button key={c._id} onClick={() => setSelectedCat(c._id)} className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${selectedCat === c._id ? 'bg-indigo-600 text-white border-transparent' : 'bg-white/5 text-slate-400 border-white/10'}`}>{c.name}</button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredMenu.map(item => {
              const catName = getCatName(item) || catMap[getCatId(item)] || '—'
              const hasOpts = item.options && item.options.length > 0
              return (
                <div key={item._id}
                  className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/[0.07] hover:border-white/20 transition-all"
                  onClick={() => setDetailItem(item)}
                >
                  {item.image ? <img src={imgSrc(item.image)} alt={item.name} className="w-full h-28 object-cover rounded-xl mb-3 bg-slate-800" /> : <div className="w-full h-20 rounded-xl mb-3 bg-white/5 flex items-center justify-center text-3xl">🍽️</div>}
                  <p className="text-sm font-bold text-white">{item.name}</p>
                  <p className="text-xs text-slate-500 mb-1">{catName}</p>
                  {item.description && <p className="text-xs text-slate-400 mb-2 line-clamp-2">{item.description}</p>}
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-base font-black text-indigo-400">฿{item.price}</p>
                    <div className="flex items-center gap-1.5">
                      {hasOpts && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">มีตัวเลือก</span>}
                      <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20">+ สั่ง</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {filteredMenu.length === 0 && <Card><p className="text-slate-500 text-sm text-center">ไม่มีเมนู</p></Card>}
        </div>
      )}

      {/* Cart */}
      {section === 'cart' && (
        <div className="max-w-lg space-y-3">
          {cart.length === 0 ? <Card><p className="text-slate-500 text-sm text-center">ตะกร้าว่าง</p></Card> : (
            <>
              {cart.map(item => {
                const unitPrice = item.price + (item.extraPrice || 0)
                return (
                  <div key={item.cartKey} className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white">{item.name}</p>
                      {item.options && item.options.length > 0 && (
                        <p className="text-[11px] text-indigo-300 mt-0.5">
                          {item.options.map(o => `${o.name}: ${o.choice}${o.extraPrice ? ` (+฿${o.extraPrice})` : ''}`).join(' · ')}
                        </p>
                      )}
                      {item.note && <p className="text-xs text-slate-500 mt-0.5">📝 {item.note}</p>}
                      <p className="text-xs text-indigo-400 font-bold mt-1">฿{unitPrice} × {item.quantity} = ฿{unitPrice * item.quantity}</p>
                    </div>
                    <Btn variant="danger" size="sm" onClick={() => removeFromCart(item.cartKey)}>ลบ</Btn>
                  </div>
                )
              })}
              <Divider />
              <div className="flex justify-between items-center px-1">
                <span className="text-slate-400 text-sm">รวม</span>
                <span className="text-2xl font-black text-white">฿{cart.reduce((s, c) => s + (c.price + (c.extraPrice || 0)) * c.quantity, 0)}</span>
              </div>
              <Btn size="lg" variant="success" className="w-full" onClick={placeOrder}>✓ สั่งอาหาร</Btn>
            </>
          )}
        </div>
      )}

      {/* My Orders */}
      {section === 'orders' && (
        <div className="max-w-lg space-y-3">
          <Btn variant="ghost" size="sm" onClick={() => loadOrders(tableId)}>รีเฟรช</Btn>
          {orders.map(order => (
            <div key={order._id} className="bg-white/[0.04] border border-white/10 rounded-2xl p-4">
              <div className="flex justify-between mb-2">
                <Badge status={order.status} />
                <span className="text-xs font-black text-indigo-400">฿{order.totalAmount}</span>
              </div>
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs text-slate-400">
                  <span>{item.name} × {item.quantity}{item.note && <span className="text-slate-600"> ({item.note})</span>}</span>
                  <span>฿{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          ))}
          {orders.length === 0 && <Card><p className="text-slate-500 text-sm text-center">ยังไม่มีออเดอร์</p></Card>}
        </div>
      )}

      {/* Bill */}
      {section === 'bill' && (
        <div className="max-w-lg space-y-3">
          <Btn variant="ghost" size="sm" onClick={() => loadBill(tableId)}>รีเฟรช</Btn>
          {bill ? (
            <Card title={`บิลโต๊ะ ${bill.tableNumber}`}>
              {bill.orders.map(order => (
                <div key={order._id} className="mb-3 pb-3 border-b border-white/8 last:border-0">
                  <div className="flex justify-between mb-1">
                    <Badge status={order.status} />
                    <span className="text-xs font-bold text-indigo-400">฿{order.totalAmount}</span>
                  </div>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs text-slate-400">
                      <span>{item.name} × {item.quantity}</span>
                      <span>฿{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              ))}
              <div className="flex justify-between items-center mt-2">
                <span className="text-slate-400 text-sm">ยอดรวมทั้งหมด</span>
                <span className="text-2xl font-black text-white">฿{bill.totalAmount}</span>
              </div>
            </Card>
          ) : <Card><p className="text-slate-500 text-sm text-center">ไม่มีบิลสำหรับโต๊ะนี้</p></Card>}
        </div>
      )}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═════════════════════════════════════════════════════════════════════════════
const ADMIN_SECTIONS = [
  { key: 'restaurant', label: '🏠 ร้านอาหาร' },
  { key: 'categories', label: '📂 หมวดหมู่' },
  { key: 'menu', label: '🍽️ เมนู' },
  { key: 'tables', label: '🪑 โต๊ะ' },
  { key: 'reports', label: '📊 รายงาน' },
]
const STAFF_SECTIONS = [
  { key: 'orders', label: '📋 ออเดอร์' },
  { key: 'checkout', label: '💳 Checkout' },
]

// ═════════════════════════════════════════════════════════════════════════════
// CUSTOMER PAGE — เข้าจาก QR Code /r/:restaurantId/table/:tableNumber
// ═════════════════════════════════════════════════════════════════════════════
function CustomerPage() {
  const { restaurantId, tableNumber } = useParams()
  const [tableId, setTableId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    call('GET', `/api/public/restaurant/${restaurantId}/table-by-number/${tableNumber}`)
      .then(t => setTableId(t._id))
      .catch(() => setError(`ไม่พบโต๊ะหมายเลข ${tableNumber}`))
  }, [restaurantId, tableNumber])

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="text-5xl">😕</div>
        <p className="text-white font-bold text-lg">{error}</p>
        <p className="text-slate-500 text-sm">กรุณาติดต่อพนักงาน</p>
      </div>
    </div>
  )

  if (!tableId) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-slate-400 text-sm animate-pulse">กำลังโหลด…</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)' } }} />
      <header className="border-b border-white/8 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <span className="text-base font-black text-white">🍽️ EzyOrder</span>
          <span className="text-xs text-slate-500 border border-white/10 rounded-full px-2 py-0.5">โต๊ะ {tableNumber}</span>
        </div>
      </header>
      <div className="max-w-2xl mx-auto p-4">
        <CustomerView initialRestaurantId={restaurantId} initialTableId={tableId} />
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// DASHBOARD (Admin / Staff / Customer test)
// ═════════════════════════════════════════════════════════════════════════════
function Dashboard() {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState('admin')       // 'admin' | 'staff' | 'customer'
  const [section, setSection] = useState('restaurant')
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!token) return
    call('GET', '/api/auth/me', null, token)
      .then(u => setUser(u))
      .catch(() => { localStorage.removeItem('token'); setToken(null) })
  }, [token])

  useEffect(() => {
    if (!token) return
    const s = io(BASE)
    setSocket(s)
    return () => s.disconnect()
  }, [token])

  const onLogin = (t, u) => {
    localStorage.setItem('token', t)
    setToken(t)
    if (u) setUser(u)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null); setUser(null)
    socket?.disconnect(); setSocket(null)
    toast.success('ออกจากระบบแล้ว')
  }

  const switchMode = (m) => {
    setMode(m)
    setSection(m === 'admin' ? 'restaurant' : m === 'staff' ? 'orders' : 'menu')
  }

  if (!token) return <><AuthScreen onLogin={onLogin} /><Toaster position="bottom-center" toastOptions={{ style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)' } }} /></>

  const restaurantId = user?.restaurantId
  const navItems = mode === 'admin' ? ADMIN_SECTIONS : mode === 'staff' ? STAFF_SECTIONS : []

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)' } }} />

      {/* Top bar */}
      <header className="border-b border-white/8 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          <span className="text-base font-black text-white mr-2">🍽️ EzyOrder</span>
          {/* Mode tabs */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1">
            {[['admin', '⚙️ Admin'], ['staff', '👨‍🍳 Staff'], ['customer', '🛒 Customer']].map(([m, label]) => (
              <button key={m} onClick={() => switchMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === m ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3">
            {user && <span className="text-xs text-slate-500 hidden sm:block">{user.name} <span className="text-slate-700">·</span> <span className="text-indigo-400">{user.role}</span></span>}
            <Btn variant="danger" size="sm" onClick={logout}>ออกจากระบบ</Btn>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        {navItems.length > 0 && (
          <aside className="w-44 flex-shrink-0 border-r border-white/8 py-6 px-3">
            <nav className="space-y-1">
              {navItems.map(({ key, label }) => (
                <button key={key} onClick={() => setSection(key)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${section === key ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                  {label}
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Main */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Admin */}
          {mode === 'admin' && restaurantId && (
            <>
              {section === 'restaurant' && <AdminRestaurant token={token} restaurantId={restaurantId} />}
              {section === 'categories' && <AdminCategories token={token} restaurantId={restaurantId} />}
              {section === 'menu' && <AdminMenu token={token} restaurantId={restaurantId} />}
              {section === 'tables' && <AdminTables token={token} restaurantId={restaurantId} />}
              {section === 'reports' && <AdminReports token={token} restaurantId={restaurantId} />}
            </>
          )}
          {/* Staff */}
          {mode === 'staff' && restaurantId && (
            <>
              {section === 'orders' && <StaffOrders token={token} restaurantId={restaurantId} socket={socket} />}
              {section === 'checkout' && <StaffCheckout token={token} restaurantId={restaurantId} />}
            </>
          )}
          {/* Customer */}
          {mode === 'customer' && <CustomerView />}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/r/:restaurantId/table/:tableNumber" element={<CustomerPage />} />
      <Route path="/*" element={<Dashboard />} />
    </Routes>
  )
}
