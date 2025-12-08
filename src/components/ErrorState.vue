<template>
  <div class="error-container">
    <div class="error-icon">⚠️</div>
    <p class="error-title">{{ title }}</p>
    <p class="error-message">{{ message }}</p>
    <button @click="$emit('retry')" class="btn-retry">
      🔄 Coba Lagi
    </button>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Terjadi Kesalahan'
  },
  message: {
    type: String,
    default: 'Gagal memuat data dari server'
  }
});

defineEmits(['retry']);
</script>

<style scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background-color: #ffebee;
  border-radius: 8px;
  margin: 2rem 0;
  border-left: 4px solid #c62828;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #c62828;
  margin: 0.5rem 0;
}

.error-message {
  color: #d32f2f;
  font-size: 0.95rem;
  text-align: center;
  margin: 0.5rem 0 1.5rem;
  line-height: 1.5;
}

.btn-retry {
  padding: 0.7rem 1.5rem;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background-color 0.3s ease;
}

.btn-retry:hover {
  background-color: #b71c1c;
}
</style>
