import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Download, Filter } from 'lucide-react';

interface NotaBelanjaModalProps {
  batchId?: string;
  initialBatchId?: string;
  onClose: () => void;
}

export const NotaBelanjaModal: React.FC<NotaBelanjaModalProps> = ({ initialBatchId, onClose }) => {
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

  const handleDownloadReceipt = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card printable-thermal-receipt" onClick={e => e.stopPropagation()} style={{ maxWidth: '340px', width: '92%', background: '#FFFFFF', padding: '16px 14px' }}>
        {/* Receipt Header (58mm / 80mm Standard Thermal Format) */}
        <div style={{ textAlign: 'center', borderBottom: '2px dashed #0F172A', paddingBottom: '10px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ fontSize: '15px', fontWeight: '900', color: '#0F172A', letterSpacing: '0.5px' }}>
            PT KOPRA SEJATI
          </div>
          <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700' }}>GUDANG PENAMPUNGAN SEKELY</div>
          <div style={{ fontSize: '9px', color: '#94A3B8', marginTop: '2px' }}>Struk Bukti Pembelian Kopra</div>
          <button className="no-print" style={{ position: 'absolute', top: '0px', right: '0px', background: 'none', border: 'none', cursor: 'pointer' }} onClick={onClose}>
            <X size={18} color="#64748B" />
          </button>
        </div>

        {/* Selection Pickers: Batch & Specific Timbangan Record */}
        <div className="no-print" style={{ background: '#F8FAFC', borderRadius: '10px', padding: '8px', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={11} color="#FF5000" />
            <span style={{ fontSize: '10px', fontWeight: '800', color: '#0F172A' }}>FILTER NOTA BATCH</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>
              <label style={{ fontSize: '9px', fontWeight: '700', color: '#64748B' }}>Pilih Batch:</label>
              <select
                className="form-select"
                style={{ padding: '3px 6px', fontSize: '10px' }}
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
              <label style={{ fontSize: '9px', fontWeight: '700', color: '#64748B' }}>Pilih Timbangan:</label>
              <select
                className="form-select"
                style={{ padding: '3px 6px', fontSize: '10px' }}
                value={selectedTimbanganId}
                onChange={e => setSelectedTimbanganId(e.target.value)}
              >
                <option value="ALL">Semua Timbangan ({allBatchTimbangan.length})</option>
                {allBatchTimbangan.map(t => (
                  <option key={t.id} value={t.id}>{t.id} - {t.namaTuanToko}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Thermal Receipt Monospaced Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '11px', fontFamily: 'monospace, monospace', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Batch ID:</span> <strong>{selectedBatchId}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Tanggal:</span> <span>{new Date().toISOString().split('T')[0]}</span>
          </div>
          <div style={{ borderBottom: '1px dashed #CBD5E1', margin: '4px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Total Karung:</span> <span>{totalKarung} Karung</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Gross Timbangan:</span> <span>{totalBeratBruto.toLocaleString('id-ID')} kg</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#EF4444' }}>
            <span>Potongan Air:</span> <span>-{totalPotonganAir.toLocaleString('id-ID')} kg</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', borderTop: '1px solid #0F172A', paddingTop: '3px' }}>
            <span>Netto Final:</span> <span>{totalNettoFinal.toLocaleString('id-ID')} kg</span>
          </div>

          <div style={{ borderBottom: '1px dashed #CBD5E1', margin: '4px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: '800' }}>
            <span>Total Belanja:</span> <span>Rp {totalBelanjaNominal.toLocaleString('id-ID')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#FF5000', fontWeight: '800' }}>
            <span>Potongan Panjar:</span> <span>-Rp {totalPanjarNominal.toLocaleString('id-ID')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '900', color: '#0F172A', borderTop: '2px dashed #0F172A', paddingTop: '6px', marginTop: '2px' }}>
            <span>SISA PELUNASAN:</span> <span>Rp {sisaPelunasan.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print" style={{ display: 'flex', gap: '6px' }}>
          <button type="button" className="btn btn-outline" style={{ flex: 1, fontSize: '10px' }} onClick={onClose}>
            Batal
          </button>
          <button type="button" className="btn btn-primary" style={{ flex: 1, fontSize: '10px' }} onClick={handleDownloadReceipt}>
            <Download size={13} /> Download Nota
          </button>
        </div>
      </div>
    </div>
  );
};
