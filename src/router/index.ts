import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import BookListView from '../views/BookListView.vue'
import AddBookView from '../views/AddBookView.vue'
import EditBookView from '../views/EditBookView.vue'
import BookDetailView from '../views/BookDetailsView.vue' // Import nowego widoku
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/books', name: 'books', component: BookListView, meta: { requiresAuth: true } },
    { path: '/books/:id', name: 'book-details', component: BookDetailView, meta: { requiresAuth: true } }, // Szczegóły
    { path: '/add', name: 'add-book', component: AddBookView, meta: { requiresAuth: true } },
    { path: '/edit/:id', name: 'edit-book', component: EditBookView, meta: { requiresAuth: true } },
  ]
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !useAuthStore().isAuthenticated) {
    return { name: 'login' }
  }
})

export default router