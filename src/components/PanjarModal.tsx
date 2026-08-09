import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BatchPickerModal } from './BatchPickerModal';
import type { PaymentMethod } from '../types';
import { X, UploadCloud, Wallet, ChevronDown } from 'lucide-react';

interface PanjarModalProps {
  initialBatchId?: string;
  onClose: () => void;
  onSubmit: (data: {
    noKwitansi: string;
    tgl: string;
    namaPenerima: string;
    nominalDp: number;
    bank: PaymentMethod;
    noRekening: string;
    catatan: string;
    batchId?: string;
  }) => void;
}

export const PanjarModal: React.FC<PanjarModalProps> = ({ initialBatchId, onClose, onSubmit }) => {
  const { batchList, timbanganList } = useApp();

  const [noKwitansi, setNoKwitansi] = useState('KS 31');
  const [tgl, setTgl] = useState(new Date().toISOString().split('T')[0]);
  const [namaPenerima, setNamaPenerima] = useState('');
  const [nominalDpStr, setNominalDpStr] = useState('');
  const [bank, setBank] = useState<PaymentMethod>('BRILink');
  const [noRekening, setNoRekening] = useState('');
  const [catatan, setCatatan] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatchId && initialBatchId !== 'ALL' ? initialBatchId : batchList[0]?.id || '');
  const [showPicker, setShowPicker] = useState(false);

  const parseDigits = (val: string): number => {
    const clean = val.replace(/\D/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  const activeBatchObj = batchList.find(b => b.id === selectedBatchId) || batchList[0];
  const modalAwal = activeBatchObj?.modalAwalBatch || 150000000;
  const existingBatchTimbangans = timbanganList.filter(t => t.batchId === activeBatchObj?.id);
  const totalBeliExisting = existingBatchTimbangans.reduce((acc, curr) => acc + curr.totalNominalBeli, 0);
  const currentSisaModal = Math.max(0, modalAwal - totalBeliExisting);

  const nominalDpNum = parseDigits(nominalDpStr);
  const proyeksiSisaModal = Math.max(0, currentSisaModal - nominalDpNum);

  const handleNominalChange = (val: string) => {
    const num = parseDigits(val);
    setNominalDpStr(num ? `Rp ${num.toLocaleString('id-ID')}` : '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseDigits(nominalDpStr);
    if (!namaPenerima || !num) return;
    onSubmit({
      noKwitansi,
      tgl,
      namaPenerima,
      nominalDp: num,
      bank,
      noRekening: noRekening || `${bank} Sekely`,
      catatan,
      batchId: selectedBatchId,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-drag-handle" />
        <div className="modal-header">
          <div className="modal-title">Input Panjar (DP) Petani / Pengepul</div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={onClose}>
            <X size={18} color="#64748B" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">No. Kwitansi (KS / BD)</label>
              <input type="text" className="form-input" value={noKwitansi} onChange={e => setNoKwitansi(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Transaksi</label>
              <input type="date" className="form-input" value={tgl} onChange={e => setTgl(e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Target Batch (Sumber Modal Usaha)</label>
            <button
              type="button"
              className="form-input"
              style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: '800', color: '#FF5000' }}
              onClick={() => setShowPicker(true)}
            >
              <span>{selectedBatchId} ({activeBatchObj?.statusMilestone || 'Gudang'})</span>
              <ChevronDown size={16} color="#64748B" />
            </button>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 12px', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Wallet size={14} color="#FF5000" /> Real-Time Saldo Modal Usaha {selectedBatchId}
            </div>
            <div className="grid-2" style={{ fontSize: '10px' }}>
              <div>Modal Awal: <strong>Rp {modalAwal.toLocaleString('id-ID')}</strong> ({activeBatchObj?.sumberAkunDana || 'BRI'})</div>
              <div>Sisa Saldo Kas: <strong style={{ color: '#10B981' }}>Rp {currentSisaModal.toLocaleString('id-ID')}</strong></div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nama Petani / Pengepul Kopra</label>
            <input type="text" className="form-input" placeholder="Contoh: Sahbudin Jabai" value={namaPenerima} onChange={e => setNamaPenerima(e.target.value)} required />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Nominal Panjar DP (Rp)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Rp 20.000.000"
                value={nominalDpStr}
                onChange={e => handleNominalChange(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Metode Pembayaran</label>
              <select className="form-select" value={bank} onChange={e => setBank(e.target.value as PaymentMethod)}>
                <option value="BRILink">BRILink Sekely</option>
                <option value="BRI">Bank BRI</option>
                <option value="BNI">Bank BNI</option>
                <option value="Cash">Cash / Tunai</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">No. Rekening Transfer</label>
            <input type="text" className="form-input" placeholder="BNI A/n Sahbudin Jabai" value={noRekening} onChange={e => setNoRekening(e.target.value)} />
          </div>

          <div style={{ background: '#F1F5F9', padding: '8px 12px', borderRadius: '8px', marginBottom: '12px', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Proyeksi Sisa Modal Kas Batch:</span>
            <strong style={{ color: proyeksiSisaModal >= 0 ? '#10B981' : '#EF4444' }}>Rp {proyeksiSisaModal.toLocaleString('id-ID')}</strong>
          </div>

          <div className="form-group">
            <label className="form-label">Catatan Panjar</label>
            <input type="text" className="form-input" placeholder="Panjar DP Kopra Masuk Pekan Ini" value={catatan} onChange={e => setCatatan(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Foto Kwitansi DP</label>
            <div style={{ border: '2px dashed var(--brand-border)', borderRadius: '10px', padding: '8px', textAlign: 'center', background: '#F8FAFC' }}>
              <UploadCloud size={18} color="#FF5000" style={{ margin: '0 auto 2px auto' }} />
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#0F172A' }}>Klik foto Kwitansi DP</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan & Potong Saldo</button>
          </div>
        </form>

        {showPicker && (
          <BatchPickerModal
            batchList={batchList}
            selectedBatchId={selectedBatchId}
            onSelect={id => setSelectedBatchId(id)}
            onClose={() => setShowPicker(false)}
          />
        )}
      </div>
    </div>
  );
};
