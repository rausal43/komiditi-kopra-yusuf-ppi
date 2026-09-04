import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BatchModal } from './BatchModal';
import { BatchPickerModal } from './BatchPickerModal';
import { BatchMasterTable } from './BatchMasterTable';
import { Plus, Target, PieChart, ChevronDown, Edit } from 'lucide-react';
import type { BatchShipment } from '../types';

export const BatchSettingModule: React.FC = () => {
  const { batchList, timbanganList, addBatch, updateBatch, canEditOrDelete, activeModal, setActiveModal } = useApp();

  const [selectedBatchId, setSelectedBatchId] = useState(batchList[0]?.id || '');
  const [showBatchPickerModal, setShowBatchPickerModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<BatchShipment | null>(null);

  const activeBatch = batchList.find(b => b.id === selectedBatchId) || batchList[0];
  const isBatchModalOpen = activeModal === 'BATCH';

  const modalAwal = activeBatch?.modalAwalBatch || 150000000;
  const totalBeliBatch = timbanganList.filter(t => t.batchId === activeBatch?.id).reduce((acc, curr) => acc + curr.totalNominalBeli, 0);
  const modalTerpakaiPercent = Math.min(100, Math.round((totalBeliBatch / modalAwal) * 100));
  const tonaseTerkumpulKg = activeBatch?.beratSekely || 10240;
  const tonasePercent = Math.min(100, Math.round((tonaseTerkumpulKg / (activeBatch?.targetTonase || 10500)) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div className="desktop-only-btn" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '4px' }}>
        {canEditOrDelete && activeBatch && (
          <button className="btn btn-outline" style={{ borderRadius: '99px', padding: '8px 16px', fontSize: '11px' }} onClick={() => setEditingBatch(activeBatch)}>
            <Edit size={14} /> Edit Batch Terpilih
          </button>
        )}
        <button className="btn btn-primary" style={{ borderRadius: '99px', padding: '8px 16px' }} onClick={() => setActiveModal('BATCH')}>
          <Plus size={15} /> Buat Batch Baru
        </button>
      </div>

      {activeBatch && (
        <div className="grid-2">
          <div className="card card-orange-hero">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <button
                  type="button"
                  onClick={() => setShowBatchPickerModal(true)}
                  style={{ background: 'rgba(255, 255, 255, 0.18)', border: '1px solid rgba(255, 255, 255, 0.3)', borderRadius: '99px', padding: '3px 10px', color: '#FFFFFF', fontSize: '10px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}
                >
                  <span>PILIH BATCH: {activeBatch.id}</span>
                  <ChevronDown size={13} color="#FFFFFF" />
                </button>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>{activeBatch.namaBatch}</div>
              </div>
              <div className="circular-ring-container">
                <svg width="42" height="42" viewBox="0 0 36 36">
                  <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="3.5" fill="none" />
                  <path className="ring-fill" strokeDasharray={`${tonasePercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#FFFFFF" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                </svg>
                <span className="ring-text" style={{ color: '#FFFFFF' }}>{tonasePercent}%</span>
              </div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.18)', borderRadius: '12px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '10px', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Target size={12} color="#FFFFFF" /> Tonase: <strong>{(tonaseTerkumpulKg / 1000).toFixed(1)} Ton</strong>
              </span>
              <span className="badge" style={{ background: '#FFFFFF', color: '#FF5000', fontWeight: '800' }}>{activeBatch.statusMilestone}</span>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748B' }}>MODAL USAHA BATCH</div>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>Rp {modalAwal.toLocaleString('id-ID')}</div>
              </div>
              <div className="circular-ring-container">
                <svg width="42" height="42" viewBox="0 0 36 36">
                  <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#E2E8F0" strokeWidth="3.5" fill="none" />
                  <path className="ring-fill" strokeDasharray={`${modalTerpakaiPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#10B981" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                </svg>
                <span className="ring-text" style={{ color: '#0F172A' }}>{modalTerpakaiPercent}%</span>
              </div>
            </div>
            <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontSize: '10px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                <PieChart size={12} color="#10B981" /> Beli: <strong style={{ color: '#0F172A', whiteSpace: 'nowrap' }}>Rp {totalBeliBatch.toLocaleString('id-ID')}</strong>
              </span>
              <span className="badge badge-navy" style={{ whiteSpace: 'nowrap', fontSize: '10px' }}>{activeBatch.sumberAkunDana || 'BRI'}</span>
            </div>
          </div>
        </div>
      )}

      <BatchMasterTable batchList={batchList} selectedBatchId={selectedBatchId} onSelectBatch={id => setSelectedBatchId(id)} />

      {showBatchPickerModal && (
        <BatchPickerModal
          batchList={batchList}
          selectedBatchId={selectedBatchId}
          onSelect={id => { setSelectedBatchId(id); setShowBatchPickerModal(false); }}
          onClose={() => setShowBatchPickerModal(false)}
        />
      )}

      {editingBatch && (
        <BatchModal
          initialBatch={editingBatch}
          onClose={() => setEditingBatch(null)}
          onSubmit={data => {
            updateBatch(editingBatch.id, data);
            setEditingBatch(null);
          }}
        />
      )}

      {isBatchModalOpen && (
        <BatchModal onClose={() => setActiveModal('NONE')} onSubmit={data => { addBatch(data); setActiveModal('NONE'); }} />
      )}
    </div>
  );
};
