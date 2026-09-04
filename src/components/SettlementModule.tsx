import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SettlementModal } from './SettlementModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { ImagePreviewModal } from './ImagePreviewModal';
import { PaginationControl } from './PaginationControl';
import { BatchFilterSelect } from './common/BatchFilterSelect';
import { Plus, Building2, TrendingUp, DollarSign, Award, Trash2, Edit, Lock, Paperclip } from 'lucide-react';
import type { SettlementPabrik } from '../types';

export const SettlementModule: React.FC = () => {
  const { settlementList, batchList, addSettlement, updateSettlement, deleteSettlement, canEditOrDelete, activeModal, setActiveModal } = useApp();
  const [selectedFilterBatch, setSelectedFilterBatch] = useState('ALL');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [editingSettlement, setEditingSettlement] = useState<SettlementPabrik | null>(null);
  const [displayLimit, setDisplayLimit] = useState<number>(5);

  const isModalOpen = activeModal === 'SETTLEMENT';

  const filteredSettlement = settlementList
    .filter(s => selectedFilterBatch === 'ALL' || s.batchId === selectedFilterBatch)
    .sort((a, b) => (b.id || '').localeCompare(a.id || ''));

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
            <BatchFilterSelect
              batchList={batchList}
              selectedBatchId={selectedFilterBatch}
              onChange={setSelectedFilterBatch}
              width="140px"
              showLabel={false}
            />

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
              {filteredSettlement.slice(0, displayLimit).map(s => (
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
                      <button
                        type="button"
                        onClick={() => setPreviewImageUrl(s.fotoNotaTimbangPabrik || s.lampiranNotaPabrikUrl || '')}
                        style={{
                          background: 'rgba(16, 185, 129, 0.1)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          color: '#10B981',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '10px',
                          fontWeight: '700',
                        }}
                        title="Klik untuk lihat foto nota timbang pabrik"
                      >
                        <Paperclip size={13} color="#10B981" />
                        <span>Lihat Nota</span>
                      </button>
                    ) : (
                      <span style={{ color: '#CBD5E1', fontSize: '10px' }}>-</span>
                    )}
                  </td>
                  <td>
                    {canEditOrDelete ? (
                      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setEditingSettlement(s)}
                          style={{
                            background: '#EFF6FF', border: 'none', borderRadius: '6px',
                            padding: '4px 8px', color: '#2563EB', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '700',
                          }}
                          title="Edit Settlement (Khusus Owner)"
                        >
                          <Edit size={12} /> Edit
                        </button>
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
                      </div>
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

      <PaginationControl
        currentCount={Math.min(displayLimit, filteredSettlement.length)}
        totalCount={filteredSettlement.length}
        pageSize={5}
        onLoadMore={() => setDisplayLimit(prev => prev + 5)}
        onReset={() => setDisplayLimit(5)}
      />

      {previewImageUrl && (
        <ImagePreviewModal
          imageUrl={previewImageUrl}
          title="Nota Timbang Pabrik"
          onClose={() => setPreviewImageUrl(null)}
        />
      )}

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

      {editingSettlement && (
        <SettlementModal
          initialSettlement={editingSettlement}
          onClose={() => setEditingSettlement(null)}
          onSubmit={data => {
            updateSettlement(editingSettlement.id, data);
            setEditingSettlement(null);
          }}
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
