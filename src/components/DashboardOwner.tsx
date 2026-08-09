import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowUpRight, Edit3, TrendingUp, BarChart3 } from 'lucide-react';

export const DashboardOwner: React.FC = () => {
  const { timbanganList, settlementList, batchList, priceSetting, updatePriceSetting, setActiveTab } = useApp();

  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [hargaWilmar, setHargaWilmar] = useState(priceSetting.hargaAcuanPabrikWilmar);
  const [hargaBeliSekely, setHargaBeliSekely] = useState(priceSetting.batasBeliGudangSekely);

  const totalPenerimaan = settlementList.reduce((acc, curr) => acc + curr.totalPenerimaanPabrik, 0);
  const totalNettProfit = settlementList.reduce((acc, curr) => acc + curr.nettProfitMargin, 0);
  const avgSusut = settlementList.length > 0
    ? (settlementList.reduce((acc, curr) => acc + (curr.susutTonasePercent || curr.persenSusutPabrik || 0), 0) / settlementList.length).toFixed(2)
    : '0.00';

  const totalSekelyTonase = timbanganList.reduce((acc, curr) => acc + curr.totalNetto, 0);

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    updatePriceSetting({ hargaAcuanPabrikWilmar: Number(hargaWilmar), batasBeliGudangSekely: Number(hargaBeliSekely) });
    setIsEditingPrice(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Stat Cards Row */}
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-label">Nett Profit Real-Time</div>
          <div className="stat-value">Rp {(totalNettProfit / 1000000).toFixed(1)} Jt</div>
          <div className="stat-sub" style={{ color: '#10B981', fontWeight: '700' }}>Margin Per Batch (±10 Ton)</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Tonase Sekely</div>
          <div className="stat-value">{(totalSekelyTonase / 1000).toFixed(2)} Ton</div>
          <div className="stat-sub">Stok Gudang & Pelayaran</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Susut Tonase Sekely vs Bitung</div>
          <div className="stat-value">{avgSusut}%</div>
          <div className="stat-sub" style={{ color: '#10B981', fontWeight: '600' }}>Target Toleransi: &lt; 3.0%</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Penerimaan Pabrik</div>
          <div className="stat-value">Rp {(totalPenerimaan / 1000000).toFixed(1)} Jt</div>
          <div className="stat-sub">Cair dari Wilmar / Agro</div>
        </div>
      </div>

      {/* Visual Business Performance & Profitability Chart Card */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <TrendingUp size={16} color="#FF5000" /> Grafik Profitability Nett Profit Per Batch (Jt Rp)
            </span>
          </div>

          <div style={{ height: '130px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '10px 14px', background: '#F8FAFC', borderRadius: '10px' }}>
            {batchList.slice(0, 4).map((b, idx) => {
              const settlement = settlementList.find(s => s.batchId === b.id);
              const profitVal = settlement ? settlement.nettProfitMargin / 1000000 : idx === 0 ? 10.3 : 9.8;
              const heightPx = Math.min(100, Math.max(25, (profitVal / 15) * 100));

              return (
                <div key={b.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: '#10B981' }}>+Rp {profitVal.toFixed(1)}Jt</div>
                  <div style={{ width: '100%', maxWidth: '38px', height: `${heightPx}%`, background: 'var(--brand-orange)', borderRadius: '6px' }} />
                  <div style={{ fontSize: '9px', fontWeight: '700', color: '#0F172A' }}>{b.id}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-title">
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <BarChart3 size={16} color="#0EA5E9" /> Progress Alokasi Modal Usaha Terpakai
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px', background: '#F8FAFC', borderRadius: '10px' }}>
            {batchList.slice(0, 2).map(b => {
              const modal = b.modalAwalBatch || 150000000;
              const terpakai = timbanganList.filter(t => t.batchId === b.id).reduce((acc, curr) => acc + curr.totalNominalBeli, 0);
              const percentTerpakai = Math.min(100, Math.round((terpakai / modal) * 100));

              return (
                <div key={b.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700' }}>
                    <span>{b.id} ({b.sumberAkunDana || 'BRI'})</span>
                    <span style={{ color: '#FF5000' }}>{percentTerpakai}% Terpakai</span>
                  </div>
                  <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '99px', overflow: 'hidden', marginTop: '2px' }}>
                    <div style={{ width: `${percentTerpakai}%`, height: '100%', background: '#10B981', borderRadius: '99px' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748B', marginTop: '2px' }}>
                    <span>Beli: Rp {(terpakai / 1000000).toFixed(1)} Jt</span>
                    <span>Modal: Rp {(modal / 1000000).toFixed(0)} Jt</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Master Price Setting Card */}
      <div className="card">
        <div className="card-title">
          <span>Master Price Setting (Wilmar Bitung vs Sekely)</span>
          <button className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => setIsEditingPrice(!isEditingPrice)}>
            <Edit3 size={13} /> {isEditingPrice ? 'Batal' : 'Update Harga'}
          </button>
        </div>

        {!isEditingPrice ? (
          <div className="grid-3" style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
            <div>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '600' }}>Acuan Wilmar Bitung</div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>Rp {priceSetting.hargaAcuanPabrikWilmar.toLocaleString('id-ID')}/kg</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '600' }}>Batas Beli Gudang Sekely</div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#FF5000' }}>Rp {priceSetting.batasBeliGudangSekely.toLocaleString('id-ID')}/kg</div>
            </div>
            <div>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '600' }}>Est. Gross Spread</div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#10B981' }}>+Rp {(priceSetting.hargaAcuanPabrikWilmar - priceSetting.batasBeliGudangSekely).toLocaleString('id-ID')}/kg</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSavePrices} className="grid-3" style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Wilmar Bitung</label>
              <input type="number" className="form-input" value={hargaWilmar} onChange={e => setHargaWilmar(Number(e.target.value))} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Batas Beli Sekely</label>
              <input type="number" className="form-input" value={hargaBeliSekely} onChange={e => setHargaBeliSekely(Number(e.target.value))} required />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Simpan</button>
            </div>
          </form>
        )}
      </div>

      {/* Batch Settlement Table */}
      <div className="card">
        <div className="card-title">
          <span>Rekapitulasi Profitability Batch Selesai</span>
          <button className="btn btn-outline" style={{ fontSize: '11px', padding: '4px 8px' }} onClick={() => setActiveTab('settlement')}>
            Lihat Semua Settlement <ArrowUpRight size={13} />
          </button>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Tgl Masuk</th>
                <th>Berat Netto</th>
                <th>Kadar Air %</th>
                <th>Susut %</th>
                <th>Total HPP</th>
                <th>Penerimaan</th>
                <th>Nett Profit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {settlementList.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: '700' }}>{s.batchId}</td>
                  <td>{s.tglMasukPabrik || s.tglSettlement}</td>
                  <td style={{ fontWeight: '700' }}>{s.beratNettoFinalPabrik.toLocaleString('id-ID')} kg</td>
                  <td><span className="badge badge-navy">{s.kadarAirLabPercent || 6.5}%</span></td>
                  <td><span className="badge badge-warning">{s.susutTonasePercent || s.persenSusutPabrik || 0}%</span></td>
                  <td>Rp {s.totalHppBatch.toLocaleString('id-ID')}</td>
                  <td>Rp {s.totalPenerimaanPabrik.toLocaleString('id-ID')}</td>
                  <td style={{ fontWeight: '800', color: '#10B981' }}>+Rp {s.nettProfitMargin.toLocaleString('id-ID')}</td>
                  <td><span className="badge badge-success">Approved</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
