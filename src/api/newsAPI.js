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
      const response = await apiClient.get('/client/news');
      
      // Backend returns either {status: 'success', data: [...]} or direct array
      let newsArray = [];
      
      if (response.status === 'success' && response.data) {
        // Response format: {status: 'success', data: [...]}
        newsArray = Array.isArray(response.data) ? response.data : response.data.data || [];
      } else if (Array.isArray(response)) {
        // Direct array response
        newsArray = response;
      } else if (response.data) {
        // Nested data property
        newsArray = Array.isArray(response.data) ? response.data : response.data.data || [];
      }
      
      return newsArray;
    } catch (error) {
      console.error('❌ Error loading news:', error.message);
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
      const response = await apiClient.get(`/client/news/${id}`);
      const data = response.data || response;
      
      // Handle both direct object dan paginated response
      if (data.data) {
        return data.data;
      } else {
        return data;
      }
    } catch (error) {
      console.error(`❌ Error loading news detail:`, error.message);
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
