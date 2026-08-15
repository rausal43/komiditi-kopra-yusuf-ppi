import React from 'react';
import { Eye, Download } from 'lucide-react';
import type { MediaItem } from './GalleryGridView';

interface GalleryTableViewProps {
  mediaItems: MediaItem[];
  getCategoryBadgeClass: (category: string) => string;
  onPreview: (url: string, title: string) => void;
}

export const GalleryTableView: React.FC<GalleryTableViewProps> = ({
  mediaItems,
  getCategoryBadgeClass,
  onPreview,
}) => {
  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Pratinjau</th>
              <th>Kategori</th>
              <th>Batch ID</th>
              <th>Tanggal</th>
              <th>Keterangan / Rincian</th>
              <th>Rincian Transaksi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {mediaItems.map(m => (
              <tr key={m.id}>
                <td>
                  <div
                    onClick={() => onPreview(m.url, m.keterangan)}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#0F172A',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #E2E8F0',
                    }}
                    title="Klik untuk memperbesar pratinjau"
                  >
                    <img
                      src={m.url}
                      alt={m.keterangan}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </td>
                <td>
                  <span className={`badge ${getCategoryBadgeClass(m.category)}`}>{m.category}</span>
                </td>
                <td style={{ fontWeight: '800', color: '#FF5000' }}>{m.batchId}</td>
                <td>{m.tgl}</td>
                <td style={{ fontWeight: '700', color: '#0F172A' }}>{m.keterangan}</td>
                <td style={{ fontSize: '11px', color: '#475569' }}>{m.detailInfo}</td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => onPreview(m.url, m.keterangan)}
                      style={{
                        background: 'rgba(255, 80, 0, 0.1)',
                        border: '1px solid rgba(255, 80, 0, 0.3)',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        color: '#FF5000',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '10px',
                        fontWeight: '700',
                      }}
                      title="Pratinjau Foto"
                    >
                      <Eye size={12} /> Pratinjau
                    </button>
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      style={{
                        background: '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        color: '#334155',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '10px',
                        fontWeight: '700',
                        textDecoration: 'none',
                      }}
                      title="Download Foto"
                    >
                      <Download size={12} /> Download
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
