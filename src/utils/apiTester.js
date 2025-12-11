/**
 * API Tester Utility
 * Gunakan ini untuk testing API dari browser console (development only)
 * 
 * Note: File ini bisa dihapus saat production build
 */

import { apiClient, API_CONFIG } from '../config/apiConfig'

// Export untuk bisa diakses dari console saat development
if (import.meta.env.DEV) {
  window.apiTester = {
    config: API_CONFIG,

    /**
     * Test GET request
     * Contoh: apiTester.testGet('/client/publications')
     */
    async testGet(endpoint) {
      try {
        const result = await apiClient.get(endpoint)
        return result
      } catch (error) {
        console.error('❌ Error:', error.message)
        throw error
      }
    },

    /**
     * Test POST request
     * Contoh: apiTester.testPost('/client/endpoint', { key: 'value' })
     */
    async testPost(endpoint, data) {
      try {
        const result = await apiClient.post(endpoint, data)
        return result
      } catch (error) {
        console.error('❌ Error:', error.message)
        throw error
      }
    },

    /**
     * Test PUT request
     * Contoh: apiTester.testPut('/client/endpoint/1', { key: 'value' })
     */
    async testPut(endpoint, data) {
      try {
        const result = await apiClient.put(endpoint, data)
        return result
      } catch (error) {
        console.error('❌ Error:', error.message)
        throw error
      }
    },

    /**
     * Test DELETE request
     * Contoh: apiTester.testDelete('/client/endpoint/1')
     */
    async testDelete(endpoint) {
      try {
        const result = await apiClient.delete(endpoint)
        return result
      } catch (error) {
        console.error('❌ Error:', error.message)
        throw error
      }
    },

    /**
     * Tampilkan konfigurasi API
     */
    showConfig() {
      console.table({
        'Base URL': this.config.baseURL,
        'Timeout (ms)': this.config.timeout,
        'Token': this.config.token ? '✅ Set' : '❌ Not set',
      })
    },

    /**
     * Test koneksi ke server
     */
    async testConnection() {
      try {
        const result = await apiClient.get('/health')
        console.log('✅ Server is running!')
        return result
      } catch (error) {
        console.error('❌ Cannot connect to server:', error.message)
        throw error
      }
    },
  }
}
