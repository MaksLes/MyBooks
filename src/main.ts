//Punkt wejścia całej aplikacji Vue
//createApp tworzy instancję aplikacji
import { createApp } from 'vue'
//createPinia() inicjalizuje system zarządzania stanem Pinia
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)

//Pinia musi być zarejestrowana przed routerem ponieważ navigation guard w routerze wywołuje useAuthStore(), a store musi istnieć zanim zostanie użyty
app.use(createPinia()) //rejestruje store globalnie
app.use(router) //rejestruje router

//mount() injectuje drzewo komponentów Vue do elementu <div id="app">
app.mount('#app') //inject'uje Vue do div#app