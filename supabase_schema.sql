-- =============================================
-- SQL SCHEMA FOR SUPABASE DATABASE (KOMODITI KOPRA)
-- Paste & Run ini di Supabase SQL Editor
-- =============================================

-- 1. Table: Batches
CREATE TABLE IF NOT EXISTS public.batches (
  id TEXT PRIMARY KEY,
  "namaBatch" TEXT NOT NULL,
  "tglMulai" DATE,
  "targetTonase" NUMERIC DEFAULT 0,
  "beratSekely" NUMERIC DEFAULT 0,
  "modalAwalBatch" NUMERIC DEFAULT 0,
  "sumberAkunDana" TEXT,
  "statusMilestone" TEXT DEFAULT 'Gudang Sekely',
  "lokasiSaatIni" TEXT,
  "biayaUpahPanggul" NUMERIC DEFAULT 0,
  "biayaSewaFeeder" NUMERIC DEFAULT 0,
  "biayaFreightSabuk" NUMERIC DEFAULT 0,
  "biayaUangJalan" NUMERIC DEFAULT 0,
  "biayaTruckingBitung" NUMERIC DEFAULT 0,
  "biayaAdminBriLink" NUMERIC DEFAULT 0,
  "timbanganIds" JSONB DEFAULT '[]'::jsonb,
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table: Panjar DP
CREATE TABLE IF NOT EXISTS public.panjar (
  id TEXT PRIMARY KEY,
  "noKwitansi" TEXT NOT NULL,
  tgl DATE,
  "namaPenerima" TEXT NOT NULL,
  "nominalDp" NUMERIC DEFAULT 0,
  bank TEXT,
  "noRekening" TEXT,
  status TEXT DEFAULT 'Belum Lunas',
  "buktiUrl" TEXT,
  catatan TEXT,
  "batchId" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table: Timbangan Karung
CREATE TABLE IF NOT EXISTS public.timbangan (
  id TEXT PRIMARY KEY,
  tgl DATE,
  "namaTuanToko" TEXT NOT NULL,
  "rincianKarung" JSONB DEFAULT '[]'::jsonb,
  "karungItems" JSONB DEFAULT '[]'::jsonb,
  "totalGross" NUMERIC DEFAULT 0,
  "taraKarung" NUMERIC DEFAULT 0,
  "totalNetto" NUMERIC DEFAULT 0,
  "kadarAir" NUMERIC DEFAULT 6.0,
  "kadarAirPerKarung" JSONB DEFAULT '[]'::jsonb,
  "fotoPerKarung" JSONB DEFAULT '[]'::jsonb,
  "hargaBeliPerKg" NUMERIC DEFAULT 0,
  "totalNominalBeli" NUMERIC DEFAULT 0,
  "panjarDpId" TEXT,
  "potonganDp" NUMERIC DEFAULT 0,
  "sisaPelunasan" NUMERIC DEFAULT 0,
  "notaUrl" TEXT,
  "batchId" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Table: Settlements Pabrik
CREATE TABLE IF NOT EXISTS public.settlements (
  id TEXT PRIMARY KEY,
  "tglSettlement" DATE,
  "batchId" TEXT NOT NULL,
  "pabrikTujuan" TEXT,
  "beratGrossPabrik" NUMERIC DEFAULT 0,
  "potonganRafaksiPabrik" NUMERIC DEFAULT 0,
  "beratNettoFinalPabrik" NUMERIC DEFAULT 0,
  "hargaAcuanPabrik" NUMERIC DEFAULT 0,
  "totalPenerimaanPabrik" NUMERIC DEFAULT 0,
  "totalHppBatch" NUMERIC DEFAULT 0,
  "nettProfitMargin" NUMERIC DEFAULT 0,
  "persenSusutPabrik" NUMERIC DEFAULT 0,
  "tglMasukPabrik" DATE,
  "kadarAirLabPercent" NUMERIC DEFAULT 0,
  "potonganKadarAirKg" NUMERIC DEFAULT 0,
  "susutTonasePercent" NUMERIC DEFAULT 0,
  "statusApproval" TEXT,
  "lampiranNotaPabrikUrl" TEXT,
  "fotoNotaTimbangPabrik" TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Table: Price Settings
CREATE TABLE IF NOT EXISTS public.price_settings (
  id INT PRIMARY KEY DEFAULT 1,
  "hargaAcuanPabrikWilmar" NUMERIC DEFAULT 14800,
  "batasBeliGudangSekely" NUMERIC DEFAULT 12200,
  "daftarAkunOwner" JSONB DEFAULT '[]'::jsonb
);

-- 6. Table: Users Authentication
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Default Users
INSERT INTO public.users (username, password, name, role)
VALUES
  ('owneryusufdz', 'komoditi1523', 'Yusuf (Owner)', 'OWNER'),
  ('logisticteam', 'komoditi1523', 'Tim Logistik', 'LOGISTIK')
ON CONFLICT (username) DO UPDATE
SET password = EXCLUDED.password, name = EXCLUDED.name, role = EXCLUDED.role;

-- Enable RLS (Row Level Security) or Allow Anon Access
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panjar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timbangan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow Public (Anon) Read & Write Policies
CREATE POLICY "Allow public read/write batches" ON public.batches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write panjar" ON public.panjar FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write timbangan" ON public.timbangan FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write settlements" ON public.settlements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write price_settings" ON public.price_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write users" ON public.users FOR ALL USING (true) WITH CHECK (true);
