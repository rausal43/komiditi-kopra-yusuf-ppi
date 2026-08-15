import React from 'react';
import { Plus, Trash2, Camera, Loader2, Droplets } from 'lucide-react';

export interface KarungRow {
  berat: number | '';
  kadarAir: number | '';
  fotoUrl?: string;
}

interface TimbanganKarungFormProps {
  karungRows: KarungRow[];
  uploadingIndex: number | null;
  taraPerKarung: number | '';
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  onUpdateRow: (index: number, field: 'berat' | 'kadarAir', value: number | '') => void;
  onPhotoUpload: (index: number, file: File) => void;
  onRemovePhoto: (index: number) => void;
  onPreviewPhoto: (url: string) => void;
  onTaraChange: (val: number | '') => void;
}

export const TimbanganKarungForm: React.FC<TimbanganKarungFormProps> = ({
  karungRows,
  uploadingIndex,
  taraPerKarung,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
  onPhotoUpload,
  onRemovePhoto,
  onPreviewPhoto,
  onTaraChange,
}) => {
  const fileInputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const tblHeaderStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: '800',
    color: '#64748B',
    padding: '6px 8px',
    textAlign: 'center',
    borderBottom: '2px solid #E2E8F0',
    whiteSpace: 'nowrap',
  };

  const tblCellStyle: React.CSSProperties = {
    padding: '4px 4px',
    textAlign: 'center',
    verticalAlign: 'middle',
  };

  const miniInputStyle: React.CSSProperties = {
    width: '100%',
    padding: '7px 8px',
    fontSize: '13px',
    fontWeight: '700',
    border: '1.5px solid #E2E8F0',
    borderRadius: '8px',
    textAlign: 'center',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: '#FAFBFC',
  };

  return (
    <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '10px 12px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label className="form-label" style={{ margin: 0, fontSize: '11px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Droplets size={14} color="#FF5000" /> Dynamic Rincian Karung ({karungRows.length} Koli)
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '10px', color: '#64748B', fontWeight: '700' }}>Tara/Karung:</span>
          <input
            type="number"
            step="0.1"
            className="form-input"
            style={{ width: '55px', padding: '4px 6px', fontSize: '11px', fontWeight: '800', textAlign: 'center' }}
            value={taraPerKarung}
            onChange={e => onTaraChange(e.target.value ? parseFloat(e.target.value) : '')}
          />
          <span style={{ fontSize: '10px', color: '#64748B' }}>kg</span>
        </div>
      </div>

      <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #F1F5F9', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...tblHeaderStyle, width: '32px' }}>#</th>
              <th style={tblHeaderStyle}>Berat (kg)</th>
              <th style={tblHeaderStyle}>Kadar Air (%)</th>
              <th style={{ ...tblHeaderStyle, width: '65px' }}>Foto</th>
              <th style={{ ...tblHeaderStyle, width: '36px' }}>Hapus</th>
            </tr>
          </thead>
          <tbody>
            {karungRows.map((row, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                <td style={{ ...tblCellStyle, fontSize: '11px', fontWeight: '800', color: '#64748B' }}>
                  {idx + 1}
                </td>
                <td style={tblCellStyle}>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    style={miniInputStyle}
                    value={row.berat}
                    onChange={e => onUpdateRow(idx, 'berat', e.target.value ? parseFloat(e.target.value) : '')}
                    required={idx === 0}
                  />
                </td>
                <td style={tblCellStyle}>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="6.0"
                    style={{ ...miniInputStyle, color: (typeof row.kadarAir === 'number' && row.kadarAir > 6.0) ? '#FF5000' : '#0F172A' }}
                    value={row.kadarAir}
                    onChange={e => onUpdateRow(idx, 'kadarAir', e.target.value ? parseFloat(e.target.value) : '')}
                  />
                </td>
                <td style={tblCellStyle}>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    style={{ display: 'none' }}
                    ref={el => { fileInputRefs.current[idx] = el; }}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) onPhotoUpload(idx, file);
                    }}
                  />
                  {uploadingIndex === idx ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Mengunggah ke Cloudflare R2...">
                      <Loader2 size={16} className="animate-spin" color="#FF5000" />
                    </div>
                  ) : row.fotoUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'center' }}>
                      <img
                        src={row.fotoUrl}
                        alt="Karung"
                        style={{ width: '26px', height: '26px', borderRadius: '4px', objectFit: 'cover', cursor: 'pointer', border: '1px solid #FF5000' }}
                        onClick={() => onPreviewPhoto(row.fotoUrl!)}
                        title="Klik untuk melihat foto"
                      />
                      <button
                        type="button"
                        onClick={() => onRemovePhoto(idx)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '1px' }}
                        title="Hapus Foto"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[idx]?.click()}
                      style={{
                        background: '#F1F5F9', border: '1px dashed #CBD5E1', borderRadius: '6px',
                        padding: '4px 6px', color: '#64748B', cursor: 'pointer', fontSize: '9px', fontWeight: '700',
                        display: 'inline-flex', alignItems: 'center', gap: '2px',
                      }}
                      title="Ambil foto timbangan karung"
                    >
                      <Camera size={11} color="#FF5000" />
                    </button>
                  )}
                </td>
                <td style={tblCellStyle}>
                  <button
                    type="button"
                    onClick={() => onRemoveRow(idx)}
                    disabled={karungRows.length <= 1}
                    style={{
                      background: 'none', border: 'none', color: karungRows.length <= 1 ? '#CBD5E1' : '#EF4444',
                      cursor: karungRows.length <= 1 ? 'not-allowed' : 'pointer', padding: '4px',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        className="btn btn-outline"
        onClick={onAddRow}
        style={{
          width: '100%', marginTop: '8px', padding: '6px', fontSize: '11px',
          borderRadius: '8px', justifyContent: 'center', borderStyle: 'dashed',
          color: '#FF5000', borderColor: '#FF5000', background: 'rgba(255,80,0,0.03)',
        }}
      >
        <Plus size={14} /> + Tambah Baris Karung Baru
      </button>
    </div>
  );
};
