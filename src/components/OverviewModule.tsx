import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PieChart, TrendingUp, DollarSign, Scale, Award, ShieldCheck, Filter } from 'lucide-react';

export const OverviewModule: React.FC = () => {
  const { batchList, settlementList, timbanganList } = useApp();
  const [selectedBatchId, setSelectedBatchId] = useState(batchList[0]?.id || 'BATCH-2026-08A');

  const selectedBatch = batchList.find(b => b.id === selectedBatchId) || batchList[0];
  const settlement = settlementList.find(s => s.batchId === selectedBatchId);

  const batchTimbangan = timbanganList.filter(t => t.batchId === selectedBatchId);
  const totalBelanjaNominal = batchTimbangan.length
    ? batchTimbangan.reduce((acc, curr) => acc + curr.totalNominalBeli, 0)
    : 126128000;

  const totalShipping = selectedBatch
    ? selectedBatch.biayaUpahPanggul + selectedBatch.biayaSewaFeeder + selectedBatch.biayaFreightSabuk +
      selectedBatch.biayaUangJalan + selectedBatch.biayaTruckingBitung + selectedBatch.biayaAdminBriLink
    : 12200000;

  const totalRevenuePabrik = settlement ? settlement.totalPenerimaanPabrik : 146500000;
  const nettProfitMargin = settlement ? settlement.nettProfitMargin : totalRevenuePabrik - (totalBelanjaNominal + totalShipping);

  // Donut chart percentages
  const pctBelanja = Math.round((totalBelanjaNominal / totalRevenuePabrik) * 100);
  const pctShipping = Math.round((totalShipping / totalRevenuePabrik) * 100);
  const pctProfit = Math.max(0, 100 - (pctBelanja + pctShipping));

  // Global metric summary totals
  const totalRevenueAll = settlementList.reduce((acc, curr) => acc + curr.totalPenerimaanPabrik, 0);
  const totalProfitAll = settlementList.reduce((acc, curr) => acc + curr.nettProfitMargin, 0);
  const totalTonaseKgAll = timbanganList.reduce((acc, curr) => acc + curr.totalNetto, 0);
  const avgMoistureAll = (settlementList.reduce((acc, curr) => acc + (curr.kadarAirLabPercent || 0), 0) / (settlementList.length || 1)).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Overview Header */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="badge badge-orange" style={{ marginBottom: '4px' }}>Dashboard Overview & Analitik</span>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>
              Eksekutif Dashboard Performa Finansial & Operasional
            </h2>
            <p style={{ fontSize: '11px', color: '#64748B' }}>
              Visualisasi real-time status batch, pendapatan pabrik, alokasi modal, dan efisiensi tonase.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core Metric Summary Cards (Full Unabbreviated Numbers) */}
      <div className="grid-4">
        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <DollarSign size={12} color="#10B981" /> Total Pendapatan Pabrik
          </div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>
            Rp {totalRevenueAll.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} color="#FF5000" /> Total Net Profit Margin
          </div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: totalProfitAll >= 0 ? '#10B981' : '#EF4444', marginTop: '4px' }}>
            +Rp {totalProfitAll.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Scale size={12} color="#0EA5E9" /> Total Tonase Sourced
          </div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>
            {(totalTonaseKgAll / 1000).toFixed(2)} Ton ({totalTonaseKgAll.toLocaleString('id-ID')} kg)
          </div>
        </div>

        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Award size={12} color="#F59E0B" /> Rata-Rata Kadar Air Lab
          </div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>
            {avgMoistureAll}%
          </div>
        </div>
      </div>

      {/* Interactive Pie/Donut Chart Section per Selected Batch */}
      <div className="grid-2">
        {/* Donut Chart Component with Overflow Fix */}
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PieChart size={16} color="#FF5000" /> Analisis P&L Chart Lingkaran
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', maxWidth: '100%' }}>
              <Filter size={13} color="#FF5000" />
              <select
                className="form-select"
                style={{ width: '130px', maxWidth: '130px', padding: '4px 6px', fontSize: '10px', fontWeight: '700', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                value={selectedBatchId}
                onChange={e => setSelectedBatchId(e.target.value)}
              >
                {batchList.map(b => (
                  <option key={b.id} value={b.id}>{b.id}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SVG Donut Chart Illustration */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', padding: '10px 0' }}>
            <div style={{ position: 'relative', width: '130px', height: '130px' }}>
              <svg width="130" height="130" viewBox="0 0 42 42" className="donut-svg">
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#E2E8F0" strokeWidth="5" />
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#FF5000" strokeWidth="5" strokeDasharray={`${pctBelanja} ${100 - pctBelanja}`} strokeDashoffset="25" />
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#0EA5E9" strokeWidth="5" strokeDasharray={`${pctShipping} ${100 - pctShipping}`} strokeDashoffset={`${25 - pctBelanja}`} />
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10B981" strokeWidth="5" strokeDasharray={`${pctProfit} ${100 - pctProfit}`} strokeDashoffset={`${25 - pctBelanja - pctShipping}`} />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '9px', color: '#64748B', fontWeight: '700' }}>TOTAL REVENUE</span>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#0F172A' }}>Rp {(totalRevenuePabrik / 1000000).toFixed(0)} Jt</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#FF5000' }} />
                <span>Belanja Kopra: <strong>Rp {totalBelanjaNominal.toLocaleString('id-ID')} ({pctBelanja}%)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#0EA5E9' }} />
                <span>Biaya Transport: <strong>Rp {totalShipping.toLocaleString('id-ID')} ({pctShipping}%)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10B981' }} />
                <span>Nett Profit: <strong style={{ color: '#10B981' }}>+Rp {nettProfitMargin.toLocaleString('id-ID')} ({pctProfit}%)</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Alokasi Modal & Efisiensi */}
        <div className="card" style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} color="#10B981" /> Detail Rekapitulasi Financial {selectedBatchId}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#F8FAFC', borderRadius: '8px' }}>
              <span>Nama Batch:</span> <strong>{selectedBatch?.namaBatch}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#F8FAFC', borderRadius: '8px' }}>
              <span>Status Pelayaran:</span> <span className="badge badge-orange">{selectedBatch?.statusMilestone}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#F8FAFC', borderRadius: '8px' }}>
              <span>Total Revenue Pabrik:</span> <strong style={{ color: '#0F172A' }}>Rp {totalRevenuePabrik.toLocaleString('id-ID')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <span style={{ fontWeight: '800', color: '#0F172A' }}>NETT PROFIT MARGIN:</span>
              <strong style={{ color: '#10B981', fontSize: '12px' }}>+Rp {nettProfitMargin.toLocaleString('id-ID')}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
