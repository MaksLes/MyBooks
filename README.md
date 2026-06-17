# MyBooks - Dokumentacja aplikacji

## Opis projektu

MyBooks to webowa aplikacja fullstack do zarządzania osobistą kolekcją książek. Każdy użytkownik po rejestracji i zalogowaniu może dodawać, przeglądać, edytować oraz usuwać przeczytane książki. Dane są izolowane między użytkownikami - każdy widzi tylko swoją kolekcję.

---

## Technologie

### Frontend

| Technologia | Wersja | Rola                           |
| ----------- | ------ | ------------------------------ |
| Vue 3       | ^3.5   | framework UI (Composition API) |
| TypeScript  | ~6.0   | statyczne typowanie            |
| Vite        | ^8.0   | bundler i serwer deweloperski  |
| Vue Router  | ^4.6   | routing SPA                    |
| Pinia       | ^3.0   | zarządzanie stanem             |
| Axios       | ^1.15  | klient HTTP                    |
| Bootstrap 5 | 5.3.0  | stylowanie (CDN)               |

### Backend

| Technologia  | Wersja | Rola                      |
| ------------ | ------ | ------------------------- |
| Node.js      | ≥20.19 | środowisko uruchomieniowe |
| Express      | ^5.2   | framework REST API        |
| bcryptjs     | ^3.0   | hashowanie haseł          |
| jsonwebtoken | ^9.0   | autoryzacja JWT           |

---

## Struktura projektu

```
MyBooks/
├── src/
│   ├── lib/
│   │   └── api.ts           # instancja Axios z interceptorem JWT
│   ├── router/
│   │   └── index.ts         # definicja tras i navigation guard
│   ├── stores/
│   │   └── auth.ts          # store Pinia - stan sesji użytkownika
│   ├── views/
│   │   ├── HomeView.vue     # strona główna / dashboard
│   │   ├── LoginView.vue    # formularz logowania
│   │   ├── RegisterView.vue # formularz rejestracji
│   │   ├── BookListView.vue # lista książek z wyszukiwarką
│   │   ├── AddBookView.vue  # formularz dodawania książki
│   │   ├── EditBookView.vue # formularz edycji książki
│   │   └── BookDetailsView.vue # szczegóły książki
│   ├── App.vue              # główny komponent (navbar + RouterView)
│   └── main.ts              # punkt wejścia aplikacji
├── backend/
│   ├── data/
│   │   ├── users.json       # baza użytkowników
│   │   └── books.json       # baza książek
│   └── server.js            # serwer Express z REST API
└── index.html               # jedyny plik HTML (SPA)
```

---

## Instalacja i uruchomienie

- Otwrórz terminal i nazwij go backend (żeby nie pomylić), zmień scieżkę (cd backend) i wpisz polecenie: node server.js
- Otwórz drugi terminal i nazwij go frontend, wpisz polecenie: npm run dev
- Otworzy się strona logowania, stwórz konto i zacznij korzystać z aplikacji.

### Wymagania

- Node.js w wersji ≥ 20.19
- npm

### Frontend

```bash
npm install
npm run dev
```

Aplikacja dostępna pod adresem: `http://localhost:5173`

### Backend

```bash
cd backend
npm install
```

Utwórz plik `backend/.env` z zawartością:

```
JWT_SECRET=twoj_tajny_klucz
PORT=3000
```

Uruchom serwer:

```bash
node server.js
```

API dostępne pod adresem: `http://localhost:3000`

---

## Funkcjonalności

- **Rejestracja i logowanie** - konto chronione hasłem hashowanym algorytmem bcrypt
- **Trwałość sesji** - token JWT przechowywany w localStorage, sesja przeżywa odświeżenie strony i wygasa po 2h
- **Dashboard** - statystyki kolekcji: liczba książek, średnia ocen, najlepsza pozycja
- **Lista książek** - przeglądanie całej kolekcji w układzie kart
- **Wyszukiwarka** - filtrowanie książek po tytule lub autorze w czasie rzeczywistym
- **Dodawanie książki** - tytuł, autor, ocena (1–10), opis
- **Edycja książki** - formularz pre-wypełniony aktualnymi danymi
- **Usuwanie książki** - z potwierdzeniem przez dialog
- **Szczegóły książki** - pełny widok wybranej pozycji
- **Ochrona tras** - niezalogowany użytkownik jest automatycznie przekierowywany na stronę logowania

---

## Architektura autoryzacji

```
Rejestracja:  hasło → bcrypt.hash(10) → zapisane w users.json
Logowanie:    hasło + hash → bcrypt.compare() → jwt.sign() → token (2h)
Każde żądanie: Axios interceptor → nagłówek Authorization: Bearer <token>
Serwer:       authenticateToken middleware → jwt.verify() → req.user
```

Dane książek są przypisane do właściciela przez pole `owner: email`. Użytkownik nie może odczytać ani zmodyfikować cudzych rekordów.

---

## REST API

Bazowy adres: `/api`

### Autoryzacja

| Metoda | Endpoint         | Opis                        | Auth |
| ------ | ---------------- | --------------------------- | ---- |
| POST   | `/auth/register` | rejestracja użytkownika     | nie  |
| POST   | `/auth/login`    | logowanie, zwraca token JWT | nie  |

### Książki

| Metoda | Endpoint     | Opis                                   | Auth |
| ------ | ------------ | -------------------------------------- | ---- |
| GET    | `/books`     | lista książek zalogowanego użytkownika | tak  |
| GET    | `/books/:id` | szczegóły jednej książki               | tak  |
| POST   | `/books`     | dodanie nowej książki                  | tak  |
| PUT    | `/books/:id` | aktualizacja książki                   | tak  |
| DELETE | `/books/:id` | usunięcie książki                      | tak  |

### Przykładowe ciało żądania

**POST /api/auth/login**

```json
{
  "email": "jan@example.com",
  "password": "haslo123"
}
```

**POST /api/books**

```json
{
  "title": "Wiedźmin",
  "author": "Andrzej Sapkowski",
  "rating": 9,
  "description": "Zbiór opowiadań o wiedźminie Geralcie."
}
```

---

## Znane ograniczenia

- Dane przechowywane w plikach JSON zamiast relacyjnej bazy danych
- Brak paginacji przy dużej liczbie książek
- Token JWT w localStorage podatny na atak XSS (w produkcji zalecane HttpOnly cookies)
- Brak obsługi zdjęć okładek książek
