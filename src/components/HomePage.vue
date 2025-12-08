<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">PENDATAAN PUBLIKASI DOSEN FASILKOM<br>UNIVERSITAS MERCU BUANA</h1>
        <p class="hero-subtitle">Jelajahi analisis publikasi ilmiah dosen Fakultas Ilmu Komputer Universitas Mercu Buana<br>dan Google Scholar dalam satu platform terpadu</p>
        <div class="hero-buttons">
          <router-link to="/analisis" class="btn btn-primary">LIHAT ANALISIS →</router-link>
          <router-link to="/data-publikasi" class="btn btn-secondary">DATA PUBLIKASI</router-link>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-icon">👤</div>
          <div class="stat-value">{{ stats.totalDosen }}</div>
          <div class="stat-label">Jumlah Dosen</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📁</div>
          <div class="stat-value">{{ stats.totalPublikasi.toLocaleString('id-ID') }}</div>
          <div class="stat-label">Total Publikasi</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-value">{{ stats.totalSitasi.toLocaleString('id-ID') }}</div>
          <div class="stat-label">Total Sitasi</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-value">{{ stats.tahunTerakhir }}</div>
          <div class="stat-label">Tahun Publikasi Terakhir</div>
        </div>
      </div>
    </section>

    <!-- Tentang Section -->
    <section class="about-section">
      <div class="about-card">
        <div class="about-icon">📖</div>
        <h2>Tentang ScholarTrack</h2>
        <p>ScholarTrack adalah platform digital yang dirancang khusus untuk memonitor dan menganalisis publikasi ilmiah dosen Fakultas Ilmu Komputer Universitas Mercu Buana. Dengan mengintegrasikan data dari Google Scholar, platform ini menyediakan visualisasi komprehensif tentang tren penelitian, topik riset populer, dan produktivitas akademik. Informasi ini membantu dalam pengambilan keputusan strategis dan peningkatan kualitas riset. Platform ini menyajikan data secara transparan dan mudah diakses, mendorong kolaborasi riset, dan meningkatkan visibilitas kontribusi akademik dosen Fasilkom UMB.</p>
      </div>
    </section>

    <!-- Berita Section -->
    <section class="berita-section">
      <h2>BERITA</h2>
      <div v-if="beritaList.length === 0" class="loading-message">📚 Memuat berita...</div>
      <div v-else class="berita-carousel">
        <button class="carousel-btn prev" @click="prevSlide">‹</button>
        <div class="carousel-container">
          <div class="carousel-wrapper" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div class="berita-card" v-for="(berita, index) in beritaList" :key="index">
              <div class="berita-tag">{{ berita.tag }}</div>
              <h3>{{ berita.title }}</h3>
              <p>{{ berita.description }}</p>
            </div>
          </div>
        </div>
        <button class="carousel-btn next" @click="nextSlide">›</button>
      </div>
      <router-link to="/berita" class="see-all">See All ></router-link>
    </section>

    <!-- Rekap Publikasi Section -->
    <section class="rekap-section">
      <h2>REKAP PUBLIKASI DOSEN FASILKOM UNIVERSITAS MERCU BUANA</h2>
      
      <!-- Loading State -->
      <LoadingState v-if="loading" message="⏳ Memuat data analisis..." />
      
      <!-- Error State -->
      <ErrorState 
        v-else-if="error" 
        :title="'Gagal Memuat Data'"
        :message="error"
      />
      
      <!-- Content -->
      <div v-else class="rekap-grid">
        <!-- Chart 1: Tren Publikasi per Tahun -->
        <div class="rekap-card">
          <h3>Tren Publikasi per Tahun</h3>
          <div class="chart-container">
            <canvas ref="trendChart" style="max-height: 250px;"></canvas>
          </div>
          <router-link to="/data-publikasi" class="lihat-btn">LIHAT DATA PUBLIKASI</router-link>
        </div>

        <!-- Chart 2: Top Dosen by Publikasi -->
        <div class="rekap-card stats-card-dark">
          <h3>5 DOSEN DENGAN PUBLIKASI TERBANYAK</h3>
          <ul class="top-list">
            <li v-for="(dosen, idx) in topDosenPublikasi" :key="idx">
              <span class="rank">{{ idx + 1 }}.</span> 
              <span class="name">{{ dosen.nama_dosen }}</span> 
              <span class="count">{{ dosen.publications_count || 0 }}</span>
            </li>
          </ul>
        </div>

        <!-- Chart 3: Top Dosen by Sitasi -->
        <div class="rekap-card stats-card-dark">
          <h3>5 DOSEN DENGAN SITASI TERBANYAK</h3>
          <ul class="top-list">
            <li v-for="(dosen, idx) in topDosenSitasi" :key="idx">
              <span class="rank">{{ idx + 1 }}.</span> 
              <span class="name">{{ dosen.nama_dosen }}</span> 
              <span class="count">{{ dosen.total_sitasi || 0 }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
      <h2>CONTACT US</h2>
      <div class="contact-card">
        <div class="contact-info">
          <div class="contact-item">
            <span class="icon">💬</span>
            <span class="text">+6234567890</span>
          </div>
          <div class="contact-item">
            <span class="icon">📧</span>
            <span class="text">scholartrack@gmail.com</span>
          </div>
        </div>
        <div class="contact-map">
          <p class="alamat-label">Lokasi Universitas Mercu Buana:</p>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1983.202272674759!2d106.73740077017727!3d-6.210254569484226!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f71f5a41c197%3A0x628259f9e8d6d7b4!2sUniversitas%20Mercu%20Buana!5e0!3m2!1sen!2sus!4v1765214996624!5m2!1sen!2sus" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade">
          </iframe>
          <p class="alamat-text">Jl. Meruya Selatan, Kembangan, Jakarta Barat 11650, Indonesia</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { apiClient } from '../config/apiConfig';
import { dashboardAPI } from '../api/dashboardAPI';
import { newsAPI } from '../api/newsAPI';
import LoadingState from './LoadingState.vue';
import ErrorState from './ErrorState.vue';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const currentSlide = ref(0);
const loading = ref(false);
const error = ref(null);

// Dashboard Stats
const stats = ref({
  totalDosen: 0,
  totalPublikasi: 0,
  totalSitasi: 0,
  tahunTerakhir: new Date().getFullYear()
});

// News/Berita data
const beritaList = ref([]);

// Analytics data for rekap section
const trendData = ref({ labels: [], values: [] });
const topDosenPublikasi = ref([]);
const topDosenSitasi = ref([]);

// Chart references
const trendChart = ref(null);
let trendChartInstance = null;

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    console.log('🔵 Fetching dashboard data...');
    const data = await dashboardAPI.getDashboardData();
    
    console.log('✅ Dashboard data loaded:', data);
    
    // Update stats
    stats.value = {
      totalDosen: data.jumlah_dosen || 0,
      totalPublikasi: data.total_publikasi || 0,
      totalSitasi: data.total_sitasi || 0,
      tahunTerakhir: data.tahun_terakhir || new Date().getFullYear()
    };
    
    // Extract trend data
    if (data.tren_publikasi) {
      trendData.value = {
        labels: data.tren_publikasi.map(item => item.tahun.toString()),
        values: data.tren_publikasi.map(item => item.total)
      };
    }
    
    // Extract top dosen by publikasi
    if (data.top_dosen_publikasi) {
      topDosenPublikasi.value = data.top_dosen_publikasi.slice(0, 5);
    }
    
    // Extract top dosen by sitasi
    if (data.top_dosen_sitasi) {
      topDosenSitasi.value = data.top_dosen_sitasi.slice(0, 5);
    }
  } catch (err) {
    console.error('❌ Error loading dashboard data:', err);
    error.value = err.message || 'Gagal memuat data dashboard';
  }
};

