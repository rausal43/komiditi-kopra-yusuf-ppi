import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PanjarModal } from './PanjarModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { Plus, Search, Filter, Trash2, Lock } from 'lucide-react';

interface PanjarModuleProps {
  selectedBatchId?: string;
  onBatchFilterChange?: (batchId: string) => void;
}

export const PanjarModule: React.FC<PanjarModuleProps> = ({
  selectedBatchId: externalBatchId,
  onBatchFilterChange,
}) => {
  const { panjarList, batchList, addPanjar, deletePanjar, canEditOrDelete, activeModal, setActiveModal } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [internalFilterBatch, setInternalFilterBatch] = useState('ALL');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const selectedFilterBatch = externalBatchId !== undefined ? externalBatchId : internalFilterBatch;
  const isModalOpen = activeModal === 'PANJAR';

  const handleFilterChange = (val: string) => {
    if (onBatchFilterChange) {
      onBatchFilterChange(val);
    } else {
      setInternalFilterBatch(val);
    }
  };

  const filteredPanjar = panjarList.filter(p => {
    const matchesSearch =
      p.namaPenerima.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.noKwitansi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBatch = selectedFilterBatch === 'ALL' || p.batchId === selectedFilterBatch;
    return matchesSearch && matchesBatch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Action & Filter Toolbar */}
      <div className="card" style={{ padding: '12px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="#FF5000" />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A' }}>Filter Batch:</span>
            <select
              className="form-select"
              style={{ width: '160px', padding: '6px 10px', fontSize: '11px' }}
              value={selectedFilterBatch}
              onChange={e => handleFilterChange(e.target.value)}
            >
              <option value="ALL">Semua Batch</option>
              {batchList.map(b => (
                <option key={b.id} value={b.id}>{b.id}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Cari No. Kwitansi / Petani..."
                className="form-input"
                style={{ paddingLeft: '28px', width: '160px', padding: '5px 8px 5px 28px', fontSize: '11px' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Search size={13} color="#94A3B8" style={{ position: 'absolute', left: '8px', top: '7px' }} />
            </div>

            <button className="btn btn-primary desktop-only-btn" style={{ fontSize: '11px', padding: '6px 12px' }} onClick={() => setActiveModal('PANJAR')}>
              <Plus size={14} /> + Input Panjar DP
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>No. Kwitansi</th>
                <th>Tgl</th>
                <th>Nama Petani / Penerima</th>
                <th>Nominal DP</th>
                <th>Metode Bayar</th>
                <th>Status Pemotongan</th>
                <th>Aksi / Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPanjar.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: '800', color: '#FF5000' }}>{p.batchId || 'BATCH-08A'}</td>
                  <td style={{ fontWeight: '700' }}>{p.noKwitansi}</td>
                  <td>{p.tgl}</td>
                  <td style={{ fontWeight: '700' }}>{p.namaPenerima}</td>
                  <td style={{ fontWeight: '800', color: '#10B981' }}>Rp {p.nominalDp.toLocaleString('id-ID')}</td>
                  <td><span className="badge badge-navy">{p.bank}</span></td>
                  <td>
                    {p.status === 'Lunas' ? (
                      <span className="badge badge-success">Terpotong Lunas</span>
                    ) : p.status === 'Sisa Pelunasan' ? (
                      <span className="badge badge-warning">Sisa Pelunasan</span>
                    ) : (
                      <span className="badge badge-navy">Belum Lunas</span>
                    )}
                  </td>
                  <td>
                    {canEditOrDelete ? (
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(p.id)}
                        style={{
                          background: '#FEF2F2', border: 'none', borderRadius: '6px',
                          padding: '4px 8px', color: '#EF4444', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '700',
                        }}
                        title="Hapus Panjar DP (Khusus Owner)"
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
          title="Hapus Data Panjar DP"
          itemName={`Panjar ${panjarList.find(p => p.id === deleteTargetId)?.noKwitansi || deleteTargetId}`}
          onConfirm={() => {
            deletePanjar(deleteTargetId);
            setDeleteTargetId(null);
          }}
          onClose={() => setDeleteTargetId(null)}
        />
      )}

      {isModalOpen && (
        <PanjarModal
          initialBatchId={selectedFilterBatch}
          onClose={() => setActiveModal('NONE')}
          onSubmit={data => {
            addPanjar({ ...data, batchId: selectedFilterBatch !== 'ALL' ? selectedFilterBatch : batchList[0]?.id, status: 'Belum Lunas' });
            setActiveModal('NONE');
          }}
        />
      )}
    </div>
  );
};
