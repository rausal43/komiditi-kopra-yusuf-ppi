import React from 'react';
import { useApp } from '../context/AppContext';

export const AIReportModule: React.FC = () => {
  const { aiReports, generateAIReport } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="card" style={{ padding: '18px 22px', background: 'var(--brand-navy)', color: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <span className="badge badge-orange" style={{ marginBottom: '6px' }}>DeepSeek-V3 Engine</span>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>
              DeepSeek AI Automated Weekly Maintenance & Executive Summary
            </h2>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
              Menerjemahkan data operasional teknis & finansial menjadi laporan narasi bisnis yang santun, profesional, dan dikirim otomatis ke Gmail Klien/Owner.
            </p>
          </div>

          <button className="btn btn-primary" onClick={generateAIReport}>
            Generate Laporan Pekanan Baru
          </button>
        </div>
      </div>

      {/* System Metrics Overview */}
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-label">Cloudflare Edge Uptime</div>
          <div className="stat-value">100%</div>
          <div className="stat-sub">Zero Downtime</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Blocked Threats</div>
          <div className="stat-value">42</div>
          <div className="stat-sub">Cloudflare WAF</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Kecepatan Respon</div>
          <div className="stat-value">1.1s</div>
          <div className="stat-sub">Core Web Vitals Pass</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Pengiriman Gmail</div>
          <div className="stat-value">Otomatis</div>
          <div className="stat-sub">Setiap Senin 08:00 WIB</div>
        </div>
      </div>

      {/* AI Reports Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
          Arsip Laporan Mingguan DeepSeek AI (Email Gmail)
        </h3>

        {aiReports.map(report => (
          <div key={report.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span className="badge badge-navy">{report.periodeLabel}</span>
                <span style={{ fontSize: '11px', color: '#64748B', marginLeft: '8px' }}>
                  Dibuat pada: {report.tglGenerated}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-success">{report.statusKirimGmail}</span>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                  Ke: {report.emailKlien}
                </span>
              </div>
            </div>

            {/* Email Narrative Box */}
            <div
              style={{
                background: '#F8FAFC',
                border: '1px solid var(--brand-border)',
                borderRadius: '10px',
                padding: '16px',
                fontFamily: 'monospace',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6',
                color: '#0F172A',
              }}
            >
              {report.narasiBisnis}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
