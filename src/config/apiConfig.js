/**
 * API Configuration
 * This file loads environment variables for API Bridge
 */

export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  token: import.meta.env.VITE_API_TOKEN || '',
};

/**
 * API instance for making requests
 */
export const apiClient = {
  async request(endpoint, options = {}) {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      // Tambahkan token ke header jika ada
      if (API_CONFIG.token) {
        headers['Authorization'] = `Bearer ${API_CONFIG.token}`;
      }

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers,
        mode: 'cors',
        credentials: 'include',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error Response (${response.status}):`, errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text();
        console.error(`Expected JSON but got ${contentType}. Response:`, responseText.substring(0, 200));
        throw new Error(`Expected JSON response, got ${contentType || 'unknown'}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`Request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },

  // Debug helper
  debug() {
    console.log('🔧 API Configuration:');
    console.log(`  Base URL: ${API_CONFIG.baseURL}`);
    console.log(`  Timeout: ${API_CONFIG.timeout}ms`);
    console.log(`  Token: ${API_CONFIG.token ? API_CONFIG.token.substring(0, 20) + '...' : 'NOT SET'}`);
    return API_CONFIG;
  }
};

export default API_CONFIG;
