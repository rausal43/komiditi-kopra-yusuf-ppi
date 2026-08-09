import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, ShoppingCart, Plus, Ship, Factory } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, activeRole, openContextualFabModal } = useApp();

  const navItems = [
    { id: 'batch', label: 'Beranda', icon: Home, roles: ['sekely', 'owner', 'logistik', 'SEKELY', 'OWNER', 'LOGISTIK'] },
    { id: 'belanja', label: 'Belanja', icon: ShoppingCart, roles: ['sekely', 'owner', 'SEKELY', 'OWNER'] },
    { id: 'action', label: 'Input Baru', icon: Plus, isAction: true, roles: ['sekely', 'owner', 'logistik', 'SEKELY', 'OWNER', 'LOGISTIK'] },
    { id: 'transshipment', label: 'Pengiriman', icon: Ship, roles: ['logistik', 'owner', 'LOGISTIK', 'OWNER'] },
    { id: 'settlement', label: 'Pabrik', icon: Factory, roles: ['owner', 'logistik', 'OWNER', 'LOGISTIK'] },
  ];

  const currentRole = activeRole || 'owner';
  const filteredNavItems = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <div className="mobile-bottom-nav">
      {filteredNavItems.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        if (item.isAction) {
          return (
            <button
              key={item.id}
              className="mobile-fab-center-btn"
              onClick={openContextualFabModal}
              title="Input Baru Sesuai Halaman"
            >
              <Plus size={24} color="#FFFFFF" />
            </button>
          );
        }

        return (
          <button
            key={item.id}
            className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <Icon size={18} color={isActive ? '#FF5000' : '#64748B'} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
