<script setup lang="ts">
import { ref } from 'vue'
import api from '../lib/api'
import { useRouter } from 'vue-router'

const router = useRouter()
const book = ref({
  title: '',
  author: '',
  description: '',
  rating: 5
})

const errorMsg = ref('')

const handleSubmit = async () => {
  try {
    // Wysyłamy dane do endpointu, który stworzyliśmy w server.js
    await api.post('/books', book.value)
    
    // Po sukcesie wróć do listy książek
    router.push('/books')
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || "Błąd podczas dodawania książki"
  }
}
</script>

<template>
  <div class="max-width-600 mx-auto">
    <h2 class="mb-4">Dodaj nową książkę</h2>
    
    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

    <form @submit.prevent="handleSubmit" class="card p-4 shadow-sm">
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

      <button type="submit" class="btn btn-success w-100">Dodaj do kolekcji</button>
    </form>
  </div>
</template>