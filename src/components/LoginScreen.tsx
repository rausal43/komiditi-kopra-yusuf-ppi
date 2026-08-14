import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Truck, Warehouse, Lock, ArrowRight } from 'lucide-react';
import type { Role } from '../types';

export const LoginScreen: React.FC = () => {
  const { login } = useApp();
  const [selectedRole, setSelectedRole] = useState<Role>('LOGISTIK');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole, username || selectedRole.toLowerCase());
  };

  const handleQuickLogin = (role: Role) => {
    login(role);
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
            Sistem Sourcing & Rekonsiliasi Real-Time
          </p>
        </div>

        {/* Quick Role Selection Cards */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
            Pilih Peran / Hak Akses
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setSelectedRole('LOGISTIK')}
              style={{
                padding: '10px 6px',
                borderRadius: '12px',
                border: selectedRole === 'LOGISTIK' ? '2px solid #FF5000' : '1px solid #E2E8F0',
                background: selectedRole === 'LOGISTIK' ? 'rgba(255, 80, 0, 0.06)' : '#FAFBFC',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <Truck size={18} color={selectedRole === 'LOGISTIK' ? '#FF5000' : '#64748B'} style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '11px', fontWeight: '800', color: selectedRole === 'LOGISTIK' ? '#FF5000' : '#0F172A' }}>Logistik</div>
              <div style={{ fontSize: '9px', color: '#64748B' }}>Input & Save</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('OWNER')}
              style={{
                padding: '10px 6px',
                borderRadius: '12px',
                border: selectedRole === 'OWNER' ? '2px solid #FF5000' : '1px solid #E2E8F0',
                background: selectedRole === 'OWNER' ? 'rgba(255, 80, 0, 0.06)' : '#FAFBFC',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <ShieldCheck size={18} color={selectedRole === 'OWNER' ? '#FF5000' : '#64748B'} style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '11px', fontWeight: '800', color: selectedRole === 'OWNER' ? '#FF5000' : '#0F172A' }}>Owner</div>
              <div style={{ fontSize: '9px', color: '#64748B' }}>Full Akses</div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('SEKELY')}
              style={{
                padding: '10px 6px',
                borderRadius: '12px',
                border: selectedRole === 'SEKELY' ? '2px solid #FF5000' : '1px solid #E2E8F0',
                background: selectedRole === 'SEKELY' ? 'rgba(255, 80, 0, 0.06)' : '#FAFBFC',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <Warehouse size={18} color={selectedRole === 'SEKELY' ? '#FF5000' : '#64748B'} style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: '11px', fontWeight: '800', color: selectedRole === 'SEKELY' ? '#FF5000' : '#0F172A' }}>Sekely</div>
              <div style={{ fontSize: '9px', color: '#64748B' }}>Gudang</div>
            </button>
          </div>
        </div>

        {/* Role Privileges Notice */}
        <div style={{
          background: selectedRole === 'LOGISTIK' ? '#EFF6FF' : selectedRole === 'OWNER' ? '#ECFDF5' : '#F8FAFC',
          border: `1px solid ${selectedRole === 'LOGISTIK' ? '#BFDBFE' : selectedRole === 'OWNER' ? '#A7F3D0' : '#E2E8F0'}`,
          borderRadius: '10px',
          padding: '10px 12px',
          marginBottom: '20px',
          fontSize: '11px',
          color: '#334155',
        }}>
          {selectedRole === 'LOGISTIK' && (
            <div>
              <strong>🚚 Hak Akses Logistik:</strong> Buka Beranda, Belanja Kopra, Pengiriman, & Setor Pabrik. Bisa input & simpan data baru, tetapi <u>tidak bisa edit/hapus</u> setelah disimpan.
            </div>
          )}
          {selectedRole === 'OWNER' && (
            <div>
              <strong>🛡️ Hak Akses Owner:</strong> Memiliki wewenang penuh (Full Access). Bisa input, edit, hapus data, serta mengatur harga & modul finansial.
            </div>
          )}
          {selectedRole === 'SEKELY' && (
            <div>
              <strong>🏭 Hak Akses Sekely:</strong> Membuka modul operasional gudang dan belanja kopra lapangan.
            </div>
          )}
        </div>

        {/* Form Input Credentials */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '14px' }}>
            <label className="form-label" style={{ fontSize: '11px' }}>Username / ID</label>
            <input
              type="text"
              className="form-input"
              placeholder={`Masukkan username (opsional, default: ${selectedRole.toLowerCase()})`}
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ fontSize: '13px' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="form-label" style={{ fontSize: '11px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ fontSize: '13px' }}
              />
              <Lock size={14} color="#94A3B8" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
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
            }}
          >
            Masuk Sebagai {selectedRole} <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Instant Login Option */}
        <div style={{ marginTop: '16px', textAlign: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '14px' }}>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>Atau Masuk Cepat: </span>
          <button
            type="button"
            onClick={() => handleQuickLogin('LOGISTIK')}
            style={{ fontSize: '11px', fontWeight: '800', color: '#FF5000', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', marginLeft: '4px' }}
          >
            Masuk Logistik
          </button>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}> | </span>
          <button
            type="button"
            onClick={() => handleQuickLogin('OWNER')}
            style={{ fontSize: '11px', fontWeight: '800', color: '#10B981', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Masuk Owner
          </button>
        </div>
      </div>
    </div>
  );
};
