import React, { useState } from 'react';
import { BatchReportModule } from './BatchReportModule';
import { AIReportModule } from './AIReportModule';

export const LaporanModule: React.FC = () => {
  const [subTab, setSubTab] = useState<'pnl' | 'ai'>('pnl');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header & Sub-Tab Switcher */}
      <div className="card" style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="badge badge-orange" style={{ marginBottom: '4px' }}>Evaluasi & Profitability</span>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
              Laporan Profitability Per-Batch & AI Summary
            </h2>
            <p style={{ fontSize: '11px', color: '#64748B' }}>
              Rekapitulasi Laba Rugi (P&L) bersih per-batch dan ringkasan eksekutif mingguan via DeepSeek AI Engine.
            </p>
          </div>

          <div className="role-switcher-badge" style={{ background: '#F1F5F9' }}>
            <button
              className={`role-btn ${subTab === 'pnl' ? 'active' : ''}`}
              style={{ color: subTab === 'pnl' ? '#FFF' : '#0F172A' }}
              onClick={() => setSubTab('pnl')}
            >
              Laporan P&L Per-Batch
            </button>
            <button
              className={`role-btn ${subTab === 'ai' ? 'active' : ''}`}
              style={{ color: subTab === 'ai' ? '#FFF' : '#0F172A' }}
              onClick={() => setSubTab('ai')}
            >
              DeepSeek AI Summary
            </button>
          </div>
        </div>
      </div>

      {subTab === 'pnl' ? <BatchReportModule /> : <AIReportModule />}
    </div>
  );
};
