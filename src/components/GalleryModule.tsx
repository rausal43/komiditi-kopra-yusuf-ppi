import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ImagePreviewModal } from './ImagePreviewModal';
import { GalleryGridView } from './gallery/GalleryGridView';
import { GalleryTableView } from './gallery/GalleryTableView';
import { aggregateMediaItems } from '../utils/mediaAggregator';
import {
  Image as ImageIcon,
  Filter,
  Search,
  Lock,
  Package,
  ShoppingCart,
  Factory,
  Grid,
  List,
} from 'lucide-react';

import { PaginationControl } from './PaginationControl';

export const GalleryModule: React.FC = () => {
  const { activeRole, timbanganList, panjarList, settlementList, batchList } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [batchFilter, setBatchFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [displayLimit, setDisplayLimit] = useState<number>(5);

  const currentRole = activeRole || 'owner';
  const isOwner = currentRole.toLowerCase() === 'owner';

  // Aggregate all media files from timbangan, panjar, settlement, and batches
  const mediaList = useMemo(() => {
    return aggregateMediaItems(timbanganList, panjarList, settlementList, batchList);
  }, [timbanganList, panjarList, settlementList, batchList]);

  // Filtering
  const filteredMedia = useMemo(() => {
    return mediaList.filter(m => {
      const matchesCategory = categoryFilter === 'ALL' || m.category === categoryFilter;
      const matchesBatch = batchFilter === 'ALL' || m.batchId === batchFilter;
      const matchesSearch =
        searchTerm === '' ||
        m.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.detailInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.batchId.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesBatch && matchesSearch;
    });
  }, [mediaList, categoryFilter, batchFilter, searchTerm]);

  // Counts for metric cards
  const countTimbangan = mediaList.filter(m => m.category === 'Timbangan Karung').length;
  const countPanjar = mediaList.filter(m => m.category === 'Panjar DP').length;
  const countSettlement = mediaList.filter(m => m.category === 'Setor Pabrik').length;
  const countShipping = mediaList.filter(m => m.category === 'Pengiriman Kapal').length;

  if (!isOwner) {
    return (
      <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
        <div
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#EF4444',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
          }}
        >
          <Lock size={24} />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>Akses Terbatas (Owner Only)</h3>
        <p style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
          Menu Galeri Media & Arsip Dokumen hanya dapat diakses oleh akun dengan peran Owner.
        </p>
      </div>
    );
  }

  const handleOpenPreview = (url: string, title: string) => {
    setPreviewImageUrl(url);
    setPreviewTitle(title);
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Timbangan Karung':
        return 'badge-navy';
      case 'Panjar DP':
        return 'badge-warning';
      case 'Setor Pabrik':
        return 'badge-success';
      case 'Pengiriman Kapal':
        return 'badge-orange';
      default:
        return 'badge-navy';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header Bar */}
      <div className="card" style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="badge badge-orange" style={{ marginBottom: '4px' }}>Khusus Aksres Owner</span>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ImageIcon size={18} color="#FF5000" /> Galeri Media & Arsip Dokumen R2
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '6px', background: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
            <button
              type="button"
              className={`btn ${viewMode === 'table' ? 'btn-primary' : ''}`}
              style={{ padding: '5px 10px', fontSize: '11px', borderRadius: '6px' }}
              onClick={() => setViewMode('table')}
              title="Tampilan Tabel"
            >
              <List size={14} /> Tabel
            </button>
            <button
              type="button"
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : ''}`}
              style={{ padding: '5px 10px', fontSize: '11px', borderRadius: '6px' }}
              onClick={() => setViewMode('grid')}
              title="Tampilan Grid Thumbnail"
            >
              <Grid size={14} /> Grid
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div className="grid-4">
        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ImageIcon size={12} color="#FF5000" /> Total File Media
          </div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A', marginTop: '2px' }}>
            {mediaList.length} File
          </div>
        </div>

        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShoppingCart size={12} color="#0EA5E9" /> Foto Timbangan Karung
          </div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#0EA5E9', marginTop: '2px' }}>
            {countTimbangan} File
          </div>
        </div>

        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Package size={12} color="#F59E0B" /> Kwitansi Panjar DP
          </div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#F59E0B', marginTop: '2px' }}>
            {countPanjar} File
          </div>
        </div>

        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Factory size={12} color="#10B981" /> Nota Pabrik & Shipping
          </div>
          <div style={{ fontSize: '15px', fontWeight: '800', color: '#10B981', marginTop: '2px' }}>
            {countSettlement + countShipping} File
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: '1 1 140px', minWidth: '0' }}>
            <Filter size={14} color="#FF5000" />
            <select
              className="form-select"
              style={{ width: '100%', padding: '6px 8px', fontSize: '11px' }}
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">Semua Kategori</option>
              <option value="Timbangan Karung">Timbangan Karung</option>
              <option value="Panjar DP">Panjar DP</option>
              <option value="Setor Pabrik">Setor Pabrik</option>
              <option value="Pengiriman Kapal">Pengiriman Kapal</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: '1 1 120px', minWidth: '0' }}>
            <select
              className="form-select"
              style={{ width: '100%', padding: '6px 8px', fontSize: '11px' }}
              value={batchFilter}
              onChange={e => setBatchFilter(e.target.value)}
            >
              <option value="ALL">Semua Batch</option>
              {[...batchList].sort((a, b) => b.id.localeCompare(a.id)).map((b: any) => (
                <option key={b.id} value={b.id}>{b.id}</option>
              ))}
            </select>
          </div>

          <div style={{ position: 'relative', flex: '1 1 140px', minWidth: '0' }}>
            <input
              type="text"
              placeholder="Cari media..."
              className="form-input"
              style={{ paddingLeft: '28px', width: '100%', padding: '6px 8px 6px 28px', fontSize: '11px' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Search size={13} color="#94A3B8" style={{ position: 'absolute', left: '8px', top: '8px' }} />
          </div>
        </div>
      </div>

      {/* Main Content View: Table or Grid (Batched 5 Items per Load) */}
      {filteredMedia.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>
          <ImageIcon size={32} color="#94A3B8" style={{ marginBottom: '8px' }} />
          <div style={{ fontSize: '13px', fontWeight: '700' }}>Belum Ada Media Ditemukan</div>
          <div style={{ fontSize: '11px', marginTop: '4px' }}>
            Silakan ubah filter atau upload foto nota/timbangan pada transaksi belanja, panjar, atau settlement.
          </div>
        </div>
      ) : (
        <>
          {viewMode === 'table' ? (
            <GalleryTableView
              mediaItems={filteredMedia.slice(0, displayLimit)}
              getCategoryBadgeClass={getCategoryBadgeClass}
              onPreview={handleOpenPreview}
            />
          ) : (
            <GalleryGridView
              mediaItems={filteredMedia.slice(0, displayLimit)}
              getCategoryBadgeClass={getCategoryBadgeClass}
              onPreview={handleOpenPreview}
            />
          )}

          <PaginationControl
            currentCount={Math.min(displayLimit, filteredMedia.length)}
            totalCount={filteredMedia.length}
            pageSize={5}
            onLoadMore={() => setDisplayLimit(prev => prev + 5)}
            onReset={() => setDisplayLimit(5)}
          />
        </>
      )}

      {previewImageUrl && (
        <ImagePreviewModal
          imageUrl={previewImageUrl}
          title={previewTitle || 'Pratinjau Media Galeri'}
          onClose={() => setPreviewImageUrl(null)}
        />
      )}
    </div>
  );
};
