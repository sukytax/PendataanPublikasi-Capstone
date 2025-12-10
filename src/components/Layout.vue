<template>
  <div class="app-container">
    <header class="navbar">
      <div class="navbar-content">
        <div class="brand">
          <div class="logo-placeholder">
            <img src="/public/logo_app.png" alt="Logo" class="logo-img" /> 
          </div>
          <div class="brand-text">
            <h1>ScholarTrack</h1>
            <span>Fasilkom UMB</span>
          </div>
        </div>

        <nav class="nav-links">
          <router-link to="/" class="nav-item">BERANDA</router-link>
          <router-link to="/data-publikasi" class="nav-item">DATA PUBLIKASI</router-link>
          <router-link to="/analisis" class="nav-item">ANALISIS</router-link>
          <router-link to="/berita" class="nav-item">BERITA</router-link>
        </nav>
        
        <div class="mobile-menu-icon" @click="toggleMenu">
          <span>&#9776;</span>
        </div>
      </div>

      <div class="mobile-nav" :class="{ 'is-open': isMenuOpen }">
         <router-link to="/" class="mobile-nav-item" @click="toggleMenu">BERANDA</router-link>
         <router-link to="/data-publikasi" class="mobile-nav-item" @click="toggleMenu">DATA PUBLIKASI</router-link>
         <router-link to="/analisis" class="mobile-nav-item" @click="toggleMenu">ANALISIS</router-link>
         <router-link to="/berita" class="mobile-nav-item" @click="toggleMenu">BERITA</router-link>
      </div>
    </header>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-left">
           <div class="footer-logo-placeholder">
              <img src="/public/umb.png" alt="Logo UMB" class="footer-logo-img" />
              <img src="/public/unggul.png" alt="Logo Akreditasi" class="footer-logo-img" id="unggul" />
           </div>
        </div>
        
        <div class="footer-copyright">
          <p>Copyright @ 2025 Universitas Mercu Buana</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// State untuk menu mobile (buka/tutup)
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body{
  margin: 0;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* --- HEADER STYLES --- */
.navbar {
  background-color: #ffffff;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-content {
  max-width: 1900px;
  margin: 0 auto;
  padding: 1rem 10rem 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Brand / Logo Area */
.brand {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-placeholder {
  width: 50px;
  height: 50px;
  background-color: #0d8aee; /* Placeholder color (icon buku biru) */
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  width: 100%;
  height: auto;
  display: block; /* Hapus ini jika sudah ada gambar asli */
}

.brand-text h1 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #000;
}

.brand-text span {
  font-size: 0.9rem;
  color: #666;
  display: block;
}

/* Desktop Navigation */
.nav-links {
  display: flex;
  gap: 40px; 
}

.nav-item {
  text-decoration: none;
  color: #000;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  transition: color 0.3s;
}

.nav-item:hover, .nav-item.router-link-active {
  color: #0d8aee; /* Warna biru saat hover/aktif */
}

/* Mobile Menu Button */
.mobile-menu-icon {
  display: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.mobile-nav {
  display: none; /* Hidden by default on desktop */
}

/* --- MAIN CONTENT STYLES --- */
.main-content {
  flex: 1; /* Mengisi sisa ruang agar footer turun ke bawah */
  background-color: #ebf2f7; /* Warna background abu-kebiruan sesuai gambar */
  padding: 0;
}

/* --- FOOTER STYLES --- */
.footer {
  background-color: #0e3b63; /* Warna biru dongker gelap */
  color: white;
  padding: 2rem 0;
}

.footer-content {
  max-width: 1900px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* Supaya copyright sejajar bawah */
  position: relative;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-logo-placeholder {
  display: flex;
  gap: 10px;
}

.footer-logo-img {
  width: 100%; /* Placeholder size */
  height: 70px;
  border-radius: 2%;
}
#unggul {
  height: 81px;
  width: auto;
}

.footer-copyright {
  font-size: 0.8rem;
  opacity: 0.8;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -1.2rem;
  text-align: center;
  width: calc(100% - 4rem);
}

/* --- RESPONSIVE / ANDROID SUPPORT --- */
@media (max-width: 768px) {
  .nav-links {
    display: none; /* Sembunyikan menu desktop di HP */
  }

  .mobile-menu-icon {
    display: block; /* Tampilkan tombol hamburger */
  }

  .navbar-content {
    padding: 1rem 5rem 1rem 2rem; /* Reset padding untuk mobile, hamburger ke kanan */
  }

  /* Mobile Dropdown Styles */
  .mobile-nav {
    display: block;
    background-color: #ffffff;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
    border-bottom: 1px solid #eee;
  }

  .mobile-nav.is-open {
    max-height: 300px; /* Tinggi cukup untuk menu */
  }

  .mobile-nav-item {
    display: block;
    padding: 15px 2rem;
    text-decoration: none;
    color: #333;
    border-top: 1px solid #f0f0f0;
    font-weight: 600;
  }

  .mobile-nav-item:hover {
    background-color: #f9f9f9;
  }

  /* Footer Adjustment for Mobile */
  .footer-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
  }

  .footer-copyright {
    position: static;
    transform: none;
    width: 100%;
  }
}
</style>