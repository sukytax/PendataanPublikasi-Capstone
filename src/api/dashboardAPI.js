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
      const response = await apiClient.get('/client/dashboard');
      
      // Backend returns {status: 'success', data: {...}}
      // Extract the data property
      const apiData = response.data || response;
      
      // Transform backend response ke format internal
      const transformedData = {
        jumlah_dosen: apiData.stats?.total_dosen || 0,
        total_publikasi: apiData.stats?.total_publikasi || 0,
        total_sitasi: parseInt(apiData.stats?.total_sitasi || 0),
        tahun_terakhir: apiData.stats?.publikasi_terakhir || new Date().getFullYear(),
        tren_publikasi: (apiData.chart || []).map(item => ({
          tahun: parseInt(item.tahun),
          total: item.total
        })),
        top_dosen_publikasi: (apiData.top_rank || []).slice(0, 5).map(item => ({
          nama_dosen: item.nama_dosen,
          publications_count: item.publications_count || item.total,
          program_studi: item.study_program?.program_studi || item.program_studi || 'Unknown'
        })),
        top_dosen_sitasi: (apiData.top_rank || []).slice(0, 5).map(item => ({
          nama_dosen: item.nama_dosen,
          total_sitasi: item.total_sitasi || 0
        }))
      };
      
      return transformedData;
    } catch (error) {
      console.error('❌ Error loading dashboard:', error.message);
      throw error;
    }
  },

  /**
   * Transform raw dashboard data ke format display
   * @param {Object} rawData - Raw data dari API
   * @returns {Object} Transformed data
   */
  transformDashboardData(rawData) {
    if (!rawData) {
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
    }

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
