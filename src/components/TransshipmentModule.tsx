import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransshipmentModal } from './TransshipmentModal';
import { BatchPickerModal } from './BatchPickerModal';
import { BatchModal } from './BatchModal';
import type { MilestoneStatus } from '../types';
import { Plus, ChevronDown, Ship, MapPin } from 'lucide-react';

export const TransshipmentModule: React.FC = () => {
  const { batchList, addBatch, updateBatchMilestone, activeModal, setActiveModal } = useApp();
  const [selectedBatchId, setSelectedBatchId] = useState(batchList[0]?.id || '');
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showBatchPickerModal, setShowBatchPickerModal] = useState(false);

  const activeBatch = batchList.find(b => b.id === selectedBatchId) || batchList[0];
  const isBatchModalOpen = activeModal === 'BATCH';
  const isTransshipmentModalOpen = activeModal === 'TRANSSHIPMENT' || showMilestoneModal;

  const milestones: { key: MilestoneStatus; label: string }[] = [
    { key: 'Gudang Sekely' as MilestoneStatus, label: 'Gudang' },
    { key: 'Loading Feeder' as MilestoneStatus, label: 'Loading Feeder' },
    { key: 'Pelayaran Kapal' as MilestoneStatus, label: 'Pelayaran Kapal' },
    { key: 'Unloading Bitung' as MilestoneStatus, label: 'Unloading' },
  ];

  const milestoneKeys = milestones.map(m => m.key);
  const currentStepIndex = milestoneKeys.indexOf(activeBatch?.statusMilestone || 'Gudang Sekely');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header Bar */}
      <div className="card" style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Ship size={18} color="#FF5000" /> Milestone Tracking Pelayaran Kapal
          </h2>

          <button className="btn btn-primary desktop-only-btn" style={{ borderRadius: '99px', padding: '8px 16px' }} onClick={() => setActiveModal('BATCH')}>
            <Plus size={15} /> Buat Batch Baru
          </button>
        </div>
      </div>

      {/* Active Batch Card */}
      {activeBatch && (
        <div className="card">
          <div className="card-title" style={{ marginBottom: '10px' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: '4px 10px', fontSize: '11px', fontWeight: '800', color: '#FF5000' }}
              onClick={() => setShowBatchPickerModal(true)}
            >
              <span>PILIH BATCH: {activeBatch.id}</span>
              <ChevronDown size={14} />
            </button>
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '14px' }}>{activeBatch.namaBatch}</h3>

          {/* Stepper Tracker with Exact Milestone Labels: Gudang, Loading Feeder, Pelayaran Kapal, Unloading */}
          <div className="milestone-tracker">
            {milestones.map((m, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isActive = idx === currentStepIndex;
              const statusClass = isCompleted ? 'completed' : isActive ? 'active' : '';

              return (
                <div key={m.label} className={`milestone-step ${statusClass}`}>
                  <div className="milestone-circle">{idx + 1}</div>
                  <div className="milestone-name">{m.label}</div>
                </div>
              );
            })}
          </div>

          {/* Location & Cost Details Box */}
          <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748B', fontWeight: '700' }}>
              <MapPin size={14} color="#0EA5E9" /> Lokasi Terkini Batch
            </div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>{activeBatch.lokasiSaatIni}</div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Berat Gudang Sekely</div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#FF5000' }}>{(activeBatch.beratSekely / 1000).toFixed(2)} Ton</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Total Biaya Shipping</div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#10B981' }}>
                  Rp {(
                    activeBatch.biayaUpahPanggul +
                    activeBatch.biayaSewaFeeder +
                    activeBatch.biayaFreightSabuk +
                    activeBatch.biayaUangJalan +
                    activeBatch.biayaTruckingBitung +
                    activeBatch.biayaAdminBriLink
                  ).toLocaleString('id-ID')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBatchPickerModal && (
        <BatchPickerModal
          batchList={batchList}
          selectedBatchId={selectedBatchId}
          onSelect={id => { setSelectedBatchId(id); setShowBatchPickerModal(false); }}
          onClose={() => setShowBatchPickerModal(false)}
        />
      )}

      {isTransshipmentModalOpen && activeBatch && (
        <TransshipmentModal
          milestones={milestones}
          onClose={() => { setActiveModal('NONE'); setShowMilestoneModal(false); }}
          onSubmit={(status, lokasi) => {
            updateBatchMilestone(activeBatch.id, status, lokasi);
            setActiveModal('NONE');
            setShowMilestoneModal(false);
          }}
        />
      )}

      {isBatchModalOpen && (
        <BatchModal onClose={() => setActiveModal('NONE')} onSubmit={data => { addBatch(data); setActiveModal('NONE'); }} />
      )}
    </div>
  );
};
