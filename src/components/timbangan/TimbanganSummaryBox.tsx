import React from 'react';

interface TimbanganSummaryBoxProps {
  totalGross: number;
  totalTara: number;
  totalNettoTimbang: number;
  avgKadarAir: number;
  rafaksiPercent: number;
  potonganKadarAirKg: number;
  nettoBayarFinal: number;
  hargaBeliStr: string;
  totalNominalBeli: number;
  onHargaBeliChange: (val: string) => void;
}

export const TimbanganSummaryBox: React.FC<TimbanganSummaryBoxProps> = ({
  totalGross,
  totalTara,
  totalNettoTimbang,
  avgKadarAir,
  rafaksiPercent,
  potonganKadarAirKg,
  nettoBayarFinal,
  hargaBeliStr,
  totalNominalBeli,
  onHargaBeliChange,
}) => {
  return (
    <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '14px', padding: '10px 12px', marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
        <span style={{ color: '#64748B' }}>Total Gross Timbang:</span>
        <strong style={{ color: '#0F172A' }}>{totalGross.toLocaleString('id-ID')} kg</strong>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
        <span style={{ color: '#64748B' }}>Total Potongan Tara Karung:</span>
        <strong style={{ color: '#EF4444' }}>- {totalTara.toLocaleString('id-ID')} kg</strong>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
        <span style={{ color: '#64748B' }}>Netto Setelah Tara:</span>
        <strong style={{ color: '#0F172A' }}>{totalNettoTimbang.toLocaleString('id-ID')} kg</strong>
      </div>

      <div style={{ borderTop: '1px dashed #E2E8F0', paddingTop: '6px', marginTop: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
          <span style={{ color: '#64748B' }}>Rata-Rata Kadar Air:</span>
          <strong style={{ color: avgKadarAir > 6.0 ? '#FF5000' : '#10B981' }}>{avgKadarAir.toFixed(1)}% {avgKadarAir > 6.0 && `(Rafaksi: ${rafaksiPercent.toFixed(1)}%)`}</strong>
        </div>
        {potonganKadarAirKg > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
            <span style={{ color: '#64748B' }}>Potongan Rafaksi Kadar Air:</span>
            <strong style={{ color: '#EF4444' }}>- {potonganKadarAirKg.toFixed(1)} kg</strong>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800', marginTop: '4px' }}>
          <span style={{ color: '#0F172A' }}>Netto Final Bayar:</span>
          <strong style={{ color: '#FF5000', fontSize: '13px' }}>{nettoBayarFinal.toFixed(1)} kg</strong>
        </div>
      </div>

      <div style={{ borderTop: '1.5px solid #E2E8F0', paddingTop: '8px', marginTop: '8px' }}>
        <div className="grid-2" style={{ alignItems: 'center' }}>
          <div>
            <label className="form-label" style={{ fontSize: '10px', margin: 0 }}>Harga Beli Gudang / kg</label>
            <input
              type="text"
              className="form-input"
              style={{ fontSize: '12px', fontWeight: '800', padding: '6px 8px', color: '#10B981' }}
              value={hargaBeliStr}
              onChange={e => onHargaBeliChange(e.target.value)}
              required
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700' }}>Total Beli Kopra:</div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#10B981' }}>
              Rp {totalNominalBeli.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
