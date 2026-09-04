import { supabase } from './supabase';
import type { BatchShipment, TimbanganKarung, PanjarDP, PabrikSettlement, MasterPriceSetting } from '../types';

export const dbService = {
  // Authenticate user against Supabase users table
  async authenticateUser(usernameInput: string, passwordInput: string) {
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', cleanUsername)
        .eq('password', cleanPassword)
        .single();

      if (data && !error) {
        return {
          username: data.username,
          name: data.name,
          role: data.role as 'OWNER' | 'LOGISTIK' | 'SEKELY',
        };
      }
    } catch (err) {
      console.warn('Supabase user auth query notice:', err);
    }

    // Local fallback accounts if table not yet created in Supabase
    if (cleanUsername === 'owneryusufdz' && cleanPassword === 'komoditi1523') {
      return { username: 'owneryusufdz', name: 'Yusuf (Owner)', role: 'OWNER' as const };
    }
    if (cleanUsername === 'logisticteam' && cleanPassword === 'komoditi1523') {
      return { username: 'logisticteam', name: 'Tim Logistik', role: 'LOGISTIK' as const };
    }

    return null;
  },

  // Fetch all initial data from Supabase
  async fetchAllData() {
    try {
      const [batchesRes, timbanganRes, panjarRes, settlementRes, priceRes] = await Promise.all([
        supabase.from('batches').select('*').order('tglMulai', { ascending: false }),
        supabase.from('timbangan').select('*').order('tgl', { ascending: false }),
        supabase.from('panjar').select('*').order('tgl', { ascending: false }),
        supabase.from('settlements').select('*').order('tglSettlement', { ascending: false }),
        supabase.from('price_settings').select('*').maybeSingle(),
      ]);

      // If queries succeeded (data is array), return data from DB (even if empty)
      return {
        batches: batchesRes.error ? null : (batchesRes.data as BatchShipment[]),
        timbangan: timbanganRes.error ? null : (timbanganRes.data as TimbanganKarung[]),
        panjar: panjarRes.error ? null : (panjarRes.data as PanjarDP[]),
        settlement: settlementRes.error ? null : (settlementRes.data as PabrikSettlement[]),
        priceSetting: priceRes.error ? null : (priceRes.data as MasterPriceSetting),
      };
    } catch (err) {
      console.warn('Supabase fetch error:', err);
      return null;
    }
  },

  // Save new Timbangan
  async insertTimbangan(item: TimbanganKarung) {
    try {
      const { error } = await supabase.from('timbangan').insert([item]);
      if (error) console.error('Error inserting timbangan:', error);
    } catch (err) {
      console.error('Supabase timbangan insert error:', err);
    }
  },

  // Save new Panjar
  async insertPanjar(item: PanjarDP) {
    try {
      const { error } = await supabase.from('panjar').insert([item]);
      if (error) console.error('Error inserting panjar:', error);
    } catch (err) {
      console.error('Supabase panjar insert error:', err);
    }
  },

  // Save new Batch
  async insertBatch(item: BatchShipment) {
    try {
      const { error } = await supabase.from('batches').insert([item]);
      if (error) console.error('Error inserting batch:', error);
    } catch (err) {
      console.error('Supabase batch insert error:', err);
    }
  },

  // Update Batch Milestone
  async updateBatchMilestone(id: string, statusMilestone: BatchShipment['statusMilestone'], lokasiSaatIni: string) {
    try {
      const { error } = await supabase.from('batches').update({ statusMilestone, lokasiSaatIni }).eq('id', id);
      if (error) console.error('Error updating batch milestone:', error);
    } catch (err) {
      console.error('Supabase batch update error:', err);
    }
  },

  // Save new Settlement
  async insertSettlement(item: PabrikSettlement) {
    try {
      const { error } = await supabase.from('settlements').insert([item]);
      if (error) console.error('Error inserting settlement:', error);
    } catch (err) {
      console.error('Supabase settlement insert error:', err);
    }
  },

  async updateTimbangan(id: string, item: Partial<TimbanganKarung>) {
    try {
      const { error } = await supabase.from('timbangan').update(item).eq('id', id);
      if (error) console.error('Error updating timbangan:', error);
    } catch (err) {
      console.error('Supabase timbangan update error:', err);
    }
  },

  async updatePanjar(id: string, item: Partial<PanjarDP>) {
    try {
      const { error } = await supabase.from('panjar').update(item).eq('id', id);
      if (error) console.error('Error updating panjar:', error);
    } catch (err) {
      console.error('Supabase panjar update error:', err);
    }
  },

  async updateBatch(id: string, item: Partial<BatchShipment>) {
    try {
      const { error } = await supabase.from('batches').update(item).eq('id', id);
      if (error) console.error('Error updating batch:', error);
    } catch (err) {
      console.error('Supabase batch update error:', err);
    }
  },

  async updateSettlement(id: string, item: Partial<PabrikSettlement>) {
    try {
      const { error } = await supabase.from('settlements').update(item).eq('id', id);
      if (error) console.error('Error updating settlement:', error);
    } catch (err) {
      console.error('Supabase settlement update error:', err);
    }
  },

  // Delete functions (Owner only)
  async deleteTimbangan(id: string) {
    try {
      const { error } = await supabase.from('timbangan').delete().eq('id', id);
      if (error) console.error('Error deleting timbangan:', error);
    } catch (err) {
      console.error('Supabase timbangan delete error:', err);
    }
  },

  async deletePanjar(id: string) {
    try {
      const { error } = await supabase.from('panjar').delete().eq('id', id);
      if (error) console.error('Error deleting panjar:', error);
    } catch (err) {
      console.error('Supabase panjar delete error:', err);
    }
  },

  async deleteBatch(id: string) {
    try {
      const { error } = await supabase.from('batches').delete().eq('id', id);
      if (error) console.error('Error deleting batch:', error);
    } catch (err) {
      console.error('Supabase batch delete error:', err);
    }
  },

  async deleteSettlement(id: string) {
    try {
      const { error } = await supabase.from('settlements').delete().eq('id', id);
      if (error) console.error('Error deleting settlement:', error);
    } catch (err) {
      console.error('Supabase settlement delete error:', err);
    }
  },

  // Update Price Setting
  async updatePriceSetting(setting: Partial<MasterPriceSetting>) {
    try {
      const { error } = await supabase.from('price_settings').upsert([setting]);
      if (error) console.error('Error updating price setting:', error);
    } catch (err) {
      console.error('Supabase price setting update error:', err);
    }
  }
};
