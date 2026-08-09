import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { MilestoneStatus } from '../types';
import { X, Wallet } from 'lucide-react';

interface BatchModalProps {
  onClose: () => void;
  onSubmit: (data: {
    namaBatch: string;
    tglMulai: string;
    targetTonase: number;
    beratSekely: number;
    modalAwalBatch: number;
    sumberAkunDana: string;
    statusMilestone: MilestoneStatus;
    lokasiSaatIni: string;
    biayaUpahPanggul: number;
    biayaSewaFeeder: number;
    biayaFreightSabuk: number;
    biayaUangJalan: number;
    biayaTruckingBitung: number;
    biayaAdminBriLink: number;
    timbanganIds: string[];
    catatan: string;
  }) => void;
}

export const BatchModal: React.FC<BatchModalProps> = ({ onClose, onSubmit }) => {
  const { daftarAkunOwner } = useApp();

  const [namaBatch, setNamaBatch] = useState('');
  const [targetTonaseStr, setTargetTonaseStr] = useState('10.000');
  const [modalAwalStr, setModalAwalStr] = useState('Rp 150.000.000');
  const [sumberAkunDana, setSumberAkunDana] = useState(daftarAkunOwner[0] || 'Bank BRI Sekely');

  const parseDigits = (val: string): number => {
    const clean = val.replace(/\D/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  const handleTargetTonaseChange = (val: string) => {
    const num = parseDigits(val);
    setTargetTonaseStr(num ? num.toLocaleString('id-ID') : '');
  };

  const handleModalChange = (val: string) => {
    const num = parseDigits(val);
    setModalAwalStr(num ? `Rp ${num.toLocaleString('id-ID')}` : '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const modalNum = parseDigits(modalAwalStr);
    const tonaseNum = parseDigits(targetTonaseStr);
    if (!namaBatch || !modalNum) return;

    onSubmit({
      namaBatch,
      tglMulai: new Date().toISOString().split('T')[0],
      targetTonase: tonaseNum || 10000,
      beratSekely: 0,
      modalAwalBatch: modalNum,
      sumberAkunDana,
      statusMilestone: 'Gudang Sekely',
      lokasiSaatIni: 'Penampungan Gudang Sekely',
      biayaUpahPanggul: 2500000,
      biayaSewaFeeder: 3500000,
      biayaFreightSabuk: 4000000,
      biayaUangJalan: 1200000,
      biayaTruckingBitung: 800000,
      biayaAdminBriLink: 200000,
      timbanganIds: [],
      catatan: 'Inisialisasi batch baru via Kopra Sejati App',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', width: '92%' }}>
        <div className="modal-header">
          <div className="modal-title">Inisialisasi Batch Baru</div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={onClose}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Batch / Kode Pengiriman</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: Batch #09A - Halmahera to Bitung"
              value={namaBatch}
              onChange={e => setNamaBatch(e.target.value)}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Target Tonase (kg)</label>
              <input
                type="text"
                className="form-input"
                value={targetTonaseStr}
                onChange={e => handleTargetTonaseChange(e.target.value)}
                placeholder="10.000"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Modal Usaha Batch (Rp)</label>
              <input
                type="text"
                className="form-input"
                value={modalAwalStr}
                onChange={e => handleModalChange(e.target.value)}
                placeholder="Rp 150.000.000"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Wallet size={14} color="#10B981" /> Rekening Sumber Dana Owner
            </label>
            <select
              className="form-select"
              value={sumberAkunDana}
              onChange={e => setSumberAkunDana(e.target.value)}
            >
              {daftarAkunOwner.map(akun => (
                <option key={akun} value={akun}>{akun}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Buat Batch Baru</button>
          </div>
        </form>
      </div>
    </div>
  );
};
