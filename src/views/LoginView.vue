<script setup lang="ts">
import { ref } from 'vue';
import api from '../lib/api';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const email = ref(''); // pole email formularza
const password = ref(''); // pole hasła formularza
const errorMsg = ref(''); // komunikat błędu 
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    });
    
    // Zapisujemy token i otrzymane imię
    authStore.login(response.data.token, response.data.name); //zapisywanie sesji
    router.push('/');
  } catch (err: any) {
    errorMsg.value = "Błędne dane logowania";
  }
};
</script>

<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-4">
      <div class="card shadow">
        <div class="card-body">
          <h2 class="text-center mb-4">Logowanie</h2>
          <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Hasło</label>
              <input v-model="password" type="password" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary w-100 fw-bold">Zaloguj się</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>