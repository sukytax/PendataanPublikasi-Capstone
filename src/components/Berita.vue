<template>
  <div class="berita-container">
    <div class="berita-header">
      <h1 class="berita-title">BERITA PUBLIKASI FASILKOM UMB</h1>
      <p class="berita-subtitle">Informasi terbaru tentang publikasi dan tren riset di Fasilkom UMB</p>
    </div>

    <div class="berita-content">
      <!-- Berita Baru -->
      <div class="berita-card berita-baru" @click="handleBeritaClick(beritaList[0])">
        <div class="berita-badge badge-baru">Publikasi Baru</div>
        <div class="berita-counter">20 Items</div>
        <h2 class="berita-card-title">20 PUBLIKASI BARU TELAH DITAMBAHKAN</h2>
        <p class="berita-card-description">
          Data publikasi terbaru dari Google Scholar telah diperbarui untuk periode November 2025
        </p>
        <div class="berita-meta">
          <svg class="berita-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="1"></circle>
            <path d="M12 8v4l3 2"></path>
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path>
          </svg>
          <span class="berita-time">1 bulan yang lalu | 10 November 2025</span>
        </div>
      </div>

      <!-- Berita Trending -->
      <div class="berita-card berita-trending" @click="handleBeritaClick(beritaList[1])">
        <div class="berita-badge badge-trending">Trending</div>
        <div class="berita-counter">20 Items</div>
        <h2 class="berita-card-title">Topik 'Deep Learning' Meningkat Pesat</h2>
        <p class="berita-card-description">
          Terjadi peningkatan 20% publikasi dengan topik Deep Learning dibanding tahun lalu
        </p>
        <div class="berita-meta">
          <svg class="berita-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="1"></circle>
            <path d="M12 8v4l3 2"></path>
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path>
          </svg>
          <span class="berita-time">2 bulan yang lalu | 10 Oktober 2025</span>
        </div>
      </div>

      <!-- Berita Pencapaian -->
      <div class="berita-card berita-pencapaian" @click="handleBeritaClick(beritaList[2])">
        <div class="berita-badge badge-pencapaian">Pencapaian</div>
        <div class="berita-counter">8 Items</div>
        <h2 class="berita-card-title">Milestone 400+ Publikasi Tercapai</h2>
        <p class="berita-card-description">
          Fakultas Ilmu Komputer Universitas Mercu Buana telah mencapai 400 publikasi ilmiah di Google Scholar
        </p>
        <div class="berita-meta">
          <svg class="berita-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="1"></circle>
            <path d="M12 8v4l3 2"></path>
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path>
          </svg>
          <span class="berita-time">3 bulan yang lalu | 10 September 2025</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const beritaList = ref([
  {
    id: 1,
    type: 'baru',
    badge: 'Publikasi Baru',
    title: '20 PUBLIKASI BARU TELAH DITAMBAHKAN',
    description: 'Data publikasi terbaru dari Google Scholar telah diperbarui untuk periode November 2025',
    itemCount: '20 Items',
    date: '10 November 2025',
    daysAgo: '1 bulan yang lalu'
  },
  {
    id: 2,
    type: 'trending',
    badge: 'Trending',
    title: "Topik 'Deep Learning' Meningkat Pesat",
    description: 'Terjadi peningkatan 20% publikasi dengan topik Deep Learning dibanding tahun lalu',
    itemCount: '20 Items',
    date: '10 Oktober 2025',
    daysAgo: '2 bulan yang lalu'
  },
  {
    id: 3,
    type: 'pencapaian',
    badge: 'Pencapaian',
    title: 'Milestone 400+ Publikasi Tercapai',
    description: 'Fakultas Ilmu Komputer Universitas Mercu Buana telah mencapai 400 publikasi ilmiah di Google Scholar',
    itemCount: '8 Items',
    date: '10 September 2025',
    daysAgo: '3 bulan yang lalu'
  }
]);

// Method untuk fetch berita dari API (akan digunakan nanti)
const fetchBerita = async () => {
  try {
    // Ganti dengan URL API Laravel Anda
    const response = await fetch('http://your-laravel-api.test/api/berita');
    const data = await response.json();
    beritaList.value = data;
  } catch (error) {
    console.error('Error fetching berita:', error);
  }
};

// Method untuk handle click pada berita (navigate ke detail)
const handleBeritaClick = (berita) => {
  console.log('Berita clicked:', berita);
  router.push(`/berita/${berita.id}`);
};

onMounted(() => {
  // TODO: Uncomment ketika API sudah siap
  // fetchBerita();
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
  font-weight: 400;
}

.berita-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
  max-width: 1500px;
  margin: 0 auto;
}

.berita-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  cursor: pointer;
}

.berita-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.berita-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.badge-baru {
  background: #e3f2fd;
  color: #1565c0;
}

.badge-trending {
  background: #fce4ec;
  color: #c2185b;
}

.badge-pencapaian {
  background: #fff3e0;
  color: #e65100;
}

.berita-counter {
  position: absolute;
  top: 25px;
  right: 30px;
  font-size: 13px;
  color: #95a5a6;
  font-weight: 500;
}

.berita-card-title {
  font-size: 20px;
  font-weight: 700;
  color: #2c3e50;
  margin: 15px 0;
  line-height: 1.4;
}

.berita-card-description {
  font-size: 15px;
  color: #5a6c7d;
  line-height: 1.6;
  margin-bottom: 20px;
}

.berita-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #95a5a6;
  font-size: 13px;
}

.berita-icon {
  width: 16px;
  height: 16px;
  color: #bdc3c7;
  flex-shrink: 0;
}

.berita-time {
  white-space: nowrap;
}

/* Badge Colors - Alternative Styles */
.berita-baru .berita-badge {
  background: #1565c0;
  color: white;
}

.berita-trending .berita-badge {
  background: #c2185b;
  color: white;
}

.berita-pencapaian .berita-badge {
  background: #e65100;
  color: white;
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

  .berita-counter {
    position: static;
    margin-bottom: 10px;
    display: inline-block;
  }

  .berita-card-title {
    font-size: 18px;
  }

  .berita-card-description {
    font-size: 14px;
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

  .berita-time {
    white-space: normal;
  }
}
</style>
