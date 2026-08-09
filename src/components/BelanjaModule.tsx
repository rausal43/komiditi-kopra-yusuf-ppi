import React from 'react';
import { TimbanganModule } from './TimbanganModule';
import { PanjarModule } from './PanjarModule';
import { NotaBelanjaModal } from './NotaBelanjaModal';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Download } from 'lucide-react';

export const BelanjaModule: React.FC = () => {
  const { batchList, belanjaSubTab, setBelanjaSubTab } = useApp();
  const [showNotaModal, setShowNotaModal] = React.useState(false);
  const activeBatchIdForNota = batchList[0]?.id || 'BATCH-2026-08A';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Clean Single Header Bar with Inline Parallel Right Controls */}
      <div className="card" style={{ padding: '14px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingCart color="#FF5000" size={20} />
            <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
              Belanja Kopra & Panjar DP Petani (Gudang Sekely)
            </h2>
          </div>

          {/* Parallel Side-by-Side Right Action Group */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '2px' }}>
            <button
              className="btn btn-outline"
              style={{ padding: '5px 10px', fontSize: '11px', fontWeight: '800', color: '#FF5000', borderColor: '#FF5000', whiteSpace: 'nowrap', flexShrink: 0 }}
              onClick={() => setShowNotaModal(true)}
            >
              <Download size={14} /> Download Nota
            </button>

            <div className="role-switcher-badge" style={{ background: '#F1F5F9', whiteSpace: 'nowrap', flexShrink: 0 }}>
              <button
                className={`role-btn ${belanjaSubTab === 'timbangan' ? 'active' : ''}`}
                style={{ color: belanjaSubTab === 'timbangan' ? '#FFF' : '#0F172A', padding: '4px 10px', whiteSpace: 'nowrap' }}
                onClick={() => setBelanjaSubTab('timbangan')}
              >
                Timbangan
              </button>
              <button
                className={`role-btn ${belanjaSubTab === 'panjar' ? 'active' : ''}`}
                style={{ color: belanjaSubTab === 'panjar' ? '#FFF' : '#0F172A', padding: '4px 10px', whiteSpace: 'nowrap' }}
                onClick={() => setBelanjaSubTab('panjar')}
              >
                Panjar DP
              </button>
            </div>
          </div>
        </div>
      </div>

      {belanjaSubTab === 'timbangan' ? <TimbanganModule /> : <PanjarModule />}

      {showNotaModal && (
        <NotaBelanjaModal batchId={activeBatchIdForNota} onClose={() => setShowNotaModal(false)} />
      )}
    </div>
  );
};
