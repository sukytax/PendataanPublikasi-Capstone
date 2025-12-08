<template>
  <div class="analisis-container">
    <h1 class="page-title">ANALISIS PUBLIKASI DOSEN FASILKOM</h1>

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
        <h2 class="chart-title">Distribusi Publikasi per Program Studi</h2>
        <canvas ref="programStudiChart"></canvas>
      </div>

      <div class="chart-card">
        <h2 class="chart-title">Tren Publikasi 5 Tahun Terakhir</h2>
        <canvas ref="trendChart"></canvas>
      </div>
    </div>

    <!-- Charts Row 2 -->
    <div class="charts-row">
      <div class="chart-card">
        <h2 class="chart-title">Distribusi Sitasi Publikasi</h2>
        <canvas ref="sitasiChart"></canvas>
      </div>

      <div class="chart-card">
        <h2 class="chart-title">Jenis Publikasi</h2>
        <canvas ref="jenisPublikasiChart"></canvas>
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
</template>

<script>
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  name: 'AnalisisData',
  data() {
    return {
      // Data statistik - akan diambil dari API
      stats: {
        totalDosen: 175,
        totalPublikasi: 1500,
        totalSitasi: 10670,
        tahunTerakhir: 2025
      },
      
      // Data insights - akan diambil dari API
      insights: {
        pertumbuhanPublikasi: 'Publikasi meningkat 30.2% dibanding tahun lalu, dengan pertumbuhan tertinggi di bidang Artificial Intelligence dan Data Science.',
        dampakSitasi: '42.2% publikasi memiliki sitasi di atas 10, menunjukkan dampak riset yang signifikan di komunitas akademik.',
        dominasiProgramStudi: 'Teknik Informatika menghasilkan 57.8% total publikasi Fasilkom, dengan fokus riset pada Machine Learning dan IoT.',
        jangkauanInternasional: '35.6% publikasi terbit di jurnal terindeks Scopus, menandakan peningkatan kualitas dan visibilitas riset.'
      },

      // Data untuk charts - akan diambil dari API
      programStudiData: {
        labels: ['Teknik Informatika', 'Sistem Informasi'],
        values: [58, 42]
      },

      trendData: {
        labels: ['2019', '2020', '2021', '2022', '2023'],
        values: [150, 170, 195, 210, 270]
      },

      sitasiData: {
        labels: ['0-10 Sitasi', '11-50 Sitasi', '51-100 Sitasi', '100+ Sitasi'],
        values: [320, 340, 210, 130]
      },

      jenisPublikasiData: {
        labels: ['Sinta 1', 'Sinta 2', 'Scopus', 'Sinta 3'],
        values: [35, 25, 25, 15]
      }
    };
  },

  mounted() {
    // Inisialisasi semua chart setelah component di-mount
    this.initProgramStudiChart();
    this.initTrendChart();
    this.initSitasiChart();
    this.initJenisPublikasiChart();

    // TODO: Uncomment ketika API sudah siap
    // this.fetchAnalysisData();
  },

  methods: {
    // Method untuk fetch data dari Laravel API
    async fetchAnalysisData() {
      try {
        // Ganti dengan URL API Laravel Anda
        const response = await fetch('http://your-laravel-api.test/api/analysis');
        const data = await response.json();

        // Update data dari API
        this.stats = data.stats;
        this.insights = data.insights;
        this.programStudiData = data.programStudi;
        this.trendData = data.trend;
        this.sitasiData = data.sitasi;
        this.jenisPublikasiData = data.jenisPublikasi;

        // Update semua chart dengan data baru
        this.updateAllCharts();
      } catch (error) {
        console.error('Error fetching analysis data:', error);
      }
    },

    initProgramStudiChart() {
      const ctx = this.$refs.programStudiChart.getContext('2d');
      this.programStudiChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.programStudiData.labels,
          datasets: [{
            data: this.programStudiData.values,
            backgroundColor: ['#1e5a6e', '#f4c542'],
            borderWidth: 0
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
                },
                generateLabels: (chart) => {
                  const data = chart.data;
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i];
                    return {
                      text: `${label} ${value}%`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      hidden: false,
                      index: i
                    };
                  });
                }
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `${context.label}: ${context.parsed}%`;
                }
              }
            }
          }
        }
      });
    },

    initTrendChart() {
      const ctx = this.$refs.trendChart.getContext('2d');
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
      const ctx = this.$refs.sitasiChart.getContext('2d');
      this.sitasiChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.sitasiData.labels,
          datasets: [{
            label: 'Jumlah Publikasi',
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
              beginAtZero: true,
              ticks: {
                stepSize: 95
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

    initJenisPublikasiChart() {
      const ctx = this.$refs.jenisPublikasiChart.getContext('2d');
      this.jenisPublikasiChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.jenisPublikasiData.labels,
          datasets: [{
            data: this.jenisPublikasiData.values,
            backgroundColor: ['#1e5a6e', '#6ba3b8', '#f4c542', '#e8b84a'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 15,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `${context.label}: ${context.parsed}%`;
                }
              }
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

      this.jenisPublikasiChart.data.labels = this.jenisPublikasiData.labels;
      this.jenisPublikasiChart.data.datasets[0].data = this.jenisPublikasiData.values;
      this.jenisPublikasiChart.update();
    }
  },

  beforeUnmount() {
    // Destroy charts sebelum component di-unmount
    if (this.programStudiChart) this.programStudiChart.destroy();
    if (this.trendChart) this.trendChart.destroy();
    if (this.sitasiChart) this.sitasiChart.destroy();
    if (this.jenisPublikasiChart) this.jenisPublikasiChart.destroy();
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
