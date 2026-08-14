import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, ArrowRight, AlertCircle, User } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginWithCredentials } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Harap isi username dan password!');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const result = await loginWithCredentials(username, password);
    setIsLoading(false);

    if (!result.success) {
      setErrorMsg(result.message || 'Username atau password salah!');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,80,0,0.15) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, rgba(0,0,0,0) 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
        padding: '36px 30px',
        zIndex: 1,
      }}>
        {/* Logo & Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #FF5000, #FF7A33)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '20px', fontWeight: '900',
            boxShadow: '0 8px 20px rgba(255,80,0,0.3)', marginBottom: '14px',
          }}>
            KS
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
            KOPRA SEJATI
          </h1>
          <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', margin: 0 }}>
            Sistem Operational & Sourcing Management
          </p>
        </div>

        {/* Error Notification Banner */}
        {errorMsg && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FCA5A5',
            borderRadius: '10px', padding: '10px 12px', marginBottom: '18px',
            fontSize: '12px', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Production Ready Form Input Credentials */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Masukkan username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ fontSize: '13px', paddingLeft: '36px' }}
                required
              />
              <User size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                placeholder="Masukkan password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ fontSize: '13px', paddingLeft: '36px' }}
                required
              />
              <Lock size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              borderRadius: '12px',
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Memverifikasi...' : 'Masuk Aplikasi'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '10px', color: '#94A3B8' }}>
          🛡️ Terkoneksi secara aman dengan Supabase Real-Time Database
        </div>
      </div>
    </div>
  );
};
