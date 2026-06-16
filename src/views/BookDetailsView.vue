<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../lib/api'

const route = useRoute()
const router = useRouter()
const book = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await api.get(`/books/${route.params.id}`)
    book.value = res.data
  } catch (err) {
    console.error("Nie udało się pobrać danych książki")
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container mt-4">
    <button @click="router.back()" class="btn btn-outline-secondary mb-4">← Wróć</button>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>

    <div v-else-if="book" class="card shadow-lg border-0 rounded-4 overflow-hidden">
      <div class="row g-0">
        <div class="col-md-4 bg-warning d-flex align-items-center justify-content-center p-5">
          <ion-icon name="book-outline" style="font-size: 7rem;"></ion-icon>
        </div>
        <div class="col-md-8">
          <div class="card-body p-5">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h1 class="display-4 fw-bold mb-1">{{ book.title }}</h1>
                <p class="text-muted fs-4">Autor: {{ book.author }}</p>
              </div>
              <span class="badge bg-dark fs-4 p-3 rounded-3 shadow-sm">
                {{ book.rating }}/10 ⭐
              </span>
            </div>
            
            <hr class="my-4">
            
            <h5 class="fw-bold text-uppercase text-muted small mb-3">Opis fabuły / Notatki:</h5>
            <p class="fs-5 lh-lg text-secondary" style="white-space: pre-line;">
              {{ book.description || 'Brak dodatkowego opisu dla tej pozycji.' }}
            </p>

            <div class="mt-5 d-flex gap-2">
              <RouterLink :to="'/edit/' + book.id" class="btn btn-primary btn-lg px-5">Edytuj</RouterLink>
              <button @click="router.push('/books')" class="btn btn-light btn-lg px-4">Lista książek</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-danger rounded-4 p-4 shadow-sm">
      <h4 class="alert-heading">Błąd!</h4>
      <p>Nie znaleziono książki o podanym identyfikatorze w Twojej bibliotece.</p>
    </div>
  </div>
</template>