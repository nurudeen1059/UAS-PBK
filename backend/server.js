const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// Database file path
const dbPath = path.join(__dirname, 'db.json');

// Helper functions untuk database
const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [], todos: [] };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// Middleware untuk verifikasi token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const db = readDB();

    // Cek apakah username atau email sudah ada
    const existingUser = db.users.find(user => 
      user.username === username || user.email === email
    );

    if (existingUser) {
      return res.status(400).json({ message: 'Username atau email sudah terdaftar' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const newUser = {
      id: db.users.length + 1,
      username,
      email,
      password: hashedPassword
    };

    db.users.push(newUser);
    writeDB(db);

    res.status(201).json({ 
      message: 'Registrasi berhasil',
      user: { id: newUser.id, username: newUser.username, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const db = readDB();

    // Cari user
    const user = db.users.find(u => u.username === username);
    if (!user) {
      return res.status(400).json({ message: 'Username atau password salah' });
    }

    // Verifikasi password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Username atau password salah' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login berhasil',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get todos berdasarkan user
app.get('/api/todos', authenticateToken, (req, res) => {
  try {
    const db = readDB();
    const userTodos = db.todos.filter(todo => todo.userId === req.user.id);
    res.json(userTodos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create todo
app.post('/api/todos', authenticateToken, (req, res) => {
  try {
    const { title, description } = req.body;
    const db = readDB();

    const newTodo = {
      id: db.todos.length + 1,
      userId: req.user.id,
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.todos.push(newTodo);
    writeDB(db);

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update todo
app.put('/api/todos/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const db = readDB();

    const todoIndex = db.todos.findIndex(todo => 
      todo.id === parseInt(id) && todo.userId === req.user.id
    );

    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo tidak ditemukan' });
    }

    db.todos[todoIndex] = {
      ...db.todos[todoIndex],
      title: title || db.todos[todoIndex].title,
      description: description || db.todos[todoIndex].description,
      completed: completed !== undefined ? completed : db.todos[todoIndex].completed,
      updatedAt: new Date().toISOString()
    };

    writeDB(db);
    res.json(db.todos[todoIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete todo
app.delete('/api/todos/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();

    const todoIndex = db.todos.findIndex(todo => 
      todo.id === parseInt(id) && todo.userId === req.user.id
    );

    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo tidak ditemukan' });
    }

    db.todos.splice(todoIndex, 1);
    writeDB(db);

    res.json({ message: 'Todo berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get todo by ID
app.get('/api/todos/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const db = readDB();

    const todo = db.todos.find(todo => 
      todo.id === parseInt(id) && todo.userId === req.user.id
    );

    if (!todo) {
      return res.status(404).json({ message: 'Todo tidak ditemukan' });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
}); 