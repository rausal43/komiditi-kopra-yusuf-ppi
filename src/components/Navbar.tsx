import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Menu, LogOut, ShieldCheck, Truck, Warehouse } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, activeRole, logout, setIsMobileMenuOpen } = useApp();
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getRoleIcon = () => {
    if (activeRole === 'OWNER') return <ShieldCheck size={14} color="#10B981" />;
    if (activeRole === 'LOGISTIK') return <Truck size={14} color="#FF5000" />;
    return <Warehouse size={14} color="#0EA5E9" />;
  };

  return (
    <header className={`header-hero ${isHidden ? 'header-hidden' : ''}`}>
      <div className="header-compact">
        {/* Left: Burger Menu & App Title */}
        <div className="header-brand-group">
          <button
            className="mobile-burger-btn"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Buka Menu"
          >
            <Menu size={20} color="#FFFFFF" />
          </button>
          <div className="header-app-name">KOPRA SEJATI</div>
        </div>

        {/* Right: User Profile & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255, 255, 255, 0.1)', padding: '5px 10px',
            borderRadius: '20px', fontSize: '11px', fontWeight: '700', color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}>
            {getRoleIcon()}
            <span>{user?.name || activeRole}</span>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Keluar / Logout"
            style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#FCA5A5', padding: '5px 10px', borderRadius: '14px',
              fontSize: '11px', fontWeight: '700', cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
};
