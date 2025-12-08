/**
 * API Testing Utility
 * Untuk debug dan test endpoint API
 */

export const testAPI = {
  async testEndpoint(endpoint, token = null) {
    const baseURL = 'http://localhost:8000';
    const url = `${baseURL}${endpoint}`;
    
    console.log(`\n🧪 Testing: ${endpoint}`);
    console.log(`📍 Full URL: ${url}`);
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log(`🔐 Using token: ${token.substring(0, 20)}...`);
    }
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        mode: 'cors',
        credentials: 'include'
      });
      
      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      console.log(`📋 Content-Type: ${response.headers.get('content-type')}`);
      
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log(`✅ Response (JSON):`, data);
        return { success: true, status: response.status, data };
      } else if (contentType && contentType.includes('text/html')) {
        const text = await response.text();
        console.log(`❌ Response is HTML (ERROR PAGE):`, text.substring(0, 200));
        return { success: false, status: response.status, error: 'HTML response', text: text.substring(0, 200) };
      } else {
        const text = await response.text();
        console.log(`⚠️ Response:`, text.substring(0, 200));
        return { success: false, status: response.status, text: text.substring(0, 200) };
      }
    } catch (error) {
      console.error(`💥 Network Error:`, error.message);
      return { success: false, error: error.message };
    }
  },
  
  async testAllEndpoints() {
    const token = import.meta.env.VITE_API_TOKEN;
    
    console.log('🚀 Starting API endpoint tests...\n');
    
    const endpoints = [
      { path: '/api/health', needsAuth: false, name: 'Health Check' },
      { path: '/api/client/dashboard', needsAuth: true, name: 'Dashboard' },
      { path: '/api/client/news', needsAuth: true, name: 'News List' },
      { path: '/api/client/news/1', needsAuth: true, name: 'News Detail #1' },
      { path: '/api/client/publications', needsAuth: true, name: 'Publications List' },
      { path: '/api/client/publications/1', needsAuth: true, name: 'Publication Detail #1' },
    ];
    
    const results = [];
    
    for (const endpoint of endpoints) {
      const testToken = endpoint.needsAuth ? token : null;
      const result = await this.testEndpoint(endpoint.path, testToken);
      results.push({ ...endpoint, result });
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n📊 Test Summary:');
    console.log('='.repeat(60));
    results.forEach(r => {
      const status = r.result.success ? '✅' : '❌';
      console.log(`${status} ${r.name}: ${r.result.status || 'No response'}`);
    });
    
    return results;
  }
};

export default testAPI;
