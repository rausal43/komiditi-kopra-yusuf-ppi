import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, Receipt, Filter } from 'lucide-react';

interface NotaBelanjaModalProps {
  batchId: string;
  onClose: () => void;
}

export const NotaBelanjaModal: React.FC<NotaBelanjaModalProps> = ({ initialBatchId, onClose }: { initialBatchId?: string; batchId?: string; onClose: () => void }) => {
  const { batchList, timbanganList, panjarList } = useApp();
  const [selectedBatchId, setSelectedBatchId] = useState(initialBatchId || batchList[0]?.id || '');
  const [selectedTimbanganId, setSelectedTimbanganId] = useState<string>('ALL');

  const allBatchTimbangan = timbanganList.filter(t => !selectedBatchId || t.batchId === selectedBatchId);

  const activeTimbangan = selectedTimbanganId === 'ALL'
    ? allBatchTimbangan
    : allBatchTimbangan.filter(t => t.id === selectedTimbanganId);

  const batchPanjar = panjarList.filter(p => p.batchId === selectedBatchId);

  const totalKarung = activeTimbangan.reduce((acc, curr) => acc + (curr.rincianKarung?.length || 0), 0);
  const totalBeratBruto = activeTimbangan.reduce((acc, curr) => acc + curr.totalGross, 0);
  const totalNettoFinal = activeTimbangan.reduce((acc, curr) => acc + curr.totalNetto, 0);
  const totalPotonganAir = totalBeratBruto - totalNettoFinal;
  const totalBelanjaNominal = activeTimbangan.reduce((acc, curr) => acc + curr.totalNominalBeli, 0);
  const totalPanjarNominal = batchPanjar.reduce((acc, curr) => acc + curr.nominalDp, 0);
  const sisaPelunasan = totalBelanjaNominal - totalPanjarNominal;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', width: '92%', background: '#FFFFFF' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed #E2E8F0', paddingBottom: '12px', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#FF5000', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Receipt size={16} /> NOTA REKAPITULASI BELANJA
            </div>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700' }}>PT KOPRA SEJATI • Gudang Sekely</div>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={onClose}>
            <X size={20} color="#64748B" />
          </button>
        </div>

        {/* Selection Pickers: Batch & Specific Timbangan Record */}
        <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '10px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={12} color="#FF5000" />
            <span style={{ fontSize: '10px', fontWeight: '800', color: '#0F172A' }}>PILIH BATCH & TRANSAKSI</span>
          </div>

          <div className="grid-2" style={{ gap: '6px' }}>
            <div>
              <label style={{ fontSize: '9px', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '2px' }}>Pilih Batch:</label>
              <select
                className="form-select"
                style={{ padding: '4px 6px', fontSize: '10px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '100%' }}
                value={selectedBatchId}
                onChange={e => {
                  setSelectedBatchId(e.target.value);
                  setSelectedTimbanganId('ALL');
                }}
              >
                {batchList.map(b => (
                  <option key={b.id} value={b.id}>{b.id} - {b.namaBatch}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '9px', fontWeight: '700', color: '#64748B', display: 'block', marginBottom: '2px' }}>Pilih Timbangan / Nota:</label>
              <select
                className="form-select"
                style={{ padding: '4px 6px', fontSize: '10px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '100%' }}
                value={selectedTimbanganId}
                onChange={e => setSelectedTimbanganId(e.target.value)}
              >
                <option value="ALL">Semua Data Timbangan ({allBatchTimbangan.length})</option>
                {allBatchTimbangan.map(t => (
                  <option key={t.id} value={t.id}>{t.id} - {t.namaTuanToko} (Rp {t.totalNominalBeli.toLocaleString('id-ID')})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Itemized Calculation Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
            <span>Total Koli / Karung:</span> <strong>{totalKarung} Karung</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
            <span>Berat Bruto Timbangan:</span> <strong>{totalBeratBruto.toLocaleString('id-ID')} kg</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
            <span>Potongan Kadar Air:</span> <strong style={{ color: '#EF4444' }}>-{totalPotonganAir.toLocaleString('id-ID')} kg</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0F172A', fontWeight: '800', borderTop: '1px solid #E2E8F0', paddingTop: '4px' }}>
            <span>Netto Ditimbang:</span> <strong>{totalNettoFinal.toLocaleString('id-ID')} kg</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: '800' }}>
            <span>Total Nominal Belanja:</span> <strong>Rp {totalBelanjaNominal.toLocaleString('id-ID')}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FF5000', fontWeight: '800' }}>
            <span>Potongan Panjar DP:</span> <strong>-Rp {totalPanjarNominal.toLocaleString('id-ID')}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '800', color: '#0F172A', borderTop: '2px solid #0F172A', paddingTop: '6px', marginTop: '2px' }}>
            <span>SISA PELUNASAN:</span> <strong style={{ color: sisaPelunasan >= 0 ? '#10B981' : '#EF4444' }}>Rp {sisaPelunasan.toLocaleString('id-ID')}</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" className="btn btn-outline" style={{ flex: 1, fontSize: '11px' }} onClick={onClose}>
            Batal
          </button>
          <button type="button" className="btn btn-primary" style={{ flex: 1, fontSize: '11px' }} onClick={handlePrint}>
            <Printer size={14} /> Cetak Struk Nota
          </button>
        </div>
      </div>
    </div>
  );
};
