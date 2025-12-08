/**
 * Dashboard API Service
 * Handle semua logic fetch data dashboard dari backend
 */

import { apiClient } from '../config/apiConfig'

export const dashboardAPI = {
  /**
   * Fetch dashboard data
   * @returns {Promise<Object>} Dashboard data
   */
  async getDashboardData() {
    try {
      console.log('🔵 Fetching dashboard data...');
      const response = await apiClient.get('/client/dashboard');
      console.log('📥 Raw response from apiClient:', response);
      
      // Handle both wrapped and unwrapped responses
      const data = response.data ? response.data : response;
      console.log('✅ Dashboard data loaded:', data);
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format: data is not an object');
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      throw error;
    }
  },

  /**
   * Transform raw dashboard data ke format display
   * @param {Object} rawData - Raw data dari API
   * @returns {Object} Transformed data
   */
  transformDashboardData(rawData) {
    console.log('📊 Raw data dari API:', rawData);
    
    if (!rawData) {
      console.warn('⚠️ rawData is null or undefined');
      return {
        stats: { totalDosen: 0, totalPublikasi: 0, totalSitasi: 0, tahunTerakhir: new Date().getFullYear() },
        trendData: { labels: [], values: [] },
        programStudiData: { labels: [], values: [] },
        sitasiData: { labels: [], values: [] },
        insights: {},
        rawData: {}
      };
    }
    
    // Transform stats
    const stats = {
      totalDosen: rawData.jumlah_dosen || 0,
      totalPublikasi: rawData.total_publikasi || 0,
      totalSitasi: rawData.total_sitasi || 0,
      tahunTerakhir: rawData.tahun_terakhir || new Date().getFullYear()
    };

    // Transform trend publikasi untuk chart
    const trendData = {
      labels: (rawData.tren_publikasi || []).map(item => item.tahun.toString()),
      values: (rawData.tren_publikasi || []).map(item => item.total)
    };

    // Transform program studi data dari top_dosen_publikasi
    let programStudiData = {
      labels: [],
      values: []
    };
    
    if (rawData.top_dosen_publikasi && Array.isArray(rawData.top_dosen_publikasi) && rawData.top_dosen_publikasi.length > 0) {
      programStudiData = {
        labels: rawData.top_dosen_publikasi.map(item => item.nama_dosen || 'Unknown'),
        values: rawData.top_dosen_publikasi.map(item => item.publications_count || 0)
      };
      console.log('✅ programStudiData transformed:', programStudiData);
    } else {
      console.warn('⚠️ top_dosen_publikasi is empty or not array:', rawData.top_dosen_publikasi);
    }

    // Transform sitasi data dari top_dosen_sitasi
    let sitasiData = {
      labels: [],
      values: []
    };
    
    if (rawData.top_dosen_sitasi && Array.isArray(rawData.top_dosen_sitasi) && rawData.top_dosen_sitasi.length > 0) {
      sitasiData = {
        labels: rawData.top_dosen_sitasi.map(item => item.nama_dosen || 'Unknown'),
        values: rawData.top_dosen_sitasi.map(item => item.total_sitasi || 0)
      };
      console.log('✅ sitasiData transformed:', sitasiData);
    } else {
      console.warn('⚠️ top_dosen_sitasi is empty or not array:', rawData.top_dosen_sitasi);
    }

    console.log('📈 Transformed data:', { programStudiData, sitasiData, trendData });

    // Generate insights berdasarkan data
    const topDosenPubCount = rawData.top_dosen_publikasi?.[0]?.publications_count || 0;
    const insights = {
      pertumbuhanPublikasi: `Publikasi mencapai ${rawData.total_publikasi || 0} dengan ${rawData.jumlah_dosen || 0} dosen aktif di ${rawData.topik_riset?.length || 0} topik riset.`,
      dampakSitasi: `Total sitasi mencapai ${rawData.total_sitasi || 0}, menunjukkan dampak riset yang signifikan dengan rata-rata ${Math.round((rawData.total_sitasi || 0) / (rawData.jumlah_dosen || 1))} sitasi per dosen.`,
      dominasiProgramStudi: `Dosen terprodukstif adalah ${rawData.top_dosen_publikasi?.[0]?.nama_dosen || '-'} dengan ${topDosenPubCount} publikasi.`,
      jangkauanInternasional: `Dosen dengan sitasi tertinggi adalah ${rawData.top_dosen_sitasi?.[0]?.nama_dosen || '-'} dengan ${rawData.top_dosen_sitasi?.[0]?.total_sitasi || 0} sitasi.`
    };

    return {
      stats,
      trendData,
      programStudiData,
      sitasiData,
      insights,
      rawData // Keep raw data for reference
    };
  },
};

export default dashboardAPI;
