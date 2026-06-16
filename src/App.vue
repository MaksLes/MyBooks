<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const router = useRouter()

// Reaktywne sprawdzanie statusu logowania i imienia
const isLoggedIn = computed(() => authStore.isAuthenticated)
const userName = computed(() => authStore.userName)

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/">📚 MyBooks</RouterLink>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav me-auto">
          <RouterLink v-if="isLoggedIn" class="nav-link" to="/books">Moje Książki</RouterLink>
          <RouterLink v-if="isLoggedIn" class="nav-link" to="/add">Dodaj książkę</RouterLink>
        </div>

        <div class="navbar-nav">
          <template v-if="!isLoggedIn">
            <RouterLink class="nav-link" to="/login">Zaloguj</RouterLink>
            <RouterLink class="btn btn-warning ms-lg-2" to="/register">Rejestracja</RouterLink>
          </template>
          
          <template v-else>
            <span class="navbar-text me-3 text-light">
              Witaj, <span class="fw-bold text-warning">{{ userName }}</span>!
            </span>
            <button @click="handleLogout" class="btn btn-outline-danger btn-sm">Wyloguj</button>
          </template>
        </div>
      </div>
    </div>
  </nav>

  <div class="container pb-5">
    <RouterView />
  </div>
</template>

<style>
/* Globalne poprawki wizualne */
body {
  background-color: #f8f9fa;
}

.navbar-brand {
  font-size: 1.5rem;
}

.nav-link.router-link-active {
  color: #ffc107 !important; /* Podświetlenie aktywnej zakładki na złoto */
  font-weight: bold;
}
</style>