import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteModalProps {
  title: string;
  itemName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  title,
  itemName,
  onConfirm,
  onClose,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '380px', width: '90%', textAlign: 'center', padding: '24px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-10px', marginRight: '-10px' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={onClose}>
            <X size={18} color="#64748B" />
          </button>
        </div>

        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
          <AlertTriangle size={24} />
        </div>

        <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>
          {title}
        </h3>

        <p style={{ fontSize: '12px', color: '#64748B', lineHeight: '1.4', marginBottom: '16px' }}>
          Apakah Anda yakin ingin menghapus <strong style={{ color: '#0F172A' }}>"{itemName}"</strong>?
          <span style={{ display: 'block', fontSize: '10px', color: '#10B981', marginTop: '6px', fontWeight: '600' }}>
            🛡️ Data transaksi/batch terdahulu yang terhubung akan tetap tersimpan secara aman di sistem.
          </span>
        </p>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className="btn btn-outline" style={{ flex: 1, fontSize: '12px' }} onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ flex: 1, background: '#EF4444', borderColor: '#EF4444', fontSize: '12px' }}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Ya, Hapus Data
          </button>
        </div>
      </div>
    </div>
  );
};
