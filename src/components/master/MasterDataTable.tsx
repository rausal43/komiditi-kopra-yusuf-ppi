import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface MasterDataTableProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  items: string[];
  inputValue: string;
  inputPlaceholder: string;
  categoryBadgeText: string;
  categoryBadgeClass?: string;
  statusBadgeText: string;
  canEditOrDelete: boolean;
  onInputChange: (val: string) => void;
  onAdd: (e: React.FormEvent) => void;
  onStartEdit: (name: string) => void;
  onDelete: (name: string) => void;
}

export const MasterDataTable: React.FC<MasterDataTableProps> = ({
  title,
  icon: Icon,
  iconColor,
  items,
  inputValue,
  inputPlaceholder,
  categoryBadgeText,
  categoryBadgeClass = 'badge-navy',
  statusBadgeText,
  canEditOrDelete,
  onInputChange,
  onAdd,
  onStartEdit,
  onDelete,
}) => {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Icon size={16} color={iconColor} /> {title}
        </h3>

        <form onSubmit={onAdd} style={{ display: 'flex', gap: '6px', width: '100%', maxWidth: '320px' }}>
          <input
            type="text"
            className="form-input"
            style={{ padding: '6px 10px', fontSize: '11px' }}
            placeholder={inputPlaceholder}
            value={inputValue}
            onChange={e => onInputChange(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ fontSize: '11px', padding: '6px 12px', flexShrink: 0 }}>
            + Tambah
          </button>
        </form>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>No</th>
              <th>Nama Master Data</th>
              <th>Kategori</th>
              <th>Status</th>
              <th style={{ width: '140px' }}>Aksi (CRUD)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={item}>
                <td style={{ fontWeight: '800', color: '#64748B' }}>{idx + 1}</td>
                <td style={{ fontWeight: '700', color: '#0F172A' }}>{item}</td>
                <td><span className={`badge ${categoryBadgeClass}`}>{categoryBadgeText}</span></td>
                <td><span className="badge badge-success">{statusBadgeText}</span></td>
                <td>
                  {canEditOrDelete ? (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ padding: '3px 7px', fontSize: '10px', color: '#FF5000', borderColor: '#FF5000' }}
                        onClick={() => onStartEdit(item)}
                        title="Ubah Nama"
                      >
                        <Edit3 size={11} /> Ubah
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ padding: '3px 7px', fontSize: '10px', color: '#EF4444', borderColor: '#FCA5A5' }}
                        onClick={() => onDelete(item)}
                        title="Hapus"
                      >
                        <Trash2 size={11} /> Hapus
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '10px', color: '#CBD5E1' }}>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
