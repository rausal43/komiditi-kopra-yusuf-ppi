import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, ShoppingCart, Ship, Factory, PieChart, X, LogOut } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, activeRole, user, logout, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'batch', label: 'Beranda', icon: Home, roles: ['sekely', 'owner', 'logistik', 'SEKELY', 'OWNER', 'LOGISTIK'] },
    { id: 'belanja', label: 'Belanja Kopra', icon: ShoppingCart, roles: ['sekely', 'owner', 'logistik', 'SEKELY', 'OWNER', 'LOGISTIK'] },
    { id: 'transshipment', label: 'Pengiriman Kapal', icon: Ship, roles: ['logistik', 'owner', 'LOGISTIK', 'OWNER'] },
    { id: 'settlement', label: 'Setor Pabrik', icon: Factory, roles: ['owner', 'logistik', 'OWNER', 'LOGISTIK'] },
    { id: 'report', label: 'Overview', icon: PieChart, roles: ['owner', 'OWNER'] },
  ];

  const currentRole = activeRole || 'owner';
  const filteredNavItems = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-logo-circle">KS</div>
        <div>
          <div className="brand-title">KOPRA SEJATI</div>
          <div className="brand-sub">Real-Time Sourcing Tracking</div>
        </div>
        <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
          <X size={18} color="#94A3B8" />
        </button>
      </div>

      <div className="role-active-card">
        <div className="role-active-badge">Akses {String(currentRole).toUpperCase()}</div>
        <div className="role-menu-counter">{user?.name || currentRole}</div>
      </div>

      <nav className="sidebar-nav">
        {filteredNavItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
              {isActive && <span className="active-dot" />}
            </button>
          );
        })}
      </nav>

      {/* Logout button at bottom of sidebar */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button
          type="button"
          onClick={logout}
          className="nav-item"
          style={{ width: '100%', color: '#F87171', justifyContent: 'flex-start' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LogOut size={18} color="#F87171" />
            <span>Keluar / Logout</span>
          </div>
        </button>
      </div>
    </aside>
  );
};
