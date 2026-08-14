import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { BatchSettingModule } from './components/BatchSettingModule';
import { BelanjaModule } from './components/BelanjaModule';
import { TransshipmentModule } from './components/TransshipmentModule';
import { SettlementModule } from './components/SettlementModule';
import { OverviewModule } from './components/OverviewModule';
import { LoginScreen } from './components/LoginScreen';

const MainContent: React.FC = () => {
  const { user, activeTab } = useApp();

  if (!user) {
    return <LoginScreen />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'batch-setting':
      case 'dashboard':
        return <BatchSettingModule />;
      case 'belanja':
      case 'panjar':
      case 'timbangan':
        return <BelanjaModule />;
      case 'pengiriman':
      case 'transshipment':
        return <TransshipmentModule />;
      case 'pabrik':
      case 'settlement':
        return <SettlementModule />;
      case 'report':
      case 'laporan':
      case 'overview':
        return <OverviewModule />;
      default:
        return <BatchSettingModule />;
    }
  };

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Header Hero Banner */}
        <Navbar />

        {/* Content Body */}
        <main className="content-body">{renderTabContent()}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
