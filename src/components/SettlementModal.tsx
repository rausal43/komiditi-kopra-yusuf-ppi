import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calculator, Scale } from 'lucide-react';

interface SettlementModalProps {
  onClose: () => void;
  onSubmit: (data: {
    batchId: string; tglMasukPabrik: string; pabrikTujuan: 'Wilmar Bitung' | 'Agro Bitung';
    beratGrossPabrik: number; kadarAirLabPercent: number; potonganKadarAirKg: number;
    beratNettoFinalPabrik: number; hargaAcuanPabrik: number; totalPenerimaanPabrik: number;
    susutTonasePercent: number; totalHppBatch: number; nettProfitMargin: number;
  }) => void;
}

export const SettlementModal: React.FC<SettlementModalProps> = ({ onClose, onSubmit }) => {
  const { batchList, timbanganList, priceSetting } = useApp();

  const parseDigits = (val: string): number => {
    const clean = val.replace(/\D/g, '');
    return clean ? parseInt(clean, 10) : 0;
  };

  const [selectedBatchId, setSelectedBatchId] = useState(batchList[0]?.id || '');
  const [tglMasukPabrik, setTglMasukPabrik] = useState(new Date().toISOString().split('T')[0]);
  const [pabrikTujuan, setPabrikTujuan] = useState<'Wilmar Bitung' | 'Agro Bitung'>('Wilmar Bitung');
  const [beratGrossStr, setBeratGrossStr] = useState('10.080 kg');
  const [kadarAirLabPercent, setKadarAirLabPercent] = useState<number | ''>(5.2);
  const [hargaAcuanStr, setHargaAcuanStr] = useState(`Rp ${priceSetting.hargaAcuanPabrikWilmar.toLocaleString('id-ID')}`);

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
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '460px', width: '94%' }}>
        <div className="modal-header">
          <div className="modal-title">Input & Rekonsiliasi Settlement Pabrik</div>
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

          {/* RECONCILIATION RESULT CARD */}
          <div style={{ background: 'rgba(255, 80, 0, 0.05)', border: '1px solid rgba(255, 80, 0, 0.2)', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calculator size={13} color="#FF5000" /> Rekonsiliasi & Final Profit Margin
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
              <span>Susut Tonase (Sekely vs Pabrik):</span> <strong style={{ color: selisihBeratKg > 0 ? '#F59E0B' : '#10B981' }}>{selisihBeratKg.toLocaleString('id-ID')} kg ({susutTonasePercent}%)</strong>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
              <span>Selisih Kadar Air (Lab vs Sekely):</span> <strong>{selisihKadarAirPercent > 0 ? `+${selisihKadarAirPercent}` : selisihKadarAirPercent}%</strong>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
              <span>Netto Final Pabrik:</span> <strong style={{ color: '#0F172A' }}>{beratNettoFinalPabrik.toLocaleString('id-ID')} kg</strong>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
              <span>Total Penerimaan Pabrik:</span> <strong style={{ color: '#0F172A' }}>Rp {totalPenerimaanPabrik.toLocaleString('id-ID')}</strong>
            </div>
            <div style={{ fontSize: '12px', borderTop: '1px dashed #CBD5E1', paddingTop: '6px', marginTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: '800', color: '#0F172A' }}>FINAL NETT PROFIT MARGIN:</span>
              <strong style={{ color: nettProfitMargin >= 0 ? '#10B981' : '#EF4444', fontSize: '13px' }}>{nettProfitMargin >= 0 ? '+' : ''}Rp {nettProfitMargin.toLocaleString('id-ID')}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan Settlement</button>
          </div>
        </form>
      </div>
    </div>
  );
};