// Fetch berita from API
const fetchBerita = async () => {
  try {
    console.log('🔵 Fetching news data...');
    const newsArray = await newsAPI.getAllNews();
    
    console.log('✅ News data loaded:', newsArray);
    
    // Transform to berita format
    beritaList.value = newsArray.slice(0, 4).map(item => ({
      id: item.id,
      tag: item.tags ? item.tags.split(',')[0] : 'Berita',
      title: item.judul || item.title,
      description: item.deskripsi_singkat || item.description
    }));
  } catch (err) {
    console.error('❌ Error loading news:', err);
    // Use fallback data if API fails
    beritaList.value = [
      {
        tag: 'Pencapaian',
        title: 'Data Publikasi Terbaru Dimuat',
        description: 'Platform sedang memuat data publikasi terbaru dari sistem backend.'
      }
    ];
  }
};

// Initialize trend chart
const initTrendChart = () => {
  if (!trendChart.value || trendData.value.labels.length === 0) return;
  
  const ctx = trendChart.value.getContext('2d');
  
  if (trendChartInstance) {
    trendChartInstance.destroy();
  }
  
  trendChartInstance = new ChartJS(ctx, {
    type: 'line',
    data: {
      labels: trendData.value.labels,
      datasets: [{
        label: 'Tren Publikasi',
        data: trendData.value.values,
        borderColor: '#0d8aee',
        backgroundColor: 'rgba(13, 138, 238, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#0d8aee',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#333' }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: '#666' },
          grid: { color: 'rgba(0,0,0,0.1)' }
        },
        x: {
          ticks: { color: '#666' },
          grid: { color: 'rgba(0,0,0,0.1)' }
        }
      }
    }
  });
};

