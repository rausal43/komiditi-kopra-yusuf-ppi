import type { BatchShipment, TimbanganKarung, PanjarDP, PabrikSettlement, PriceSetting, AIWeeklyReport, KarungItem } from '../types';

export const initialPriceSetting: PriceSetting = {
  hargaAcuanPabrikWilmar: 14800,
  batasBeliGudangSekely: 12200,
  daftarAkunOwner: [
    'Bank BRI Sekely (Operasional)',
    'Bank BCA Owner (Utama)',
    'Kas Cash Gudang Sekely',
    'BRILink Agen Sekely',
  ],
};

export const initialBatchList: BatchShipment[] = [
  {
    id: 'BATCH-2026-08A',
    namaBatch: 'Batch #08A - Halmahera to Bitung',
    tglMulai: '2026-08-01',
    targetTonase: 10500,
    beratSekely: 10240,
    modalAwalBatch: 150000000,
    sumberAkunDana: 'Bank BRI Sekely (Operasional)',
    statusMilestone: 'Sabuk Nusantara',
    lokasiSaatIni: 'Pelayaran Laut Maluku - Menuju Bitung',
    biayaUpahPanggul: 1250000,
    biayaSewaFeeder: 2500000,
    biayaFreightSabuk: 4500000,
    biayaUangJalan: 1800000,
    biayaTruckingBitung: 3200000,
    biayaAdminBriLink: 150000,
    timbanganIds: ['t-1', 't-2'],
    catatan: 'Pengiriman utama pekan 1 Agustus 2026',
  },
  {
    id: 'BATCH-2026-07B',
    namaBatch: 'Batch #07B - Halmahera to Wilmar Bitung',
    tglMulai: '2026-07-20',
    targetTonase: 10000,
    beratSekely: 10150,
    modalAwalBatch: 140000000,
    sumberAkunDana: 'Bank BCA Owner (Utama)',
    statusMilestone: 'Selesai Pabrik',
    lokasiSaatIni: 'Setor Wilmar Bitung (Lunas)',
    biayaUpahPanggul: 1200000,
    biayaSewaFeeder: 2400000,
    biayaFreightSabuk: 4400000,
    biayaUangJalan: 1700000,
    biayaTruckingBitung: 3100000,
    biayaAdminBriLink: 140000,
    timbanganIds: ['t-3'],
    catatan: 'Settlement Wilmar sukses',
  },
];

export const initialBatch = initialBatchList;

export const initialPanjarList: PanjarDP[] = [
  {
    id: 'p-1',
    noKwitansi: 'KS 29',
    tgl: '2026-08-01',
    namaPenerima: 'Sahbudin Jabai',
    nominalDp: 20000000,
    bank: 'BRILink',
    noRekening: 'BRILink Agen Sekely',
    status: 'Sisa Pelunasan',
    buktiUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
    catatan: 'Panjar DP pengadaan 2 ton kopra',
    batchId: 'BATCH-2026-08A',
  },
  {
    id: 'p-2',
    noKwitansi: 'KS 30',
    tgl: '2026-08-03',
    namaPenerima: 'Umar Talib',
    nominalDp: 15000000,
    bank: 'BRI',
    noRekening: 'BRI 09412-004-9128',
    status: 'Belum Lunas',
    buktiUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
    catatan: 'DP kopra penjemuran Tobelo',
    batchId: 'BATCH-2026-08A',
  },
];

export const initialPanjar = initialPanjarList;

export const initialTimbanganList: TimbanganKarung[] = [
  {
    id: 't-1',
    tgl: '2026-08-02',
    namaTuanToko: 'Om Hadi Tobelo',
    rincianKarung: [77, 76, 77, 72, 80],
    karungItems: [
      { berat: 77, kadarAir: 6.5 },
      { berat: 76, kadarAir: 6.8 },
      { berat: 77, kadarAir: 6.2 },
      { berat: 72, kadarAir: 7.0 },
      { berat: 80, kadarAir: 6.0 },
    ],
    kadarAirPerKarung: [6.5, 6.8, 6.2, 7.0, 6.0],
    totalGross: 382,
    taraKarung: 6,
    totalNetto: 376,
    kadarAir: 6.5,
    hargaBeliPerKg: 12200,
    totalNominalBeli: 4587200,
    panjarDpId: 'p-1',
    potonganDp: 3000000,
    sisaPelunasan: 1587200,
    notaUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=400',
    batchId: 'BATCH-2026-08A',
  },
  {
    id: 't-2',
    tgl: '2026-08-04',
    namaTuanToko: 'Tuan Jabai',
    rincianKarung: [85, 84, 86, 85, 82, 84],
    karungItems: [
      { berat: 85, kadarAir: 7.0 },
      { berat: 84, kadarAir: 7.2 },
      { berat: 86, kadarAir: 6.8 },
      { berat: 85, kadarAir: 7.1 },
      { berat: 82, kadarAir: 7.0 },
      { berat: 84, kadarAir: 6.9 },
    ],
    kadarAirPerKarung: [7.0, 7.2, 6.8, 7.1, 7.0, 6.9],
    totalGross: 506,
    taraKarung: 6,
    totalNetto: 500,
    kadarAir: 7.0,
    hargaBeliPerKg: 12200,
    totalNominalBeli: 6100000,
    potonganDp: 0,
    sisaPelunasan: 6100000,
    notaUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=400',
    batchId: 'BATCH-2026-08A',
  },
];

export const initialTimbangan = initialTimbanganList;

export const initialSettlementList: PabrikSettlement[] = [
  {
    id: 's-1',
    tglSettlement: '2026-07-28',
    batchId: 'BATCH-2026-07B',
    pabrikTujuan: 'Wilmar Bitung',
    beratGrossPabrik: 10150,
    potonganRafaksiPabrik: 70,
    beratNettoFinalPabrik: 10080,
    hargaAcuanPabrik: 14800,
    totalPenerimaanPabrik: 149184000,
    totalHppBatch: 138840000,
    nettProfitMargin: 10344000,
    persenSusutPabrik: 0.69,
    lampiranNotaPabrikUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
  },
];

export const initialSettlement = initialSettlementList;

export const initialAIReports: AIWeeklyReport[] = [
  {
    id: 'air-1',
    tgl: '2026-08-07',
    ringkasanEksekutif: 'Margin bersih Batch #08A mencapai Rp 10.3 Jt (7.4% ROI) dengan susut tonase Bitung di bawah 0.7%.',
    rekomendasiTindakan: [
      'Pertahankan batas beli Gudang Sekely di Rp 12.200/kg',
      'Optimalkan pengangkutan Kapal Sabuk Nusantara pekan depan',
    ],
    skorEfisiensi: 92,
  },
];
