import React, { useState, useMemo } from 'react';
import type { BatchShipment } from '../types';
import { X, Search, CheckCircle2 } from 'lucide-react';

interface BatchPickerModalProps {
  batchList: BatchShipment[];
  selectedBatchId: string;
  onSelect: (batchId: string) => void;
  onClose: () => void;
}

export const BatchPickerModal: React.FC<BatchPickerModalProps> = ({
  batchList,
  selectedBatchId,
  onSelect,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AKTIF' | 'SELESAI'>('ALL');

  const filteredBatches = useMemo(() => {
    const list = batchList.filter(b => {
      const matchesSearch =
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.namaBatch.toLowerCase().includes(searchTerm.toLowerCase());

      const isFinished = b.statusMilestone === 'Selesai Pabrik';
      const matchesStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'AKTIF'
          ? !isFinished
          : isFinished;

      return matchesSearch && matchesStatus;
    });

    return [...list].sort((a, b) => b.id.localeCompare(a.id));
  }, [batchList, searchTerm, statusFilter]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-drag-handle" />
        <div className="modal-header">
          <div className="modal-title">Pilih Batch Pengiriman ({batchList.length})</div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={onClose}>
            <X size={18} color="#64748B" />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Cari Kode Batch atau Nama..."
            style={{ paddingLeft: '34px', fontSize: '12px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            autoFocus
          />
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
        </div>

        {/* Status Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
          <button
            type="button"
            className={`badge ${statusFilter === 'ALL' ? 'badge-orange' : 'badge-navy'}`}
            style={{ cursor: 'pointer', padding: '6px 12px', border: 'none' }}
            onClick={() => setStatusFilter('ALL')}
          >
            Semua ({batchList.length})
          </button>
          <button
            type="button"
            className={`badge ${statusFilter === 'AKTIF' ? 'badge-orange' : 'badge-navy'}`}
            style={{ cursor: 'pointer', padding: '6px 12px', border: 'none' }}
            onClick={() => setStatusFilter('AKTIF')}
          >
            Berjalan ({batchList.filter(b => b.statusMilestone !== 'Selesai Pabrik').length})
          </button>
          <button
            type="button"
            className={`badge ${statusFilter === 'SELESAI' ? 'badge-orange' : 'badge-navy'}`}
            style={{ cursor: 'pointer', padding: '6px 12px', border: 'none' }}
            onClick={() => setStatusFilter('SELESAI')}
          >
            Selesai ({batchList.filter(b => b.statusMilestone === 'Selesai Pabrik').length})
          </button>
        </div>

        {/* Batch List Options */}
        <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredBatches.map(b => {
            const isSelected = b.id === selectedBatchId;
            return (
              <div
                key={b.id}
                onClick={() => {
                  onSelect(b.id);
                  onClose();
                }}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: isSelected ? '2px solid #FF5000' : '1px solid #E2E8F0',
                  background: isSelected ? 'var(--brand-orange-light)' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '800', fontSize: '13px', color: '#FF5000' }}>{b.id}</span>
                    <span className="badge badge-success" style={{ fontSize: '9px' }}>{b.statusMilestone}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#0F172A', fontWeight: '700', marginTop: '2px' }}>{b.namaBatch}</div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>
                    Modal Usaha: <strong>Rp {(b.modalAwalBatch || 150000000).toLocaleString('id-ID')}</strong> ({b.sumberAkunDana || 'BRI'})
                  </div>
                </div>

                {isSelected && <CheckCircle2 size={18} color="#FF5000" />}
              </div>
            );
          })}

          {filteredBatches.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '12px' }}>
              Tidak ada Batch yang sesuai pencarian.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
