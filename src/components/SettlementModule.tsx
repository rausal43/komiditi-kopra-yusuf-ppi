import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SettlementModal } from './SettlementModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { Building2, Plus, Filter, DollarSign, Award, TrendingUp, Paperclip, Trash2, Lock } from 'lucide-react';

export const SettlementModule: React.FC = () => {
  const { settlementList, batchList, addSettlement, deleteSettlement, canEditOrDelete, activeModal, setActiveModal } = useApp();
  const [selectedFilterBatch, setSelectedFilterBatch] = useState('ALL');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const isModalOpen = activeModal === 'SETTLEMENT';

  const filteredSettlement = settlementList.filter(s => {
    return selectedFilterBatch === 'ALL' || s.batchId === selectedFilterBatch;
  });

  const totalPenerimaan = filteredSettlement.reduce((acc, curr) => acc + curr.totalPenerimaanPabrik, 0);
  const totalProfit = filteredSettlement.reduce((acc, curr) => acc + curr.nettProfitMargin, 0);
  const avgKadarAir = (filteredSettlement.reduce((acc, curr) => acc + (curr.kadarAirLabPercent || 0), 0) / (filteredSettlement.length || 1)).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header Bar */}
      <div className="card" style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 color="#FF5000" size={18} /> Serah Terima & Settlement Pabrik Bitung
          </h2>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={13} color="#FF5000" />
              <select
                className="form-select"
                style={{ width: '140px', padding: '6px 8px', fontSize: '11px' }}
                value={selectedFilterBatch}
                onChange={e => setSelectedFilterBatch(e.target.value)}
              >
                <option value="ALL">Semua Batch</option>
                {batchList.map(b => (
                  <option key={b.id} value={b.id}>{b.id}</option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary desktop-only-btn" style={{ padding: '7px 14px', fontSize: '11px' }} onClick={() => setActiveModal('SETTLEMENT')}>
              <Plus size={14} /> + Settlement
            </button>
          </div>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid-3">
        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <DollarSign size={12} color="#10B981" /> Total Penerimaan Pabrik
          </div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>
            Rp {totalPenerimaan.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Award size={12} color="#FF5000" /> Rata-Rata Kadar Air Lab
          </div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#FF5000', marginTop: '4px' }}>
            {avgKadarAir}%
          </div>
        </div>

        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} color="#10B981" /> Total Nett Profit Margin
          </div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#10B981', marginTop: '4px' }}>
            Rp {totalProfit.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Table Data */}
      <div className="card">
        <div className="card-title">
          <span>Daftar Transaksi Settlement Pabrik ({filteredSettlement.length})</span>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID Settlement</th>
                <th>Batch Terikat</th>
                <th>Tanggal</th>
                <th>Penimbangan Pabrik</th>
                <th>Netto Final Pabrik</th>
                <th>Kadar Air Lab %</th>
                <th>Harga / kg</th>
                <th>Penerimaan Total</th>
                <th>Nett Profit</th>
                <th>Nota</th>
                <th>Aksi / Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSettlement.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: '800', color: '#FF5000' }}>{s.id}</td>
                  <td><span className="badge badge-navy">{s.batchId}</span></td>
                  <td>{s.tglSettlement || '2026-08-09'}</td>
                  <td>{s.beratGrossPabrik.toLocaleString('id-ID')} kg</td>
                  <td style={{ fontWeight: '700' }}>{s.beratNettoFinalPabrik.toLocaleString('id-ID')} kg</td>
                  <td><span className="badge badge-warning">{s.kadarAirLabPercent || 6.5}%</span></td>
                  <td>Rp {s.hargaAcuanPabrik.toLocaleString('id-ID')}</td>
                  <td style={{ fontWeight: '800', color: '#0F172A' }}>Rp {s.totalPenerimaanPabrik.toLocaleString('id-ID')}</td>
                  <td style={{ fontWeight: '800', color: s.nettProfitMargin >= 0 ? '#10B981' : '#EF4444' }}>
                    Rp {s.nettProfitMargin.toLocaleString('id-ID')}
                  </td>
                  <td>
                    {(s.fotoNotaTimbangPabrik || s.lampiranNotaPabrikUrl) ? (
                      <span title="Foto nota timbang tersedia" style={{ cursor: 'pointer' }}>
                        <Paperclip size={14} color="#10B981" />
                      </span>
                    ) : (
                      <span style={{ color: '#CBD5E1', fontSize: '10px' }}>-</span>
                    )}
                  </td>
                  <td>
                    {canEditOrDelete ? (
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(s.id)}
                        style={{
                          background: '#FEF2F2', border: 'none', borderRadius: '6px',
                          padding: '4px 8px', color: '#EF4444', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '700',
                        }}
                        title="Hapus Settlement (Khusus Owner)"
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    ) : (
                      <span style={{ fontSize: '10px', color: '#94A3B8', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: '600' }} title="Tersimpan - Tidak dapat diubah oleh Logistik">
                        <Lock size={11} color="#64748B" /> Tersimpan
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTargetId && (
        <ConfirmDeleteModal
          title="Hapus Settlement Pabrik"
          itemName={`Settlement ${deleteTargetId}`}
          onConfirm={() => {
            deleteSettlement(deleteTargetId);
            setDeleteTargetId(null);
          }}
          onClose={() => setDeleteTargetId(null)}
        />
      )}

      {isModalOpen && (
        <SettlementModal
          onClose={() => setActiveModal('NONE')}
          onSubmit={data => { addSettlement(data); setActiveModal('NONE'); }}
        />
      )}
    </div>
  );
};
