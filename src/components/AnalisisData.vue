<template>
  <div class="analisis-container">
    <h1 class="page-title">ANALISIS PUBLIKASI DOSEN FASILKOM</h1>

    <!-- Loading State -->
    <LoadingState v-if="loading" message="⏳ Memuat data analisis..." />

    <!-- Error State -->
    <ErrorState 
      v-else-if="error" 
      :title="'Gagal Memuat Data'"
      :message="error"
      @retry="fetchAnalysisData"
    />

    <!-- Data State -->
    <div v-else>
      <!-- Statistics Cards -->
      <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalDosen }}</div>
          <div class="stat-label">Jumlah Dosen</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orange">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalPublikasi.toLocaleString('id-ID') }}</div>
          <div class="stat-label">Total Publikasi</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon pink">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalSitasi.toLocaleString('id-ID') }}</div>
          <div class="stat-label">Total Sitasi</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon dark">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.tahunTerakhir }}</div>
          <div class="stat-label">Tahun Publikasi Terakhir</div>
        </div>
      </div>
    </div>

    <!-- Charts Row 1 -->
    <div class="charts-row">
      <div class="chart-card">
        <h2 class="chart-title">Top 5 Dosen Paling Produktif</h2>
        <canvas ref="programStudiChart"></canvas>
      </div>

      <div class="chart-card">
        <h2 class="chart-title">Tren Publikasi Dari Tahun ke Tahun</h2>
        <canvas ref="trendChart"></canvas>
      </div>
    </div>

    <!-- Charts Row 2 -->
    <div class="charts-row">
      <div class="chart-card">
        <h2 class="chart-title">Top 5 Dosen Dengan Sitasi Tertinggi</h2>
        <canvas ref="sitasiChart"></canvas>
      </div>
    </div>

    <!-- Insights Section -->
    <div class="insights-section">
      <h2 class="insights-title">INSIGHT KUNCI DARI GOOGLE SCHOLAR</h2>
      <div class="insights-grid">
        <div class="insight-card">
          <h3 class="insight-heading">Pertumbuhan Publikasi</h3>
          <p class="insight-text">{{ insights.pertumbuhanPublikasi }}</p>
        </div>

        <div class="insight-card">
          <h3 class="insight-heading">Dampak Sitasi</h3>
          <p class="insight-text">{{ insights.dampakSitasi }}</p>
        </div>

        <div class="insight-card">
          <h3 class="insight-heading">Dominasi Program Studi</h3>
          <p class="insight-text">{{ insights.dominasiProgramStudi }}</p>
        </div>

        <div class="insight-card">
          <h3 class="insight-heading">Jangkauan Internasional</h3>
          <p class="insight-text">{{ insights.jangkauanInternasional }}</p>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import dashboardAPI from '../api/dashboardAPI';
import LoadingState from './LoadingState.vue';
import ErrorState from './ErrorState.vue';

Chart.register(...registerables);

