<template>
  <div class="data-publikasi-page">
    <div class="page-container">
      <!-- Title -->
      <div class="page-title">
        <h1>DATA PUBLIKASI</h1>
      </div>

      <!-- Filter Section -->
      <div class="filter-section">
        <div class="filter-group">
          <label class="filter-label">TAHUN</label>
          <select v-model="filters.tahun" class="filter-select">
            <option value="">Pilih</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">PROGRAM STUDI</label>
          <select v-model="filters.programStudi" class="filter-select">
            <option value="">Pilih</option>
            <option value="Teknik Informatika">Teknik Informatika</option>
            <option value="Sistem Informasi">Sistem Informasi</option>
          </select>
        </div>
      </div>
      <button class="btn-export" @click="exportData">EXPORT DATA</button>

      <!-- Table Section -->
      <div class="table-controls">
        <div class="items-per-page">
          <span>Tampilkan</span>
          <select v-model.number="itemsPerPage" class="items-select">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          <span>per halaman</span>
        </div>
        <div class="search-box">
          <label>Cari Data</label>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari nama, program studi, dll"
            class="search-input"
          />
        </div>
      </div>

      <!-- Loading State -->
      <LoadingState v-if="loading" message="⏳ Memuat publikasi dari server..." />

      <!-- Error State -->
      <ErrorState 
        v-else-if="error" 
        :title="'Gagal Memuat Data'"
        :message="error"
        @retry="fetchPublications"
      />

      <!-- Data State -->
      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>TAHUN</th>
              <th>NAMA DOSEN</th>
              <th>PROGRAM STUDI</th>
              <th>TOTAL PENELITIAN</th>
              <th>TOTAL SITASI</th>
              <th>DETAIL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedData" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ item.tahunRange || item.tahun }}</td>
              <td>{{ item.namaDosen }}</td>
              <td>{{ item.programStudi }}</td>
              <td>{{ item.totalPenelitian }}</td>
              <td>{{ item.totalSitasi }}</td>
              <td>
                <router-link :to="`/data-publikasi/${item.id}`" class="btn-detail">LIHAT DETAIL</router-link>
              </td>
            </tr>
            <tr v-if="paginatedData.length === 0">
              <td colspan="7" class="text-center">Tidak ada data yang sesuai dengan filter</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="pagination">
          <button 
            @click="previousPage" 
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            ← Sebelumnya
          </button>
          <div class="pagination-info">
            Halaman {{ currentPage }} dari {{ totalPages }}
          </div>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            Selanjutnya →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import publicationsAPI from '../api/publicationsAPI';
import LoadingState from './LoadingState.vue';
import ErrorState from './ErrorState.vue';

// Filter state
const filters = ref({
  tahun: '',
  programStudi: ''
});

const searchQuery = ref('');
const itemsPerPage = ref(10);
const currentPage = ref(1);
const loading = ref(false);
const error = ref(null);

// Data dari API
const allData = ref([]);

// Fetch data publikasi dari backend (dengan pagination)
const fetchPublications = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // Fetch semua data dari API
    const rawData = await publicationsAPI.getAllPublications();
    
    // Transform data
    allData.value = publicationsAPI.transformData(rawData);
  } catch (err) {
    error.value = err.message || 'Gagal memuat data publikasi dari server';
    console.error('❌ Failed to fetch publications:', err);
  } finally {
    loading.value = false;
  }
};

// Load data saat component mounted
onMounted(() => {
  fetchPublications();
});

// Filtered data based on search and filters
const filteredData = computed(() => {
  return allData.value.filter(item => {
    const matchTahun = !filters.value.tahun || item.tahun.includes(filters.value.tahun);
    const matchProgram = !filters.value.programStudi || item.programStudi === filters.value.programStudi;
    const matchSearch = !searchQuery.value || 
      item.namaDosen.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.programStudi.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    return matchTahun && matchProgram && matchSearch;
  });
});

// Paginated data
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

// Export data
const exportData = () => {
  const csvContent = [
    ['NO', 'TAHUN', 'NAMA DOSEN', 'PROGRAM STUDI', 'TOTAL PENELITIAN', 'TOTAL SITASI'],
    ...filteredData.value.map((item, index) => [
      index + 1,
      item.tahun,
      item.namaDosen,
      item.programStudi,
      item.totalPenelitian,
      item.totalSitasi
    ])
  ]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'data-publikasi.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.data-publikasi-page {
  width: 100%;
  background-color: #ebf2f7;
  min-height: 100vh;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* ========== PAGE TITLE ========== */
.page-title {
  margin-bottom: 2rem;
}

.page-title h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #000;
}

