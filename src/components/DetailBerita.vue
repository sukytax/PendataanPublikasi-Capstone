<template>
  <div class="detail-berita-container">
    <!-- Header Card -->
    <div class="header-card">
      <div class="badge-section">
        <span class="badge badge-pencapaian">Pencapaian</span>
      </div>
      
      <h1 class="detail-title">Milestone 400+ Publikasi Tercapai</h1>
      
      <p class="detail-meta">3 bulan yang lalu | 10 September 2025</p>
      
      <p class="detail-intro">
        Fakultas Ilmu Komputer Universitas Mercu Buana telah mencapai 400 publikasi ilmiah di Google Scholar
      </p>

      <div class="stats-box">
        <div class="stat-item">
          <div class="stat-number">300</div>
          <div class="stat-label">Views</div>
        </div>
      </div>

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
      <p class="content-paragraph">
        Fakultas Ilmu Komputer Universitas Mercu Buana dengan bangga mengumumkan pencapaian milestone penting: total 500 publikasi ilmiah telah terindeks di Google Scholar. Pencapaian ini merupakan hasil kerja keras seluruh sivitas akademika dalam 5 tahun terakhir.
      </p>

      <div class="section">
        <h2 class="section-title">Perjalanan Menuju 500 Publikasi</h2>
        <ul class="section-list">
          <li>2021: 85 publikasi</li>
          <li>2022: 102 publikasi</li>
          <li>2023: 118 publikasi</li>
          <li>2024: 142 publikasi</li>
          <li>2025: 153 publikasi (hingga September)</li>
        </ul>
      </div>

      <div class="section">
        <h2 class="section-title">Distribusi Publikasi</h2>
        <p class="section-text">Dari 500 publikasi terindeks di Google Scholar, berikut distribusinya:</p>
        <ul class="section-list">
          <li>Dari 500 publikasi terindeks di Google Scholar</li>
          <li>320 publikasi di jurnal internasional</li>
          <li>120 publikasi di konferensi internasional</li>
          <li>60 publikasi di jurnal nasional terakreditasi</li>
        </ul>
      </div>

      <div class="section">
        <h2 class="section-title">Kontributor Utama</h2>
        <p class="section-text">Pencapaian ini tidak lepas dari kontribusi para dosen dan peneliti produktif, dengan top 5 kontributor:</p>
        <ul class="section-list">
          <li>Dr. Hadi Santoso - 48 publikasi</li>
          <li>Dr. Afiyati - 42 publikasi</li>
          <li>Dr. Wawan Gunawan - 38 publikasi</li>
          <li>Dr. Abdi Wahab - 35 publikasi</li>
          <li>Dr. Emil Kaburuan - 31 publikasi</li>
        </ul>
      </div>

      <div class="section">
        <h2 class="section-title">Target Ke Depan</h2>
        <p class="section-text">
          Dengan momentum ini, Fasilkom UMB menargetkan 750 publikasi pada akhir 2026, dengan fokus pada peningkatan kualitas dan dampak sitasi.
        </p>
      </div>
    </div>

    <!-- Tags Section -->
    <div class="tags-section">
      <h3 class="tags-title">Tags</h3>
      <div class="tags-list">
        <span class="tag">Pencapaian</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const berita = ref({
  id: 3,
  type: 'pencapaian',
  badge: 'Pencapaian',
  title: 'Milestone 400+ Publikasi Tercapai',
  date: '10 September 2025',
  daysAgo: '3 bulan yang lalu',
  intro: 'Fakultas Ilmu Komputer Universitas Mercu Buana telah mencapai 400 publikasi ilmiah di Google Scholar',
  views: 300,
  content: {
    intro: 'Fakultas Ilmu Komputer Universitas Mercu Buana dengan bangga mengumumkan pencapaian milestone penting: total 500 publikasi ilmiah telah terindeks di Google Scholar. Pencapaian ini merupakan hasil kerja keras seluruh sivitas akademika dalam 5 tahun terakhir.',
    sections: [
      {
        title: 'Perjalanan Menuju 500 Publikasi',
        items: [
          '2021: 85 publikasi',
          '2022: 102 publikasi',
          '2023: 118 publikasi',
          '2024: 142 publikasi',
          '2025: 153 publikasi (hingga September)'
        ]
      },
      {
        title: 'Distribusi Publikasi',
        intro: 'Dari 500 publikasi terindeks di Google Scholar, berikut distribusinya:',
        items: [
          'Dari 500 publikasi terindeks di Google Scholar',
          '320 publikasi di jurnal internasional',
          '120 publikasi di konferensi internasional',
          '60 publikasi di jurnal nasional terakreditasi'
        ]
      },
      {
        title: 'Kontributor Utama',
        intro: 'Pencapaian ini tidak lepas dari kontribusi para dosen dan peneliti produktif, dengan top 5 kontributor:',
        items: [
          'Dr. Hadi Santoso - 48 publikasi',
          'Dr. Afiyati - 42 publikasi',
          'Dr. Wawan Gunawan - 38 publikasi',
          'Dr. Abdi Wahab - 35 publikasi',
          'Dr. Emil Kaburuan - 31 publikasi'
        ]
      },
      {
        title: 'Target Ke Depan',
        text: 'Dengan momentum ini, Fasilkom UMB menargetkan 750 publikasi pada akhir 2026, dengan fokus pada peningkatan kualitas dan dampak sitasi.'
      }
    ]
  },
  tags: ['Pencapaian']
});

