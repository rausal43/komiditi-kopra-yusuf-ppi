import React, { useState, useMemo } from 'react';
import type { BatchShipment } from '../types';
import { Search } from 'lucide-react';

interface BatchMasterTableProps {
  batchList: BatchShipment[];
  selectedBatchId: string;
  onSelectBatch: (id: string) => void;
}

export const BatchMasterTable: React.FC<BatchMasterTableProps> = ({
  batchList,
  selectedBatchId,
  onSelectBatch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AKTIF' | 'SELESAI'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredBatches = useMemo(() => {
    const list = batchList.filter(b => {
      const matchesSearch =
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.namaBatch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.lokasiSaatIni.toLowerCase().includes(searchTerm.toLowerCase());

      const isFinished = b.statusMilestone === 'Selesai Pabrik';
      const matchesStatus =
        statusFilter === 'ALL'
          ? true
          : statusFilter === 'AKTIF'
          ? !isFinished
          : isFinished;

      return matchesSearch && matchesStatus;
    });

    // Sort Newest Batch First
    return [...list].sort((a, b) => b.id.localeCompare(a.id));
  }, [batchList, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage) || 1;
  const paginatedBatches = filteredBatches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="card">
      <div className="card-title" style={{ flexWrap: 'wrap', gap: '10px' }}>
        <span style={{ fontSize: '13px', fontWeight: '800' }}>Daftar Batch Operasional ({filteredBatches.length} Batch Ditemukan)</span>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Status Filter Pills */}
          <div className="role-switcher-badge" style={{ background: '#F1F5F9' }}>
            <button
              className={`role-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
              style={{ color: statusFilter === 'ALL' ? '#FFF' : '#0F172A', padding: '3px 8px', fontSize: '10px' }}
              onClick={() => { setStatusFilter('ALL'); setCurrentPage(1); }}
            >
              Semua ({batchList.length})
            </button>
            <button
              className={`role-btn ${statusFilter === 'AKTIF' ? 'active' : ''}`}
              style={{ color: statusFilter === 'AKTIF' ? '#FFF' : '#0F172A', padding: '3px 8px', fontSize: '10px' }}
              onClick={() => { setStatusFilter('AKTIF'); setCurrentPage(1); }}
            >
              Berjalan ({batchList.filter(b => b.statusMilestone !== 'Selesai Pabrik').length})
            </button>
            <button
              className={`role-btn ${statusFilter === 'SELESAI' ? 'active' : ''}`}
              style={{ color: statusFilter === 'SELESAI' ? '#FFF' : '#0F172A', padding: '3px 8px', fontSize: '10px' }}
              onClick={() => { setStatusFilter('SELESAI'); setCurrentPage(1); }}
            >
              Selesai ({batchList.filter(b => b.statusMilestone === 'Selesai Pabrik').length})
            </button>
          </div>

          {/* Instant Search Bar */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Cari Batch ID / Nama..."
              className="form-input"
              style={{ paddingLeft: '30px', width: '160px', padding: '5px 10px 5px 30px', fontSize: '11px' }}
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
            <Search size={13} color="#94A3B8" style={{ position: 'absolute', left: '10px', top: '7px' }} />
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th style={{ whiteSpace: 'nowrap' }}>Batch ID</th>
              <th style={{ whiteSpace: 'nowrap' }}>Nama Batch</th>
              <th style={{ whiteSpace: 'nowrap' }}>Modal Usaha</th>
              <th style={{ whiteSpace: 'nowrap' }}>Rekening Sumber</th>
              <th style={{ whiteSpace: 'nowrap' }}>Tonase Sekely</th>
              <th style={{ whiteSpace: 'nowrap' }}>Milestone Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBatches.map(b => (
              <tr
                key={b.id}
                onClick={() => onSelectBatch(b.id)}
                style={{
                  background: b.id === selectedBatchId ? 'rgba(255, 80, 0, 0.08)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
              >
                <td style={{ fontWeight: '800', color: '#FF5000', whiteSpace: 'nowrap' }}>{b.id}</td>
                <td style={{ fontWeight: '700', whiteSpace: 'nowrap' }}>{b.namaBatch}</td>
                <td style={{ fontWeight: '700', whiteSpace: 'nowrap' }}>Rp {(b.modalAwalBatch || 150000000).toLocaleString('id-ID')}</td>
                <td style={{ whiteSpace: 'nowrap' }}><span className="badge badge-navy" style={{ whiteSpace: 'nowrap' }}>{b.sumberAkunDana || 'Bank BRI'}</span></td>
                <td style={{ whiteSpace: 'nowrap' }}>{b.beratSekely.toLocaleString('id-ID')} kg</td>
                <td style={{ whiteSpace: 'nowrap' }}><span className="badge badge-success" style={{ whiteSpace: 'nowrap' }}>{b.statusMilestone}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '11px', color: '#64748B' }}>
          <span>Halaman {currentPage} dari {totalPages}</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              className="btn btn-outline"
              style={{ padding: '3px 8px', fontSize: '10px' }}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              Sebelumnya
            </button>
            <button
              className="btn btn-outline"
              style={{ padding: '3px 8px', fontSize: '10px' }}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
