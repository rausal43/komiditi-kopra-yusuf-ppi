import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, ShoppingCart, Ship, Factory, PieChart, X } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, activeRole, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'batch', label: 'Beranda', icon: Home, roles: ['sekely', 'owner', 'logistik', 'SEKELY', 'OWNER', 'LOGISTIK'] },
    { id: 'belanja', label: 'Belanja Kopra', icon: ShoppingCart, roles: ['sekely', 'owner', 'SEKELY', 'OWNER'] },
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
        <div className="role-menu-counter">{filteredNavItems.length} Modul Aktif Terhubung</div>
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
    </aside>
  );
};
