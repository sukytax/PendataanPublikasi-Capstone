/**
 * Publications API Service
 * Handle semua logic fetch publications dari backend
 */

import { apiClient } from '../config/apiConfig'

export const publicationsAPI = {
  /**
   * Fetch semua publications dengan pagination handling
   * @returns {Promise<Array>} Array of all publications
   */
  async getAllPublications() {
    let allPublications = [];
    let page = 1;
    let hasNextPage = true;

    // Loop untuk fetch semua halaman
    while (hasNextPage) {
      console.log(`  📄 Loading page ${page}...`);
      
      try {
        const response = await apiClient.get(`/client/publications?page=${page}`);
        
        // Handle response structure (bisa nested di .data atau langsung)
        const pageData = response.data || response;
        const items = Array.isArray(pageData) ? pageData : (pageData.data || []);
        
        // Tambahkan data dari halaman ini
        allPublications = allPublications.concat(items);
        
        // Cek apakah ada halaman berikutnya
        hasNextPage = response.next_page_url !== null && response.next_page_url !== undefined;
        page++;
        
        // Safety check untuk infinite loop
        if (page > 100) {
          console.warn('⚠️ Stopped at page 100 to prevent infinite loop');
          break;
        }
      } catch (error) {
        console.error(`❌ Error loading page ${page}:`, error);
        throw error;
      }
    }
    
    console.log(`✅ Total publications loaded: ${allPublications.length}`);
    
    // Log sample data untuk debugging
    if (allPublications.length > 0) {
      console.log('📋 Sample data structure:', allPublications[0]);
    }
    
    return allPublications;
  },

  /**
   * Fetch detail publikasi by ID
   * @param {number} id - ID publikasi/dosen
   * @returns {Promise<Object>} Detail publikasi
   */
  async getPublicationDetail(id) {
    try {
      console.log(`🔵 Fetching publication detail #${id}...`);
      const response = await apiClient.get(`/client/publications/${id}`);
      const data = response.data || response;
      console.log('✅ Publication detail loaded:', data);
      return data;
    } catch (error) {
      console.error(`❌ Error loading publication detail:`, error);
      throw error;
    }
  },

  /**
   * Transform raw API data ke format table
   * @param {Array} rawData - Raw data dari API
   * @returns {Array} Transformed data
   */
  transformData(rawData) {
    return rawData.map(item => {
      // Extract program studi dari nested object
      const programStudi = item.study_program?.program_studi || 
                          item.program_studi || 
                          item.programStudi || 
                          'N/A';
      
      return {
        id: item.id, // Include ID untuk routing
        tahun: item.year || item.tahun || (item.created_at ? new Date(item.created_at).getFullYear() : new Date().getFullYear()),
        namaDosen: item.nama_dosen || item.author || item.namaDosen || 'Unknown',
        programStudi: programStudi,
        totalPenelitian: item.publications_count || item.total_penelitian || item.publications || 0,
        totalSitasi: item.total_sitasi || item.citations_count || item.total_sitasi || item.citations || 0,
        hIndex: item.h_index || item.hIndex || 0
      };
    });
  },

  /**
   * Transform raw detail data ke format display
   * @param {Object} rawData - Raw data dari API
   * @returns {Object} Transformed data
   */
  transformDetailData(rawData) {
    return {
      namaDosen: rawData.nama_dosen || rawData.author || 'Unknown',
      afiliasi: rawData.afiliasi || rawData.study_program?.fakultas || 'N/A',
      bidangKeilmuan: (rawData.bidang_keilmuan || '').split(',').map(f => f.trim()).filter(f => f),
      totalPenelitian: rawData.publications_count || rawData.total_penelitian || 0,
      totalSitasi: rawData.total_sitasi || rawData.citations_count || 0,
      hIndex: rawData.h_index || rawData.hIndex || 0,
      linkProfile: rawData.google_scholar_link || 'https://scholar.google.com',
      linkProfileText: 'Klik Di Sini',
      daftarPublikasi: rawData.publications || []
    };
  },
};

export default publicationsAPI;
