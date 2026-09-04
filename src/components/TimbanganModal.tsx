import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BatchPickerModal } from './BatchPickerModal';
import { PanjarPickerModal } from './PanjarPickerModal';
import { ImagePreviewModal } from './ImagePreviewModal';
import { TimbanganKarungForm, type KarungRow } from './timbangan/TimbanganKarungForm';
import { TimbanganSummaryBox } from './timbangan/TimbanganSummaryBox';
import { X, Calculator, Wallet, ChevronDown } from 'lucide-react';
import { uploadToR2 } from '../lib/r2Service';
import type { TimbanganKarung } from '../types';

interface TimbanganModalProps {
  initialBatchId?: string;
  initialTimbangan?: TimbanganKarung;
  onClose: () => void;
  onSubmit: (data: {
    tgl: string; namaTuanToko: string; rincianKarung: number[]; totalGross: number;
    taraKarung: number; totalNetto: number; kadarAir: number; hargaBeliPerKg: number;
    totalNominalBeli: number; panjarDpId?: string; potonganDp: number; sisaPelunasan: number; batchId?: string;
    kadarAirPerKarung?: number[]; fotoPerKarung?: string[];
  }) => void;
}

export const TimbanganModal: React.FC<TimbanganModalProps> = ({ initialBatchId, initialTimbangan, onClose, onSubmit }) => {
  const { panjarList, batchList, timbanganList, priceSetting } = useApp();

  const parseDigits = (val: string): number => {
    const clean = val.replace(/\D/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  const [namaTuanToko, setNamaTuanToko] = useState(initialTimbangan?.namaTuanToko || '');
  const [tgl, setTgl] = useState(initialTimbangan?.tgl || new Date().toISOString().split('T')[0]);

  const initialKarungRows: KarungRow[] = initialTimbangan?.rincianKarung?.map((berat, idx) => ({
    berat,
    kadarAir: initialTimbangan.kadarAirPerKarung?.[idx] ?? initialTimbangan.kadarAir ?? 6.0,
    fotoUrl: initialTimbangan.fotoPerKarung?.[idx],
  })) || [{ berat: '', kadarAir: 6.0 }];

  const [karungRows, setKarungRows] = useState<KarungRow[]>(initialKarungRows);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [taraPerKarung, setTaraPerKarung] = useState<number | ''>(
    initialTimbangan && initialTimbangan.rincianKarung?.length
      ? Math.round(initialTimbangan.taraKarung / initialTimbangan.rincianKarung.length) || 1
      : 1
  );
  const [hargaBeliStr, setHargaBeliStr] = useState(
    initialTimbangan
      ? `Rp ${initialTimbangan.hargaBeliPerKg.toLocaleString('id-ID')}`
      : `Rp ${priceSetting.batasBeliGudangSekely.toLocaleString('id-ID')}`
  );
  const [selectedPanjarId, setSelectedPanjarId] = useState<string>(initialTimbangan?.panjarDpId || '');
  const [potonganDpStr, setPotonganDpStr] = useState(initialTimbangan?.potonganDp ? `Rp ${initialTimbangan.potonganDp.toLocaleString('id-ID')}` : '');

  const [selectedBatchId, setSelectedBatchId] = useState(
    initialTimbangan?.batchId || (initialBatchId && initialBatchId !== 'ALL' ? initialBatchId : batchList[0]?.id || '')
  );
  const [showBatchPicker, setShowBatchPicker] = useState(false);
  const [showPanjarPicker, setShowPanjarPicker] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const activeBatchObj = batchList.find(b => b.id === selectedBatchId) || batchList[0];
  const modalAwal = activeBatchObj?.modalAwalBatch || 150000000;
  const totalBeliExisting = timbanganList
    .filter(t => t.batchId === activeBatchObj?.id && t.id !== initialTimbangan?.id)
    .reduce((acc, curr) => acc + curr.totalNominalBeli, 0);
  const currentSisaModal = Math.max(0, modalAwal - totalBeliExisting);

  // Calculations from karung rows
  const validRows = karungRows.filter(r => typeof r.berat === 'number' && r.berat > 0);
  const totalGross = validRows.reduce((acc, r) => acc + (typeof r.berat === 'number' ? r.berat : 0), 0);
  const taraVal = Number(taraPerKarung || 0);
  const totalTara = taraVal * validRows.length;
  const totalNettoTimbang = Math.max(0, totalGross - totalTara);

  // Average kadar air from all rows
  const avgKadarAir = validRows.length > 0
    ? validRows.reduce((acc, r) => acc + (typeof r.kadarAir === 'number' ? r.kadarAir : 6.0), 0) / validRows.length
    : 6.0;

  const rafaksiPercent = Math.max(0, avgKadarAir - 6.0);
  const potonganKadarAirKg = (totalNettoTimbang * rafaksiPercent) / 100;
  const nettoBayarFinal = Math.max(0, totalNettoTimbang - potonganKadarAirKg);

  const hargaBeliPerKg = parseDigits(hargaBeliStr);
  const totalNominalBeli = Math.round(nettoBayarFinal * hargaBeliPerKg);

  const batchPanjarList = panjarList.filter(p => (p.batchId === selectedBatchId || !p.batchId) && (p.status !== 'Lunas' || p.id === selectedPanjarId));
  const panjarSelected = batchPanjarList.find(p => p.id === selectedPanjarId);
  const maxPanjarAllowed = panjarSelected ? panjarSelected.nominalDp : 0;
  const potonganDpNum = parseDigits(potonganDpStr);
  const potonganDpActual = Math.min(potonganDpNum, maxPanjarAllowed);
  const sisaPelunasan = Math.max(0, totalNominalBeli - potonganDpActual);
  const proyeksiSisaModal = Math.max(0, currentSisaModal - sisaPelunasan);

  const handlePhotoUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const url = await uploadToR2(file, 'timbangan');
      setKarungRows(prev => prev.map((row, i) => i === index ? { ...row, fotoUrl: url } : row));
    } catch (err) {
      console.error('Error uploading photo to R2:', err);
      alert('Gagal mengunggah foto ke Cloudflare R2');
    } finally {
      setUploadingIndex(null);
    }
  };

  const addKarungRow = () => {
    setKarungRows(prev => [...prev, { berat: '', kadarAir: 6.0 }]);
  };

  const removeKarungRow = (index: number) => {
    if (karungRows.length <= 1) return;
    setKarungRows(prev => prev.filter((_, i) => i !== index));
  };

  const updateKarungRow = (index: number, field: 'berat' | 'kadarAir', value: number | '') => {
    setKarungRows(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  const removePhoto = (index: number) => {
    setKarungRows(prev => prev.map((row, i) => i === index ? { ...row, fotoUrl: undefined } : row));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validRows.length === 0 || !namaTuanToko.trim()) return;
    const rincianKarung = validRows.map(r => typeof r.berat === 'number' ? r.berat : 0);
    const kadarAirPerKarung = validRows.map(r => typeof r.kadarAir === 'number' ? r.kadarAir : 6.0);
    const fotoPerKarung = karungRows.map(r => r.fotoUrl || '');
    const hasFoto = fotoPerKarung.some(f => f.length > 0);

    onSubmit({
      tgl, namaTuanToko: namaTuanToko.trim(), rincianKarung, totalGross, taraKarung: totalTara,
      totalNetto: nettoBayarFinal, kadarAir: avgKadarAir, hargaBeliPerKg, totalNominalBeli,
      panjarDpId: selectedPanjarId || undefined, potonganDp: potonganDpActual, sisaPelunasan, batchId: selectedBatchId,
      kadarAirPerKarung, fotoPerKarung: hasFoto ? fotoPerKarung : undefined,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxHeight: '92vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <div className="modal-title">{initialTimbangan ? 'Edit Timbangan Karung' : 'Input Timbangan Karung Lapangan'}</div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={onClose}>
            <X size={18} color="#64748B" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Target Batch (Dipilih)</label>
              <button type="button" className="form-input" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: '800', color: '#FF5000' }} onClick={() => setShowBatchPicker(true)}>
                <span>{selectedBatchId} - {activeBatchObj?.namaBatch || 'Halmahera'}</span>
                <ChevronDown size={16} color="#64748B" />
              </button>
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Timbang</label>
              <input type="date" className="form-input" value={tgl} onChange={e => setTgl(e.target.value)} required />
            </div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '8px 12px', marginBottom: '10px' }}>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wallet size={13} color="#FF5000" /> Saldo Modal {selectedBatchId}: <strong style={{ color: '#10B981', marginLeft: 'auto' }}>Rp {currentSisaModal.toLocaleString('id-ID')}</strong>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nama Tuan / Toko / Petani</label>
            <input type="text" className="form-input" placeholder="Masukkan nama petani/tuan toko" value={namaTuanToko} onChange={e => setNamaTuanToko(e.target.value)} required />
          </div>

          <TimbanganKarungForm
            karungRows={karungRows}
            uploadingIndex={uploadingIndex}
            taraPerKarung={taraPerKarung}
            onAddRow={addKarungRow}
            onRemoveRow={removeKarungRow}
            onUpdateRow={updateKarungRow}
            onPhotoUpload={handlePhotoUpload}
            onRemovePhoto={removePhoto}
            onPreviewPhoto={setPreviewPhoto}
            onTaraChange={setTaraPerKarung}
          />

          <TimbanganSummaryBox
            totalGross={totalGross}
            totalTara={totalTara}
            totalNettoTimbang={totalNettoTimbang}
            avgKadarAir={avgKadarAir}
            rafaksiPercent={rafaksiPercent}
            potonganKadarAirKg={potonganKadarAirKg}
            nettoBayarFinal={nettoBayarFinal}
            hargaBeliStr={hargaBeliStr}
            totalNominalBeli={totalNominalBeli}
            onHargaBeliChange={setHargaBeliStr}
          />

          {/* Panjar DP Deduction Box */}
          <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '12px', padding: '10px 12px', marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#92400E', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Potongan Panjar DP Petani (Opsional)</span>
              <button type="button" className="btn btn-outline" style={{ padding: '2px 8px', fontSize: '10px', color: '#92400E', borderColor: '#FCD34D' }} onClick={() => setShowPanjarPicker(true)}>
                {selectedPanjarId ? 'Ganti Panjar' : 'Pilih Kwitansi DP'}
              </button>
            </div>

            {panjarSelected ? (
              <div>
                <div style={{ fontSize: '10px', color: '#B45309', fontWeight: '700' }}>
                  Kwitansi: {panjarSelected.noKwitansi} ({panjarSelected.namaPenerima}) - Max: Rp {maxPanjarAllowed.toLocaleString('id-ID')}
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nominal Potong DP"
                    style={{ fontSize: '11px', fontWeight: '800', padding: '4px 8px' }}
                    value={potonganDpStr}
                    onChange={e => setPotonganDpStr(e.target.value)}
                  />
                  <button type="button" style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '10px', fontWeight: '700' }} onClick={() => { setSelectedPanjarId(''); setPotonganDpStr(''); }}>
                    Batal
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '10px', color: '#B45309' }}>
                {batchPanjarList.length > 0 ? `${batchPanjarList.length} kwitansi DP tersedia untuk dipotong.` : 'Tidak ada kwitansi DP gantung pada batch ini.'}
              </div>
            )}

            <div style={{ borderTop: '1px dashed #FCD34D', paddingTop: '6px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800' }}>
              <span style={{ color: '#92400E' }}>Sisa Pelunasan Tunai:</span>
              <strong style={{ color: '#10B981', fontSize: '13px' }}>Rp {sisaPelunasan.toLocaleString('id-ID')}</strong>
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '8px 12px', borderRadius: '10px', marginBottom: '14px', fontSize: '10px', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
            <span>Proyeksi Sisa Modal Batch:</span>
            <strong style={{ color: proyeksiSisaModal > 0 ? '#10B981' : '#EF4444' }}>Rp {proyeksiSisaModal.toLocaleString('id-ID')}</strong>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>
              <Calculator size={15} /> {initialTimbangan ? 'Simpan Perubahan Timbangan' : 'Simpan Transaksi Beli Kopra'}
            </button>
          </div>
        </form>

        {showBatchPicker && (
          <BatchPickerModal
            batchList={batchList}
            selectedBatchId={selectedBatchId}
            onSelect={id => { setSelectedBatchId(id); setShowBatchPicker(false); setSelectedPanjarId(''); setPotonganDpStr(''); }}
            onClose={() => setShowBatchPicker(false)}
          />
        )}

        {showPanjarPicker && (
          <PanjarPickerModal
            panjarList={batchPanjarList}
            selectedPanjarId={selectedPanjarId}
            onSelect={panjar => {
              if (panjar) {
                setSelectedPanjarId(panjar.id);
                setPotonganDpStr(`Rp ${panjar.nominalDp.toLocaleString('id-ID')}`);
              }
              setShowPanjarPicker(false);
            }}
            onClose={() => setShowPanjarPicker(false)}
          />
        )}

        {previewPhoto && (
          <ImagePreviewModal
            imageUrl={previewPhoto}
            title="Pratinjau Foto Timbangan Karung"
            onClose={() => setPreviewPhoto(null)}
          />
        )}
      </div>
    </div>
  );
};