export default {
  name: 'AnalisisData',
  components: {
    LoadingState,
    ErrorState
  },
  data() {
    return {
      loading: false,
      error: null,
      
      // Data statistik - akan diambil dari API
      stats: {
        totalDosen: 20,
        totalPublikasi: 183,
        totalSitasi: 8373,
        tahunTerakhir: 2025
      },
      
      // Data insights - akan diambil dari API
      insights: {
        pertumbuhanPublikasi: 'Publikasi mencapai 183 dengan 20 dosen aktif di 20 topik riset.',
        dampakSitasi: 'Total sitasi mencapai 8373, menunjukkan dampak riset yang signifikan dengan rata-rata 418 sitasi per dosen.',
        dominasiProgramStudi: 'Dosen terprodukstif adalah Siti Choiriah dengan 10 publikasi.',
        jangkauanInternasional: 'Dosen dengan sitasi tertinggi adalah Sharryn Kasmir dengan 1742 sitasi.'
      },

      // Data untuk charts - akan diambil dari API
      programStudiData: {
        labels: ['Siti Choiriah', 'Heri Budianto', 'Adizty Suparno', 'Swarmilah Hariani., M.Acc.,Ph.D', 'Ratna Mappanyuki'],
        values: [10, 10, 10, 10, 10]
      },

      trendData: {
        labels: ['1996', '1999', '2007', '2008', '2011', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
        values: [1, 1, 3, 2, 2, 3, 6, 8, 9, 10, 12, 17, 32, 22, 15, 19, 8, 13]
      },

      sitasiData: {
        labels: ['Sharryn Kasmir', 'Dr. Agus Arijanto,SE,MM', 'Adi Nurmahdi', 'Hari Setiyawati', 'Heri Budianto'],
        values: [1742, 1257, 699, 597, 506]
      }
    };
  },

  mounted() {
    // Fetch data dari API
    this.fetchAnalysisData();
    
    // Fallback: initialize charts dengan default data setelah delay
    setTimeout(() => {
      if (!this.loading && !this.error) {
        console.log('📊 Initializing charts with current data');
        this.initAllCharts();
      }
    }, 500);
  },

  methods: {
    // Method untuk fetch data dari API
    async fetchAnalysisData() {
      this.loading = true;
      this.error = null;

      try {
        console.log('🔵 Fetching dashboard data...');
        
        // Fetch data dari API
        const rawData = await dashboardAPI.getDashboardData();
        console.log('📥 Raw API response:', rawData);
        
        // Transform data
        const transformedData = dashboardAPI.transformDashboardData(rawData);
        console.log('📊 Transformed data:', transformedData);
        
        // Update all data
        this.stats = transformedData.stats;
        this.trendData = transformedData.trendData;
        this.programStudiData = transformedData.programStudiData;
        this.sitasiData = transformedData.sitasiData;
        this.insights = transformedData.insights;
        
        console.log('✅ Data assigned to component:', {
          stats: this.stats,
          trendData: this.trendData,
          programStudiData: this.programStudiData,
          sitasiData: this.sitasiData
        });
        
        // Inisialisasi semua chart setelah data di-load dan DOM siap
        this.$nextTick(() => {
          console.log('🎨 Initializing charts...');
          // Add delay untuk ensure DOM fully rendered
          setTimeout(() => {
            this.initAllCharts();
          }, 100);
        });
      } catch (err) {
        this.error = err.message || 'Gagal memuat data dashboard';
        console.error('❌ Failed to fetch dashboard data:', err);
        console.error('📋 Error details:', err);
      } finally {
        this.loading = false;
      }
    },

    initAllCharts() {
      // Inisialisasi semua chart dengan null checks
      try {
        console.log('🔍 Checking canvas refs:', {
          programStudiChart: !!this.$refs.programStudiChart,
          trendChart: !!this.$refs.trendChart,
          sitasiChart: !!this.$refs.sitasiChart
        });
        
        console.log('📌 Current data:', {
          programStudiData: this.programStudiData,
          trendData: this.trendData,
          sitasiData: this.sitasiData
        });
        
        if (this.$refs.programStudiChart) {
          console.log('✨ Initializing programStudiChart');
          this.initProgramStudiChart();
        } else {
          console.warn('⚠️ programStudiChart ref not found');
        }
        
        if (this.$refs.trendChart) {
          console.log('✨ Initializing trendChart');
          this.initTrendChart();
        } else {
          console.warn('⚠️ trendChart ref not found');
        }
        
        if (this.$refs.sitasiChart) {
          console.log('✨ Initializing sitasiChart');
          this.initSitasiChart();
        } else {
          console.warn('⚠️ sitasiChart ref not found');
        }
      } catch (error) {
        console.error('❌ Error initializing charts:', error);
      }
    },

    initProgramStudiChart() {
      const canvasElement = this.$refs.programStudiChart;
      if (!canvasElement) {
        console.warn('⚠️ Program Studi canvas not found');
        return;
      }
      
      console.log('📊 programStudiChart data:', {
        labels: this.programStudiData.labels,
        values: this.programStudiData.values
      });
      
      const ctx = canvasElement.getContext('2d');
      this.programStudiChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.programStudiData.labels,
          datasets: [{
            label: 'Jumlah Publikasi',
            data: this.programStudiData.values,
            backgroundColor: '#1e5a6e',
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            x: {
              beginAtZero: true,
              ticks: {
                stepSize: 2
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
      
      console.log('✅ programStudiChart initialized');
    },

    initTrendChart() {
      const canvasElement = this.$refs.trendChart;
      if (!canvasElement) {
        console.warn('⚠️ Trend chart canvas not found');
        return;
      }
      
      const ctx = canvasElement.getContext('2d');
      this.trendChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.trendData.labels,
          datasets: [{
            label: 'Jumlah Publikasi',
            data: this.trendData.values,
            backgroundColor: '#1e5a6e',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 70
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    },

    initSitasiChart() {
      const canvasElement = this.$refs.sitasiChart;
      if (!canvasElement) {
        console.warn('⚠️ Sitasi chart canvas not found');
        return;
      }
      
      const ctx = canvasElement.getContext('2d');
      this.sitasiChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.sitasiData.labels,
          datasets: [{
            label: 'Jumlah Sitasi',
            data: this.sitasiData.values,
            backgroundColor: '#f4c542',
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            x: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    },

    updateAllCharts() {
      // Update semua chart ketika data berubah
      this.programStudiChart.data.labels = this.programStudiData.labels;
      this.programStudiChart.data.datasets[0].data = this.programStudiData.values;
      this.programStudiChart.update();

      this.trendChart.data.labels = this.trendData.labels;
      this.trendChart.data.datasets[0].data = this.trendData.values;
      this.trendChart.update();

      this.sitasiChart.data.labels = this.sitasiData.labels;
      this.sitasiChart.data.datasets[0].data = this.sitasiData.values;
      this.sitasiChart.update();
    }
  },

  beforeUnmount() {
    // Destroy charts sebelum component di-unmount
    if (this.programStudiChart) this.programStudiChart.destroy();
    if (this.trendChart) this.trendChart.destroy();
    if (this.sitasiChart) this.sitasiChart.destroy();
  }
};
</script>

<style scoped>
.analisis-container {
  padding: 30px;
  min-height: 100vh;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: left;
}

/* Statistics Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.blue {
  background: #2196f3;
}

.stat-icon.orange {
  background: #ff9800;
}

.stat-icon.pink {
  background: #e91e63;
}

.stat-icon.dark {
  background: #37474f;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 5px;
}

/* Charts */
.charts-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
  margin-bottom: 25px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
}

canvas {
  max-height: 300px;
}

/* Insights Section */
.insights-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-top: 25px;
}

.insights-title {
  font-size: 20px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 25px;
  text-align: center;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.insight-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #1e5a6e;
}

.insight-heading {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
}

.insight-text {
  font-size: 14px;
  color: #5a6c7d;
  line-height: 1.6;
  text-align: justify;
}

/* Responsive Design */
@media (max-width: 768px) {
  .analisis-container {
    padding: 15px;
  }

  .page-title {
    font-size: 22px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .charts-row {
    grid-template-columns: 1fr;
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
  }

  .stat-value {
    font-size: 24px;
  }
}
</style>
