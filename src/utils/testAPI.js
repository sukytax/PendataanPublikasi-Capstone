/**
 * API Testing Utility (Development only)
 * Untuk debug dan test endpoint API
 */

export const testAPI = {
  async testEndpoint(endpoint, token = null) {
    const baseURL = 'http://localhost:8000';
    const url = `${baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        mode: 'cors',
        credentials: 'include'
      });
      
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return { success: true, status: response.status, data };
      } else if (contentType && contentType.includes('text/html')) {
        const text = await response.text();
        return { success: false, status: response.status, error: 'HTML response', text: text.substring(0, 200) };
      } else {
        const text = await response.text();
        return { success: false, status: response.status, text: text.substring(0, 200) };
      }
    } catch (error) {
      console.error(`❌ Network Error:`, error.message);
      return { success: false, error: error.message };
    }
  },
  
  async testAllEndpoints() {
    const token = import.meta.env.VITE_API_TOKEN;
    
    const endpoints = [
      { path: '/api/health', needsAuth: false, name: 'Health Check' },
      { path: '/api/client/dashboard', needsAuth: true, name: 'Dashboard' },
      { path: '/api/client/news', needsAuth: true, name: 'News List' },
      { path: '/api/client/publications', needsAuth: true, name: 'Publications List' },
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      const testToken = endpoint.needsAuth ? token : null;
      const result = await this.testEndpoint(endpoint.path, testToken);
      results.push({ ...endpoint, result });
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return results;
  }
};

export default testAPI;
