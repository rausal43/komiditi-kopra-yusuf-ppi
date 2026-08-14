import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TimbanganModal } from './TimbanganModal';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { Plus, Filter, Scale, DollarSign, Droplets, Package, Trash2, Lock } from 'lucide-react';

interface TimbanganModuleProps {
  selectedBatchId?: string;
  onBatchFilterChange?: (batchId: string) => void;
}

export const TimbanganModule: React.FC<TimbanganModuleProps> = ({
  selectedBatchId: externalBatchId,
  onBatchFilterChange,
}) => {
  const { timbanganList, batchList, addTimbangan, deleteTimbangan, canEditOrDelete, activeModal, setActiveModal } = useApp();
  const [internalFilterBatch, setInternalFilterBatch] = useState('ALL');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const selectedFilterBatch = externalBatchId !== undefined ? externalBatchId : internalFilterBatch;
  const isModalOpen = activeModal === 'TIMBANGAN';

  const handleFilterChange = (val: string) => {
    if (onBatchFilterChange) {
      onBatchFilterChange(val);
    } else {
      setInternalFilterBatch(val);
    }
  };

  const filteredTimbangan = timbanganList.filter(t => {
    return selectedFilterBatch === 'ALL' || t.batchId === selectedFilterBatch;
  });

  const totalKarung = filteredTimbangan.reduce((acc, curr) => acc + (curr.rincianKarung?.length || 0), 0);
  const totalNettoKg = filteredTimbangan.reduce((acc, curr) => acc + curr.totalNetto, 0);
  const totalNominalBeli = filteredTimbangan.reduce((acc, curr) => acc + curr.totalNominalBeli, 0);
  const avgKadarAir = (filteredTimbangan.reduce((acc, curr) => acc + (curr.kadarAir || 6.0), 0) / (filteredTimbangan.length || 1)).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Action & Filter Toolbar */}
      <div className="card" style={{ padding: '12px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="#FF5000" />
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A' }}>Filter Batch:</span>
            <select
              className="form-select"
              style={{ width: '160px', padding: '6px 10px', fontSize: '11px' }}
              value={selectedFilterBatch}
              onChange={e => handleFilterChange(e.target.value)}
            >
              <option value="ALL">Semua Batch</option>
              {batchList.map(b => (
                <option key={b.id} value={b.id}>{b.id}</option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary desktop-only-btn" style={{ fontSize: '11px', padding: '7px 12px' }} onClick={() => setActiveModal('TIMBANGAN')}>
            <Plus size={14} /> + Input Timbangan Baru
          </button>
        </div>
      </div>

      {/* Batch Summary Dashboard Cards (Full Unabbreviated Numbers) */}
      <div className="grid-4">
        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Package size={12} color="#0EA5E9" /> Total Koli / Karung
          </div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
            {totalKarung} Karung
          </div>
        </div>

        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Scale size={12} color="#FF5000" /> Total Netto Gudang
          </div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#FF5000', marginTop: '2px' }}>
            {(totalNettoKg / 1000).toFixed(2)} Ton ({totalNettoKg.toLocaleString('id-ID')} kg)
          </div>
        </div>

        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <DollarSign size={12} color="#10B981" /> Total Nominal Belanja
          </div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#10B981', marginTop: '2px' }}>
            Rp {totalNominalBeli.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Droplets size={12} color="#F59E0B" /> Rata-Rata Kadar Air
          </div>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
            {avgKadarAir}%
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Batch</th>
                <th>Tgl</th>
                <th>Tuan Toko</th>
                <th>Koli</th>
                <th>Gross</th>
                <th>Kadar Air</th>
                <th>Netto Bayar</th>
                <th>Harga/kg</th>
                <th>Nominal Beli</th>
                <th>Panjar</th>
                <th>Aksi / Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTimbangan.map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: '800', color: '#FF5000' }}>{t.batchId || 'BATCH-08A'}</td>
                  <td>{t.tgl}</td>
                  <td style={{ fontWeight: '700' }}>{t.namaTuanToko}</td>
                  <td>{t.rincianKarung.length} koli</td>
                  <td>{t.totalGross} kg</td>
                  <td>
                    <span className="badge badge-navy" title={
                      t.kadarAirPerKarung
                        ? `Per karung: ${t.kadarAirPerKarung.map((ka, i) => `#${i+1}: ${ka}%`).join(', ')}`
                        : undefined
                    } style={{ cursor: t.kadarAirPerKarung ? 'help' : 'default' }}>
                      {t.kadarAirPerKarung
                        ? `${(t.kadarAirPerKarung.reduce((a, b) => a + b, 0) / t.kadarAirPerKarung.length).toFixed(1)}%`
                        : `${t.kadarAir || 6.0}%`
                      }
                      {t.kadarAirPerKarung && <span style={{ fontSize: '8px', marginLeft: '2px', opacity: 0.7 }}>({t.kadarAirPerKarung.length})</span>}
                    </span>
                  </td>
                  <td style={{ fontWeight: '800' }}>{t.totalNetto.toLocaleString('id-ID')} kg</td>
                  <td>Rp {t.hargaBeliPerKg.toLocaleString('id-ID')}</td>
                  <td style={{ fontWeight: '700' }}>Rp {t.totalNominalBeli.toLocaleString('id-ID')}</td>
                  <td>
                    {t.potonganDp > 0 ? (
                      <span className="badge badge-success">-Rp {t.potonganDp.toLocaleString('id-ID')}</span>
                    ) : (
                      <span className="badge badge-navy">-</span>
                    )}
                  </td>
                  <td>
                    {canEditOrDelete ? (
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(t.id)}
                        style={{
                          background: '#FEF2F2', border: 'none', borderRadius: '6px',
                          padding: '4px 8px', color: '#EF4444', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '700',
                        }}
                        title="Hapus Transaksi (Khusus Owner)"
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    ) : (
                      <span style={{ fontSize: '10px', color: '#94A3B8', display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: '600' }} title="Tersimpan - Tidak dapat diubah oleh Logistik">
                        <Lock size={11} color="#64748B" /> Tersimpan
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTargetId && (
        <ConfirmDeleteModal
          title="Hapus Data Timbangan"
          itemName={`Timbangan ${timbanganList.find(t => t.id === deleteTargetId)?.namaTuanToko || deleteTargetId}`}
          onConfirm={() => {
            deleteTimbangan(deleteTargetId);
            setDeleteTargetId(null);
          }}
          onClose={() => setDeleteTargetId(null)}
        />
      )}

      {isModalOpen && (
        <TimbanganModal
          initialBatchId={selectedFilterBatch}
          onClose={() => setActiveModal('NONE')}
          onSubmit={data => {
            addTimbangan({ ...data, batchId: selectedFilterBatch !== 'ALL' ? selectedFilterBatch : batchList[0]?.id });
            setActiveModal('NONE');
          }}
        />
      )}
    </div>
  );
};
