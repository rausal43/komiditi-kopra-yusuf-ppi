import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Menu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeRole, setActiveRole, setIsMobileMenuOpen } = useApp();
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

        {/* Right: User Avatar Role Switcher */}
        <div className="role-switcher-badge">
          <button
            className={`role-btn ${activeRole === 'OWNER' ? 'active' : ''}`}
            onClick={() => setActiveRole('OWNER')}
          >
            OWNER
          </button>
          <button
            className={`role-btn ${activeRole === 'LOGISTIK' ? 'active' : ''}`}
            onClick={() => setActiveRole('LOGISTIK')}
          >
            LOGISTIK
          </button>
        </div>
      </div>
    </header>
  );
};
