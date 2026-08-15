import React from 'react';
import type { BatchShipment } from '../../types';
import { Filter } from 'lucide-react';

interface BatchFilterSelectProps {
  batchList: BatchShipment[];
  selectedBatchId: string;
  onChange: (val: string) => void;
  width?: string;
  showLabel?: boolean;
}

export const BatchFilterSelect: React.FC<BatchFilterSelectProps> = ({
  batchList,
  selectedBatchId,
  onChange,
  width = '160px',
  showLabel = true,
}) => {
  const sortedBatches = [...batchList].sort((a, b) => b.id.localeCompare(a.id));

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <Filter size={14} color="#FF5000" />
      {showLabel && <span style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A' }}>Filter Batch:</span>}
      <select
        className="form-select"
        style={{ width, padding: '6px 10px', fontSize: '11px' }}
        value={selectedBatchId}
        onChange={e => onChange(e.target.value)}
      >
        <option value="ALL">Semua Batch</option>
        {sortedBatches.map(b => (
          <option key={b.id} value={b.id}>{b.id}</option>
        ))}
      </select>
    </div>
  );
};
