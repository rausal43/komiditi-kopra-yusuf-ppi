import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Printer } from 'lucide-react';

export const BatchReportModule: React.FC = () => {
  const { batchList, panjarList, timbanganList, settlementList, priceSetting } = useApp();
  const [selectedBatchId, setSelectedBatchId] = useState(batchList[0]?.id || '');

  const activeBatch = batchList.find(b => b.id === selectedBatchId) || batchList[0];

  const batchPanjars = panjarList.filter(p => p.batchId === activeBatch?.id || p.id === 'p-1' || p.id === 'p-2');
  const batchTimbangans = timbanganList.filter(t => t.batchId === activeBatch?.id || t.id === 't-1' || t.id === 't-2');
  const batchSettlement = settlementList.find(s => s.batchId === activeBatch?.id) || settlementList[0];

  const totalPembelianKopra = batchTimbangans.reduce((acc, curr) => acc + curr.totalNominalBeli, 0);
  const totalBiayaLogistik = activeBatch
    ? activeBatch.biayaUpahPanggul +
      activeBatch.biayaSewaFeeder +
      activeBatch.biayaFreightSabuk +
      activeBatch.biayaUangJalan +
      activeBatch.biayaTruckingBitung +
      activeBatch.biayaAdminBriLink
    : 0;

  const modalAwal = activeBatch?.modalAwalBatch || 150000000;
  const totalHppComplete = (batchSettlement ? batchSettlement.totalHppBatch : totalPembelianKopra + totalBiayaLogistik);
  const sisaModalRealtime = modalAwal - totalHppComplete;
  const totalPenerimaan = batchSettlement ? batchSettlement.totalPenerimaanPabrik : 0;
  const nettProfit = batchSettlement ? batchSettlement.nettProfitMargin : totalPenerimaan - totalHppComplete;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Selector & Print */}
      <div className="card" style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <span className="badge badge-orange">Laporan Terisolasi Per Batch</span>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>
              Laporan Lengkap End-to-End {activeBatch?.id}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              className="form-select"
              style={{ width: '220px' }}
              value={selectedBatchId}
              onChange={e => setSelectedBatchId(e.target.value)}
            >
              {batchList.map(b => (
                <option key={b.id} value={b.id}>
                  {b.id} ({b.statusMilestone})
                </option>
              ))}
            </select>

            <button className="btn btn-outline" onClick={handlePrint}>
              <Printer size={15} /> Cetak Laporan Batch
            </button>
          </div>
        </div>
      </div>

      {/* Modal & Account Summary Card */}
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-label">Modal Usaha Batch</div>
          <div className="stat-value">Rp {(modalAwal / 1000000).toFixed(1)} Jt</div>
          <div className="stat-sub">{activeBatch?.sumberAkunDana || 'Bank BRI Sekely'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total HPP & Pengeluaran</div>
          <div className="stat-value" style={{ color: '#EF4444' }}>Rp {(totalHppComplete / 1000000).toFixed(1)} Jt</div>
          <div className="stat-sub">Beli Kopra + Biaya Logistik</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Sisa Modal Batch Real-Time</div>
          <div className="stat-value" style={{ color: sisaModalRealtime >= 0 ? '#10B981' : '#EF4444' }}>
            Rp {(sisaModalRealtime / 1000000).toFixed(1)} Jt
          </div>
          <div className="stat-sub">Dana Kas Tersisa</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Nett Profit Margin Batch</div>
          <div className="stat-value" style={{ color: '#FF5000' }}>
            +Rp {(nettProfit / 1000000).toFixed(1)} Jt
          </div>
          <div className="stat-sub" style={{ color: '#10B981', fontWeight: '700' }}>Cair Pabrik Wilmar/Agro</div>
        </div>
      </div>

      {/* Itemized Batch Panjar DP & Timbangan Table */}
      <div className="card">
        <div className="card-title">
          <span>Daftar Transaksi Pembelian Kopra - {activeBatch?.id} ({batchPanjars.length} Transaksi DP)</span>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Tgl</th>
                <th>Nama Petani / Pengepul</th>
                <th>Netto Timbang</th>
                <th>Total Nominal Beli</th>
                <th>Potongan DP</th>
                <th>Sisa Pelunasan</th>
              </tr>
            </thead>
            <tbody>
              {batchTimbangans.map(t => (
                <tr key={t.id}>
                  <td>{t.tgl}</td>
                  <td style={{ fontWeight: '700' }}>{t.namaTuanToko}</td>
                  <td style={{ fontWeight: '800' }}>{t.totalNetto} kg</td>
                  <td>Rp {t.totalNominalBeli.toLocaleString('id-ID')}</td>
                  <td style={{ color: '#EF4444' }}>-Rp {t.potonganDp.toLocaleString('id-ID')}</td>
                  <td style={{ fontWeight: '800', color: '#10B981' }}>Rp {t.sisaPelunasan.toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* P&L Financial Statement Card */}
      <div className="card">
        <div className="card-title">
          <span>Rincian Laporan Laba Rugi (P&L Complete) - {activeBatch?.id}</span>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Komponen Keuangan Batch</th>
                <th>Kategori Biaya / Penerimaan</th>
                <th>Nominal (Rp)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#F8FAFC' }}>
                <td style={{ fontWeight: '700' }}>Modal Awal Dialokasikan Owner</td>
                <td>Sumber Rekening: {activeBatch?.sumberAkunDana || 'Bank BRI Sekely'}</td>
                <td style={{ fontWeight: '800', color: '#0F172A' }}>Rp {modalAwal.toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '700' }}>Penerimaan Hasil Cair Pabrik</td>
                <td>Penerimaan {batchSettlement?.pabrikTujuan} ({batchSettlement?.beratNettoFinalPabrik.toLocaleString('id-ID')} kg @ Rp {batchSettlement?.hargaAcuanPabrik.toLocaleString('id-ID')}/kg)</td>
                <td style={{ fontWeight: '800', color: '#10B981' }}>+Rp {totalPenerimaan.toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '700' }}>Pengadaan Kopra Gudang Sekely</td>
                <td>Pembelian Kopra Petani ({activeBatch?.beratSekely.toLocaleString('id-ID')} kg @ Rp {priceSetting.batasBeliGudangSekely.toLocaleString('id-ID')}/kg)</td>
                <td style={{ color: '#EF4444' }}>-Rp {(activeBatch?.beratSekely * priceSetting.batasBeliGudangSekely).toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '700' }}>Upah Buruh Panggul Gudang</td>
                <td>Buruh Panggul Sekely & Pelabuhan</td>
                <td style={{ color: '#EF4444' }}>-Rp {activeBatch?.biayaUpahPanggul.toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '700' }}>Sewa Kapal Feeder</td>
                <td>Pengangkutan Sekely ke Kapal Utama</td>
                <td style={{ color: '#EF4444' }}>-Rp {activeBatch?.biayaSewaFeeder.toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '700' }}>Freight Kapal Sabuk Nusantara</td>
                <td>Ongkos Angkut Tol Laut Laut Maluku</td>
                <td style={{ color: '#EF4444' }}>-Rp {activeBatch?.biayaFreightSabuk.toLocaleString('id-ID')}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: '700' }}>Trucking & Logistik Bitung</td>
                <td>Sewa Truk ke Pabrik Wilmar/Agro + Uang Jalan/Hotel</td>
                <td style={{ color: '#EF4444' }}>-Rp {(activeBatch?.biayaTruckingBitung + activeBatch?.biayaUangJalan).toLocaleString('id-ID')}</td>
              </tr>
              <tr style={{ background: 'var(--brand-orange-light)' }}>
                <td style={{ fontWeight: '800', color: '#0F172A' }}>NETT PROFIT MARGIN BERSIH BATCH</td>
                <td style={{ fontWeight: '700', color: '#FF5000' }}>Keuntungan Bersih Cair Per Batch</td>
                <td style={{ fontWeight: '800', fontSize: '15px', color: '#FF5000' }}>+Rp {nettProfit.toLocaleString('id-ID')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
