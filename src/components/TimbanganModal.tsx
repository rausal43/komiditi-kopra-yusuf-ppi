import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { BatchPickerModal } from './BatchPickerModal';
import { PanjarPickerModal } from './PanjarPickerModal';
import { X, Calculator, Wallet, ChevronDown, Droplets, Plus, Trash2, Camera } from 'lucide-react';

interface KarungRow {
  berat: number | '';
  kadarAir: number | '';
  fotoUrl?: string;
}

interface TimbanganModalProps {
  initialBatchId?: string;
  onClose: () => void;
  onSubmit: (data: {
    tgl: string; namaTuanToko: string; rincianKarung: number[]; totalGross: number;
    taraKarung: number; totalNetto: number; kadarAir: number; hargaBeliPerKg: number;
    totalNominalBeli: number; panjarDpId?: string; potonganDp: number; sisaPelunasan: number; batchId?: string;
    kadarAirPerKarung?: number[]; fotoPerKarung?: string[];
  }) => void;
}

export const TimbanganModal: React.FC<TimbanganModalProps> = ({ initialBatchId, onClose, onSubmit }) => {
  const { panjarList, batchList, timbanganList, priceSetting } = useApp();

  const parseDigits = (val: string): number => {
    const clean = val.replace(/\D/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  const [namaTuanToko, setNamaTuanToko] = useState('');
  const [tgl, setTgl] = useState(new Date().toISOString().split('T')[0]);
  const [karungRows, setKarungRows] = useState<KarungRow[]>([
    { berat: '', kadarAir: 6.0 },
  ]);
  const [taraPerKarung, setTaraPerKarung] = useState<number | ''>(1);
  const [hargaBeliStr, setHargaBeliStr] = useState(`Rp ${priceSetting.batasBeliGudangSekely.toLocaleString('id-ID')}`);
  const [selectedPanjarId, setSelectedPanjarId] = useState<string>('');
  const [potonganDpStr, setPotonganDpStr] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatchId && initialBatchId !== 'ALL' ? initialBatchId : batchList[0]?.id || '');
  const [showBatchPicker, setShowBatchPicker] = useState(false);
  const [showPanjarPicker, setShowPanjarPicker] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const activeBatchObj = batchList.find(b => b.id === selectedBatchId) || batchList[0];
  const modalAwal = activeBatchObj?.modalAwalBatch || 150000000;
  const totalBeliExisting = timbanganList.filter(t => t.batchId === activeBatchObj?.id).reduce((acc, curr) => acc + curr.totalNominalBeli, 0);
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

  const batchPanjarList = panjarList.filter(p => (p.batchId === selectedBatchId || !p.batchId) && p.status !== 'Lunas');
  const panjarSelected = batchPanjarList.find(p => p.id === selectedPanjarId);
  const maxPanjarAllowed = panjarSelected ? panjarSelected.nominalDp : 0;
  const potonganDpNum = parseDigits(potonganDpStr);
  const potonganDpActual = Math.min(potonganDpNum, maxPanjarAllowed);
  const sisaPelunasan = Math.max(0, totalNominalBeli - potonganDpActual);
  const proyeksiSisaModal = Math.max(0, currentSisaModal - sisaPelunasan);

  // CRUD operations for karung rows
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

  const compressImage = (file: File, maxSizeKB: number = 200): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width;
          let h = img.height;
          const maxDim = 800;
          if (w > maxDim || h > maxDim) {
            const ratio = Math.min(maxDim / w, maxDim / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, w, h);
          let quality = 0.7;
          let result = canvas.toDataURL('image/jpeg', quality);
          while (result.length > maxSizeKB * 1024 * 1.37 && quality > 0.1) {
            quality -= 0.1;
            result = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(result);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (index: number, file: File) => {
    const compressed = await compressImage(file, 200);
    setKarungRows(prev => prev.map((row, i) => i === index ? { ...row, fotoUrl: compressed } : row));
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
      tgl, namaTuanToko, rincianKarung, totalGross, taraKarung: totalTara,
      totalNetto: nettoBayarFinal, kadarAir: avgKadarAir, hargaBeliPerKg, totalNominalBeli,
      panjarDpId: selectedPanjarId || undefined, potonganDp: potonganDpActual, sisaPelunasan, batchId: selectedBatchId,
      kadarAirPerKarung, fotoPerKarung: hasFoto ? fotoPerKarung : undefined,
    });
  };

  // Styles
  const tblHeaderStyle: React.CSSProperties = {
    fontSize: '10px', fontWeight: '800', color: '#64748B', padding: '6px 8px',
    textAlign: 'center', borderBottom: '2px solid #E2E8F0', whiteSpace: 'nowrap',
  };
  const tblCellStyle: React.CSSProperties = {
    padding: '4px 4px', textAlign: 'center', verticalAlign: 'middle',
  };
  const miniInputStyle: React.CSSProperties = {
    width: '100%', padding: '7px 8px', fontSize: '13px', fontWeight: '700',
    border: '1.5px solid #E2E8F0', borderRadius: '8px', textAlign: 'center',
    outline: 'none', transition: 'border-color 0.2s',
    background: '#FAFBFC',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxHeight: '92vh', overflowY: 'auto' }}>
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
            <input type="text" className="form-input" placeholder="Masukkan nama petani/tuan toko" value={namaTuanToko} onChange={e => setNamaTuanToko(e.target.value)} required />
          </div>

          {/* === CRUD TABLE: Karung Items === */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Droplets size={13} color="#0EA5E9" />
                Rincian Karung ({validRows.length} karung)
              </label>
              <button type="button" onClick={addKarungRow}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '5px 12px', fontSize: '11px', fontWeight: '700',
                  color: '#fff', background: 'linear-gradient(135deg, #FF5000, #FF7A33)',
                  border: 'none', borderRadius: '8px', cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(255,80,0,0.25)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,80,0,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(255,80,0,0.25)'; }}
              >
                <Plus size={13} /> Tambah Karung
              </button>
            </div>

            <div style={{
              border: '1.5px solid #E2E8F0', borderRadius: '12px', overflow: 'hidden',
              background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    <th style={{ ...tblHeaderStyle, width: '36px' }}>#</th>
                    <th style={tblHeaderStyle}>Berat (kg)</th>
                    <th style={tblHeaderStyle}>Kadar Air (%)</th>
                    <th style={{ ...tblHeaderStyle, width: '44px' }}>Foto</th>
                    <th style={{ ...tblHeaderStyle, width: '36px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {karungRows.map((row, idx) => (
                    <tr key={idx} style={{
                      borderBottom: idx < karungRows.length - 1 ? '1px solid #F1F5F9' : 'none',
                      background: idx % 2 === 1 ? '#FAFBFC' : '#fff',
                      transition: 'background 0.15s',
                    }}>
                      <td style={{ ...tblCellStyle, fontSize: '11px', fontWeight: '800', color: '#94A3B8' }}>
                        {idx + 1}
                      </td>
                      <td style={tblCellStyle}>
                        <input
                          type="number"
                          step="0.5"
                          placeholder="0"
                          style={miniInputStyle}
                          value={row.berat}
                          onChange={e => updateKarungRow(idx, 'berat', e.target.value ? parseFloat(e.target.value) : '')}
                          onFocus={e => e.currentTarget.style.borderColor = '#FF5000'}
                          onBlur={e => e.currentTarget.style.borderColor = '#E2E8F0'}
                        />
                      </td>
                      <td style={tblCellStyle}>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="6.0"
                          style={{ ...miniInputStyle, color: '#0EA5E9' }}
                          value={row.kadarAir}
                          onChange={e => updateKarungRow(idx, 'kadarAir', e.target.value ? parseFloat(e.target.value) : '')}
                          onFocus={e => e.currentTarget.style.borderColor = '#0EA5E9'}
                          onBlur={e => e.currentTarget.style.borderColor = '#E2E8F0'}
                        />
                      </td>
                      <td style={tblCellStyle}>
                        <input
                          ref={el => { fileInputRefs.current[idx] = el; }}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          style={{ display: 'none' }}
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(idx, file);
                          }}
                        />
                        {row.fotoUrl ? (
                          <div
                            style={{
                              width: '32px', height: '32px', borderRadius: '6px', overflow: 'hidden',
                              cursor: 'pointer', margin: '0 auto', border: '2px solid #10B981',
                              position: 'relative',
                            }}
                            onClick={() => setPreviewPhoto(row.fotoUrl!)}
                          >
                            <img src={row.fotoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button
                              type="button"
                              onClick={e => { e.stopPropagation(); removePhoto(idx); }}
                              style={{
                                position: 'absolute', top: '-4px', right: '-4px',
                                width: '14px', height: '14px', borderRadius: '50%',
                                background: '#EF4444', border: 'none', color: '#fff',
                                fontSize: '8px', cursor: 'pointer', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', lineHeight: 1,
                              }}
                            >✕</button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[idx]?.click()}
                            style={{
                              width: '32px', height: '32px', borderRadius: '6px',
                              border: '1.5px dashed #CBD5E1', background: '#F8FAFC',
                              cursor: 'pointer', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', margin: '0 auto',
                              transition: 'border-color 0.2s, background 0.2s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF5000'; e.currentTarget.style.background = '#FFF7ED'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.background = '#F8FAFC'; }}
                            title="Ambil foto karung (opsional)"
                          >
                            <Camera size={14} color="#94A3B8" />
                          </button>
                        )}
                      </td>
                      <td style={tblCellStyle}>
                        <button
                          type="button"
                          onClick={() => removeKarungRow(idx)}
                          disabled={karungRows.length <= 1}
                          style={{
                            width: '28px', height: '28px', borderRadius: '6px',
                            border: 'none', background: karungRows.length <= 1 ? '#F1F5F9' : '#FEF2F2',
                            cursor: karungRows.length <= 1 ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={e => { if (karungRows.length > 1) e.currentTarget.style.background = '#FEE2E2'; }}
                          onMouseLeave={e => { if (karungRows.length > 1) e.currentTarget.style.background = '#FEF2F2'; }}
                        >
                          <Trash2 size={13} color={karungRows.length <= 1 ? '#CBD5E1' : '#EF4444'} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick stats below table */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '6px 10px', marginTop: '6px', fontSize: '10px', color: '#64748B',
              background: '#F8FAFC', borderRadius: '8px',
            }}>
              <span>Total: <strong style={{ color: '#0F172A' }}>{validRows.length}</strong> karung</span>
              <span>Gross: <strong style={{ color: '#0F172A' }}>{totalGross.toLocaleString('id-ID')} kg</strong></span>
              <span>Avg KA: <strong style={{ color: '#0EA5E9' }}>{avgKadarAir.toFixed(1)}%</strong></span>
            </div>
          </div>

          {/* Tara Per Karung */}
          <div className="form-group">
            <label className="form-label">Tara Per Karung (kg) × {validRows.length} karung = {totalTara} kg</label>
            <input type="number" step="0.5" className="form-input" placeholder="1" value={taraPerKarung}
              onChange={e => setTaraPerKarung(e.target.value ? parseFloat(e.target.value) : '')} required
              style={{ maxWidth: '160px' }}
            />
          </div>

          {/* Kalkulator Netto & Rafaksi Kadar Air */}
          <div style={{ background: 'rgba(255, 80, 0, 0.08)', borderRadius: '10px', padding: '10px 12px', marginBottom: '10px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#FF5000', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calculator size={14} /> Kalkulator Netto & Rafaksi Kadar Air
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '10px' }}>
              <div>Gross: <strong>{totalGross.toLocaleString('id-ID')} kg</strong></div>
              <div>Tara Karung: <strong style={{ color: '#EF4444' }}>-{totalTara} kg</strong></div>
              <div>Rata-Rata KA: <strong style={{ color: '#0EA5E9' }}>{avgKadarAir.toFixed(1)}%</strong></div>
              <div>Rafaksi ({rafaksiPercent.toFixed(1)}%): <strong style={{ color: '#EF4444' }}>-{potonganKadarAirKg.toFixed(1)} kg</strong></div>
              <div style={{ gridColumn: '1 / -1', borderTop: '1px dashed rgba(255,80,0,0.3)', paddingTop: '4px', marginTop: '2px' }}>
                Netto Bayar: <strong style={{ color: '#10B981', fontSize: '12px' }}>{nettoBayarFinal.toFixed(1)} kg</strong>
              </div>
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
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={validRows.length === 0 || !namaTuanToko.trim()}>Simpan & Potong Saldo</button>
          </div>
        </form>

        {/* Photo Preview Modal */}
        {previewPhoto && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 9999, padding: '20px',
          }} onClick={() => setPreviewPhoto(null)}>
            <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '80vh' }}>
              <img src={previewPhoto} alt="Preview" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '12px', objectFit: 'contain' }} />
              <button onClick={() => setPreviewPhoto(null)} style={{
                position: 'absolute', top: '-12px', right: '-12px',
                width: '32px', height: '32px', borderRadius: '50%',
                background: '#EF4444', border: 'none', color: '#fff',
                fontSize: '14px', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}>✕</button>
            </div>
          </div>
        )}

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
