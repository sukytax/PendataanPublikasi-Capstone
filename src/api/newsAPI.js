/**
 * News/Berita API Service
 * Handle semua logic fetch news/berita dari backend
 */

import { apiClient } from '../config/apiConfig'

export const newsAPI = {
  /**
   * Fetch semua news/berita
   * @returns {Promise<Array>} Array of all news
   */
  async getAllNews() {
    try {
      console.log('🔵 Fetching all news...');
      const response = await apiClient.get('/client/news');
      
      // Handle both direct array dan paginated response
      const data = response.data || response;
      const newsArray = Array.isArray(data) ? data : (data.data || []);
      
      console.log('✅ News loaded:', newsArray);
      return newsArray;
    } catch (error) {
      console.error('❌ Error loading news:', error);
      throw error;
    }
  },

  /**
   * Fetch detail news by ID
   * @param {number} id - ID berita
   * @returns {Promise<Object>} Detail news
   */
  async getNewsDetail(id) {
    try {
      console.log(`🔵 Fetching news detail with ID: ${id}`);
      const response = await apiClient.get(`/client/news/${id}`);
      const data = response.data || response;
      
      console.log('✅ News detail loaded:', data);
      
      // Handle both direct object dan paginated response
      if (data.data) {
        return data.data;
      } else {
        return data;
      }
    } catch (error) {
      console.error(`❌ Error loading news detail:`, error);
      throw error;
    }
  },

  /**
   * Transform news data untuk display
   * @param {Array} rawData - Raw data dari API
   * @returns {Array} Transformed data
   */
  transformNews(rawData) {
    return rawData.map(item => ({
      id: item.id,
      judul: item.judul || item.title,
      deskripsi_singkat: item.deskripsi_singkat || item.description,
      tags: item.tags || '',
      isi: item.isi || item.content || '',
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  }
};

export default newsAPI;
