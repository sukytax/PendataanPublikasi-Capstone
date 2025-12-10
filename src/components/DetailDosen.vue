<template>
  <div class="detail-dosen-page">
    <div class="page-container">
      <!-- Back Button -->
      <router-link to="/data-publikasi" class="back-btn">← Kembali ke Data Publikasi</router-link>

      <!-- Profile Section Header -->
      <div class="profile-header">
        <h1>PROFIL DOSEN</h1>
      </div>

      <!-- Profile Card -->
      <div class="profile-card" v-if="dosenData">
        <!-- Dosen Name -->
        <div class="dosen-name">
          <h2>{{ dosenData.namaDosen }}</h2>
        </div>

        <!-- Dosen Info -->
        <div class="info-section">
          <div class="info-row">
            <span class="info-label">Afiliasi</span>
            <span class="info-value">: {{ dosenData.afiliasi }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Bidang Keilmuan</span>
            <div class="info-value field-list">
              :
              <ul>
                <li v-for="(field, index) in dosenData.bidangKeilmuan" :key="index">
                  {{ field }}
                </li>
              </ul>
            </div>
          </div>

          <div class="info-row">
            <span class="info-label">Total Penelitian</span>
            <span class="info-value">: {{ dosenData.totalPenelitian }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Total Sitasi</span>
            <span class="info-value">: {{ dosenData.totalSitasi }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">H-Index</span>
            <span class="info-value">: {{ dosenData.hIndex }}</span>
          </div>

          <!-- Daftar Publikasi -->
          <div class="info-row publikasi-section">
            <span class="info-label">Daftar Publikasi</span>
            <div class="publikasi-list">
              <div class="publikasi-table-wrapper">
                <table class="publikasi-table">
                  <thead>
                    <tr>
                      <th class="nomer-tabel">NO</th>
                      <th class="judul-tabel">JUDUL</th>
                      <th class="jumlah-sitasi-tabel">JUMLAH SITASI</th>
                      <th class="tahun-tabel">TAHUN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(pub, index) in paginatedData" :key="index">
                      <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                      <td>{{ pub.judul }}</td>
                      <td>{{ pub.jumlah_sitasi }}</td>
                      <td>{{ pub.tahun }}</td>
                    </tr>
                    <tr v-if="paginatedData.length === 0">
                      <td colspan="4" class="text-center">Tidak ada publikasi</td>
                    </tr>
                  </tbody>
                </table>
                <div class="pagination">
                  <button 
                    @click="previousPage" 
                    :disabled="currentPage === 1"
                    class="pagination-btn">
                    ← Sebelumnya
                  </button>
                  <div class="pagination-info">
                    Halaman {{ currentPage }} dari {{ totalPages }}
                  </div>
                  <button 
                    @click="nextPage" 
                    :disabled="currentPage === totalPages"
                    class="pagination-btn">
                      Selanjutnya →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Link Profile -->
          <div class="info-row">
            <span class="info-label">Link Profile</span>
            <span class="info-value">
              : <a :href="dosenData.linkProfile" target="_blank" class="profile-link">{{ dosenData.linkProfileText }}</a>
            </span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <LoadingState v-else-if="loading" message="⏳ Memuat data dosen..." />

      <!-- Error State -->
      <ErrorState 
        v-else-if="error"
        :title="'Gagal Memuat Data Dosen'"
        :message="error"
        @retry="fetchDosenDetail"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import publicationsAPI from '../api/publicationsAPI';
import LoadingState from './LoadingState.vue';
import ErrorState from './ErrorState.vue';

const route = useRoute();
const dosenData = ref(null);
const loading = ref(false);
const error = ref(null);

// Pagination variables
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Fetch detail dosen dari API
const fetchDosenDetail = async () => {
  loading.value = true;
  error.value = null;

  try {
    console.log('🔵 Fetching dosen detail...');
    
    // Get ID dari route params
    const dosenId = route.params.id;
    
    if (!dosenId) {
      throw new Error('ID dosen tidak ditemukan');
    }

    // Fetch data dari API
    const rawData = await publicationsAPI.getPublicationDetail(dosenId);
    
    // Transform data
    dosenData.value = publicationsAPI.transformDetailData(rawData);
    
    console.log('✅ Dosen detail loaded:', dosenData.value);
  } catch (err) {
    error.value = err.message || 'Gagal memuat data dosen';
    console.error('❌ Failed to fetch dosen detail:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDosenDetail();
});

// Computed properties untuk pagination
const filteredData = computed(() => {
  return dosenData.value?.daftarPublikasi || [];
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredData.value.slice(start, end);
});

// Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage.value);
});

// Pagination methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.detail-dosen-page {
  width: 100%;
  background-color: #ebf2f7;
  min-height: 100vh;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* Back Button */
.back-btn {
  display: inline-block;
  margin-bottom: 2rem;
  color: #0e3b63;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.back-btn:hover {
  color: #0d8aee;
}

/* Profile Header */
.profile-header {
  background-color: #0e3b63;
  color: white;
  padding: 1.5rem 2rem;
  border-radius: 8px 8px 0 0;
  margin-bottom: 0;
}

.profile-header h1 {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Profile Card */
.profile-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.dosen-name {
  text-align: center;
  padding: 2rem;
  background-color: #f9f9f9;
  border-bottom: 1px solid #f0f0f0;
}

.dosen-name h2 {
  font-size: 1.8rem;
  color: #000;
  font-weight: 700;
}

/* Info Section */
.info-section {
  padding: 2rem;
}

.info-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 600;
  color: #333;
  min-width: 150px;
  flex-shrink: 0;
}

.info-value {
  color: #555;
  flex: 1;
}

.field-list {
  display: flex;
  gap: 0.5rem;
}

.field-list ul {
  list-style: none;
  padding: 0;
}

.field-list li {
  display: inline;
}

.field-list li:not(:last-child)::after {
  content: ', ';
}

.field-list li a {
  color: #0d8aee;
  text-decoration: underline;
}

/* Publikasi Section */
.publikasi-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
}

.publikasi-list {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.publikasi-table-wrapper {
  flex: 1;
  overflow-x: auto;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.publikasi-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.publikasi-table thead {
  background-color: #0e3b63;
  color: white;
}

.publikasi-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.nomer-tabel {
  width: 5%;
}
.judul-tabel {
  width: auto;
}

.jumlah-sitasi-tabel {
  width: 15%;
}

.tahun-tabel {
  width: 10%;
}

.publikasi-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.publikasi-table tbody tr {
  transition: background-color 0.2s ease;
}

.publikasi-table tbody tr:hover {
  background-color: #f9f9f9;
}

.publikasi-table .text-center {
  text-align: center;
  color: #999;
}

.publikasi-items {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.publikasi-item {
  padding: 1rem;
  background-color: #f9f9f9;
  border-left: 3px solid #0d8aee;
  border-radius: 4px;
}

.publikasi-item p {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.6;
  text-align: justify;
}
/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  border-top: 1px solid #f0f0f0;
}

.pagination-btn {
  padding: 0.6rem 1.2rem;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #0e3b63;
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.9rem;
  color: #666;
}

/* Profile Link */
.profile-link {
  color: #0d8aee;
  text-decoration: underline;
  font-weight: 600;
  transition: color 0.3s ease;
}

.profile-link:hover {
  color: #0a6fb5;
}

/* Loading */
.loading {
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.loading p {
  font-size: 1.1rem;
  color: #666;
}

/* ========== RESPONSIVE DESIGN ========== */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }

  .profile-header {
    padding: 1rem;
  }

  .profile-header h1 {
    font-size: 1.1rem;
  }

  .dosen-name {
    padding: 1.5rem;
  }

  .dosen-name h2 {
    font-size: 1.4rem;
  }

  .info-section {
    padding: 1.5rem;
  }

  .info-row {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .info-label {
    min-width: auto;
    font-weight: 700;
  }

  .publikasi-list {
    flex-direction: column;
  }

  .publikasi-item {
    padding: 0.8rem;
  }

  .publikasi-item p {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .page-container {
    padding: 0.8rem;
  }

  .back-btn {
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
  }

  .profile-header {
    padding: 0.8rem;
    border-radius: 4px 4px 0 0;
  }

  .profile-header h1 {
    font-size: 1rem;
  }

  .dosen-name {
    padding: 1rem;
  }

  .dosen-name h2 {
    font-size: 1.2rem;
  }

  .info-section {
    padding: 1rem;
  }

  .info-row {
    margin-bottom: 0.8rem;
  }

  .info-label {
    font-size: 0.9rem;
  }

  .info-value {
    font-size: 0.9rem;
  }

  .publikasi-item {
    padding: 0.6rem;
    border-left-width: 2px;
  }

  .publikasi-item p {
    font-size: 0.8rem;
  }
}
</style>
