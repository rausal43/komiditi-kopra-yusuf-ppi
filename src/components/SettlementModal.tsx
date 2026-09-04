import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calculator, Scale, Camera, ImageIcon, Loader2 } from 'lucide-react';
import { uploadToR2 } from '../lib/r2Service';
import type { SettlementPabrik } from '../types';

interface SettlementModalProps {
  initialSettlement?: SettlementPabrik;
  onClose: () => void;
  onSubmit: (data: {
    batchId: string; tglMasukPabrik: string; pabrikTujuan: 'Wilmar Bitung' | 'Agro Bitung';
    beratGrossPabrik: number; kadarAirLabPercent: number; potonganKadarAirKg: number;
    beratNettoFinalPabrik: number; hargaAcuanPabrik: number; totalPenerimaanPabrik: number;
    susutTonasePercent: number; totalHppBatch: number; nettProfitMargin: number;
    fotoNotaTimbangPabrik?: string;
  }) => void;
}

export const SettlementModal: React.FC<SettlementModalProps> = ({ initialSettlement, onClose, onSubmit }) => {
  const { batchList, timbanganList, priceSetting } = useApp();

  const parseDigits = (val: string): number => {
    const clean = val.replace(/\D/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  const [selectedBatchId, setSelectedBatchId] = useState(initialSettlement?.batchId || batchList[0]?.id || '');
  const [tglMasukPabrik, setTglMasukPabrik] = useState(initialSettlement?.tglMasukPabrik || initialSettlement?.tglSettlement || new Date().toISOString().split('T')[0]);
  const [pabrikTujuan, setPabrikTujuan] = useState<'Wilmar Bitung' | 'Agro Bitung'>(initialSettlement?.pabrikTujuan || 'Wilmar Bitung');
  const [beratGrossStr, setBeratGrossStr] = useState(initialSettlement ? `${initialSettlement.beratGrossPabrik.toLocaleString('id-ID')} kg` : '10.080 kg');
  const [kadarAirLabPercent, setKadarAirLabPercent] = useState<number | ''>(initialSettlement?.kadarAirLabPercent ?? 5.2);
  const [hargaAcuanStr, setHargaAcuanStr] = useState(initialSettlement ? `Rp ${initialSettlement.hargaAcuanPabrik.toLocaleString('id-ID')}` : `Rp ${priceSetting.hargaAcuanPabrikWilmar.toLocaleString('id-ID')}`);
  const [fotoNotaTimbang, setFotoNotaTimbang] = useState<string>(initialSettlement?.fotoNotaTimbangPabrik || initialSettlement?.lampiranNotaPabrikUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [previewFoto, setPreviewFoto] = useState(false);
  const fotoInputRef = useRef<HTMLInputElement>(null);

  const handleFotoUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadToR2(file, 'settlements');
      setFotoNotaTimbang(url);
    } catch (err) {
      console.error('Error uploading to R2:', err);
      alert('Gagal mengunggah foto ke Cloudflare R2');
    } finally {
      setIsUploading(false);
    }
  };


  const selectedBatch = batchList.find(b => b.id === selectedBatchId) || batchList[0];

  const batchTimbangan = timbanganList.filter(t => t.batchId === selectedBatchId);
  const totalBeratSekelyKg = batchTimbangan.length
    ? batchTimbangan.reduce((acc, curr) => acc + curr.totalNetto, 0)
    : selectedBatch?.beratSekely || 10240;
  
  const totalBelanjaSekelyNominal = batchTimbangan.length
    ? batchTimbangan.reduce((acc, curr) => acc + curr.totalNominalBeli, 0)
    : totalBeratSekelyKg * priceSetting.batasBeliGudangSekely;

  const avgKadarAirSekelyNum = batchTimbangan.length
    ? batchTimbangan.reduce((acc, curr) => acc + (curr.kadarAir || 6.0), 0) / batchTimbangan.length
    : 6.0;

  const totalShipping = selectedBatch
    ? selectedBatch.biayaUpahPanggul + selectedBatch.biayaSewaFeeder + selectedBatch.biayaFreightSabuk +
      selectedBatch.biayaUangJalan + selectedBatch.biayaTruckingBitung + selectedBatch.biayaAdminBriLink
    : 12000000;

  const realTotalHpp = totalBelanjaSekelyNominal + totalShipping;

  const grossPabrikNum = parseDigits(beratGrossStr);
  const kadarAirLabNum = Number(kadarAirLabPercent || 0);
  const potonganKadarAirKg = Math.round(grossPabrikNum * (kadarAirLabNum > 5 ? (kadarAirLabNum - 4) * 0.015 : 0));
  const beratNettoFinalPabrik = Math.max(0, grossPabrikNum - potonganKadarAirKg);

  const hargaPabrikNum = parseDigits(hargaAcuanStr) || priceSetting.hargaAcuanPabrikWilmar;
  const totalPenerimaanPabrik = beratNettoFinalPabrik * hargaPabrikNum;

  const selisihBeratKg = totalBeratSekelyKg - beratNettoFinalPabrik;
  const susutTonasePercent = totalBeratSekelyKg > 0 ? Number(((selisihBeratKg / totalBeratSekelyKg) * 100).toFixed(2)) : 0;
  const selisihKadarAirPercent = Number((kadarAirLabNum - avgKadarAirSekelyNum).toFixed(1));

  const nettProfitMargin = totalPenerimaanPabrik - realTotalHpp;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grossPabrikNum || !hargaPabrikNum) return;
    onSubmit({
      batchId: selectedBatchId, tglMasukPabrik, pabrikTujuan, beratGrossPabrik: grossPabrikNum,
      kadarAirLabPercent: kadarAirLabNum, potonganKadarAirKg, beratNettoFinalPabrik, hargaAcuanPabrik: hargaPabrikNum,
      totalPenerimaanPabrik, susutTonasePercent, totalHppBatch: realTotalHpp, nettProfitMargin,
      fotoNotaTimbangPabrik: fotoNotaTimbang || undefined,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px', width: '94%' }}>
        <div className="modal-header">
          <div className="modal-title">{initialSettlement ? 'Edit Settlement Pabrik' : 'Input & Rekonsiliasi Settlement Pabrik'}</div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={onClose}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        {/* BATCH SUMMARY RECAP CARD FROM BELANJA */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '10px 12px', marginBottom: '14px', fontSize: '11px' }}>
          <div style={{ fontWeight: '800', color: '#FF5000', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Scale size={13} /> Data Belanja Gudang Sekely ({selectedBatchId})
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', color: '#64748B' }}>
            <div>Berat Sekely: <strong style={{ color: '#0F172A' }}>{totalBeratSekelyKg.toLocaleString('id-ID')} kg</strong></div>
            <div>Total Belanja: <strong style={{ color: '#0F172A' }}>Rp {(totalBelanjaSekelyNominal / 1000000).toFixed(1)}Jt</strong></div>
            <div>Kadar Air: <strong style={{ color: '#0F172A' }}>{avgKadarAirSekelyNum.toFixed(1)}%</strong></div>
            <div>Shipping: <strong style={{ color: '#0F172A' }}>Rp {(totalShipping / 1000000).toFixed(1)}Jt</strong></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Pilih Batch Pengiriman</label>
            <select className="form-select" value={selectedBatchId} onChange={e => setSelectedBatchId(e.target.value)}>
              {batchList.map(b => (
                <option key={b.id} value={b.id}>{b.id} ({b.namaBatch})</option>
              ))}
            </select>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Pabrik Tujuan</label>
              <select className="form-select" value={pabrikTujuan} onChange={e => setPabrikTujuan(e.target.value as any)}>
                <option value="Wilmar Bitung">Wilmar Bitung</option>
                <option value="Agro Bitung">Agro Bitung</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tanggal Masuk</label>
              <input type="date" className="form-input" value={tglMasukPabrik} onChange={e => setTglMasukPabrik(e.target.value)} required />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Timbang Gross (kg)</label>
              <input type="text" className="form-input" value={beratGrossStr} onChange={e => { const num = parseDigits(e.target.value); setBeratGrossStr(num ? `${num.toLocaleString('id-ID')} kg` : ''); }} placeholder="0 kg" required />
            </div>
            <div className="form-group">
              <label className="form-label">Kadar Air Lab (%)</label>
              <input type="number" step="0.1" className="form-input" value={kadarAirLabPercent} onChange={e => setKadarAirLabPercent(e.target.value === '' ? '' : Number(e.target.value))} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Harga Pabrik (Rp/kg)</label>
            <input type="text" className="form-input" value={hargaAcuanStr} onChange={e => { const num = parseDigits(e.target.value); setHargaAcuanStr(num ? `Rp ${num.toLocaleString('id-ID')}` : ''); }} placeholder="Rp 0" required />
          </div>

          {/* FOTO NOTA TIMBANG PABRIK */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Camera size={13} color="#FF5000" /> Foto Nota Timbang Pabrik (Opsional)
            </label>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', background: '#FFF7ED', border: '2px dashed #FF5000', borderRadius: '10px', color: '#FF5000', fontSize: '12px', fontWeight: '600' }}>
                <Loader2 size={18} className="animate-spin" /> Mengunggah ke Cloudflare R2...
              </div>
            ) : fotoNotaTimbang ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden',
                    border: '2px solid #10B981', cursor: 'pointer', flexShrink: 0,
                  }}
                  onClick={() => setPreviewFoto(true)}
                >
                  <img src={fotoNotaTimbang} alt="Nota" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '10px', color: '#10B981', fontWeight: '700' }}>✓ Foto ter-upload (R2)</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button type="button" onClick={() => fotoInputRef.current?.click()}
                      style={{ fontSize: '10px', color: '#FF5000', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }}>
                      Ganti
                    </button>
                    <button type="button" onClick={() => setFotoNotaTimbang('')}
                      style={{ fontSize: '10px', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' }}>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => fotoInputRef.current?.click()}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  width: '100%', padding: '14px', border: '2px dashed #CBD5E1', borderRadius: '10px',
                  background: '#F8FAFC', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                  color: '#64748B', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF5000'; e.currentTarget.style.background = '#FFF7ED'; e.currentTarget.style.color = '#FF5000'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.color = '#64748B'; }}
              >
                <ImageIcon size={18} /> Klik untuk upload foto nota timbang (R2)
              </button>
            )}
          </div>

          {/* RECONCILIATION RESULT CARD */}
          <div style={{ background: 'rgba(255, 80, 0, 0.05)', border: '1px solid rgba(255, 80, 0, 0.2)', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calculator size={13} color="#FF5000" /> Rekonsiliasi & Profit Margin
            </div>

            <table style={{ width: '100%', fontSize: '11px', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ color: '#64748B', padding: '3px 0', whiteSpace: 'nowrap' }}>Susut Tonase</td>
                  <td style={{ textAlign: 'right', padding: '3px 0', fontWeight: '700', whiteSpace: 'nowrap', color: selisihBeratKg > 0 ? '#F59E0B' : '#10B981' }}>
                    {selisihBeratKg.toLocaleString('id-ID')} kg ({susutTonasePercent}%)
                  </td>
                </tr>
                <tr>
                  <td style={{ color: '#64748B', padding: '3px 0', whiteSpace: 'nowrap' }}>Selisih Kadar Air</td>
                  <td style={{ textAlign: 'right', padding: '3px 0', fontWeight: '700', whiteSpace: 'nowrap' }}>
                    {selisihKadarAirPercent > 0 ? `+${selisihKadarAirPercent}` : selisihKadarAirPercent}%
                  </td>
                </tr>
                <tr>
                  <td style={{ color: '#64748B', padding: '3px 0', whiteSpace: 'nowrap' }}>Netto Final Pabrik</td>
                  <td style={{ textAlign: 'right', padding: '3px 0', fontWeight: '700', color: '#0F172A', whiteSpace: 'nowrap' }}>
                    {beratNettoFinalPabrik.toLocaleString('id-ID')} kg
                  </td>
                </tr>
                <tr>
                  <td style={{ color: '#64748B', padding: '3px 0', whiteSpace: 'nowrap' }}>Total Penerimaan</td>
                  <td style={{ textAlign: 'right', padding: '3px 0', fontWeight: '700', color: '#0F172A', whiteSpace: 'nowrap' }}>
                    Rp {totalPenerimaanPabrik.toLocaleString('id-ID')}
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={{ borderTop: '1px dashed #CBD5E1', marginTop: '6px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '800', fontSize: '10px', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Nett Profit</span>
              <strong style={{ color: nettProfitMargin >= 0 ? '#10B981' : '#EF4444', fontSize: '14px', fontWeight: '800', whiteSpace: 'nowrap' }}>
                {nettProfitMargin >= 0 ? '+' : ''}Rp {nettProfitMargin.toLocaleString('id-ID')}
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{initialSettlement ? 'Simpan Perubahan' : 'Simpan Settlement'}</button>
          </div>
        </form>

        {/* Photo Preview Modal */}
        {previewFoto && fotoNotaTimbang && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 9999, padding: '20px',
          }} onClick={() => setPreviewFoto(false)}>
            <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '80vh' }}>
              <img src={fotoNotaTimbang} alt="Nota Timbang Pabrik" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '12px', objectFit: 'contain' }} />
              <button onClick={() => setPreviewFoto(false)} style={{
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
      </div>
    </div>
  );
};
