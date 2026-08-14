import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BatchModal } from './BatchModal';
import { BatchPickerModal } from './BatchPickerModal';
import { BatchMasterTable } from './BatchMasterTable';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { Plus, Target, PieChart, ChevronDown, Ship, Warehouse, CreditCard, X } from 'lucide-react';

export const BatchSettingModule: React.FC = () => {
  const {
    batchList, timbanganList, addBatch, activeModal, setActiveModal,
    daftarAkunOwner, addAkunOwner, deleteAkunOwner,
    daftarKapal, addKapal, deleteKapal,
    daftarGudang, addGudang, deleteGudang, canEditOrDelete
  } = useApp();

  const [selectedBatchId, setSelectedBatchId] = useState(batchList[0]?.id || '');
  const [showBatchPickerModal, setShowBatchPickerModal] = useState(false);
  const [newAkunInput, setNewAkunInput] = useState('');
  const [newKapalInput, setNewKapalInput] = useState('');
  const [newGudangInput, setNewGudangInput] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'rekening' | 'kapal' | 'gudang'; name: string } | null>(null);

  const activeBatch = batchList.find(b => b.id === selectedBatchId) || batchList[0];
  const isBatchModalOpen = activeModal === 'BATCH';

  const modalAwal = activeBatch?.modalAwalBatch || 150000000;
  const totalBeliBatch = timbanganList.filter(t => t.batchId === activeBatch?.id).reduce((acc, curr) => acc + curr.totalNominalBeli, 0);
  const modalTerpakaiPercent = Math.min(100, Math.round((totalBeliBatch / modalAwal) * 100));
  const tonaseTerkumpulKg = activeBatch?.beratSekely || 10240;
  const tonasePercent = Math.min(100, Math.round((tonaseTerkumpulKg / (activeBatch?.targetTonase || 10500)) * 100));

  const handleConfirmDelete = () => {
    if (!deleteTarget || !canEditOrDelete) return;
    if (deleteTarget.type === 'rekening') deleteAkunOwner(deleteTarget.name);
    else if (deleteTarget.type === 'kapal') deleteKapal(deleteTarget.name);
    else if (deleteTarget.type === 'gudang') deleteGudang(deleteTarget.name);
    setDeleteTarget(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div className="desktop-only-btn" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
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

      {/* Master CRUD Cards with Custom Delete Modal */}
      <div className="grid-3">
        <div className="card">
          <div className="card-title" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '800' }}>
              <CreditCard size={13} color="#10B981" /> Master Rekening Owner
            </span>
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {daftarAkunOwner.map(a => (
              <span key={a} className="badge badge-navy" style={{ padding: '3px 8px', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>{a}</span>
                {canEditOrDelete && (
                  <X size={11} style={{ cursor: 'pointer' }} onClick={() => setDeleteTarget({ type: 'rekening', name: a })} />
                )}
              </span>
            ))}
          </div>
          <form onSubmit={e => { e.preventDefault(); if (newAkunInput.trim()) { addAkunOwner(newAkunInput.trim()); setNewAkunInput(''); } }} style={{ display: 'flex', gap: '4px' }}>
            <input type="text" className="form-input" style={{ padding: '4px 6px', fontSize: '10px' }} placeholder="Tambah Rekening..." value={newAkunInput} onChange={e => setNewAkunInput(e.target.value)} />
            <button type="submit" className="btn btn-primary" style={{ fontSize: '10px', padding: '4px 6px', flexShrink: 0 }}>+ Tambah</button>
          </form>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '800' }}>
              <Ship size={13} color="#FF5000" /> Master Nama Kapal
            </span>
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {daftarKapal.map(k => (
              <span key={k} className="badge badge-orange" style={{ padding: '3px 8px', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>{k}</span>
                {canEditOrDelete && (
                  <X size={11} style={{ cursor: 'pointer' }} onClick={() => setDeleteTarget({ type: 'kapal', name: k })} />
                )}
              </span>
            ))}
          </div>
          <form onSubmit={e => { e.preventDefault(); if (newKapalInput.trim()) { addKapal(newKapalInput.trim()); setNewKapalInput(''); } }} style={{ display: 'flex', gap: '4px' }}>
            <input type="text" className="form-input" style={{ padding: '4px 6px', fontSize: '10px' }} placeholder="Tambah Kapal..." value={newKapalInput} onChange={e => setNewKapalInput(e.target.value)} />
            <button type="submit" className="btn btn-primary" style={{ fontSize: '10px', padding: '4px 6px', flexShrink: 0 }}>+ Tambah</button>
          </form>
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '800' }}>
              <Warehouse size={13} color="#0EA5E9" /> Master Lokasi Gudang
            </span>
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
            {daftarGudang.map(g => (
              <span key={g} className="badge badge-navy" style={{ padding: '3px 8px', fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span>{g}</span>
                {canEditOrDelete && (
                  <X size={11} style={{ cursor: 'pointer' }} onClick={() => setDeleteTarget({ type: 'gudang', name: g })} />
                )}
              </span>
            ))}
          </div>
          <form onSubmit={e => { e.preventDefault(); if (newGudangInput.trim()) { addGudang(newGudangInput.trim()); setNewGudangInput(''); } }} style={{ display: 'flex', gap: '4px' }}>
            <input type="text" className="form-input" style={{ padding: '4px 6px', fontSize: '10px' }} placeholder="Tambah Gudang..." value={newGudangInput} onChange={e => setNewGudangInput(e.target.value)} />
            <button type="submit" className="btn btn-outline" style={{ fontSize: '10px', padding: '4px 6px', flexShrink: 0 }}>+ Tambah</button>
          </form>
        </div>
      </div>

      {showBatchPickerModal && (
        <BatchPickerModal
          batchList={batchList}
          selectedBatchId={selectedBatchId}
          onSelect={id => { setSelectedBatchId(id); setShowBatchPickerModal(false); }}
          onClose={() => setShowBatchPickerModal(false)}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          title={`Hapus ${deleteTarget.type === 'rekening' ? 'Rekening' : deleteTarget.type === 'kapal' ? 'Kapal' : 'Gudang'}`}
          itemName={deleteTarget.name}
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {isBatchModalOpen && (
        <BatchModal onClose={() => setActiveModal('NONE')} onSubmit={data => { addBatch(data); setActiveModal('NONE'); }} />
      )}
    </div>
  );
};
