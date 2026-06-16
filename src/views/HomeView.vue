<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import api from '../lib/api'

const authStore = useAuthStore()
const books = ref<any[]>([])
const loading = ref(true)

const stats = computed(() => {
  if (books.value.length === 0) return { count: 0, avg: 0, best: 'Brak' }
  
  const total = books.value.length
  const sum = books.value.reduce((acc, b) => acc + Number(b.rating), 0)
  const avg = (sum / total).toFixed(1)
  
  // Znajdź najlepiej ocenioną książkę
  const bestBook = [...books.value].sort((a, b) => b.rating - a.rating)[0]
  
  return { count: total, avg, best: bestBook.title }
})

const lastBook = computed(() => {
  return books.value.length > 0 ? books.value[books.value.length - 1] : null
})

onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      const res = await api.get('/books')
      books.value = res.data
    } catch (err) {
      console.error("Błąd pobierania statystyk:", err)
    } finally {
      loading.value = false
    }
  } else {
    loading.value = false
  }
})
</script>

<template>
  <div class="home-container">
    <div v-if="!authStore.isAuthenticated" class="text-center py-5 bg-white rounded-4 shadow-sm border">
      <h1 class="display-3 fw-bold text-dark mb-3">Twoja osobista <span class="text-warning">biblioteka</span></h1>
      <p class="lead text-muted mb-4">Organizuj, oceniaj i śledź swoją kolekcję książek w jednym miejscu.</p>
      <div class="d-flex justify-content-center gap-3">
        <RouterLink to="/register" class="btn btn-warning btn-lg px-5 fw-bold shadow-sm">Zacznij teraz</RouterLink>
        <RouterLink to="/login" class="btn btn-outline-dark btn-lg px-5">Zaloguj się</RouterLink>
      </div>
    </div>

    <div v-else>
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h2 class="fw-bold">Cześć, {{ authStore.userName }}! 👋</h2>
        <RouterLink to="/add" class="btn btn-warning fw-bold">+ Dodaj nową</RouterLink>
      </div>

      <div class="row g-4 mb-5">
        <div class="col-md-4">
          <div class="card border-0 shadow-sm bg-primary text-white h-100">
            <div class="card-body text-center p-4">
              <div class="display-5 fw-bold">{{ stats.count }}</div>
              <div class="text-uppercase small opacity-75">Książek w kolekcji</div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm bg-success text-white h-100">
            <div class="card-body text-center p-4">
              <div class="display-5 fw-bold">{{ stats.avg }}</div>
              <div class="text-uppercase small opacity-75">Średnia ocen</div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm bg-dark text-white h-100">
            <div class="card-body text-center p-4 text-truncate">
              <div class="h3 fw-bold">{{ stats.best }}</div>
              <div class="text-uppercase small opacity-75">Twój hit</div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white fw-bold border-0 pt-4">Ostatnio dodana pozycja</div>
            <div class="card-body">
              <div v-if="lastBook" class="d-flex align-items-start gap-3">
                <div class="bg-light p-3 rounded text-warning shadow-sm">
                  <span style="font-size: 2rem;">📖</span>
                </div>
                <div>
                  <h5 class="fw-bold mb-1">{{ lastBook.title }}</h5>
                  <p class="text-muted small mb-3">Autor: {{ lastBook.author }}</p>
                  <RouterLink :to="'/books/' + lastBook.id" class="btn btn-sm btn-warning fw-bold px-3">
                    Zobacz szczegóły
                  </RouterLink>
                </div>
              </div>
              <p v-else class="text-muted">Lista Twoich książek jest pusta.</p>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white fw-bold border-0 pt-4">Szybkie akcje</div>
            <div class="card-body d-grid gap-2">
              <RouterLink to="/books" class="btn btn-outline-secondary text-start p-3">📂 Przeglądaj bibliotekę</RouterLink>
              <RouterLink to="/add" class="btn btn-outline-secondary text-start p-3">➕ Dodaj książkę</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card { transition: transform 0.2s; border-radius: 1rem; }
.card:hover { transform: translateY(-5px); }
</style>