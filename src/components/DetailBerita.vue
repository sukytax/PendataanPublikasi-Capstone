<template>
  <div class="detail-berita-container">
    <!-- Loading State -->
    <LoadingState v-if="loading" message="⏳ Memuat berita..." />

    <!-- Error State -->
    <ErrorState 
      v-else-if="error" 
      :title="'Gagal Memuat Berita'"
      :message="error"
      @retry="fetchBeritaDetail"
    />

    <!-- Content -->
    <div v-else-if="berita">
      <!-- Header Card -->
      <div class="header-card">
        <div class="badge-section">
          <span class="badge" :class="getBadgeClass(berita.tags)">
            {{ getBadgeLabel(berita.tags) }}
          </span>
        </div>
        
        <h1 class="detail-title">{{ berita.judul }}</h1>
        
        <p class="detail-meta">{{ formatTimeAgo(berita.created_at) }} | {{ formatDate(berita.created_at) }}</p>
        
        <p class="detail-intro">
          {{ berita.deskripsi_singkat }}
        </p>

        <button class="btn-bagikan" @click="handleBagikan">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Bagikan Berita
        </button>
      </div>

      <!-- Content Card -->
      <div class="content-card">
        <div class="content-paragraph" v-html="formatContent(berita.isi)"></div>

        <!-- Tags -->
        <div v-if="getTags(berita.tags).length > 0" class="tags-section">
          <h3 class="tags-title">Tags</h3>
          <div class="tags-list">
            <span v-for="tag in getTags(berita.tags)" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { newsAPI } from '../api/newsAPI';
import LoadingState from './LoadingState.vue';
import ErrorState from './ErrorState.vue';

const route = useRoute();
const router = useRouter();
const berita = ref(null);
const loading = ref(false);
const error = ref(null);

// Fetch detail berita dari API
const fetchBeritaDetail = async () => {
  loading.value = true;
  error.value = null;

  try {
    const beritaId = route.params.id;
    console.log('🔵 Fetching news detail with ID:', beritaId);
    
    const data = await newsAPI.getNewsDetail(beritaId);
    console.log('✅ News detail loaded:', data);
    
    berita.value = data;
  } catch (err) {
    console.error('❌ Error loading news detail:', err);
    error.value = err.message || 'Gagal memuat detail berita';
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

// Get badge label dari tags
const getBadgeLabel = (tagsString) => {
  if (!tagsString) return 'Berita';
  const tags = tagsString.split(',').map(t => t.trim().toLowerCase());
  
  if (tags.includes('publikasi baru')) return 'Publikasi Baru';
  if (tags.includes('trending')) return 'Trending';
  if (tags.includes('pencapaian')) return 'Pencapaian';
  if (tags.includes('milestone')) return 'Milestone';
  if (tags.includes('award') || tags.includes('penghargaan')) return 'Penghargaan';
  
  return tags[0]?.charAt(0).toUpperCase() + tags[0]?.slice(1) || 'Berita';
};

// Get badge class untuk styling
const getBadgeClass = (tagsString) => {
  if (!tagsString) return 'badge-default';
  const tags = tagsString.split(',').map(t => t.trim().toLowerCase());
  
  if (tags.includes('publikasi baru')) return 'badge-baru';
  if (tags.includes('trending')) return 'badge-trending';
  if (tags.includes('pencapaian') || tags.includes('milestone')) return 'badge-pencapaian';
  if (tags.includes('award') || tags.includes('penghargaan')) return 'badge-award';
  
  return 'badge-default';
};

// Get tags dari string
const getTags = (tagsString) => {
  if (!tagsString) return [];
  return tagsString.split(',').map(tag => tag.trim());
};

// Format content dengan line breaks
const formatContent = (content) => {
  if (!content) return '';
  return content
    .replace(/\r\n\r\n/g, '</p><p>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .split('\r\n')
    .join('<br>')
    .split('<p></p>')
    .filter(p => p.trim())
    .map(para => `<p>${para.trim()}</p>`)
    .join('');
};

// Method untuk share berita
const handleBagikan = () => {
  const url = window.location.href;
  const title = berita.value?.judul || 'Berita';
  
  // Copy link ke clipboard
  navigator.clipboard.writeText(url).then(() => {
    alert('Link berhasil disalin ke clipboard!');
  }).catch(err => {
    console.error('Error copying to clipboard:', err);
  });
};

onMounted(() => {
  fetchBeritaDetail();
});
</script>

<style scoped>
.detail-berita-container {
  min-height: 100vh;
  padding: 40px 20px;
}

/* Header Card */
.header-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  max-width: 900px;
  margin: 0 auto 30px;
}

.badge-section {
  margin-bottom: 20px;
}

.badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: white;
}

.badge-baru {
  background: #4c72b0;
}

.badge-trending {
  background: #d63384;
}

.badge-pencapaian {
  background: #e65100;
}

.badge-award {
  background: #10b981;
}

.badge-default {
  background: #6b7280;
}

.detail-title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 12px;
  line-height: 1.4;
}

.detail-meta {
  font-size: 14px;
  color: #95a5a6;
  margin-bottom: 20px;
  font-weight: 500;
}

.detail-intro {
  font-size: 16px;
  color: #5a6c7d;
  line-height: 1.6;
  margin-bottom: 30px;
}

.btn-bagikan {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: white;
  border: 2px solid #e8eef1;
  color: #5a6c7d;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-bagikan:hover {
  border-color: #95a5a6;
  color: #2c3e50;
  background: #f8f9fa;
}

.btn-bagikan svg {
  width: 18px;
  height: 18px;
}

/* Content Card */
.content-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  max-width: 900px;
  margin: 0 auto 30px;
}

.content-paragraph {
  font-size: 15px;
  color: #5a6c7d;
  line-height: 1.8;
  margin-bottom: 30px;
  text-align: justify;
}

.content-paragraph p {
  margin-bottom: 16px;
}

.content-paragraph p:last-child {
  margin-bottom: 0;
}

/* Tags Section */
.tags-section {
  padding-top: 30px;
  border-top: 1px solid #ecf0f1;
  margin-top: 30px;
}

.tags-title {
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
  display: inline-block;
  margin-right: 20px;
}

.tags-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  background: #e65100;
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .detail-berita-container {
    padding: 20px;
  }

  .header-card,
  .content-card {
    padding: 25px;
    border-radius: 10px;
  }

  .detail-title {
    font-size: 24px;
  }

  .detail-intro {
    font-size: 15px;
  }

  .content-paragraph {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .detail-berita-container {
    padding: 15px;
  }

  .header-card,
  .content-card {
    padding: 20px;
  }

  .detail-title {
    font-size: 20px;
  }

  .detail-intro,
  .content-paragraph {
    font-size: 14px;
  }

  .btn-bagikan {
    width: 100%;
    justify-content: center;
  }

  .badge {
    font-size: 11px;
    padding: 5px 12px;
  }
}
</style>
