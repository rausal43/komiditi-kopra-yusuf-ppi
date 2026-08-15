import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Role, PanjarDP, TimbanganKarung, BatchShipment, SettlementPabrik, MasterPriceSetting, AIWeeklyReport } from '../types';
import { initialPriceSetting } from '../data/mockData';
import { dbService } from '../lib/dbService';

export type ActiveModalType = 'NONE' | 'BATCH' | 'TIMBANGAN' | 'PANJAR' | 'SETTLEMENT' | 'TRANSSHIPMENT';

export interface UserSession {
  username: string;
  name: string;
  role: Role;
}

interface AppContextType {
  user: UserSession | null;
  login: (role: Role, username?: string, name?: string) => void;
  loginWithCredentials: (usernameInput: string, passwordInput: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  canEditOrDelete: boolean;

  activeRole: Role;
  setActiveRole: (role: Role) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  
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
  editAkunOwner: (oldNama: string, newNama: string) => void;
  deleteAkunOwner: (nama: string) => void;
  addKapal: (nama: string) => void;
  editKapal: (oldNama: string, newNama: string) => void;
  deleteKapal: (nama: string) => void;
  addGudang: (nama: string) => void;
  editGudang: (oldNama: string, newNama: string) => void;
  deleteGudang: (nama: string) => void;

  addPanjar: (panjar: Omit<PanjarDP, 'id'>) => void;
  deletePanjar: (id: string) => void;

  addTimbangan: (timbangan: Omit<TimbanganKarung, 'id'>) => void;
  deleteTimbangan: (id: string) => void;

  addBatch: (batch: Omit<BatchShipment, 'id'>) => void;
  deleteBatch: (id: string) => void;
  updateBatchMilestone: (id: string, status: BatchShipment['statusMilestone'], lokasi: string) => void;

  addSettlement: (settlement: Omit<SettlementPabrik, 'id'>) => void;
  deleteSettlement: (id: string) => void;

  updatePriceSetting: (setting: Partial<MasterPriceSetting>) => void;
  generateAIReport: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('ks_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [activeRole, setActiveRoleState] = useState<Role>(user?.role || 'LOGISTIK');
  const [activeTab, setActiveTab] = useState<string>('batch');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('ks_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('ks_sidebar_collapsed', String(next));
      return next;
    });
  };

