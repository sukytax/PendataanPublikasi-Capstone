<template>
  <div class="berita-container">
    <div class="berita-header">
      <h1 class="berita-title">BERITA PUBLIKASI FASILKOM UMB</h1>
      <p class="berita-subtitle">Informasi terbaru tentang publikasi dan tren riset di Fasilkom UMB</p>
    </div>

    <!-- Loading State -->
    <LoadingState v-if="loading" message="⏳ Memuat berita..." />

    <!-- Error State -->
    <ErrorState 
      v-else-if="error" 
      :title="'Gagal Memuat Berita'"
      :message="error"
      @retry="fetchBerita"
    />

    <!-- Empty State -->
    <div v-else-if="beritaList.length === 0" class="empty-state">
      <p>Tidak ada berita untuk ditampilkan</p>
    </div>

    <!-- Berita List -->
    <div v-else class="berita-content">
      <div 
        v-for="berita in beritaList" 
        :key="berita.id"
        class="berita-card"
        @click="handleBeritaClick(berita)"
      >
        <div class="berita-card-top">
          <span class="berita-badge" :class="getBadgeClass(berita.tags)">
            {{ getBadgeLabel(berita.tags) }}
          </span>
        </div>
        <h2 class="berita-card-title">{{ berita.judul }}</h2>
        <p class="berita-card-description">{{ berita.deskripsi_singkat }}</p>
        <div class="berita-footer">
          <span class="berita-time">
            <img src="/public/logo_jam.png" alt="jam" class="berita-time-icon">
            {{ formatTimeAgo(berita.created_at) }}
          </span>
          <span class="berita-date">{{ formatDate(berita.created_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { newsAPI } from '../api/newsAPI';
import LoadingState from './LoadingState.vue';
import ErrorState from './ErrorState.vue';

const router = useRouter();
const beritaList = ref([]);
const loading = ref(false);
const error = ref(null);

// Fetch berita dari API
const fetchBerita = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = await newsAPI.getAllNews();
    beritaList.value = data;
  } catch (err) {
    console.error('❌ Error loading news:', err);
    error.value = err.message || 'Gagal memuat berita';
  } finally {
    loading.value = false;
  }
};

// Format tanggal untuk tampilan
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format kategori
const formatCategory = (category) => {
  if (!category) return 'Berita';
  return category.charAt(0).toUpperCase() + category.slice(1);
};

// Get badge label dari tags
const getBadgeLabel = (tagsString) => {
  if (!tagsString) return 'Berita';
  const tags = tagsString.split(',').map(t => t.trim().toLowerCase());
  
  if (tags.includes('publikasi baru')) return 'Publikasi Baru';
  if (tags.includes('trending')) return 'Trending';
  if (tags.includes('pencapaian')) return 'Pencapaian';
  if (tags.includes('award')) return 'Penghargaan';
  
  return tags[0]?.charAt(0).toUpperCase() + tags[0]?.slice(1) || 'Berita';
};

// Get badge class untuk styling
const getBadgeClass = (tagsString) => {
  if (!tagsString) return 'badge-default';
  const tags = tagsString.split(',').map(t => t.trim().toLowerCase());
  
  if (tags.includes('publikasi baru')) return 'badge-baru';
  if (tags.includes('trending')) return 'badge-trending';
  if (tags.includes('pencapaian')) return 'badge-pencapaian';
  if (tags.includes('award')) return 'badge-award';
  
  return 'badge-default';
};

// Get tags dari string
const getTags = (tagsString) => {
  if (!tagsString) return [];
  return tagsString.split(',').map(tag => tag.trim()).slice(0, 3);
};

// Hitung waktu yang lalu
const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  
  if (seconds < 60) return 'baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  if (days < 7) return `${days} hari lalu`;
  if (weeks < 4) return `${weeks} minggu lalu`;
  if (months < 12) return `${months} bulan lalu`;
  
  return formatDate(dateString);
};

// Handle click pada berita
const handleBeritaClick = (berita) => {
  router.push(`/berita/${berita.id}`);
};

onMounted(() => {
  fetchBerita();
});
</script>

<style scoped>
.berita-container {
  min-height: 100vh;
  padding: 40px 20px;
}

.berita-header {
  margin-bottom: 50px;
  max-width: 1500px;
  margin-left: auto;
  margin-right: auto;
}

.berita-title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 10px;
}

.berita-subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
}

.berita-content {
  max-width: 1500px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.berita-card {
  background: white;
  border-radius: 12px;
  padding: 28px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: none;
}

.berita-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.berita-card-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.berita-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  white-space: nowrap;
}

.badge-baru {
  background: #4c72b0;
}

.badge-trending {
  background: #d63384;
}

.badge-pencapaian {
  background: #f59e0b;
}

.badge-award {
  background: #10b981;
}

.badge-default {
  background: #6b7280;
}

.berita-card-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.berita-card-description {
  font-size: 14px;
  color: #5a6c7d;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.berita-footer {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid #ecf0f1;
  font-size: 13px;
}

.berita-time {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #7f8c8d;
  font-weight: 500;
}

.berita-time-icon {
  width: 16px;
  height: auto;
  object-fit: contain;
}

.berita-date {
  color: #95a5a6;
  font-size: 12px;
}

.empty-state {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  color: #7f8c8d;
  font-size: 16px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .berita-container {
    padding: 20px;
  }

  .berita-header {
    margin-bottom: 30px;
  }

  .berita-title {
    font-size: 24px;
  }

  .berita-subtitle {
    font-size: 14px;
  }

  .berita-card {
    padding: 20px;
  }

  .berita-card-title {
    font-size: 18px;
  }

  .berita-card-description {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .berita-container {
    padding: 15px;
  }

  .berita-title {
    font-size: 20px;
  }

  .berita-card {
    padding: 16px;
  }

  .berita-badge {
    font-size: 11px;
    padding: 5px 12px;
  }

  .berita-card-title {
    font-size: 16px;
  }

  .berita-card-description {
    font-size: 13px;
  }

  .berita-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>