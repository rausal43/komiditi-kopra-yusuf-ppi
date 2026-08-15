import React from 'react';
import { Eye, Download } from 'lucide-react';

export interface MediaItem {
  id: string;
  url: string;
  category: 'Timbangan Karung' | 'Panjar DP' | 'Setor Pabrik' | 'Pengiriman Kapal';
  batchId: string;
  tgl: string;
  keterangan: string;
  detailInfo: string;
}

interface GalleryGridViewProps {
  mediaItems: MediaItem[];
  getCategoryBadgeClass: (category: string) => string;
  onPreview: (url: string, title: string) => void;
}

export const GalleryGridView: React.FC<GalleryGridViewProps> = ({
  mediaItems,
  getCategoryBadgeClass,
  onPreview,
}) => {
  return (
    <div className="gallery-photo-grid">
      {mediaItems.map(m => (
        <div
          key={m.id}
          className="card"
          style={{
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            minWidth: 0,
            maxWidth: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <div
            onClick={() => onPreview(m.url, m.keterangan)}
            style={{
              width: '100%',
              height: '120px',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#0F172A',
              cursor: 'pointer',
              position: 'relative',
              border: '1px solid #E2E8F0',
            }}
          >
            <img
              src={m.url}
              alt={m.keterangan}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <span
              className={`badge ${getCategoryBadgeClass(m.category)}`}
              style={{ position: 'absolute', top: '6px', left: '6px', fontSize: '9px', padding: '1px 6px', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
            >
              {m.category}
            </span>
          </div>

          <div>
            <div style={{ fontSize: '10px', fontWeight: '800', color: '#0F172A', lineHeight: '1.2' }}>{m.keterangan}</div>
            <div style={{ fontSize: '9px', color: '#FF5000', fontWeight: '700', marginTop: '2px' }}>Batch: {m.batchId}</div>
            <div style={{ fontSize: '9px', color: '#64748B', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.detailInfo}</div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '6px', display: 'flex', gap: '4px' }}>
            <button
              type="button"
              onClick={() => onPreview(m.url, m.keterangan)}
              style={{
                flex: 1,
                background: '#FF5000',
                color: '#FFF',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 4px',
                fontSize: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
              }}
            >
              <Eye size={12} /> Lihat Foto
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
                padding: '5px 8px',
                color: '#334155',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: '700',
                textDecoration: 'none',
              }}
              title="Download File"
            >
              <Download size={12} />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
