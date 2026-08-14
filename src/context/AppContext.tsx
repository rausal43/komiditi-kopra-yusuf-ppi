import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Role, PanjarDP, TimbanganKarung, BatchShipment, SettlementPabrik, MasterPriceSetting, AIWeeklyReport } from '../types';
import { initialPanjar, initialTimbangan, initialBatch, initialSettlement, initialPriceSetting, initialAIReports } from '../data/mockData';
import { dbService } from '../lib/dbService';

export type ActiveModalType = 'NONE' | 'BATCH' | 'TIMBANGAN' | 'PANJAR' | 'SETTLEMENT' | 'TRANSSHIPMENT';

interface AppContextType {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  
  activeModal: ActiveModalType;
  setActiveModal: (modal: ActiveModalType) => void;
  belanjaSubTab: 'timbangan' | 'panjar';
  setBelanjaSubTab: (tab: 'timbangan' | 'panjar') => void;
  openContextualFabModal: () => void;

  panjarList: PanjarDP[];
  timbanganList: TimbanganKarung[];
  batchList: BatchShipment[];
  settlementList: SettlementPabrik[];
  priceSetting: MasterPriceSetting;
  aiReports: AIWeeklyReport[];

  daftarAkunOwner: string[];
  daftarKapal: string[];
  daftarGudang: string[];
  addAkunOwner: (nama: string) => void;
  deleteAkunOwner: (nama: string) => void;
  addKapal: (nama: string) => void;
  deleteKapal: (nama: string) => void;
  addGudang: (nama: string) => void;
  deleteGudang: (nama: string) => void;

  addPanjar: (panjar: Omit<PanjarDP, 'id'>) => void;
  addTimbangan: (timbangan: Omit<TimbanganKarung, 'id'>) => void;
  addBatch: (batch: Omit<BatchShipment, 'id'>) => void;
  updateBatchMilestone: (id: string, status: BatchShipment['statusMilestone'], lokasi: string) => void;
  addSettlement: (settlement: Omit<SettlementPabrik, 'id'>) => void;
  updatePriceSetting: (setting: Partial<MasterPriceSetting>) => void;
  generateAIReport: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<Role>('OWNER');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  const [activeModal, setActiveModal] = useState<ActiveModalType>('NONE');
  const [belanjaSubTab, setBelanjaSubTab] = useState<'timbangan' | 'panjar'>('timbangan');

  const [panjarList, setPanjarList] = useState<PanjarDP[]>(initialPanjar);
  const [timbanganList, setTimbanganList] = useState<TimbanganKarung[]>(initialTimbangan);
  const [batchList, setBatchList] = useState<BatchShipment[]>(initialBatch);
  const [settlementList, setSettlementList] = useState<SettlementPabrik[]>(initialSettlement);
  const [priceSetting, setPriceSetting] = useState<MasterPriceSetting>(initialPriceSetting);
  const [aiReports, setAiReports] = useState<AIWeeklyReport[]>(initialAIReports);

  const [daftarAkunOwner, setDaftarAkunOwner] = useState<string[]>(initialPriceSetting.daftarAkunOwner);
  const [daftarKapal, setDaftarKapal] = useState<string[]>(['KM Sabuk Nusantara', 'Kapal Feeder Sekely', 'KM Lintas Maluku']);
  const [daftarGudang, setDaftarGudang] = useState<string[]>(['Gudang Utama Sekely', 'Gudang Halmahera Barat']);

  // Fetch data from Supabase DB on mount if tables exist
  useEffect(() => {
    async function loadData() {
      const data = await dbService.fetchAllData();
      if (data) {
        if (data.batches) setBatchList(data.batches);
        if (data.timbangan) setTimbanganList(data.timbangan);
        if (data.panjar) setPanjarList(data.panjar);
        if (data.settlement) setSettlementList(data.settlement);
        if (data.priceSetting) setPriceSetting(data.priceSetting);
      }
    }
    loadData();
  }, []);

  const addAkunOwner = (nama: string) => {
    if (nama.trim() && !daftarAkunOwner.includes(nama.trim())) {
      setDaftarAkunOwner(prev => [...prev, nama.trim()]);
    }
  };

  const deleteAkunOwner = (nama: string) => {
    setDaftarAkunOwner(prev => prev.filter(a => a !== nama));
  };

  const addKapal = (nama: string) => {
    if (nama.trim() && !daftarKapal.includes(nama.trim())) {
      setDaftarKapal(prev => [...prev, nama.trim()]);
    }
  };

