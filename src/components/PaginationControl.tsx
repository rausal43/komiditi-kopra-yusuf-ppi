import React from 'react';
import { ChevronDown, RefreshCw } from 'lucide-react';

interface PaginationControlProps {
  currentCount: number;
  totalCount: number;
  pageSize?: number;
  onLoadMore: () => void;
  onReset?: () => void;
}

export const PaginationControl: React.FC<PaginationControlProps> = ({
  currentCount,
  totalCount,
  pageSize = 5,
  onLoadMore,
  onReset,
}) => {
  if (totalCount <= pageSize) return null;

  const hasMore = currentCount < totalCount;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
      {hasMore ? (
        <button
          type="button"
          className="btn btn-outline"
          onClick={onLoadMore}
          style={{
            borderRadius: '99px',
            fontSize: '11px',
            fontWeight: '700',
            padding: '7px 18px',
            borderColor: '#FF5000',
            color: '#FF5000',
            background: 'rgba(255, 80, 0, 0.05)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <ChevronDown size={14} /> Muat {Math.min(pageSize, totalCount - currentCount)} Data/Foto Lagi (Tampil {currentCount} dari {totalCount})
        </button>
      ) : (
        <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Menampilkan Seluruh {totalCount} Data (Optimasi Load Balancing 5 Data)</span>
          {onReset && currentCount > pageSize && (
            <button
              type="button"
              onClick={onReset}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: '700',
                textDecoration: 'underline',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <RefreshCw size={11} /> Riset ke 5 Data
            </button>
          )}
        </div>
      )}
    </div>
  );
};
