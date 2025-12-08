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
              :
              <div class="publikasi-items">
                <div v-for="(pub, index) in dosenData.daftarPublikasi" :key="index" class="publikasi-item">
                  <p>{{ pub }}</p>
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
      <div v-else class="loading">
        <p>Memuat data dosen...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const dosenData = ref(null);

// Sample data untuk dosen
const dosenDatabase = {
  'afiyati': {
    namaDosen: 'Afiyati',
    afiliasi: 'Universitas Mercu Buana',
    bidangKeilmuan: [
      'Artificial Intelligence',
      'Natural Language Processing',
      'Machine Learning',
      'Deep Learning'
    ],
    totalPenelitian: 19,
    totalSitasi: 52,
    hIndex: 12,
    daftarPublikasi: [
      'Deep learning for assessing unhealthy lettuce hydroponic using convolutional neural network based on faster R-CNN with inception V2 (Cited: 21, Year: 2020)',
      'Wireless sensor network design for earthquake\'s and landslide\'s early warnings (Cited: 20, Year: 2018)',
      'Energy efficiency analysis of TEEN routing protocol with isolated nodes (Cited: 17, Year: 2019)',
      'Performance analysis of VoIP client with integrated encryption module (Cited: 17, Year: 2013)',
      'Propose safety engineering concept speed limiter and fatigue control using silfa for truck and bus (Cited: 13, Year: 2020)'
    ],
    linkProfile: 'https://scholar.google.com',
    linkProfileText: 'Klik Di Sini'
  },
  'hakiman': {
    namaDosen: 'Hakiman',
    afiliasi: 'Universitas Mercu Buana',
    bidangKeilmuan: [
      'Software Engineering',
      'Web Development',
      'Mobile Applications'
    ],
    totalPenelitian: 28,
    totalSitasi: 95,
    hIndex: 16,
    daftarPublikasi: [
      'Responsive web design patterns (Cited: 22, Year: 2021)',
      'Mobile application development best practices (Cited: 18, Year: 2020)',
      'Software architecture for scalability (Cited: 15, Year: 2019)'
    ],
    linkProfile: 'https://scholar.google.com',
    linkProfileText: 'Klik Di Sini'
  },
  'wirawan-gunawan': {
    namaDosen: 'Wirawan Gunawan',
    afiliasi: 'Universitas Mercu Buana',
    bidangKeilmuan: [
      'Network Security',
      'Cryptography',
      'Information Security'
    ],
    totalPenelitian: 22,
    totalSitasi: 65,
    hIndex: 11,
    daftarPublikasi: [
      'Advanced encryption methods for IoT devices (Cited: 19, Year: 2021)',
      'Vulnerability assessment in network infrastructure (Cited: 14, Year: 2020)'
    ],
    linkProfile: 'https://scholar.google.com',
    linkProfileText: 'Klik Di Sini'
  },
  'supriadi': {
    namaDosen: 'Supriadi',
    afiliasi: 'Universitas Mercu Buana',
    bidangKeilmuan: [
      'Database Design',
      'Data Mining',
      'Business Intelligence'
    ],
    totalPenelitian: 32,
    totalSitasi: 108,
    hIndex: 18,
    daftarPublikasi: [
      'Data warehouse design for enterprise (Cited: 25, Year: 2021)',
      'Machine learning in data mining (Cited: 20, Year: 2020)'
    ],
    linkProfile: 'https://scholar.google.com',
    linkProfileText: 'Klik Di Sini'
  },
  'hayfa-samtosso': {
    namaDosen: 'Hayfa Samtosso',
    afiliasi: 'Universitas Mercu Buana',
    bidangKeilmuan: [
      'Artificial Intelligence',
      'Robotics',
      'Computer Vision'
    ],
    totalPenelitian: 26,
    totalSitasi: 78,
    hIndex: 14,
    daftarPublikasi: [
      'Computer vision applications in robotics (Cited: 17, Year: 2021)',
      'AI-based image recognition systems (Cited: 14, Year: 2020)'
    ],
    linkProfile: 'https://scholar.google.com',
    linkProfileText: 'Klik Di Sini'
  },
  'budi-santoso': {
    namaDosen: 'Budi Santoso',
    afiliasi: 'Universitas Mercu Buana',
    bidangKeilmuan: [
      'Network Programming',
      'Distributed Systems',
      'Cloud Architecture'
    ],
    totalPenelitian: 24,
    totalSitasi: 72,
    hIndex: 13,
    daftarPublikasi: [
      'Cloud computing architecture (Cited: 16, Year: 2021)',
      'Distributed system design patterns (Cited: 12, Year: 2020)'
    ],
    linkProfile: 'https://scholar.google.com',
    linkProfileText: 'Klik Di Sini'
  },
  'siti-nurhaliza': {
    namaDosen: 'Siti Nurhaliza',
    afiliasi: 'Universitas Mercu Buana',
    bidangKeilmuan: [
      'Human Computer Interaction',
      'User Experience',
      'Usability Testing'
    ],
    totalPenelitian: 20,
    totalSitasi: 58,
    hIndex: 10,
    daftarPublikasi: [
      'User interface design principles (Cited: 13, Year: 2021)',
      'Usability testing methodologies (Cited: 10, Year: 2020)'
    ],
    linkProfile: 'https://scholar.google.com',
    linkProfileText: 'Klik Di Sini'
  },
  'ahmad-hermawan': {
    namaDosen: 'Ahmad Hermawan',
    afiliasi: 'Universitas Mercu Buana',
    bidangKeilmuan: [
      'Compiler Design',
      'Programming Languages',
      'Code Optimization'
    ],
    totalPenelitian: 30,
    totalSitasi: 102,
    hIndex: 17,
    daftarPublikasi: [
      'Advanced compiler techniques (Cited: 23, Year: 2021)',
      'Language design and implementation (Cited: 18, Year: 2020)'
    ],
    linkProfile: 'https://scholar.google.com',
    linkProfileText: 'Klik Di Sini'
  },
  'ratna-sari': {
    namaDosen: 'Ratna Sari',
    afiliasi: 'Universitas Mercu Buana',
    bidangKeilmuan: [
      'Information Retrieval',
      'Text Mining',
      'Natural Language Processing'
    ],
    totalPenelitian: 25,
    totalSitasi: 82,
    hIndex: 15,
    daftarPublikasi: [
      'Text mining applications (Cited: 19, Year: 2021)',
      'Information retrieval systems (Cited: 14, Year: 2020)'
    ],
    linkProfile: 'https://scholar.google.com',
    linkProfileText: 'Klik Di Sini'
  },
  'bambang-suryanto': {
    namaDosen: 'Bambang Suryanto',
    afiliasi: 'Universitas Mercu Buana',
    bidangKeilmuan: [
      'Multimedia Systems',
      'Video Processing',
      'Graphics Programming'
    ],
    totalPenelitian: 23,
    totalSitasi: 68,
    hIndex: 12,
    daftarPublikasi: [
      'Video compression techniques (Cited: 15, Year: 2021)',
      'Real-time graphics rendering (Cited: 11, Year: 2020)'
    ],
    linkProfile: 'https://scholar.google.com',
    linkProfileText: 'Klik Di Sini'
  },
  'dwi-prabowo': {
    namaDosen: 'Dwi Prabowo',
    afiliasi: 'Universitas Mercu Buana',
    bidangKeilmuan: [
      'Internet of Things',
      'Embedded Systems',
      'Sensor Networks'
    ],
    totalPenelitian: 29,
    totalSitasi: 98,
    hIndex: 16,
    daftarPublikasi: [
      'IoT protocol design (Cited: 21, Year: 2021)',
      'Embedded system optimization (Cited: 16, Year: 2020)'
    ],
    linkProfile: 'https://scholar.google.com',
    linkProfileText: 'Klik Di Sini'
  },
  'endang-supriyanto': {
    namaDosen: 'Endang Supriyanto',
    afiliasi: 'Universitas Mercu Buana',
    bidangKeilmuan: [
      'Software Testing',
      'Quality Assurance',
      'DevOps'
    ],
    totalPenelitian: 27,
    totalSitasi: 89,
    hIndex: 15,
    daftarPublikasi: [
      'Automated testing frameworks (Cited: 20, Year: 2021)',
      'Quality assurance best practices (Cited: 15, Year: 2020)'
    ],
    linkProfile: 'https://scholar.google.com',
    linkProfileText: 'Klik Di Sini'
  }
};

onMounted(() => {
  // Get dosen ID from route params
  const dosenId = route.params.id || 'afiyati';
  
  // Simulate API call delay
  setTimeout(() => {
    dosenData.value = dosenDatabase[dosenId] || dosenDatabase['afiyati'];
  }, 300);
});
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
  max-width: 1000px;
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
