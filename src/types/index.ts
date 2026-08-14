export type Role = 'sekely' | 'owner' | 'logistik' | 'OWNER' | 'LOGISTIK' | 'SEKELY';

export type MilestoneStatus = 
  | 'Gudang Sekely'
  | 'Feeder Sekely-Tobelo'
  | 'Pelabuhan Tobelo'
  | 'Sabuk Nusantara'
  | 'Pelabuhan Bitung'
  | 'Truk Bitung'
  | 'Selesai Pabrik'
  | 'Loading Feeder'
  | 'Unloading Bitung';

export type PaymentMethod = 'BRI' | 'BNI' | 'BRILink' | 'Cash';

export interface BatchShipment {
  id: string;
  namaBatch: string;
  tglMulai: string;
  targetTonase: number;
  beratSekely: number;
  modalAwalBatch: number;
  sumberAkunDana: string;
  statusMilestone: MilestoneStatus;
  lokasiSaatIni: string;
  biayaUpahPanggul: number;
  biayaSewaFeeder: number;
  biayaFreightSabuk: number;
  biayaUangJalan: number;
  biayaTruckingBitung: number;
  biayaAdminBriLink: number;
  timbanganIds: string[];
  catatan: string;
}

export interface KarungItem {
  berat: number;
  kadarAir: number;
  fotoUrl?: string;
}

export interface TimbanganKarung {
  id: string;
  tgl: string;
  namaTuanToko: string;
  rincianKarung: number[];
  karungItems?: KarungItem[];
  totalGross: number;
  taraKarung: number;
  totalNetto: number;
  kadarAir?: number;
  kadarAirPerKarung?: number[];
  fotoPerKarung?: string[];
  hargaBeliPerKg: number;
  totalNominalBeli: number;
  panjarDpId?: string;
  potonganDp: number;
  sisaPelunasan: number;
  notaUrl?: string;
  batchId?: string;
}

export interface PanjarDP {
  id: string;
  noKwitansi: string;
  tgl: string;
  namaPenerima: string;
  nominalDp: number;
  bank: PaymentMethod;
  noRekening: string;
  status: 'Belum Lunas' | 'Sisa Pelunasan' | 'Lunas';
  buktiUrl?: string;
  catatan?: string;
  batchId?: string;
}

export interface PabrikSettlement {
  id: string;
  tglSettlement?: string;
  batchId: string;
  pabrikTujuan: 'Wilmar Bitung' | 'Agro Bitung';
  beratGrossPabrik: number;
  potonganRafaksiPabrik?: number;
  beratNettoFinalPabrik: number;
  hargaAcuanPabrik: number;
  totalPenerimaanPabrik: number;
  totalHppBatch: number;
  nettProfitMargin: number;
  persenSusutPabrik?: number;
  tglMasukPabrik?: string;
  kadarAirLabPercent?: number;
  potonganKadarAirKg?: number;
  susutTonasePercent?: number;
  statusApproval?: string;
  lampiranNotaPabrikUrl?: string;
  fotoNotaTimbangPabrik?: string;
}

export type SettlementPabrik = PabrikSettlement;

export interface PriceSetting {
  hargaAcuanPabrikWilmar: number;
  batasBeliGudangSekely: number;
  daftarAkunOwner: string[];
}

export type MasterPriceSetting = PriceSetting;

export interface AIWeeklyReport {
  id: string;
  tgl?: string;
  ringkasanEksekutif?: string;
  rekomendasiTindakan?: string[];
  skorEfisiensi?: number;
  tglGenerated?: string;
  periodeLabel?: string;
  statusKirimGmail?: string;
  emailKlien?: string;
  narasiBisnis?: string;
  uptimePercent?: string;
  blockedThreats?: number;
  avgSpeedSeconds?: number;
  totalVisitors?: number;
}
