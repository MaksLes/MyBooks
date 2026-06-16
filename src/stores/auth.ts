import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token')); //token JWT
  const userName = ref<string | null>(localStorage.getItem('userName')); //imię użykownika
  const isAuthenticated = ref<boolean>(!!localStorage.getItem('token')); // status zalogowania

  //zapisuje dane sesji po zalogowaniu
  function login(newToken: string, name: string) {
    token.value = newToken;
    userName.value = name;
    isAuthenticated.value = true;
    localStorage.setItem('token', newToken);
    localStorage.setItem('userName', name);
  }

  // czyści dane sesji po zalogowaniu
  function logout() {
    token.value = null;
    userName.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
  }

  return { token, userName, isAuthenticated, login, logout };
});