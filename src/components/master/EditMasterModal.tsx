import React from 'react';
import { X } from 'lucide-react';

interface EditMasterModalProps {
  editingTarget: { type: 'rekening' | 'kapal' | 'gudang'; oldName: string };
  editValue: string;
  onEditValueChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const EditMasterModal: React.FC<EditMasterModalProps> = ({
  editingTarget,
  editValue,
  onEditValueChange,
  onSubmit,
  onClose,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '380px' }}>
        <div className="modal-header">
          <div className="modal-title">
            Ubah Nama {editingTarget.type === 'rekening' ? 'Rekening Owner' : editingTarget.type === 'kapal' ? 'Kapal' : 'Gudang'}
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={onClose}>
            <X size={18} color="#64748B" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="form-group" style={{ marginBottom: '14px' }}>
            <label className="form-label">Nama Master Baru</label>
            <input
              type="text"
              className="form-input"
              value={editValue}
              onChange={e => onEditValueChange(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '8px', padding: '8px 10px', marginBottom: '16px', fontSize: '10px', color: '#92400E' }}>
            ℹ️ <strong>Proteksi Riwayat Transaksi:</strong> Perubahan nama ini hanya akan berlaku pada pilihan input transaksi baru. Riwayat transaksi & batch lama yang sudah tersimpan <strong>TIDAK akan berubah</strong>.
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
