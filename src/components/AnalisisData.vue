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
    <div v-else-if="stats">
      <!-- Statistics Cards -->
      <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">
          <img src="/public/logo_dosen.png" alt="logo total dosen">
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats?.totalDosen || 0 }}</div>
          <div class="stat-label">Jumlah Dosen</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon orange">
          <img src="/public/logo_publikasi.png" alt="logo publikasi">
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ (stats?.totalPublikasi || 0).toLocaleString('id-ID') }}</div>
          <div class="stat-label">Total Publikasi</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon pink">
          <img src="/public/logo_sitasi.png" alt="logo sitasi">
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ (stats?.totalSitasi || 0).toLocaleString('id-ID') }}</div>
          <div class="stat-label">Total Sitasi</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon dark">
          <img src="/public/logo_tahun.png" alt="logo tahun terakhir">
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats?.tahunTerakhir || '-' }}</div>
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
        <h2 class="chart-title">Distribusi Publikasi per Program Studi</h2>
        <canvas ref="programStudiPieChart"></canvas>
      </div>
    </div>

    <!-- Charts Row 2 -->
    <div class="charts-row">
      <div class="chart-card">
        <h2 class="chart-title">Tren Publikasi Dari Tahun ke Tahun</h2>
        <canvas ref="trendChart"></canvas>
      </div>
    </div>

    <!-- Charts Row 3 -->
    <div class="charts-row">
      <div class="chart-card">
        <h2 class="chart-title">Top 5 Dosen Dengan Sitasi Tertinggi</h2>
        <canvas ref="sitasiChart"></canvas>
      </div>
    </div>

    <!-- Insights Section -->
    <div v-if="insights" class="insights-section">
      <h2 class="insights-title">INSIGHT KUNCI DARI GOOGLE SCHOLAR</h2>
      <div class="insights-grid">
        <div class="insight-card">
          <h3 class="insight-heading">Pertumbuhan Publikasi</h3>
          <p class="insight-text">{{ insights?.pertumbuhanPublikasi || '-' }}</p>
        </div>

        <div class="insight-card">
          <h3 class="insight-heading">Dampak Sitasi</h3>
          <p class="insight-text">{{ insights?.dampakSitasi || '-' }}</p>
        </div>

        <div class="insight-card">
          <h3 class="insight-heading">Dominasi Program Studi</h3>
          <p class="insight-text">{{ insights?.dominasiProgramStudi || '-' }}</p>
        </div>

        <div class="insight-card">
          <h3 class="insight-heading">Jangkauan Internasional</h3>
          <p class="insight-text">{{ insights?.jangkauanInternasional || '-' }}</p>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import dashboardAPI from '../api/dashboardAPI';
import { publicationsAPI } from '../api/publicationsAPI';
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
      stats: null,
      
      // Data insights - akan diambil dari API
      insights: null,

      // Data untuk charts - akan diambil dari API
      programStudiData: null,
      programStudiDistribution: null,
      trendData: null,
      sitasiData: null
    };
  },

  mounted() {
    // Fetch data dari API
    this.fetchAnalysisData();
  },

  methods: {
    // Method untuk fetch data dari API
    async fetchAnalysisData() {
      this.loading = true;
      this.error = null;

      try {
        // Fetch data dari API
        const rawData = await dashboardAPI.getDashboardData();
        
        // Validate data exists
        if (!rawData) {
          throw new Error('Data dashboard tidak ditemukan dari API');
        }
        
        // Transform data
        const transformedData = dashboardAPI.transformDashboardData(rawData);
        
        // Validate transformed data
        if (!transformedData || !transformedData.stats) {
          throw new Error('Struktur data dashboard tidak valid');
        }
        
        // Update all data
        this.stats = transformedData.stats;
        this.trendData = transformedData.trendData;
        this.programStudiData = transformedData.programStudiData;
        this.sitasiData = transformedData.sitasiData;
        this.insights = transformedData.insights;
        
        // Calculate program studi distribution dari ALL publications
        this.programStudiDistribution = await this.calculateProgramStudiDistribution();
        
        // Inisialisasi semua chart setelah data di-load dan DOM siap
        this.$nextTick(() => {
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
        
        if (this.$refs.programStudiChart) {
          this.initProgramStudiChart();
        }
        
        if (this.$refs.programStudiPieChart) {
          this.initProgramStudiPieChart();
        }
        
        if (this.$refs.trendChart) {
          this.initTrendChart();
        }
        
        if (this.$refs.sitasiChart) {
          this.initSitasiChart();
        }
      } catch (error) {
        console.error('❌ Error initializing charts:', error);
      }
    },

    initProgramStudiChart() {
      const canvasElement = this.$refs.programStudiChart;
      if (!canvasElement) {
        return;
      }
      
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
    },

    initProgramStudiPieChart() {
      const canvasElement = this.$refs.programStudiPieChart;
      if (!canvasElement) {
        return;
      }
      
      const ctx = canvasElement.getContext('2d');
      this.programStudiPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.programStudiDistribution.labels,
          datasets: [{
            label: 'Distribusi Publikasi',
            data: this.programStudiDistribution.values,
            backgroundColor: [
              '#1e5a6e',
              '#f4c542',
              '#0d8aee',
              '#e74c3c',
              '#27ae60'
            ],
            borderColor: '#fff',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 15,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  return `Total Penelitian: ${value}`;
                },
                afterLabel: function(context) {
                  const label = context.label || '';
                  return `Program: ${label}`;
                }
              }
            }
          }
        }
      });
    },

    initTrendChart() {
      const canvasElement = this.$refs.trendChart;
      if (!canvasElement) {
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

      this.programStudiPieChart.data.labels = this.programStudiDistribution.labels;
      this.programStudiPieChart.data.datasets[0].data = this.programStudiDistribution.values;
      this.programStudiPieChart.update();

      this.trendChart.data.labels = this.trendData.labels;
      this.trendChart.data.datasets[0].data = this.trendData.values;
      this.trendChart.update();

      this.sitasiChart.data.labels = this.sitasiData.labels;
      this.sitasiChart.data.datasets[0].data = this.sitasiData.values;
      this.sitasiChart.update();
    },

    async calculateProgramStudiDistribution() {
      try {
        // Fetch ALL dosen/researchers data
        const allPublications = await publicationsAPI.getAllPublications();
        
        // Aggregate TOTAL PUBLICATIONS (not count of items) by program studi
        const distribution = {};
        
        allPublications.forEach(dosen => {
          // Get program studi with fallback chain
          const programStudi = dosen.study_program?.program_studi || dosen.program_studi || 'Unknown';
          
          // Get TOTAL PUBLIKASI from publications_count field
          const totalPublikasi = dosen.publications_count || 0;
          
          if (!distribution[programStudi]) {
            distribution[programStudi] = 0;
          }
          // Add total publications from this dosen
          distribution[programStudi] += totalPublikasi;
        });
        

        
        // Sort by value descending
        const sorted = Object.entries(distribution)
          .sort((a, b) => b[1] - a[1]);
        
        return {
          labels: sorted.map(item => item[0]),
          values: sorted.map(item => item[1])
        };
      } catch (error) {
        console.error('❌ Error calculating program studi distribution:', error);
        // Return empty distribution on error
        return {
          labels: [],
          values: []
        };
      }
    }
  },

  beforeUnmount() {
    // Destroy charts sebelum component di-unmount
    if (this.programStudiChart) this.programStudiChart.destroy();
    if (this.programStudiPieChart) this.programStudiPieChart.destroy();
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
  width: auto;
  height: auto;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
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
