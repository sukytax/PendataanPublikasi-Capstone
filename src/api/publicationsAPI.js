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
      try {
        const response = await apiClient.get(`/client/publications?page=${page}`);
        
        // Handle response structure: {status: 'success', data: {...pagination...}}
        let items = [];
        let paginationInfo = null;
        
        if (response.status === 'success' && response.data) {
          // If response.data is array, use directly
          if (Array.isArray(response.data)) {
            items = response.data;
          } 
          // If response.data has data property (Laravel paginated response)
          else if (response.data.data && Array.isArray(response.data.data)) {
            items = response.data.data;
            paginationInfo = response.data;
          } 
          // Fallback
          else {
            items = response.data;
          }
        } else if (Array.isArray(response)) {
          // Direct array response
          items = response;
        } else if (response.data) {
          // Nested data property
          if (Array.isArray(response.data)) {
            items = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            items = response.data.data;
            paginationInfo = response.data;
          }
        }
        
        // Tambahkan data dari halaman ini
        allPublications = allPublications.concat(items);
        
        // Log pagination info
        if (paginationInfo) {
          console.log(`📄 Publications page ${paginationInfo.current_page}/${paginationInfo.last_page} - ${items.length} items (total: ${paginationInfo.total})`);
        }
        
        // Cek apakah ada halaman berikutnya dari pagination info
        // Laravel paginate returns: current_page, last_page, next_page_url, per_page, total, etc
        if (paginationInfo) {
          // Use next_page_url if available (lebih akurat)
          if (paginationInfo.next_page_url) {
            hasNextPage = true;
          } else {
            // Otherwise check current_page vs last_page
            hasNextPage = paginationInfo.current_page < paginationInfo.last_page;
          }
        } else {
          // Jika tidak ada pagination info, cek dari jumlah items
          // Jika items kosong = sudah tidak ada data lagi
          hasNextPage = items.length > 0;
        }
        
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
    
    console.log(`✅ Total publications fetched: ${allPublications.length}`);
    return allPublications;
  },

  /**
   * Fetch detail publikasi by ID
   * @param {number} id - ID publikasi/dosen
   * @returns {Promise<Object>} Detail publikasi
   */
  async getPublicationDetail(id) {
    try {
      const response = await apiClient.get(`/client/publications/${id}`);
      
      // Handle response structure: {status: 'success', data: {...}}
      let data = response.data || response;
      if (response.status === 'success' && response.data) {
        data = response.data;
      }
      
      return data;
    } catch (error) {
      console.error(`❌ Error loading publication detail #${id}:`, error);
      throw error;
    }
  },

  /**
   * Transform raw API data ke format table
   * Response dari backend include:
   * - publications_count (total publikasi)
   * - total_sitasi (total sitasi)
   * - publications_min_tahun (tahun publikasi terlama)
   * - publications_max_tahun (tahun publikasi terbaru)
   * - publications (array, jika tersedia untuk extract min-max)
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
      
      // Extract min/max tahun publikasi
      let tahunMin = item.publications_min_tahun;
      let tahunMax = item.publications_max_tahun;
      
      // Jika tidak ada dari response, extract dari publications array jika tersedia
      if (!tahunMin || !tahunMax) {
        if (item.publications && Array.isArray(item.publications) && item.publications.length > 0) {
          const tahunArray = item.publications
            .map(p => parseInt(p.tahun || p.year))
            .filter(t => !isNaN(t));
          
          if (tahunArray.length > 0) {
            tahunMin = Math.min(...tahunArray);
            tahunMax = Math.max(...tahunArray);
          }
        }
      }
      
      return {
        id: item.id, // Include ID untuk routing
        tahun: item.year || item.tahun || (item.created_at ? new Date(item.created_at).getFullYear() : new Date().getFullYear()),
        namaDosen: item.nama_dosen || item.author || item.namaDosen || 'Unknown',
        programStudi: programStudi,
        totalPenelitian: item.publications_count || item.total_penelitian || item.publications?.length || 0,
        totalSitasi: parseInt(item.total_sitasi || item.citations_count || item.citations || 0),
        hIndex: item.h_index || item.hIndex || 0,
        // Min/Max tahun dari publikasi
        tahunMin: tahunMin || null,
        tahunMax: tahunMax || null,
        tahunRange: (tahunMin && tahunMax) 
          ? `${tahunMin} - ${tahunMax}`
          : 'N/A'
      };
    });
  },

  /**
   * Transform raw detail data ke format display
   * Extract min/max tahun dari array publications jika tidak ada di response
   * @param {Object} rawData - Raw data dari API
   * @returns {Object} Transformed data
   */
  transformDetailData(rawData) {
    // Extract min/max tahun dari publications array jika ada
    let tahunMin = rawData.publications_min_tahun;
    let tahunMax = rawData.publications_max_tahun;
    
    if (!tahunMin || !tahunMax) {
      // Jika tidak ada, extract dari publications array
      if (rawData.publications && Array.isArray(rawData.publications) && rawData.publications.length > 0) {
        const tahunArray = rawData.publications
          .map(p => parseInt(p.tahun || p.year))
          .filter(t => !isNaN(t));
        
        if (tahunArray.length > 0) {
          tahunMin = Math.min(...tahunArray);
          tahunMax = Math.max(...tahunArray);
        }
      }
    }
    
    const transformedPublications = (rawData.publications || []).map(p => {
      const tahunValue = parseInt(p.tahun) || parseInt(p.year) || null; // Convert STRING to NUMBER
      const mapped = {
        id: p.id,
        judul: p.judul || p.title || 'Untitled',
        tahun: tahunValue,
        jumlah_sitasi: parseInt(p.jumlah_sitasi) || p.citations_count || p.sitasi || 0,
        sitasi: parseInt(p.jumlah_sitasi) || p.citations_count || p.sitasi || 0, // alias
        createdAt: p.created_at
      };
      return mapped;
    });
    
    const result = {
      namaDosen: rawData.nama_dosen || rawData.author || 'Unknown',
      afiliasi: rawData.afiliasi || rawData.study_program?.fakultas || 'N/A',
      bidangKeilmuan: (rawData.bidang_keilmuan || '').split(',').map(f => f.trim()).filter(f => f),
      totalPenelitian: rawData.publications_count || rawData.publications?.length || 0,
      totalSitasi: parseInt(rawData.total_sitasi || rawData.citations_count || 0),
      hIndex: rawData.h_index || rawData.hIndex || 0,
      linkProfile: rawData.google_scholar_link || 'https://scholar.google.com',
      linkProfileText: 'Klik Di Sini',
      // Min/Max tahun publikasi
      tahunMin: tahunMin || null,
      tahunMax: tahunMax || null,
      tahunRange: (tahunMin && tahunMax) 
        ? `${tahunMin} - ${tahunMax}`
        : 'N/A',
      daftarPublikasi: transformedPublications
    };
    
    return result;
  },
};

export default publicationsAPI;