  const deleteKapal = (nama: string) => {
    setDaftarKapal(prev => prev.filter(k => k !== nama));
  };

  const addGudang = (nama: string) => {
    if (nama.trim() && !daftarGudang.includes(nama.trim())) {
      setDaftarGudang(prev => [...prev, nama.trim()]);
    }
  };

  const deleteGudang = (nama: string) => {
    setDaftarGudang(prev => prev.filter(g => g !== nama));
  };

  const openContextualFabModal = () => {
    if (activeTab === 'dashboard' || activeTab === 'batch') {
      setActiveModal('BATCH');
    } else if (activeTab === 'belanja') {
      setActiveModal(belanjaSubTab === 'timbangan' ? 'TIMBANGAN' : 'PANJAR');
    } else if (activeTab === 'settlement') {
      setActiveModal('SETTLEMENT');
    } else if (activeTab === 'transshipment') {
      setActiveModal('TRANSSHIPMENT');
    }
  };

  const addPanjar = (newPanjar: Omit<PanjarDP, 'id'>) => {
    const id = `p-${Date.now()}`;
    const fullPanjar = { ...newPanjar, id };
    setPanjarList(prev => [fullPanjar, ...prev]);
    dbService.insertPanjar(fullPanjar);
  };

  const addTimbangan = (newTimbangan: Omit<TimbanganKarung, 'id'>) => {
    const id = `t-${Date.now()}`;
    const fullTimbangan = { ...newTimbangan, id };
    setTimbanganList(prev => [fullTimbangan, ...prev]);
    dbService.insertTimbangan(fullTimbangan);
  };

  const addBatch = (newBatch: Omit<BatchShipment, 'id'>) => {
    const id = `BATCH-2026-${String(batchList.length + 1).padStart(2, '0')}C`;
    const fullBatch = { ...newBatch, id };
    setBatchList(prev => [fullBatch, ...prev]);
    dbService.insertBatch(fullBatch);
  };

  const updateBatchMilestone = (id: string, status: BatchShipment['statusMilestone'], lokasi: string) => {
    setBatchList(prev => prev.map(b => (b.id === id ? { ...b, statusMilestone: status, lokasiSaatIni: lokasi } : b)));
    dbService.updateBatchMilestone(id, status, lokasi);
  };

  const addSettlement = (newSettlement: Omit<SettlementPabrik, 'id'>) => {
    const id = `s-${Date.now()}`;
    const fullSettlement = { ...newSettlement, id };
    setSettlementList(prev => [fullSettlement, ...prev]);
    setBatchList(prev =>
      prev.map(b =>
        b.id === newSettlement.batchId
          ? { ...b, statusMilestone: 'Selesai Pabrik', statusBatch: 'Selesai', lokasiSaatIni: 'Pabrik Bitung (Settlement Selesai)' }
          : b
      )
    );
    dbService.insertSettlement(fullSettlement);
    dbService.updateBatchMilestone(newSettlement.batchId, 'Selesai Pabrik', 'Pabrik Bitung (Settlement Selesai)');
  };

  const updatePriceSetting = (setting: Partial<MasterPriceSetting>) => {
    setPriceSetting(prev => ({ ...prev, ...setting }));
    dbService.updatePriceSetting(setting);
  };

  const generateAIReport = () => {
    const id = `air-${Date.now()}`;
    const report: AIWeeklyReport = {
      id,
      tgl: new Date().toISOString().split('T')[0],
      ringkasanEksekutif: `Margin bersih Batch #${batchList[0]?.id || '08A'} mencapai Rp 10.3 Jt (7.4% ROI) dengan susut tonase Bitung di bawah 0.7%.`,
      rekomendasiTindakan: ['Pertahankan batas beli Gudang Sekely di Rp 12.200/kg', 'Optimalkan pengangkutan Kapal Pelayaran pekan depan'],
      skorEfisiensi: 92,
    };
    setAiReports(prev => [report, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        activeRole, setActiveRole, activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen,
        activeModal, setActiveModal, belanjaSubTab, setBelanjaSubTab, openContextualFabModal,
        panjarList, timbanganList, batchList, settlementList, priceSetting, aiReports,
        daftarAkunOwner, daftarKapal, daftarGudang, addAkunOwner, deleteAkunOwner, addKapal, deleteKapal, addGudang, deleteGudang,
        addPanjar, addTimbangan, addBatch, updateBatchMilestone, addSettlement, updatePriceSetting, generateAIReport,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
