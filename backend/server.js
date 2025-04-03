import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const port = 3000;

// Initialize SQLite database
const db = new Database('./books.db');

// Enable CORS
app.use(cors());
app.use(express.json());

// Create books table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT NOT NULL UNIQUE,
    genre TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL,
    image_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// GET all books
app.get('/api/books', (req, res) => {
  const books = db.prepare('SELECT * FROM books ORDER BY created_at DESC').all();
  res.json(books);
});

// POST new book
app.post('/api/books', (req, res) => {
  const { title, author, isbn, genre, description, price, image_url } = req.body;
  
  try {
    const stmt = db.prepare(`
      INSERT INTO books (id, title, author, isbn, genre, description, price, image_url)
      VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(title, author, isbn, genre, description, price, image_url);
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json(book);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'ISBN must be unique' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// PUT update book
app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, genre, description, price, image_url } = req.body;
  
  try {
    const stmt = db.prepare(`
      UPDATE books 
      SET title = ?, author = ?, isbn = ?, genre = ?, description = ?, price = ?, image_url = ?
      WHERE id = ?
    `);
    
    stmt.run(title, author, isbn, genre, description, price, image_url, id);
    const book = db.prepare('SELECT * FROM books WHERE id = ?').get(id);
    
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ error: 'ISBN must be unique' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// DELETE book
app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  
  const result = db.prepare('DELETE FROM books WHERE id = ?').run(id);
  
  if (result.changes > 0) {
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});