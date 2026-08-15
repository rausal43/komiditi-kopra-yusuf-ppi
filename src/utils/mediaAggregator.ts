import type { TimbanganKarung, PanjarDP, SettlementPabrik, BatchShipment } from '../types';
import type { MediaItem } from '../components/gallery/GalleryGridView';

export function aggregateMediaItems(
  timbanganList: TimbanganKarung[],
  panjarList: PanjarDP[],
  settlementList: SettlementPabrik[],
  batchList: BatchShipment[]
): MediaItem[] {
  const items: MediaItem[] = [];

  timbanganList.forEach(t => {
    if (t.fotoPerKarung && Array.isArray(t.fotoPerKarung)) {
      t.fotoPerKarung.forEach((foto: string, idx: number) => {
        if (foto && foto.trim() !== '') {
          items.push({
            id: `timb-${t.id}-${idx}`,
            url: foto,
            category: 'Timbangan Karung',
            batchId: t.batchId || 'BATCH-UNKNOWN',
            tgl: t.tgl || '2026-08-09',
            keterangan: `Foto Karung Timbangan #${idx + 1} - Toko: ${t.namaTuanToko}`,
            detailInfo: `${t.rincianKarung.length} Koli | Gross: ${t.totalGross} kg | Netto: ${t.totalNetto} kg | Rp ${t.totalNominalBeli.toLocaleString('id-ID')}`,
          });
        }
      });
    }

    if (t.notaUrl && t.notaUrl.trim() !== '') {
      items.push({
        id: `timb-nota-${t.id}`,
        url: t.notaUrl,
        category: 'Timbangan Karung',
        batchId: t.batchId || 'BATCH-UNKNOWN',
        tgl: t.tgl || '2026-08-09',
        keterangan: `Nota / Resi Timbangan - Toko: ${t.namaTuanToko}`,
        detailInfo: `Netto: ${t.totalNetto} kg | Rp ${t.totalNominalBeli.toLocaleString('id-ID')}`,
      });
    }
  });

  panjarList.forEach(p => {
    if (p.buktiUrl && p.buktiUrl.trim() !== '') {
      items.push({
        id: `panjar-${p.id}`,
        url: p.buktiUrl,
        category: 'Panjar DP',
        batchId: p.batchId || 'BATCH-UNKNOWN',
        tgl: p.tgl || '2026-08-09',
        keterangan: `Foto Kwitansi DP - Petani: ${p.namaPenerima}`,
        detailInfo: `No. Kwitansi: ${p.noKwitansi} | Nominal: Rp ${p.nominalDp.toLocaleString('id-ID')} | Bank: ${p.bank}`,
      });
    }
  });

  settlementList.forEach(s => {
    const notaUrl = s.fotoNotaTimbangPabrik || s.lampiranNotaPabrikUrl;
    if (notaUrl && notaUrl.trim() !== '') {
      items.push({
        id: `settle-${s.id}`,
        url: notaUrl,
        category: 'Setor Pabrik',
        batchId: s.batchId || 'BATCH-UNKNOWN',
        tgl: s.tglSettlement || '2026-08-09',
        keterangan: `Nota Timbang Pabrik Bitung`,
        detailInfo: `Netto Final: ${s.beratNettoFinalPabrik.toLocaleString('id-ID')} kg | Lab: ${s.kadarAirLabPercent}% | Total Penerimaan: Rp ${s.totalPenerimaanPabrik.toLocaleString('id-ID')}`,
      });
    }
  });

  batchList.forEach(b => {
    if ((b as any).fotoUrl && String((b as any).fotoUrl).trim() !== '') {
      items.push({
        id: `batch-${b.id}`,
        url: (b as any).fotoUrl,
        category: 'Pengiriman Kapal',
        batchId: b.id,
        tgl: '2026-08-09',
        keterangan: `Bukti Shipping & Milestone Pelayaran`,
        detailInfo: `Status: ${b.statusMilestone} | Lokasi: ${b.lokasiSaatIni} | Tonase: ${(b.beratSekely / 1000).toFixed(2)} Ton`,
      });
    }
  });

  return items;
}
