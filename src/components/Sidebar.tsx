import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, ShoppingCart, Ship, Factory, PieChart, Image as ImageIcon, Database, X, LogOut, PanelLeftClose } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab, setActiveTab, activeRole, user, logout,
    isMobileMenuOpen, setIsMobileMenuOpen,
    isSidebarCollapsed, toggleSidebar
  } = useApp();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const sections = [
    {
      title: 'OPERASIONAL',
      items: [
        { id: 'batch', label: 'Beranda', icon: Home, roles: ['sekely', 'owner', 'logistik', 'SEKELY', 'OWNER', 'LOGISTIK'] },
        { id: 'belanja', label: 'Belanja Kopra', icon: ShoppingCart, roles: ['sekely', 'owner', 'logistik', 'SEKELY', 'OWNER', 'LOGISTIK'] },
        { id: 'transshipment', label: 'Pengiriman Kapal', icon: Ship, roles: ['logistik', 'owner', 'LOGISTIK', 'OWNER'] },
        { id: 'settlement', label: 'Setor Pabrik', icon: Factory, roles: ['owner', 'logistik', 'OWNER', 'LOGISTIK'] },
      ],
    },
    {
      title: 'LAPORAN & ARSIP',
      items: [
        { id: 'report', label: 'Overview', icon: PieChart, roles: ['owner', 'OWNER'] },
        { id: 'gallery', label: 'Galeri Media', icon: ImageIcon, roles: ['owner', 'OWNER'] },
      ],
    },
    {
      title: 'PENGATURAN',
      items: [
        { id: 'master', label: 'Master Data', icon: Database, roles: ['owner', 'OWNER'] },
      ],
    },
  ];

  const currentRole = activeRole || 'owner';

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <aside className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <div className="brand-logo-circle">KS</div>
          <div>
            <div className="brand-title">KOPRA SEJATI</div>
            <div className="brand-sub">Real-Time Sourcing Tracking</div>
          </div>
        </div>
        <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
          <X size={20} color="#94A3B8" />
        </button>
      </div>

      <div className="role-active-card">
        <div className="role-active-badge">Akses {String(currentRole).toUpperCase()}</div>
        <div className="role-menu-counter">{user?.name || currentRole}</div>
      </div>

      <nav className="sidebar-nav" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {sections.map(section => {
          const visibleItems = section.items.filter(item => item.roles.includes(currentRole));
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div
                style={{
                  fontSize: '9px',
                  fontWeight: '800',
                  color: '#64748B',
                  letterSpacing: '0.6px',
                  padding: '4px 12px 2px 12px',
                }}
              >
                {section.title}
              </div>

              {visibleItems.map(item => {
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
            </div>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <button
          type="button"
          onClick={toggleSidebar}
          className="nav-item sidebar-collapse-bottom-btn desktop-only-btn"
          style={{ width: '100%', color: '#94A3B8', justifyContent: 'flex-start' }}
          title="Sembunyikan Sidebar"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PanelLeftClose size={18} color="#94A3B8" />
            <span>Sembunyikan Sidebar</span>
          </div>
        </button>

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
    </>
  );
};