const nextSlide = () => {
  if (currentSlide.value < beritaList.value.length - 1) {
    currentSlide.value++;
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};

// Load data on mount
onMounted(async () => {
  loading.value = true;
  try {
    await fetchDashboardData();
    await fetchBerita();
    
    // Initialize chart after data is loaded
    setTimeout(() => {
      initTrendChart();
    }, 100);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-page {
  width: 100%;
  background-color: #ebf2f7;
}

/* ========== HERO SECTION ========== */
.hero {
  background: linear-gradient(135deg, #0e3b63 0%, #1a5a8a 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto 3rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.hero-subtitle {
  font-size: 1rem;
  margin-bottom: 2rem;
  opacity: 0.95;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background-color: #ffffff;
  color: #0e3b63;
}

.btn-primary:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: transparent;
  color: #ffffff;
  border: 2px solid #ffffff;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Stats Container */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10rem;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem;
}

.stat-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #0e3b63;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

/* ========== ABOUT SECTION ========== */
.about-section {
  padding: 3rem 2rem;
  background-color: #ebf2f7;
}

.about-card {
  max-width: 900px;
  margin: 0 auto;
  background-color: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.about-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.about-card h2 {
  font-size: 1.5rem;
  color: #0e3b63;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.about-card p {
  font-size: 0.95rem;
  color: #555;
  line-height: 1.8;
  text-align: justify;
}

/* ========== BERITA SECTION ========== */
.berita-section {
  padding: 3rem 2rem;
  background-color: #ebf2f7;
}

.berita-section h2 {
  text-align: left;
  font-size: 1.8rem;
  color: #000;
  margin-bottom: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 700;
}

.berita-carousel {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
}

.carousel-btn {
  background-color: transparent;
  border: none;
  font-size: 2.5rem;
  color: #999;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
  flex-shrink: 0;
}

.carousel-btn:hover {
  color: #0e3b63;
}

.carousel-container {
  flex: 1;
  overflow: hidden;
  border-radius: 12px;
}

.carousel-wrapper {
  display: flex;
  gap: 1.5rem;
  transition: transform 0.5s ease;
}

.berita-card {
  flex: 0 0 calc(33.333% - 1rem);
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.berita-tag {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background-color: #ffc107;
  color: white;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
}

.berita-card h3 {
  font-size: 1.1rem;
  color: #000;
  margin-bottom: 0.8rem;
  font-weight: 700;
  line-height: 1.4;
}

.berita-card p {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

.see-all {
  text-align: right;
  max-width: 1200px;
  margin: 2rem auto 0;
  color: #999;
  font-size: 0.95rem;
  cursor: pointer;
  display: block;
  text-decoration: none;
}

.see-all:hover {
  color: #0d8aee;
}

/* ========== REKAP SECTION ========== */
.rekap-section {
  padding: 3rem 2rem;
  background-color: #ebf2f7;
}

.rekap-section h2 {
  max-width: 1200px;
  margin: 0 auto 2.5rem;
  font-size: 1.8rem;
  color: #000;
  font-weight: 700;
  text-align: left;
}

.rekap-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.rekap-card {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 2px solid #f0f0f0;
}

.rekap-card h3 {
  font-size: 1.1rem;
  color: #000;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.chart-container {
  position: relative;
  height: 250px;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.loading-message {
  text-align: center;
  padding: 3rem 2rem;
  font-size: 1.1rem;
  color: #666;
}

.simple-chart {
  width: 100%;
  height: 100%;
}

.wordcloud-placeholder {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.word-item {
  background-color: #e8f1ff;
  color: #0e3b63;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
}

.word-item.large {
  font-size: 2rem;
}

.word-item.medium {
  font-size: 1.3rem;
}

.word-item.small {
  font-size: 1rem;
}

.word-item.tiny {
  font-size: 0.8rem;
}

.stats-card-dark {
  background-color: #0e3b63;
  color: white;
}

.stats-card-dark h3 {
  color: white;
  font-size: 1rem;
}

.top-list {
  list-style: none;
}

.top-list li {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.95rem;
}

.top-list li:last-child {
  border-bottom: none;
}

.rank {
  font-weight: 700;
  min-width: 30px;
}

.name {
  flex: 1;
  padding: 0 1rem;
}

.count {
  font-weight: 700;
  text-align: right;
}

.lihat-btn {
  width: 100%;
  padding: 0.8rem;
  background-color: #ffc107;
  color: #000;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: block;
  text-decoration: none;
  text-align: center;
}

.lihat-btn:hover {
  background-color: #ffb300;
}

/* ========== CONTACT SECTION ========== */
.contact-section {
  padding: 3rem 2rem;
  background-color: #ebf2f7;
}

.contact-section h2 {
  max-width: 1200px;
  margin: 0 auto 2rem;
  font-size: 1.8rem;
  color: #000;
  font-weight: 700;
}

.contact-card {
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.contact-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon {
  font-size: 1.8rem;
}

.text {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.contact-map {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
}

.contact-map iframe {
  width: 100%;
  height: 200px;
  border: none !important;
  border-radius: 8px;
  display: block;
}

.map-image {
  width: 100%;
  height: 250px;
  background-color: #f0f0f0;
  border-radius: 8px;
  object-fit: cover;
}

.alamat-label {
  margin-top: 1rem;
  font-size: 1rem;
  color: #000;
  font-weight: 600;
}

.alamat-text {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.6;
}

/* ========== RESPONSIVE DESIGN ========== */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 2rem;
  }

  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .rekap-grid {
    grid-template-columns: 1fr;
  }

  .contact-card {
    grid-template-columns: 1fr;
  }

  .berita-card {
    flex: 0 0 calc(50% - 0.75rem);
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 2rem 1rem;
  }

  .hero-content {
    margin-bottom: 2rem;
  }

  .hero-title {
    font-size: 1.6rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
  }

  .hero-buttons {
    gap: 1rem;
  }

  .btn {
    padding: 0.7rem 1.5rem;
    font-size: 0.85rem;
  }

  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    padding: 0 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .about-section {
    padding: 2rem 1rem;
  }

  .about-card {
    padding: 1.5rem;
  }

  .about-card h2 {
    font-size: 1.3rem;
  }

  .about-card p {
    font-size: 0.85rem;
  }

  .berita-section {
    padding: 2rem 1rem;
  }

  .berita-section h2 {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
  }

  .berita-carousel {
    gap: 1rem;
  }

  .carousel-btn {
    font-size: 2rem;
  }

  .berita-card {
    flex: 0 0 100%;
  }

  .berita-card h3 {
    font-size: 1rem;
  }

  .berita-card p {
    font-size: 0.85rem;
  }

  .rekap-section {
    padding: 2rem 1rem;
  }

  .rekap-section h2 {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
  }

  .rekap-card {
    padding: 1.5rem;
  }

  .rekap-card h3 {
    font-size: 1rem;
  }

  .contact-section {
    padding: 2rem 1rem;
  }

  .contact-section h2 {
    font-size: 1.4rem;
  }

  .contact-card {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .contact-item {
    gap: 0.8rem;
  }

  .icon {
    font-size: 1.5rem;
  }

  .text {
    font-size: 0.9rem;
  }

  .map-image {
    height: 150px;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 1.5rem 1rem;
  }

  .hero-title {
    font-size: 1.3rem;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 0.8rem;
    margin-bottom: 1.5rem;
  }

  .hero-buttons {
    flex-direction: column;
    gap: 0.8rem;
  }

  .btn {
    width: 100%;
    padding: 0.7rem 1rem;
  }

  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
    padding: 0;
  }

  .stat-card {
    padding: 0.8rem;
  }

  .stat-icon {
    font-size: 2rem;
  }

  .stat-value {
    font-size: 1.2rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .about-card {
    padding: 1rem;
  }

  .berita-card {
    padding: 1rem;
  }

  .rekap-card {
    padding: 1rem;
  }

  .wordcloud-placeholder {
    gap: 0.5rem;
  }

  .word-item.large {
    font-size: 1.5rem;
  }

  .word-item.medium {
    font-size: 1.1rem;
  }

  .word-item.small {
    font-size: 0.9rem;
  }

  .top-list li {
    font-size: 0.85rem;
    padding: 0.6rem 0;
  }
}
</style>