/* ========== FILTER SECTION ========== */
.filter-section {
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
}

.filter-select {
  padding: 0.6rem 0.8rem;
  border: 1px solid #999;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: white;
  cursor: pointer;
  min-width: 150px;
}

.filter-select:focus {
  outline: none;
  border-color: #0d8aee;
  box-shadow: 0 0 0 2px rgba(13, 138, 238, 0.1);
}

.btn-export {
  padding: 0.7rem 1.5rem;
  margin-bottom: 1rem;
  background-color: #ffc107;
  color: #000;
  border: solid 1px black;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-export:hover {
  background-color: #ffb300;
}

/* ========== TABLE SECTION ========== */
.table-wrapper {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.table-controls {
  display: flex;
  background-color: #ebf2f7;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.items-select {
  padding: 0.4rem 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  min-width: 60px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-box label {
  font-size: 0.9rem;
  font-weight: 500;
}

.search-input {
  padding: 0.6rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
  min-width: 250px;
}

.search-input:focus {
  outline: none;
  border-color: #0d8aee;
  box-shadow: 0 0 0 2px rgba(13, 138, 238, 0.1);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  
}

.data-table thead {
  background-color: #0e3b63;
  color: white;
}

.data-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.data-table tbody tr {
  transition: background-color 0.2s ease;
}

.data-table tbody tr:hover {
  background-color: #f9f9f9;
}

.text-center {
  text-align: center;
  color: #999;
}

.btn-detail {
  padding: 0.5rem 1rem;
  background-color: #ffc107;
  color: #000;
  border: solid 1px black;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  text-decoration: none;
  display: inline-block;
}

.btn-detail:hover {
  background-color: #ffb300;
}

/* ========== LOADING & ERROR STATES ========== */
.loading-state,
.error-state {
  padding: 2rem;
  text-align: center;
  border-radius: 8px;
  margin: 2rem 0;
  font-size: 1rem;
  font-weight: 500;
}

.loading-state {
  background-color: #e3f2fd;
  color: #1976d2;
}

.error-state {
  background-color: #ffebee;
  color: #c62828;
}

.btn-retry {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.btn-retry:hover {
  background-color: #b71c1c;
}

/* ========== PAGINATION ========== */
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

/* ========== RESPONSIVE DESIGN ========== */
@media (max-width: 1024px) {
  .page-container {
    padding: 1.5rem;
  }

  .filter-section {
    gap: 1rem;
  }

  .search-input {
    min-width: 200px;
  }

  .data-table th,
  .data-table td {
    padding: 0.8rem;
    font-size: 0.85rem;
  }

  .btn-detail {
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }

  .page-title h1 {
    font-size: 1.5rem;
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }

  .btn-export {
    width: 100%;
  }

  .table-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .items-per-page {
    width: 100%;
  }

  .search-box {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    width: 100%;
    min-width: unset;
  }

  .data-table {
    font-size: 0.8rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.6rem;
  }

  .data-table th {
    font-size: 0.7rem;
  }

  .pagination {
    gap: 1rem;
  }

  .pagination-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }

  .modal-content {
    max-width: 90%;
  }

  .detail-row {
    flex-direction: column;
    gap: 0.5rem;
  }

  .detail-value {
    text-align: left;
  }
}

@media (max-width: 480px) {
  .page-container {
    padding: 0.8rem;
  }

  .page-title h1 {
    font-size: 1.3rem;
  }

  .filter-label {
    font-size: 0.75rem;
  }

  .btn-export {
    font-size: 0.7rem;
    padding: 0.6rem 1rem;
  }

  .table-controls {
    padding: 1rem;
  }

  .search-input {
    font-size: 0.85rem;
  }

  .data-table {
    font-size: 0.7rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.4rem;
  }

  .data-table th {
    font-size: 0.65rem;
  }

  .btn-detail {
    padding: 0.3rem 0.6rem;
    font-size: 0.65rem;
  }

  .pagination {
    flex-direction: column;
    gap: 0.8rem;
  }

  .pagination-btn {
    width: 100%;
  }

  .pagination-info {
    font-size: 0.85rem;
  }

  .modal-header h2 {
    font-size: 1.1rem;
  }

  .detail-row {
    font-size: 0.85rem;
  }
}
</style>