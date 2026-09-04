import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { BatchPickerModal } from './BatchPickerModal';
import type { PaymentMethod, PanjarDP } from '../types';
import { X, Wallet, ChevronDown, Loader2, Camera } from 'lucide-react';
import { uploadToR2 } from '../lib/r2Service';

interface PanjarModalProps {
  initialBatchId?: string;
  initialPanjar?: PanjarDP;
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
    buktiUrl?: string;
    status?: 'Belum Lunas' | 'Sisa Pelunasan' | 'Lunas';
  }) => void;
}

export const PanjarModal: React.FC<PanjarModalProps> = ({ initialBatchId, initialPanjar, onClose, onSubmit }) => {
  const { batchList, timbanganList } = useApp();

  const parseDigits = (val: string): number => {
    const clean = val.replace(/\D/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  const [noKwitansi, setNoKwitansi] = useState(initialPanjar?.noKwitansi || 'KS 31');
  const [tgl, setTgl] = useState(initialPanjar?.tgl || new Date().toISOString().split('T')[0]);
  const [namaPenerima, setNamaPenerima] = useState(initialPanjar?.namaPenerima || '');
  const [nominalDpStr, setNominalDpStr] = useState(initialPanjar ? `Rp ${initialPanjar.nominalDp.toLocaleString('id-ID')}` : '');
  const [bank, setBank] = useState<PaymentMethod>(initialPanjar?.bank || 'BRILink');
  const [noRekening, setNoRekening] = useState(initialPanjar?.noRekening || '');
  const [catatan, setCatatan] = useState(initialPanjar?.catatan || '');
  const [buktiUrl, setBuktiUrl] = useState(initialPanjar?.buktiUrl || '');
  const [status, setStatus] = useState<'Belum Lunas' | 'Sisa Pelunasan' | 'Lunas'>(initialPanjar?.status || 'Belum Lunas');
  const [isUploading, setIsUploading] = useState(false);
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const [selectedBatchId, setSelectedBatchId] = useState(initialPanjar?.batchId || (initialBatchId && initialBatchId !== 'ALL' ? initialBatchId : batchList[0]?.id || ''));
  const [showPicker, setShowPicker] = useState(false);

  const handleFotoUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadToR2(file, 'panjar');
      setBuktiUrl(url);
    } catch (err) {
      console.error('Error uploading receipt to R2:', err);
      alert('Gagal mengunggah foto kwitansi ke Cloudflare R2');
    } finally {
      setIsUploading(false);
    }
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
    if (!namaPenerima.trim() || !num) return;
    onSubmit({
      noKwitansi,
      tgl,
      namaPenerima: namaPenerima.trim(),
      nominalDp: num,
      bank,
      noRekening,
      catatan,
      batchId: selectedBatchId,
      buktiUrl: buktiUrl || undefined,
      status,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-drag-handle" />
        <div className="modal-header">
          <div className="modal-title">{initialPanjar ? 'Edit Panjar (DP) Petani / Pengepul' : 'Input Panjar (DP) Petani / Pengepul'}</div>
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
            <div style={{ fontSize: '10px', color: '#64748B', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Wallet size={12} color="#10B981" /> Estimasi Saldo Tersedia Batch
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: currentSisaModal >= 0 ? '#10B981' : '#EF4444' }}>
              Rp {currentSisaModal.toLocaleString('id-ID')}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nama Petani / Pengepul Penerima</label>
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
              <label className="form-label">Status Pemotongan</label>
              <select className="form-select" value={status} onChange={e => setStatus(e.target.value as 'Belum Lunas' | 'Sisa Pelunasan' | 'Lunas')}>
                <option value="Belum Lunas">Belum Lunas</option>
                <option value="Sisa Pelunasan">Sisa Pelunasan</option>
                <option value="Lunas">Terpotong Lunas</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Metode Pembayaran</label>
              <select className="form-select" value={bank} onChange={e => setBank(e.target.value as PaymentMethod)}>
                <option value="BRILink">BRILink Sekely</option>
                <option value="BRI">Bank BRI</option>
                <option value="BNI">Bank BNI</option>
                <option value="Cash">Cash / Tunai</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">No. Rekening Transfer</label>
              <input type="text" className="form-input" placeholder="BNI A/n Sahbudin Jabai" value={noRekening} onChange={e => setNoRekening(e.target.value)} />
            </div>
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
            <label className="form-label">Foto Kwitansi DP (Opsional)</label>
            <input
              ref={fotoInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFotoUpload(file);
              }}
            />
            {isUploading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', background: '#FFF7ED', border: '2px dashed #FF5000', borderRadius: '10px', color: '#FF5000', fontSize: '11px', fontWeight: '600' }}>
                <Loader2 size={16} className="animate-spin" /> Mengunggah kwitansi ke Cloudflare R2...
              </div>
            ) : buktiUrl ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px', background: '#ECFDF5', border: '1px solid #10B981', borderRadius: '8px' }}>
                <img src={buktiUrl} alt="Kwitansi DP" style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: '#10B981' }}>✓ Kwitansi Ter-upload (R2)</div>
                  <button type="button" onClick={() => fotoInputRef.current?.click()} style={{ fontSize: '10px', color: '#FF5000', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }}>Ganti Foto</button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fotoInputRef.current?.click()}
                style={{ border: '2px dashed var(--brand-border)', borderRadius: '10px', padding: '10px', textAlign: 'center', background: '#F8FAFC', cursor: 'pointer' }}
              >
                <Camera size={18} color="#FF5000" style={{ margin: '0 auto 2px auto' }} />
                <div style={{ fontSize: '10px', fontWeight: '700', color: '#0F172A' }}>Ambil Foto / Pilih Kwitansi DP (R2)</div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{initialPanjar ? 'Simpan Perubahan' : 'Simpan & Potong Saldo'}</button>
          </div>
        </form>

        {showPicker && (
          <BatchPickerModal
            batchList={batchList}
            selectedBatchId={selectedBatchId}
            onSelect={id => { setSelectedBatchId(id); setShowPicker(false); }}
            onClose={() => setShowPicker(false)}
          />
        )}
      </div>
    </div>
  );
};
