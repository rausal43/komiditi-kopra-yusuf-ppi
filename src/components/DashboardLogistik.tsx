import React from 'react';
import { useApp } from '../context/AppContext';

export const DashboardLogistik: React.FC = () => {
  const { panjarList, timbanganList, batchList, setActiveTab } = useApp();

  const totalDpAktif = panjarList
    .filter(p => p.status !== 'Lunas')
    .reduce((acc, curr) => acc + curr.nominalDp, 0);

  const totalBeratTimbang = timbanganList.reduce((acc, curr) => acc + curr.totalNetto, 0);
  const activeBatchCount = batchList.filter(b => b.statusMilestone !== 'Selesai Pabrik').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Category Navigation Pills */}
      <div className="category-grid">
        <div className="category-card" onClick={() => setActiveTab('panjar')}>
          <div className="category-name">Input Panjar DP</div>
        </div>

        <div className="category-card" onClick={() => setActiveTab('timbangan')}>
          <div className="category-name">Timbang Karung</div>
        </div>

        <div className="category-card" onClick={() => setActiveTab('transshipment')}>
          <div className="category-name">Batch Pelayaran</div>
        </div>

        <div className="category-card" onClick={() => setActiveTab('settlement')}>
          <div className="category-name">Serah Pabrik</div>
        </div>
      </div>

      {/* Stats Summary Row */}
      <div className="grid-3">
        <div className="stat-card">
          <div className="stat-label">Sisa Panjar/DP Belum Lunas</div>
          <div className="stat-value">Rp {(totalDpAktif / 1000000).toFixed(1)} Jt</div>
          <div className="stat-sub">{panjarList.filter(p => p.status !== 'Lunas').length} Petani Terdaftar</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Total Timbangan Gudang</div>
          <div className="stat-value">{totalBeratTimbang.toLocaleString('id-ID')} kg</div>
          <div className="stat-sub">Netto Sekely Halmahera</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Pengiriman Batch Aktif</div>
          <div className="stat-value">{activeBatchCount} Batch</div>
          <div className="stat-sub">Rute Sekely → Bitung</div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="card">
        <div className="card-title">
          <span>Aksi Cepat Operasional Lapangan</span>
        </div>
        <div className="grid-2">
          <button
            className="btn btn-primary"
            style={{ padding: '12px', justifyContent: 'center' }}
            onClick={() => setActiveTab('panjar')}
          >
            Catat Panjar DP Petani Baru (Kwitansi KS / BD)
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: '12px', justifyContent: 'center' }}
            onClick={() => setActiveTab('timbangan')}
          >
            Input Rincian Karung & Potong Panjar DP
          </button>
        </div>
      </div>

      {/* Active Panjar List Preview */}
      <div className="card">
        <div className="card-title">
          <span>Daftar Panjar (DP) Petani Aktif</span>
          <button className="btn btn-outline" style={{ fontSize: '12px' }} onClick={() => setActiveTab('panjar')}>
            Lihat Semua Panjar
          </button>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>No. Kwitansi</th>
                <th>Petani / Pengepul</th>
                <th>Tgl Transfer</th>
                <th>Nominal DP</th>
                <th>Bank & Rekening</th>
                <th>Status DP</th>
              </tr>
            </thead>
            <tbody>
              {panjarList.slice(0, 3).map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: '700', color: '#FF5000' }}>{p.noKwitansi}</td>
                  <td style={{ fontWeight: '700' }}>{p.namaPenerima}</td>
                  <td>{p.tgl}</td>
                  <td style={{ fontWeight: '700' }}>Rp {p.nominalDp.toLocaleString('id-ID')}</td>
                  <td>
                    <span className="badge badge-navy">{p.bank}</span> {p.noRekening}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        p.status === 'Lunas'
                          ? 'badge-success'
                          : p.status === 'Sisa Pelunasan'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