  const loginWithCredentials = async (usernameInput: string, passwordInput: string) => {
    const authenticatedUser = await dbService.authenticateUser(usernameInput, passwordInput);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      setActiveRoleState(authenticatedUser.role);
      localStorage.setItem('ks_user_session', JSON.stringify(authenticatedUser));
      return { success: true };
    }
    return { success: false, message: 'Username atau password tidak ditemukan!' };
  };
  
  const [activeModal, setActiveModal] = useState<ActiveModalType>('NONE');
  const [belanjaSubTab, setBelanjaSubTab] = useState<'timbangan' | 'panjar'>('timbangan');

  const [panjarList, setPanjarList] = useState<PanjarDP[]>([]);
  const [timbanganList, setTimbanganList] = useState<TimbanganKarung[]>([]);
  const [batchList, setBatchList] = useState<BatchShipment[]>([]);
  const [settlementList, setSettlementList] = useState<SettlementPabrik[]>([]);
  const [priceSetting, setPriceSetting] = useState<MasterPriceSetting>(initialPriceSetting);
  const [aiReports, setAiReports] = useState<AIWeeklyReport[]>([]);

  const [daftarAkunOwner, setDaftarAkunOwner] = useState<string[]>(initialPriceSetting.daftarAkunOwner);
  const [daftarKapal, setDaftarKapal] = useState<string[]>(['KM Sabuk Nusantara', 'Kapal Feeder Sekely', 'KM Lintas Maluku']);
  const [daftarGudang, setDaftarGudang] = useState<string[]>(['Gudang Utama Sekely', 'Gudang Halmahera Barat']);

  const canEditOrDelete = activeRole === 'OWNER' || activeRole === 'owner';

  const setActiveRole = (role: Role) => {
    setActiveRoleState(role);
    if (user) {
      const updated = { ...user, role };
      setUser(updated);
      localStorage.setItem('ks_user_session', JSON.stringify(updated));
    }
  };

  const login = (role: Role, username?: string, name?: string) => {
    const roleUpper = role.toUpperCase() as Role;
    const defaultNames: Record<string, string> = {
      OWNER: 'Pak Owner',
      LOGISTIK: 'Tim Logistik',
      SEKELY: 'Petugas Gudang Sekely',
    };
    const session: UserSession = {
      username: username || role.toLowerCase(),
      name: name || defaultNames[roleUpper] || roleUpper,
      role: roleUpper,
    };
    setUser(session);
    setActiveRoleState(roleUpper);
    localStorage.setItem('ks_user_session', JSON.stringify(session));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ks_user_session');
  };

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

  const editAkunOwner = (oldNama: string, newNama: string) => {
    if (!canEditOrDelete || !newNama.trim()) return;
    setDaftarAkunOwner(prev => prev.map(a => a === oldNama ? newNama.trim() : a));
  };

  const deleteAkunOwner = (nama: string) => {
    if (!canEditOrDelete) return;
    setDaftarAkunOwner(prev => prev.filter(a => a !== nama));
  };

  const addKapal = (nama: string) => {
    if (nama.trim() && !daftarKapal.includes(nama.trim())) {
      setDaftarKapal(prev => [...prev, nama.trim()]);
    }
  };

  const editKapal = (oldNama: string, newNama: string) => {
    if (!canEditOrDelete || !newNama.trim()) return;
    setDaftarKapal(prev => prev.map(k => k === oldNama ? newNama.trim() : k));
  };

  const deleteKapal = (nama: string) => {
    if (!canEditOrDelete) return;
    setDaftarKapal(prev => prev.filter(k => k !== nama));
  };

  const addGudang = (nama: string) => {
    if (nama.trim() && !daftarGudang.includes(nama.trim())) {
      setDaftarGudang(prev => [...prev, nama.trim()]);
    }
  };

  const editGudang = (oldNama: string, newNama: string) => {
    if (!canEditOrDelete || !newNama.trim()) return;
    setDaftarGudang(prev => prev.map(g => g === oldNama ? newNama.trim() : g));
  };

  const deleteGudang = (nama: string) => {
    if (!canEditOrDelete) return;
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

  const deletePanjar = (id: string) => {
    if (!canEditOrDelete) return;
    setPanjarList(prev => prev.filter(p => p.id !== id));
    dbService.deletePanjar(id);
  };

  const addTimbangan = (newTimbangan: Omit<TimbanganKarung, 'id'>) => {
    const id = `t-${Date.now()}`;
    const fullTimbangan = { ...newTimbangan, id };
    setTimbanganList(prev => [fullTimbangan, ...prev]);
    dbService.insertTimbangan(fullTimbangan);
  };

  const deleteTimbangan = (id: string) => {
    if (!canEditOrDelete) return;
    setTimbanganList(prev => prev.filter(t => t.id !== id));
    dbService.deleteTimbangan(id);
  };

  const addBatch = (newBatch: Omit<BatchShipment, 'id'>) => {
    const id = `BATCH-2026-${String(batchList.length + 1).padStart(2, '0')}C`;
    const fullBatch = { ...newBatch, id };
    setBatchList(prev => [fullBatch, ...prev]);
    dbService.insertBatch(fullBatch);
  };

  const deleteBatch = (id: string) => {
    if (!canEditOrDelete) return;
    setBatchList(prev => prev.filter(b => b.id !== id));
    dbService.deleteBatch(id);
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

  const deleteSettlement = (id: string) => {
    if (!canEditOrDelete) return;
    setSettlementList(prev => prev.filter(s => s.id !== id));
    dbService.deleteSettlement(id);
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
        user, login, loginWithCredentials, logout, canEditOrDelete,
        activeRole, setActiveRole, activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen,
        isSidebarCollapsed, setIsSidebarCollapsed, toggleSidebar,
        activeModal, setActiveModal, belanjaSubTab, setBelanjaSubTab, openContextualFabModal,
        panjarList, timbanganList, batchList, settlementList, priceSetting, aiReports,
        daftarAkunOwner, daftarKapal, daftarGudang, addAkunOwner, editAkunOwner, deleteAkunOwner, addKapal, editKapal, deleteKapal, addGudang, editGudang, deleteGudang,
        addPanjar, deletePanjar, addTimbangan, deleteTimbangan, addBatch, deleteBatch, updateBatchMilestone, addSettlement, deleteSettlement, updatePriceSetting, generateAIReport,
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
