import React, { useState } from 'react';
import type { PanjarDP } from '../types';
import { X, Search, CheckCircle2 } from 'lucide-react';

interface PanjarPickerModalProps {
  panjarList: PanjarDP[];
  selectedPanjarId: string;
  onSelect: (panjar: PanjarDP | null) => void;
  onClose: () => void;
}

export const PanjarPickerModal: React.FC<PanjarPickerModalProps> = ({
  panjarList,
  selectedPanjarId,
  onSelect,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPanjars = panjarList.filter(p => {
    return (
      p.namaPenerima.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.noKwitansi.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-drag-handle" />
        <div className="modal-header">
          <div className="modal-title">Pilih Potongan Panjar (DP) Petani</div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={onClose}>
            <X size={18} color="#64748B" />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Cari Kwitansi atau Nama Petani..."
            style={{ paddingLeft: '34px', fontSize: '12px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            autoFocus
          />
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
        </div>

        <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Option: Tanpa Potongan DP */}
          <div
            onClick={() => {
              onSelect(null);
              onClose();
            }}
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              border: selectedPanjarId === '' ? '2px solid #FF5000' : '1px solid #E2E8F0',
              background: selectedPanjarId === '' ? 'var(--brand-orange-light)' : '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: '800', fontSize: '12px', color: '#0F172A' }}>-- Tanpa Potongan DP --</div>
              <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>Pembayaran tunai lunas tanpa potong DP</div>
            </div>
            {selectedPanjarId === '' && <CheckCircle2 size={18} color="#FF5000" />}
          </div>

          {/* Panjar Items */}
          {filteredPanjars.map(p => {
            const isSelected = p.id === selectedPanjarId;
            return (
              <div
                key={p.id}
                onClick={() => {
                  onSelect(p);
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
                    <span style={{ fontWeight: '800', fontSize: '12px', color: '#FF5000' }}>{p.noKwitansi}</span>
                    <span className="badge badge-navy" style={{ fontSize: '9px' }}>{p.bank}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#0F172A', fontWeight: '700', marginTop: '2px' }}>{p.namaPenerima}</div>
                  <div style={{ fontSize: '11px', color: '#EF4444', fontWeight: '800', marginTop: '2px' }}>
                    DP: Rp {p.nominalDp.toLocaleString('id-ID')}
                  </div>
                </div>

                {isSelected && <CheckCircle2 size={18} color="#FF5000" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