// Method untuk fetch detail berita dari API
const fetchDetailBerita = async (id) => {
  try {
    // Ganti dengan URL API Laravel Anda
    const response = await fetch(`http://your-laravel-api.test/api/berita/${id}`);
    const data = await response.json();
    berita.value = data;
  } catch (error) {
    console.error('Error fetching detail berita:', error);
  }
};

// Method untuk share berita
const handleBagikan = () => {
  const url = window.location.href;
  const title = berita.value.title;
  
  // Copy link ke clipboard
  navigator.clipboard.writeText(url).then(() => {
    alert('Link berhasil disalin ke clipboard!');
  }).catch(err => {
    console.error('Error copying to clipboard:', err);
  });
};

onMounted(() => {
  // TODO: Uncomment ketika API sudah siap
  // Ambil ID dari route params jika menggunakan Vue Router
  // import { useRoute } from 'vue-router';
  // const route = useRoute();
  // const id = route.params.id;
  // fetchDetailBerita(id);
});
</script>

<style scoped>
.detail-berita-container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #e8eef1 0%, #e8eef1 300px, #ffffff 300px);
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
}

.badge-pencapaian {
  background: #e65100;
  color: white;
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

.stats-box {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  align-items: center;
}

.stat-item {
  border: 2px solid #e8eef1;
  border-radius: 10px;
  padding: 20px 40px;
  text-align: center;
  min-width: 120px;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
}

.stat-label {
  font-size: 13px;
  color: #95a5a6;
  margin-top: 5px;
  font-weight: 500;
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

.section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 15px;
}

.section-text {
  font-size: 15px;
  color: #5a6c7d;
  line-height: 1.8;
  margin-bottom: 12px;
  text-align: justify;
}

.section-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.section-list li {
  font-size: 15px;
  color: #5a6c7d;
  line-height: 1.8;
  padding-left: 20px;
  position: relative;
  margin-bottom: 8px;
}

.section-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #e65100;
  font-weight: bold;
}

/* Tags Section */
.tags-section {
  background: white;
  border-radius: 12px;
  padding: 30px 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  max-width: 900px;
  margin: 0 auto;
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
  .content-card,
  .tags-section {
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

  .section-title {
    font-size: 16px;
  }

  .section-text,
  .section-list li {
    font-size: 14px;
  }

  .stat-item {
    padding: 15px 30px;
    min-width: 100px;
  }

  .stat-number {
    font-size: 24px;
  }

  .tags-title {
    display: block;
    margin-bottom: 12px;
  }
}

@media (max-width: 480px) {
  .detail-berita-container {
    padding: 15px;
  }

  .header-card,
  .content-card,
  .tags-section {
    padding: 20px;
  }

  .detail-title {
    font-size: 20px;
  }

  .detail-intro,
  .content-paragraph {
    font-size: 14px;
  }

  .section-title {
    font-size: 15px;
  }

  .btn-bagikan {
    width: 100%;
    justify-content: center;
  }

  .stat-item {
    flex: 1;
    padding: 15px;
    min-width: auto;
  }

  .stats-box {
    justify-content: center;
  }
}
</style>
