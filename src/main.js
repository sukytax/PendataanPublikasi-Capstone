import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/HomePage.vue'
import DataPublikasi from './components/DataPublikasi.vue'
import AnalisisData from './components/AnalisisData.vue'
import Berita from './components/Berita.vue'

const router = createRouter({
    routes: [
        {
            path: "/",
            component: HomePage
        },
        {
            path: "/homepage",
            redirect: "/"
        },
        {
            path: "/data-publikasi",
            component: DataPublikasi
        },
        {
            path: "/data-publikasi/:id",
            component: () => import('./components/DetailDosen.vue')
        },
        {
            path: "/analisis",
            component: AnalisisData
        },
        {
            path: "/berita",
            component: Berita
        },
        {
            path: "/berita/:id",
            component: () => import('./components/DetailBerita.vue')
        }
    ],
    history: createWebHistory()
})

createApp(App).use(router).mount('#app')