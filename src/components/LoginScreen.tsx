import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Truck, Lock, ArrowRight, AlertCircle, KeyRound } from 'lucide-react';

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
      setErrorMsg(result.message || 'Username atau password salah! Periksa data akun Supabase.');
    }
  };

  const setPresetCredentials = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setErrorMsg(null);
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
        maxWidth: '440px',
        background: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
        padding: '32px 28px',
        zIndex: 1,
      }}>
        {/* Logo & Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #FF5000, #FF7A33)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '20px', fontWeight: '900',
            boxShadow: '0 8px 20px rgba(255,80,0,0.3)', marginBottom: '12px',
          }}>
            KS
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#0F172A', margin: 0 }}>
            KOPRA SEJATI
          </h1>
          <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', margin: 0 }}>
            Login Otentikasi Supabase Real-Time
          </p>
        </div>

        {/* Preset Account Quick Picker */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
            <KeyRound size={12} color="#FF5000" /> Pilih Akun Akses Supabase:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setPresetCredentials('owneryusufdz', 'komoditi1523')}
              style={{
                padding: '10px 12px',
                borderRadius: '12px',
                border: username === 'owneryusufdz' ? '2px solid #10B981' : '1px solid #E2E8F0',
                background: username === 'owneryusufdz' ? 'rgba(16, 185, 129, 0.08)' : '#FAFBFC',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <ShieldCheck size={16} color="#10B981" />
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>OWNER</span>
              </div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>owneryusufdz</div>
              <div style={{ fontSize: '9px', color: '#10B981', fontWeight: '600' }}>Full Control (Edit/Hapus)</div>
            </button>

            <button
              type="button"
              onClick={() => setPresetCredentials('logisticteam', 'komoditi1523')}
              style={{
                padding: '10px 12px',
                borderRadius: '12px',
                border: username === 'logisticteam' ? '2px solid #FF5000' : '1px solid #E2E8F0',
                background: username === 'logisticteam' ? 'rgba(255, 80, 0, 0.08)' : '#FAFBFC',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <Truck size={16} color="#FF5000" />
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>LOGISTIK</span>
              </div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>logisticteam</div>
              <div style={{ fontSize: '9px', color: '#FF5000', fontWeight: '600' }}>Input & Save Only</div>
            </button>
          </div>
        </div>

        {/* Error Notification Banner */}
        {errorMsg && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FCA5A5',
            borderRadius: '10px', padding: '10px 12px', marginBottom: '16px',
            fontSize: '11px', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Input Credentials */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontSize: '11px' }}>Username / Akun</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: owneryusufdz atau logisticteam"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ fontSize: '13px' }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontSize: '11px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                placeholder="Masukkan password (komoditi1523)"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ fontSize: '13px' }}
                required
              />
              <Lock size={14} color="#94A3B8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
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

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '10px', color: '#94A3B8' }}>
          🛡️ Terkoneksi secara aman dengan Database Supabase & Cloudflare R2
        </div>
      </div>
    </div>
  );
};
