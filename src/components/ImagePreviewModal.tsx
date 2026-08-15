import React from 'react';
import { X, Download } from 'lucide-react';

interface ImagePreviewModalProps {
  imageUrl: string;
  title?: string;
  onClose: () => void;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  imageUrl,
  title = 'Pratinjau Foto / Dokumen',
  onClose,
}) => {
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(4px)',
        zIndex: 3500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '750px',
          width: '100%',
          maxHeight: '90vh',
          background: '#0F172A',
          color: '#FFFFFF',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>{title}</div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#94A3B8' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body / Image View */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#020617',
            minHeight: '260px',
          }}
        >
          <img
            src={imageUrl}
            alt={title}
            style={{
              maxWidth: '100%',
              maxHeight: '65vh',
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
            }}
          />
        </div>

        {/* Footer with Download Button Only */}
        <div
          style={{
            padding: '14px 18px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#0F172A',
          }}
        >
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="btn btn-primary"
            style={{
              fontSize: '12px',
              padding: '8px 20px',
              borderRadius: '99px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              fontWeight: '700',
            }}
          >
            <Download size={15} /> Download Foto / Dokumen
          </a>
        </div>
      </div>
    </div>
  );
};
