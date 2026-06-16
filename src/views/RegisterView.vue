<script setup lang="ts">
import { ref } from 'vue';
import api from '../lib/api';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMsg = ref('');
const router = useRouter();

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = "Hasła nie są identyczne.";
    return;
  }

  try {
    await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    });
    router.push('/login');
  } catch (err: any) {
    errorMsg.value = err.response?.data?.error || "Błąd rejestracji";
  }
};
</script>

<template>
  <div class="row justify-content-center mt-5">
    <div class="col-md-5">
      <div class="card shadow">
        <div class="card-body">
          <h2 class="text-center mb-4">Rejestracja</h2>
          <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label class="form-label">Imię i Nazwisko</label>
              <input v-model="name" type="text" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" type="email" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Hasło</label>
              <input v-model="password" type="password" class="form-control" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Powtórz hasło</label>
              <input v-model="confirmPassword" type="password" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-warning w-100 fw-bold">Zarejestruj się</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>