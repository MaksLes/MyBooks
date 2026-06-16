<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../lib/api'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const bookId = route.params.id

const book = ref({
  title: '',
  author: '',
  description: '',
  rating: 5
})

const errorMsg = ref('')

// 1. Pobierz dane książki przy wejściu na stronę
onMounted(async () => {
  try {
    const response = await api.get(`/books/${bookId}`)
    book.value = response.data
  } catch (err) {
    errorMsg.value = "Nie udało się pobrać danych książki."
  }
})

// 2. Wyślij zaktualizowane dane
const handleUpdate = async () => {
  try {
    await api.put(`/books/${bookId}`, book.value)
    router.push('/books') // Wróć do listy
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || "Błąd podczas aktualizacji"
  }
}
</script>

<template>
  <div class="max-width-600 mx-auto">
    <h2 class="mb-4 text-primary">Edytuj książkę</h2>
    
    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

    <form @submit.prevent="handleUpdate" class="card p-4 shadow border-primary">
      <div class="mb-3">
        <label class="form-label fw-bold">Tytuł</label>
        <input v-model="book.title" type="text" class="form-control" required minlength="3">
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">Autor</label>
        <input v-model="book.author" type="text" class="form-control" required>
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">Ocena (1-10)</label>
        <input v-model="book.rating" type="number" min="1" max="10" class="form-control">
      </div>

      <div class="mb-3">
        <label class="form-label fw-bold">Opis</label>
        <textarea v-model="book.description" class="form-control" rows="3"></textarea>
      </div>

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary flex-grow-1">Zapisz zmiany</button>
        <button type="button" @click="router.push('/books')" class="btn btn-outline-secondary">Anuluj</button>
      </div>
    </form>
  </div>
</template>