# 🏛️ Website Pendataan Publikasi (E-Publication Data Management)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Technology: Vue.js](https://img.shields.io/badge/Frontend-Vue.js-4FC08D?logo=vue.js)](https://vuejs.org/)
[![API Backend: V1.0](https://img.shields.io/badge/API_Version-V1.0-blue)](link_ke_repositori_backend)

Website Pendataan Publikasi adalah *front-end* aplikasi manajemen data yang dirancang untuk mendigitalisasi, mengorganisir, dan memfasilitasi pencarian data publikasi secara efisien. Proyek ini dibangun menggunakan *framework* **Vue.js** untuk antarmuka pengguna yang cepat dan reaktif.

## 🌟 Fitur Utama

* **Manajemen Data Publikasi:** CRUD (Create, Read, Update, Delete) lengkap untuk entri publikasi.
* **Pencarian Lanjutan:** Filter dan pencarian data berdasarkan judul, penulis, tahun, dan kategori.
* **Dashboard Statistik:** Visualisasi data publikasi yang *up-to-date* menggunakan komponen grafik.
* **Antarmuka Reaktif:** Pengalaman pengguna yang mulus berkat arsitektur SPA (Single Page Application) Vue.js.

## 🛠️ Teknologi yang Digunakan

* **Frontend:** [Vue.js 3](https://vuejs.org/)
* **Routing:** [Vue Router](https://router.vuejs.org/)
* **State Management (Opsional):** [Pinia/Vuex]
* **Styling/UI Framework:** [Tailwind CSS / Vuetify / BootstrapVue] *(Pilih salah satu)*
* **Build Tool:** [Vite / Vue CLI]

## 🚀 Instalasi dan Menjalankan Proyek

Ikuti langkah-langkah berikut untuk menjalankan proyek secara lokal di mesin Anda.

### Prasyarat

Pastikan Anda memiliki [Node.js](https://nodejs.org/) (disarankan versi LTS) dan npm/yarn terinstal.

### Langkah-Langkah

1.  **Clone Repositori:**
    ```bash
    git clone [https://github.com/YourUsername/project-pendataan-publikasi.git](https://github.com/YourUsername/project-pendataan-publikasi.git)
    cd project-pendataan-publikasi/PendataanPublikasi-Capstone
    ```

2.  **Instal Dependensi:**
    ```bash
    npm install
    # atau
    # yarn install
    ```

3.  **Konfigurasi Environment:**
    Aplikasi ini memerlukan variabel lingkungan untuk terhubung ke API *backend*.

    * Salin file template `.env.example` dan ganti namanya menjadi `.env`:
        ```bash
        cp .env.example .env
        ```
    * Edit file `.env` dan masukkan URL API *backend* Anda:
        ```ini
        # .env
        # Tambahkan variabel lain yang diperlukan (seperti API Key jika ada)
        ```
    > ⚠️ **Catatan:** Harus menjalankan *backend* API

4.  **Jalankan Aplikasi:**
    ```bash
    npm run dev
    # atau
    # npm run serve (Jika menggunakan Vue CLI)
    ```

    Aplikasi akan berjalan di `http://localhost:5173/` (atau port lain yang ditunjukkan di konsol).
