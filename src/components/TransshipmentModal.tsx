import React, { useState } from 'react';
import type { MilestoneStatus } from '../types';
import { X, Camera, Check } from 'lucide-react';

interface TransshipmentModalProps {
  milestones: { key: MilestoneStatus; label: string }[];
  onClose: () => void;
  onSubmit: (status: MilestoneStatus, lokasi: string, nominalTransport?: number, fotoUrl?: string) => void;
}

export const TransshipmentModal: React.FC<TransshipmentModalProps> = ({ milestones, onClose, onSubmit }) => {
  const filteredMilestones = milestones.filter(m => m.key !== 'Selesai Pabrik');
  const [newMilestone, setNewMilestone] = useState<MilestoneStatus>('Loading Feeder');
  const [newLokasi, setNewLokasi] = useState('');
  const [biayaTransportStr, setBiayaTransportStr] = useState('Rp 2.500.000');
  const [fotoFileName, setFotoFileName] = useState('');

  const parseDigits = (val: string): number => {
    const clean = val.replace(/\D/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  const isNaikKapal = newMilestone === 'Loading Feeder' || newMilestone === 'Sabuk Nusantara';

  const handleHargaChange = (val: string) => {
    const num = parseDigits(val);
    setBiayaTransportStr(num ? `Rp ${num.toLocaleString('id-ID')}` : '');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFotoFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nominal = isNaikKapal ? parseDigits(biayaTransportStr) : undefined;
    onSubmit(newMilestone, newLokasi || newMilestone, nominal, fotoFileName || 'surat_jalan_kapal.jpg');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', width: '92%' }}>
        <div className="modal-header">
          <div className="modal-title">Update Milestone & Transport Pelayaran</div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={onClose}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Pilih Milestone Status</label>
            <select
              className="form-select"
              value={newMilestone}
              onChange={e => setNewMilestone(e.target.value as MilestoneStatus)}
            >
              {filteredMilestones.map(m => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Conditional Transport Nominal Input when Naik Kapal */}
          {isNaikKapal ? (
            <div className="form-group">
              <label className="form-label" style={{ color: '#FF5000', fontWeight: '800' }}>
                Nominal Biaya Transport Naik Kapal (Rp)
              </label>
              <input
                type="text"
                className="form-input"
                value={biayaTransportStr}
                onChange={e => handleHargaChange(e.target.value)}
                placeholder="Rp 0"
                required
              />
              <span style={{ fontSize: '10px', color: '#64748B', marginTop: '2px', display: 'block' }}>
                Disimpan sebagai biaya logistik freight/feeder kapal.
              </span>
            </div>
          ) : (
            <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '8px 10px', marginBottom: '12px', fontSize: '11px', color: '#64748B' }}>
              ℹ️ Status Turun Bitung: Konfirmasi lokasi bongkar kapal. Batch akan otomatis Selesai setelah di-input di menu Pabrik.
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Keterangan Lokasi Terkini</label>
            <input
              type="text"
              className="form-input"
              placeholder={isNaikKapal ? 'Contoh: Muat Feeder Sekely ke Sabuk Nusantara' : 'Contoh: Bongkar Kapal di Pelabuhan Bitung'}
              value={newLokasi}
              onChange={e => setNewLokasi(e.target.value)}
              required
            />
          </div>

          {/* Foto Upload Field */}
          <div className="form-group">
            <label className="form-label">Upload Foto Surat Jalan / Bukti Kapal</label>
            <div style={{ position: 'relative' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="foto-pelayaran-input"
              />
              <label
                htmlFor="foto-pelayaran-input"
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center', gap: '6px', fontSize: '11px', borderStyle: 'dashed' }}
              >
                {fotoFileName ? (
                  <>
                    <Check size={14} color="#10B981" />
                    <span style={{ color: '#10B981', fontWeight: '700' }}>{fotoFileName}</span>
                  </>
                ) : (
                  <>
                    <Camera size={14} color="#FF5000" />
                    <span>Ambil Foto / Pilih File Bukti Surat Jalan</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan Milestone</button>
          </div>
        </form>
      </div>
    </div>
  );
};
