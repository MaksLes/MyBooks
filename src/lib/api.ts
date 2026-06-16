import axios from 'axios'
import { useAuthStore } from '../stores/auth'

//instancja Axios z bazowym adresem API 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
})

// automatycznie odłącza token JWT do każdego żądania
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

export default api
