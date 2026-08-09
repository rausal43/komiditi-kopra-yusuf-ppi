# PT Kopra Sejati - System & Developer Documentation

Dokumentasi lengkap arsitektur, alur logika bisnis, struktur komponen, dan panduan pemeliharaan (*maintenance*) aplikasi **Real-Time Sourcing & Supply Chain Tracking PT Kopra Sejati**.

---

## 📌 1. Ringkasan Sistem & Arsitektur

Aplikasi **PT Kopra Sejati** dikembangkan menggunakan arsitektur modern berkinerja tinggi:

- **Framework Core**: React 18 + TypeScript + Vite.
- **Design System & Styling**: Pure Custom CSS (`src/index.css`) dengan desain ultra-responsif untuk perangkat Mobile, Tablet, dan Desktop.
- **Icon Set**: Lucide React.
- **Deployment Platform**: Cloudflare Pages (`komiditi-kopra-yusuf-ppi.pages.dev`) & GitHub Actions.
- **State Management**: React Context API (`src/context/AppContext.tsx`).

---

## 📁 2. Struktur Direktori & File Proyek

```text
pt-kopra-sejati/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions Auto-Deploy ke Cloudflare Pages
├── src/
│   ├── assets/                 # Asset Gambar & Logo
│   ├── components/             # Seluruh Komponen UI Modul Aplikasi
│   │   ├── AIReportModule.tsx      # Modul Laporan Analisis AI Jurnal
│   │   ├── BatchMasterTable.tsx    # Tabel Master Batch Responsif
│   │   ├── BatchModal.tsx          # Modal Inisialisasi Batch Baru
│   │   ├── BatchPickerModal.tsx    # Modal Pemilih Batch Aktif
│   │   ├── BatchReportModule.tsx   # Modul Rekapitulasi Laporan Batch
│   │   ├── BatchSettingModule.tsx  # Beranda & Master CRUD (Rekening, Kapal, Gudang)
│   │   ├── BelanjaModule.tsx       # Modul Timbangan Karung & Panjar DP
│   │   ├── ConfirmDeleteModal.tsx  # Modal Pop-up Konfirmasi Hapus Master Data
│   │   ├── DashboardLogistik.tsx   # Dashboard Akses Operasional Logistik
│   │   ├── DashboardOwner.tsx      # Dashboard Akses Owner & Eksekutif
│   │   ├── MobileNav.tsx           # Navigasi Bawah Khusus Layar HP
│   │   ├── Navbar.tsx              # Header Bar Atas & Role Switcher
│   │   ├── NotaBelanjaModal.tsx    # Struk Format Thermal Printer 58mm/80mm
│   │   ├── OverviewModule.tsx      # Modul Dashboard Analisis Finansial P&L Donut Chart
│   │   ├── PanjarModal.tsx         # Modal Input DP Petani Baru
│   │   ├── PanjarModule.tsx        # Tabel Pencatatan Panjar DP
│   │   ├── PanjarPickerModal.tsx   # Modal Pemilih DP untuk Pemotongan
│   │   ├── SettlementModal.tsx     # Modal Input Serah Terima Pabrik Bitung
│   │   ├── SettlementModule.tsx    # Modul Settlement Pabrik & Net Profit
│   │   ├── Sidebar.tsx             # Menu Samping Navigation Drawer
│   │   ├── TimbanganModal.tsx      # Modal Input Timbangan Karung Lapangan
│   │   ├── TimbanganModule.tsx     # Tabel Rekap Timbangan Karung
│   │   ├── TransshipmentModal.tsx  # Modal Update Status Laut & Pelayaran
│   │   └── TransshipmentModule.tsx # Modul Milestone Tracking Pelayaran Kapal
│   ├── context/
│   │   └── AppContext.tsx          # Central State Provider & Logika CRUD Data
│   ├── data/
│   │   └── mockData.ts             # Initial Mock Data Transaksi & Master
│   ├── types/
│   │   └── index.ts                # TypeScript Interfaces & Types Definisi
│   ├── App.tsx                     # Entry Point Komponen Utama
│   ├── main.tsx                    # React Root Mount Point
│   └── index.css                   # System CSS Stylesheet & Breakpoints
├── wrangler.jsonc              # Konfigurasi Deployment Cloudflare Pages
└── package.json                # Dependencies & Build Scripts
```

---

## 🔄 3. Alur Kerja Bisnis & Logika Formula

### A. Siklus Progres Batch (*Milestone Lifecycle*)
1. **`Gudang`**: Penampungan awal & pembelian kopra dari petani di Gudang Sekely.
2. **`Loading Feeder`**: Pemuatan kopra ke kapal feeder lokal.
3. **`Pelayaran Kapal`**: Pelayaran laut menuju pelabuhan Bitung.
4. **`Unloading`**: Pembongkaran & penyetoran final ke Pabrik Bitung (Wilmar/Agro).

### B. Formula Timbangan & Rafaksi Kadar Air
```text
Total Gross (kg)  = Sum(Karung 1 + Karung 2 + ... + Karung N)
Total Netto (kg)  = Max(0, Total Gross - Tara Karung)
Rafaksi (%)       = Max(0, Kadar Air % - 6.0%)
Potongan Air (kg) = (Total Netto * Rafaksi %) / 100
Netto Final (kg)  = Max(0, Total Netto - Potongan Air)
Total Belanja (Rp)= Netto Final (kg) * Harga Beli (Rp/kg)
Sisa Pelunasan    = Total Belanja - Potongan Panjar DP
```

### C. Formula Settlement Pabrik & Profit
```text
Total Revenue Pabrik (Rp) = Netto Final Pabrik (kg) * Harga Acuan Pabrik (Rp/kg)
Total HPP Shipping (Rp)   = Total Belanja Kopra + Biaya Pelayaran & Transport
Nett Profit Margin (Rp)   = Total Revenue Pabrik - Total HPP Shipping
```

---

## 🛠️ 4. Panduan Pemeliharaan & Pengembangan

### Cara Menjalankan Aplikasi Secara Lokal:
```bash
# Install paket dependensi
npm install

# Jalankan server pengembangan lokal
npm run dev
```

### Cara Memeriksa Validasi Kualitas Kode (*Build Check*):
```bash
# Jalankan kompilasi TypeScript & Vite build test
npm run build
```

### Cara Melakukan Push & Deploy Otomatis:
```bash
# Stage seluruh perubahan
git add .

# Buat commit baru
git commit -m "fitur: deskripsi perubahan"

# Push ke repositori GitHub utama
git push origin main
```
*Setiap kali `git push origin main` dijalankan, GitHub Actions dan Cloudflare Pages akan mem-build dan men-deploy versi terbaru secara otomatis.*

---

## 🛡️ 5. Tips Pemeliharaan Kode (*Maintenance Best Practices*)

1. **Keamanan Komponen (Prinsip Modular)**:
   - Setiap komponen file TSX dibuat mandiri dan dijaga di bawah **200 baris kode** untuk memudahkan pemeliharaan dan pelacakan bug.
2. **Perlindungan Data Hapus Master**:
   - Penghapusan master rekening/kapal/gudang dilindungi modal konfirmasi pop-up. Data transaksi lama yang terhubung akan tetap tersimpan secara aman di database.
3. **Performa Tabel Data**:
   - Seluruh tabel dilengkapi sistem *Pagination* 5–10 baris per halaman dan *Search Bar* instan untuk menangani ratusan/ribuan data tanpa menurunkan kecepatan aplikasi.

---

**© 2026 PT Kopra Sejati • Developed for Real-Time Supply Chain Excellence**
