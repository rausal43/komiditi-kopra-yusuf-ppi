import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BatchPickerModal } from './BatchPickerModal';
import { BatchMasterTable } from './BatchMasterTable';
import { BatchModal } from './BatchModal';
import { EditMasterModal } from './master/EditMasterModal';
import { MasterDataTable } from './master/MasterDataTable';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { Database, CreditCard, Ship, Warehouse, Lock, Plus } from 'lucide-react';

export const MasterModule: React.FC = () => {
  const {
    activeRole, batchList, addBatch, activeModal, setActiveModal,
    daftarAkunOwner, addAkunOwner, editAkunOwner, deleteAkunOwner,
    daftarKapal, addKapal, editKapal, deleteKapal,
    daftarGudang, addGudang, editGudang, deleteGudang, canEditOrDelete
  } = useApp();

  const [activeMasterTab, setActiveMasterTab] = useState<'rekening' | 'kapal' | 'gudang'>('rekening');
  const [selectedBatchId, setSelectedBatchId] = useState(batchList[0]?.id || '');
  const [showBatchPickerModal, setShowBatchPickerModal] = useState(false);

  const [newAkunInput, setNewAkunInput] = useState('');
  const [newKapalInput, setNewKapalInput] = useState('');
  const [newGudangInput, setNewGudangInput] = useState('');

  // Edit & Delete modal states
  const [editingTarget, setEditingTarget] = useState<{ type: 'rekening' | 'kapal' | 'gudang'; oldName: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'rekening' | 'kapal' | 'gudang'; name: string } | null>(null);

  const currentRole = activeRole || 'owner';
  const isOwner = currentRole.toLowerCase() === 'owner';
  const isBatchModalOpen = activeModal === 'BATCH';

  if (!isOwner) {
    return (
      <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
          }}
        >
          <Lock size={24} />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>Akses Terbatas (Owner Only)</h3>
        <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
          Halaman Master Data & Pengaturan Operasional hanya dapat diakses oleh akun dengan peran Owner.
        </p>
      </div>
    );
  }

  const handleStartEdit = (type: 'rekening' | 'kapal' | 'gudang', oldName: string) => {
    setEditingTarget({ type, oldName });
    setEditValue(oldName);
  };

  const handleConfirmEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTarget || !editValue.trim() || !canEditOrDelete) return;

    if (editingTarget.type === 'rekening') editAkunOwner(editingTarget.oldName, editValue.trim());
    else if (editingTarget.type === 'kapal') editKapal(editingTarget.oldName, editValue.trim());
    else if (editingTarget.type === 'gudang') editGudang(editingTarget.oldName, editValue.trim());

    setEditingTarget(null);
    setEditValue('');
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget || !canEditOrDelete) return;
    if (deleteTarget.type === 'rekening') deleteAkunOwner(deleteTarget.name);
    else if (deleteTarget.type === 'kapal') deleteKapal(deleteTarget.name);
    else if (deleteTarget.type === 'gudang') deleteGudang(deleteTarget.name);
    setDeleteTarget(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header Banner */}
      <div className="card" style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="badge badge-orange" style={{ marginBottom: '4px' }}>Khusus Akses Owner</span>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Database size={18} color="#FF5000" /> Master Data & Operasional Kopra
            </h2>
          </div>

          <div className="desktop-only-btn">
            <button
              className="btn btn-primary"
              style={{ borderRadius: '99px', padding: '8px 16px', fontSize: '11px' }}
              onClick={() => setActiveModal('BATCH')}
            >
              <Plus size={15} /> Buat Batch Baru
            </button>
          </div>
        </div>
      </div>

      {/* Master Data Tab Selector Bar */}
      <div className="card" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="role-switcher-badge" style={{ background: '#F1F5F9' }}>
            <button
              className={`role-btn ${activeMasterTab === 'rekening' ? 'active' : ''}`}
              style={{ color: activeMasterTab === 'rekening' ? '#FFF' : '#0F172A', padding: '6px 14px', fontSize: '11px', fontWeight: '800' }}
              onClick={() => setActiveMasterTab('rekening')}
            >
              <CreditCard size={13} style={{ marginRight: '4px' }} /> Rekening Owner ({daftarAkunOwner.length})
            </button>
            <button
              className={`role-btn ${activeMasterTab === 'kapal' ? 'active' : ''}`}
              style={{ color: activeMasterTab === 'kapal' ? '#FFF' : '#0F172A', padding: '6px 14px', fontSize: '11px', fontWeight: '800' }}
              onClick={() => setActiveMasterTab('kapal')}
            >
              <Ship size={13} style={{ marginRight: '4px' }} /> Nama Kapal ({daftarKapal.length})
            </button>
            <button
              className={`role-btn ${activeMasterTab === 'gudang' ? 'active' : ''}`}
              style={{ color: activeMasterTab === 'gudang' ? '#FFF' : '#0F172A', padding: '6px 14px', fontSize: '11px', fontWeight: '800' }}
              onClick={() => setActiveMasterTab('gudang')}
            >
              <Warehouse size={13} style={{ marginRight: '4px' }} /> Lokasi Gudang ({daftarGudang.length})
            </button>
          </div>
        </div>
      </div>

      {/* Clean Generic Master Data Table with Full CRUD */}
      {activeMasterTab === 'rekening' && (
        <MasterDataTable
          title="Tabel Master Rekening Owner"
          icon={CreditCard}
          iconColor="#10B981"
          items={daftarAkunOwner}
          inputValue={newAkunInput}
          inputPlaceholder="Tambah Rekening Bank..."
          categoryBadgeText="Operasional Owner"
          categoryBadgeClass="badge-navy"
          statusBadgeText="Aktif"
          canEditOrDelete={canEditOrDelete}
          onInputChange={setNewAkunInput}
          onAdd={e => {
            e.preventDefault();
            if (newAkunInput.trim()) {
              addAkunOwner(newAkunInput.trim());
              setNewAkunInput('');
            }
          }}
          onStartEdit={name => handleStartEdit('rekening', name)}
          onDelete={name => setDeleteTarget({ type: 'rekening', name })}
        />
      )}

      {activeMasterTab === 'kapal' && (
        <MasterDataTable
          title="Tabel Master Nama Kapal"
          icon={Ship}
          iconColor="#FF5000"
          items={daftarKapal}
          inputValue={newKapalInput}
          inputPlaceholder="Tambah Nama Kapal..."
          categoryBadgeText="Tobelo - Bitung"
          categoryBadgeClass="badge-orange"
          statusBadgeText="Siap Berlayar"
          canEditOrDelete={canEditOrDelete}
          onInputChange={setNewKapalInput}
          onAdd={e => {
            e.preventDefault();
            if (newKapalInput.trim()) {
              addKapal(newKapalInput.trim());
              setNewKapalInput('');
            }
          }}
          onStartEdit={name => handleStartEdit('kapal', name)}
          onDelete={name => setDeleteTarget({ type: 'kapal', name })}
        />
      )}

      {activeMasterTab === 'gudang' && (
        <MasterDataTable
          title="Tabel Master Lokasi Gudang"
          icon={Warehouse}
          iconColor="#0EA5E9"
          items={daftarGudang}
          inputValue={newGudangInput}
          inputPlaceholder="Tambah Lokasi Gudang..."
          categoryBadgeText="Sourcing Lapangan"
          categoryBadgeClass="badge-navy"
          statusBadgeText="Aktif Beroperasi"
          canEditOrDelete={canEditOrDelete}
          onInputChange={setNewGudangInput}
          onAdd={e => {
            e.preventDefault();
            if (newGudangInput.trim()) {
              addGudang(newGudangInput.trim());
              setNewGudangInput('');
            }
          }}
          onStartEdit={name => handleStartEdit('gudang', name)}
          onDelete={name => setDeleteTarget({ type: 'gudang', name })}
        />
      )}

      {/* Batch Operations Table */}
      <BatchMasterTable
        batchList={batchList}
        selectedBatchId={selectedBatchId}
        onSelectBatch={id => setSelectedBatchId(id)}
      />

      {/* Edit Master Modal */}
      {editingTarget && (
        <EditMasterModal
          editingTarget={editingTarget}
          editValue={editValue}
          onEditValueChange={setEditValue}
          onSubmit={handleConfirmEdit}
          onClose={() => setEditingTarget(null)}
        />
      )}

      {showBatchPickerModal && (
        <BatchPickerModal
          batchList={batchList}
          selectedBatchId={selectedBatchId}
          onSelect={id => {
            setSelectedBatchId(id);
            setShowBatchPickerModal(false);
          }}
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
        <BatchModal
          onClose={() => setActiveModal('NONE')}
          onSubmit={data => {
            addBatch(data);
            setActiveModal('NONE');
          }}
        />
      )}
    </div>
  );
};
