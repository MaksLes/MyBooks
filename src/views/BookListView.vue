<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../lib/api'

const books = ref<any[]>([]) //lista książek użytkownika
const loading = ref(true) //stan ładowania

//pobiera książki z API
const fetchBooks = async () => {
  try {
    const response = await api.get('/books')
    books.value = response.data
  } catch (error) {
    console.error("Błąd pobierania listy:", error)
  } finally {
    loading.value = false
  }
}

//usuwa książkę po potwierdzeniu 
const deleteBook = async (id: number) => {
  if (confirm('Czy na pewno chcesz usunąć tę książkę?')) {
    try {
      await api.delete(`/books/${id}`)
      fetchBooks()
    } catch (err) {
      alert("Błąd podczas usuwania.")
    }
  }
}

onMounted(fetchBooks) //pobiera dane przy załadowaniu komponentu
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold text-dark">Twoja Kolekcja</h2>
      <RouterLink to="/add" class="btn btn-warning fw-bold">+ Dodaj książkę</RouterLink>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>

    <div v-else-if="books.length === 0" class="alert alert-info rounded-4 shadow-sm p-4">
      Nie masz jeszcze żadnych książek. Kliknij przycisk powyżej, aby zacząć budować swoją bibliotekę!
    </div>

    <div v-else class="row g-4">
      <div v-for="book in books" :key="book.id" class="col-md-6 col-lg-4">
        <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-2">
              <h5 class="card-title fw-bold mb-0 text-truncate" style="max-width: 70%;">{{ book.title }}</h5>
              <span class="badge bg-warning text-dark">{{ book.rating }}/10</span>
            </div>
            <h6 class="card-subtitle mb-3 text-muted">Autor: {{ book.author }}</h6>
            <p class="card-text text-secondary text-truncate">{{ book.description || 'Brak opisu...' }}</p>
          </div>
          <div class="card-footer bg-white border-top-0 d-flex gap-2 pb-3">
            <RouterLink :to="'/books/' + book.id" class="btn btn-sm btn-outline-dark flex-grow-1 fw-bold">
              Szczegóły
            </RouterLink>
            <RouterLink :to="'/edit/' + book.id" class="btn btn-sm btn-outline-primary">
              Edytuj
            </RouterLink>
            <button @click="deleteBook(book.id)" class="btn btn-sm btn-outline-danger">
              Usuń
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card { transition: all 0.2s ease-in-out; }
.card:hover { transform: scale(1.02); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
</style>