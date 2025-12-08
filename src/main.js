import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/HomePage.vue'
import DataPublikasi from './components/DataPublikasi.vue'
import AnalisisData from './components/AnalisisData.vue'
import Berita from './components/Berita.vue'
import { apiClient } from './config/apiConfig'
import { testAPI } from './utils/testAPI'
import './utils/apiTester' // Load API Tester untuk browser console

// Expose debug tools ke global window untuk browser console
window.__DEBUG__ = {
  apiClient,
  testAPI,
  async testEndpoint(endpoint) {
    return testAPI.testEndpoint(endpoint, import.meta.env.VITE_API_TOKEN);
  },
  async testAll() {
    return testAPI.testAllEndpoints();
  },
  apiConfig() {
    return apiClient.debug();
  }
};

console.log('💡 Debug tools available: window.__DEBUG__');
console.log('   - window.__DEBUG__.apiConfig()  : Show API config');
console.log('   - window.__DEBUG__.testEndpoint(\"/api/health\") : Test single endpoint');
console.log('   - window.__DEBUG__.testAll() : Test all endpoints');

const router = createRouter({
    routes: [
        {
            path: "/",
            component: HomePage
        },
        {
            path: "/homepage",
            redirect: "/"
        },
        {
            path: "/data-publikasi",
            component: DataPublikasi
        },
        {
            path: "/data-publikasi/:id",
            component: () => import('./components/DetailDosen.vue')
        },
        {
            path: "/analisis",
            component: AnalisisData
        },
        {
            path: "/berita",
            component: Berita
        },
        {
            path: "/berita/:id",
            component: () => import('./components/DetailBerita.vue')
        }
    ],
    history: createWebHistory()
})

createApp(App).use(router).mount('#app')

console.log('✅ Vue app mounted successfully');