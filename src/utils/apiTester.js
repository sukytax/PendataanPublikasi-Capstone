/**
 * API Tester Utility
 * Gunakan ini untuk testing API dari browser console
 */

import { apiClient, API_CONFIG } from '../config/apiConfig'

// Export untuk bisa diakses dari console
window.apiTester = {
  config: API_CONFIG,

  /**
   * Test GET request
   * Contoh: apiTester.testGet('/dosen')
   */
  async testGet(endpoint) {
    try {
      console.log(`🔵 Testing GET ${endpoint}...`)
      const result = await apiClient.get(endpoint)
      console.log('✅ Success:', result)
      return result
    } catch (error) {
      console.error('❌ Error:', error.message)
      throw error
    }
  },

  /**
   * Test POST request
   * Contoh: apiTester.testPost('/dosen', { nama: 'Dr. Budi', nidn: '123456789' })
   */
  async testPost(endpoint, data) {
    try {
      console.log(`🔵 Testing POST ${endpoint}...`)
      console.log('Data:', data)
      const result = await apiClient.post(endpoint, data)
      console.log('✅ Success:', result)
      return result
    } catch (error) {
      console.error('❌ Error:', error.message)
      throw error
    }
  },

  /**
   * Test PUT request
   * Contoh: apiTester.testPut('/dosen/1', { nama: 'Dr. Budi Updated' })
   */
  async testPut(endpoint, data) {
    try {
      console.log(`🔵 Testing PUT ${endpoint}...`)
      console.log('Data:', data)
      const result = await apiClient.put(endpoint, data)
      console.log('✅ Success:', result)
      return result
    } catch (error) {
      console.error('❌ Error:', error.message)
      throw error
    }
  },

  /**
   * Test DELETE request
   * Contoh: apiTester.testDelete('/dosen/1')
   */
  async testDelete(endpoint) {
    try {
      console.log(`🔵 Testing DELETE ${endpoint}...`)
      const result = await apiClient.delete(endpoint)
      console.log('✅ Success:', result)
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
      console.log(`🔵 Testing connection to ${this.config.baseURL}...`)
      const result = await apiClient.get('/health')
      console.log('✅ Server is running!')
      return result
    } catch (error) {
      console.error('❌ Cannot connect to server:', error.message)
      throw error
    }
  },
}

// Log kalau environment sudah siap
console.log('✨ API Tester ready! Type: apiTester.showConfig() to see configuration')
console.log('📝 Available methods:')
console.log('  - apiTester.showConfig()')
console.log('  - apiTester.testConnection()')
console.log('  - apiTester.testGet(endpoint)')
console.log('  - apiTester.testPost(endpoint, data)')
console.log('  - apiTester.testPut(endpoint, data)')
console.log('  - apiTester.testDelete(endpoint)')
