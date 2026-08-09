import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BatchPickerModal } from './BatchPickerModal';
import { PanjarPickerModal } from './PanjarPickerModal';
import { X, Calculator, Wallet, ChevronDown, Droplets } from 'lucide-react';

interface TimbanganModalProps {
  initialBatchId?: string;
  onClose: () => void;
  onSubmit: (data: {
    tgl: string; namaTuanToko: string; rincianKarung: number[]; totalGross: number;
    taraKarung: number; totalNetto: number; kadarAir: number; hargaBeliPerKg: number;
    totalNominalBeli: number; panjarDpId?: string; potonganDp: number; sisaPelunasan: number; batchId?: string;
  }) => void;
}

export const TimbanganModal: React.FC<TimbanganModalProps> = ({ initialBatchId, onClose, onSubmit }) => {
  const { panjarList, batchList, timbanganList, priceSetting } = useApp();

  const parseDigits = (val: string): number => {
    const clean = val.replace(/\D/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  const [namaTuanToko, setNamaTuanToko] = useState('Om Hadi');
  const [tgl, setTgl] = useState(new Date().toISOString().split('T')[0]);
  const [rincianKarungInput, setRincianKarungInput] = useState('77, 76, 77, 72, 80');
  const [taraInput, setTaraInput] = useState<number | ''>(5);
  const [kadarAirInput, setKadarAirInput] = useState<number | ''>(6.0);
  const [hargaBeliStr, setHargaBeliStr] = useState(`Rp ${priceSetting.batasBeliGudangSekely.toLocaleString('id-ID')}`);
  const [selectedPanjarId, setSelectedPanjarId] = useState<string>('');
  const [potonganDpStr, setPotonganDpStr] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatchId && initialBatchId !== 'ALL' ? initialBatchId : batchList[0]?.id || '');
  const [showBatchPicker, setShowBatchPicker] = useState(false);
  const [showPanjarPicker, setShowPanjarPicker] = useState(false);

  const activeBatchObj = batchList.find(b => b.id === selectedBatchId) || batchList[0];
  const modalAwal = activeBatchObj?.modalAwalBatch || 150000000;
  const totalBeliExisting = timbanganList.filter(t => t.batchId === activeBatchObj?.id).reduce((acc, curr) => acc + curr.totalNominalBeli, 0);
  const currentSisaModal = Math.max(0, modalAwal - totalBeliExisting);

  const karungList = rincianKarungInput.split(',').map(val => parseFloat(val.trim())).filter(val => !isNaN(val) && val > 0);
  const totalGross = karungList.reduce((acc, curr) => acc + curr, 0);
  const taraKarungVal = Number(taraInput || 0);
  const totalNettoTimbang = Math.max(0, totalGross - taraKarungVal);

  const kadarAirVal = Number(kadarAirInput || 6.0);
  const rafaksiPercent = Math.max(0, kadarAirVal - 6.0);
  const potonganKadarAirKg = (totalNettoTimbang * rafaksiPercent) / 100;
  const nettoBayarFinal = Math.max(0, totalNettoTimbang - potonganKadarAirKg);

  const hargaBeliPerKg = parseDigits(hargaBeliStr);
  const totalNominalBeli = Math.round(nettoBayarFinal * hargaBeliPerKg);

  const batchPanjarList = panjarList.filter(p => (p.batchId === selectedBatchId || !p.batchId) && p.status !== 'Lunas');
  const panjarSelected = batchPanjarList.find(p => p.id === selectedPanjarId);
  const maxPanjarAllowed = panjarSelected ? panjarSelected.nominalDp : 0;
  const potonganDpNum = parseDigits(potonganDpStr);
  const potonganDpActual = Math.min(potonganDpNum, maxPanjarAllowed);
  const sisaPelunasan = Math.max(0, totalNominalBeli - potonganDpActual);
  const proyeksiSisaModal = Math.max(0, currentSisaModal - sisaPelunasan);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (karungList.length === 0) return;
    onSubmit({
      tgl, namaTuanToko, rincianKarung: karungList, totalGross, taraKarung: taraKarungVal,
      totalNetto: nettoBayarFinal, kadarAir: kadarAirVal, hargaBeliPerKg, totalNominalBeli,
      panjarDpId: selectedPanjarId || undefined, potonganDp: potonganDpActual, sisaPelunasan, batchId: selectedBatchId,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <div className="modal-title">Input Timbangan Karung Lapangan</div>
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
            <input type="text" className="form-input" value={namaTuanToko} onChange={e => setNamaTuanToko(e.target.value)} required />
          </div>

          <div className="form-group">
            <label className="form-label">Rincian Karung (kg - dipisah koma)</label>
            <textarea className="form-textarea" rows={2} value={rincianKarungInput} onChange={e => { setRincianKarungInput(e.target.value); const list = e.target.value.split(',').filter(v => v.trim()); setTaraInput(list.length); }} required />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Tara Karung (kg)</label>
              <input type="number" step="0.5" className="form-input" placeholder="5" value={taraInput} onChange={e => setTaraInput(e.target.value ? parseFloat(e.target.value) : '')} required />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Droplets size={12} color="#0EA5E9" /> Kadar Air (%) (Std 6%)
              </label>
              <input type="number" step="0.1" className="form-input" placeholder="6.0" value={kadarAirInput} onChange={e => setKadarAirInput(e.target.value ? parseFloat(e.target.value) : '')} required />
            </div>
          </div>

          {/* Clean Mobile 2x2 Layout Box for Kalkulator Netto */}
          <div style={{ background: 'rgba(255, 80, 0, 0.08)', borderRadius: '10px', padding: '10px 12px', marginBottom: '10px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#FF5000', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calculator size={14} /> Kalkulator Netto & Rafaksi Kadar Air
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '10px' }}>
              <div>Gross: <strong>{totalGross.toLocaleString('id-ID')} kg</strong></div>
              <div>Tara Karung: <strong style={{ color: '#EF4444' }}>-{taraKarungVal} kg</strong></div>
              <div>Pot. Air ({rafaksiPercent.toFixed(1)}%): <strong style={{ color: '#EF4444' }}>-{potonganKadarAirKg.toFixed(1)} kg</strong></div>
              <div>Netto Bayar: <strong style={{ color: '#10B981', fontSize: '11px' }}>{nettoBayarFinal.toFixed(1)} kg</strong></div>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Harga Beli Sekely (Rp/kg)</label>
              <input type="text" className="form-input" value={hargaBeliStr} onChange={e => setHargaBeliStr(e.target.value ? `Rp ${parseDigits(e.target.value).toLocaleString('id-ID')}` : '')} required />
            </div>

            <div className="form-group">
              <label className="form-label">Potong Panjar DP ({selectedBatchId})</label>
              <button type="button" className="form-input" style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: '700', fontSize: '11px', color: panjarSelected ? '#FF5000' : '#0F172A' }} onClick={() => setShowPanjarPicker(true)}>
                <span>{panjarSelected ? `${panjarSelected.noKwitansi} - ${panjarSelected.namaPenerima}` : '-- Tanpa Potongan DP --'}</span>
                <ChevronDown size={16} color="#64748B" />
              </button>
            </div>
          </div>

          {selectedPanjarId && (
            <div className="form-group">
              <label className="form-label">Nominal Potongan DP (Rp)</label>
              <input type="text" className="form-input" value={potonganDpStr} onChange={e => setPotonganDpStr(e.target.value ? `Rp ${parseDigits(e.target.value).toLocaleString('id-ID')}` : '')} />
            </div>
          )}

          <div style={{ background: '#F1F5F9', padding: '10px 12px', borderRadius: '10px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '11px' }}>Total Pembelian: <strong>Rp {totalNominalBeli.toLocaleString('id-ID')}</strong></div>
              <div style={{ fontSize: '10px', color: '#64748B' }}>Proyeksi Sisa Saldo: <strong>Rp {proyeksiSisaModal.toLocaleString('id-ID')}</strong></div>
            </div>
            <span style={{ fontWeight: '800', fontSize: '14px', color: '#10B981' }}>Rp {sisaPelunasan.toLocaleString('id-ID')}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan & Potong Saldo</button>
          </div>
        </form>

        {showBatchPicker && (
          <BatchPickerModal batchList={batchList} selectedBatchId={selectedBatchId} onSelect={id => { setSelectedBatchId(id); setSelectedPanjarId(''); setPotonganDpStr(''); }} onClose={() => setShowBatchPicker(false)} />
        )}
        {showPanjarPicker && (
          <PanjarPickerModal panjarList={batchPanjarList} selectedPanjarId={selectedPanjarId} onSelect={p => { if (p) { setSelectedPanjarId(p.id); setPotonganDpStr(`Rp ${p.nominalDp.toLocaleString('id-ID')}`); } else { setSelectedPanjarId(''); setPotonganDpStr(''); } }} onClose={() => setShowPanjarPicker(false)} />
        )}
      </div>
    </div>
  );
};
