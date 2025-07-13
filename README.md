# ToDo List App - Vue 3 + Express

Aplikasi ToDo List lengkap dengan fitur autentikasi, CRUD operations, dan filter. Dibangun dengan Vue 3, Pinia, Vue Router, Express.js, dan database JSON.

## Fitur

### Autentikasi
- ✅ Login dengan username dan password
- ✅ Register user baru
- ✅ JWT token authentication
- ✅ Protected routes

### Todo Management
- ✅ Tambah todo baru
- ✅ Edit todo yang sudah ada
- ✅ Hapus todo
- ✅ Toggle status completed/active
- ✅ Detail view todo

### Filter & UI
- ✅ Filter: All, Active, Completed
- ✅ Responsive design dengan Tailwind CSS
- ✅ Loading states
- ✅ Error handling
- ✅ User-specific todos

## Struktur Project

```
UAS/
├── backend/                 # Backend Express.js
│   ├── server.js           # Express server
│   ├── db.json            # Database JSON
│   └── package.json       # Backend dependencies
├── src/
│   ├── stores/            # Pinia stores
│   │   ├── auth.js        # Authentication store
│   │   └── todos.js       # Todos store
│   ├── views/             # Vue components
│   │   ├── Login.vue      # Login page
│   │   ├── Register.vue   # Register page
│   │   ├── Todos.vue      # Main todos list
│   │   ├── AddTodo.vue    # Add todo form
│   │   ├── EditTodo.vue   # Edit todo form
│   │   └── TodoDetail.vue # Todo detail view
│   ├── router/            # Vue Router
│   │   └── index.js       # Route configuration
│   ├── App.vue            # Root component
│   └── main.js            # App entry point
├── package.json           # Frontend dependencies
├── tailwind.config.js     # Tailwind configuration
└── postcss.config.js      # PostCSS configuration
```

## Instalasi & Menjalankan

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Menjalankan Backend

```bash
cd backend
npm start
# atau untuk development
npm run dev
```

Backend akan berjalan di `http://localhost:3000`

### 3. Menjalankan Frontend

```bash
# Di root directory (UAS/)
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user

### Todos (memerlukan authentication)
- `GET /api/todos` - Ambil semua todos user
- `POST /api/todos` - Buat todo baru
- `GET /api/todos/:id` - Ambil detail todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Hapus todo

## Database

Database menggunakan file JSON (`backend/db.json`) dengan struktur:

```json
{
  "users": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "password": "hashed_password"
    }
  ],
  "todos": [
    {
      "id": 1,
      "userId": 1,
      "title": "Todo title",
      "description": "Todo description",
      "completed": false,
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ]
}
```

## Default User

Untuk testing, sudah ada user default:
- **Username**: `admin`
- **Password**: `password`

## Teknologi yang Digunakan

### Frontend
- Vue 3 (Composition API)
- Vue Router 4
- Pinia (State Management)
- Axios (HTTP Client)
- Tailwind CSS (Styling)

### Backend
- Express.js
- bcryptjs (Password hashing)
- jsonwebtoken (JWT)
- CORS middleware

## Fitur Keamanan

- Password hashing dengan bcrypt
- JWT token authentication
- CORS protection
- User-specific data isolation
- Input validation

## Development

### Menambahkan Dependencies

```bash
# Frontend
npm install package-name

# Backend
cd backend
npm install package-name
```

### Struktur Database

Untuk menambah field baru di database, edit `backend/db.json` dan update server logic di `backend/server.js`.
