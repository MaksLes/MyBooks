import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const userName = ref<string | null>(localStorage.getItem('userName'));
  const isAuthenticated = ref<boolean>(!!localStorage.getItem('token'));

  function login(newToken: string, name: string) {
    token.value = newToken;
    userName.value = name;
    isAuthenticated.value = true;
    localStorage.setItem('token', newToken);
    localStorage.setItem('userName', name);
  }

  function logout() {
    token.value = null;
    userName.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  }

  return { token, userName, isAuthenticated, login, logout };
});