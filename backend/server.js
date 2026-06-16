process.loadEnvFile();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET;

// Ścieżki do plików danych
const usersPath = path.join(__dirname, 'data', 'users.json');
const booksPath = path.join(__dirname, 'data', 'books.json');

// Pomocnicze funkcje do czytania/zapisu
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// --- MIDDLEWARE: AUTORYZACJA ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: "Brak tokena, zaloguj się." });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Sesja wygasła." });
    req.user = user; // Zawiera email i name
    next();
  });
};

// --- ENDPOINTY AUTENTYKACJI ---

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  const users = readData(usersPath);

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "Użytkownik już istnieje." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword, name });
  writeData(usersPath, users);
  res.status(201).json({ message: "Zarejestrowano pomyślnie!" });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const users = readData(usersPath);
  const user = users.find(u => u.email === email);

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email, name: user.name }, SECRET_KEY, { expiresIn: '2h' });
    res.json({ token, name: user.name });
  } else {
    res.status(401).json({ error: "Błędny email lub hasło." });
  }
});

// --- ENDPOINTY KSIĄŻEK ---

// 1. Pobierz wszystkie książki zalogowanego użytkownika
app.get('/api/books', authenticateToken, (req, res) => {
  const allBooks = readData(booksPath);
  const userEmail = req.user.email;
  
  // Filtrujemy, aby pokazać tylko książki należące do zalogowanego maila
  const userBooks = allBooks.filter(b => b.owner === userEmail);
  
  console.log(`[GET] Użytkownik ${userEmail} pobrał listę. Znaleziono: ${userBooks.length}`);
  res.json(userBooks);
});

// 2. Pobierz jedną książkę po ID
app.get('/api/books/:id', authenticateToken, (req, res) => {
  const allBooks = readData(booksPath);
  const bookId = req.params.id;
  const userEmail = req.user.email;

  // Porównujemy ID jako stringi, aby uniknąć problemów z Date.now()
  const book = allBooks.find(b => 
    String(b.id) === String(bookId) && b.owner === userEmail
  );

  if (book) {
    res.json(book);
  } else {
    console.log(`[GET BY ID] Nie znaleziono książki ${bookId} dla ${userEmail}`);
    res.status(404).json({ error: "Nie znaleziono książki." });
  }
});

// 3. Dodaj nową książkę
app.post('/api/books', authenticateToken, (req, res) => {
  const { title, author, rating, description } = req.body;
  const books = readData(booksPath);

  const newBook = { 
    id: Date.now(), 
    owner: req.user.email, // Przypisanie e-maila z tokena
    title, 
    author, 
    rating: Number(rating), 
    description 
  };
  
  books.push(newBook);
  writeData(booksPath, books);
  console.log(`[POST] Dodano nową książkę: ${title} przez ${req.user.email}`);
  res.status(201).json(newBook);
});

// 4. Edytuj książkę
app.put('/api/books/:id', authenticateToken, (req, res) => {
  let books = readData(booksPath);
  const bookId = req.params.id;
  const index = books.findIndex(b => String(b.id) === String(bookId) && b.owner === req.user.email);

  if (index !== -1) {
    const { title, author, rating, description } = req.body;
    books[index] = { ...books[index], title, author, rating: Number(rating), description };
    writeData(booksPath, books);
    res.json(books[index]);
  } else {
    res.status(403).json({ error: "Brak uprawnień lub nie znaleziono książki." });
  }
});

// 5. Usuń książkę
app.delete('/api/books/:id', authenticateToken, (req, res) => {
  let books = readData(booksPath);
  const bookId = req.params.id;
  const initialLength = books.length;

  books = books.filter(b => !(String(b.id) === String(bookId) && b.owner === req.user.email));

  if (books.length < initialLength) {
    writeData(booksPath, books);
    console.log(`[DELETE] Usunięto książkę ${bookId}`);
    res.json({ message: "Usunięto pomyślnie." });
  } else {
    res.status(403).json({ error: "Błąd usuwania." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});