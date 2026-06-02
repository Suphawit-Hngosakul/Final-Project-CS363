import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminSettingPage from './pages/AdminSettingPage';
import AuthScreen from './pages/AuthScreen';
import CustomerOrderPage from './pages/CustomerOrderPage';
import { call } from './utils/api';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;
    call('GET', '/api/auth/me', null, token)
      .then(u => setUser(u))
      .catch(() => { 
        localStorage.removeItem('token'); 
        setToken(null); 
      });
  }, [token]);

  const onLogin = (t, u) => {
    localStorage.setItem('token', t);
    setToken(t);
    if (u) setUser(u);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return (
      <>
        <AuthScreen onLogin={onLogin} />
        <Toaster
          position="top-right"
          containerStyle={{ zIndex: 99999 }}
          toastOptions={{
            style: { background: '#0B4251', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)' }
          }}
        />
      </>
    );
  }

  return (
    <>
      <Routes>
<Route
          path="/order/:tableId"
          element={<CustomerOrderPage user={user} onLogout={handleLogout} token={token} />}
        />
        <Route 
          path="/*" 
          element={<AdminSettingPage user={user} onLogout={handleLogout} token={token} />}
        />
      </Routes>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          style: { background: '#0B4251', color: '#f1f5f9', border: '1px solid rgba(255,255,255,0.1)' } 
        }} 
      />
    </>
  );
}
