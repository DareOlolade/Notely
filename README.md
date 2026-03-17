# Notely — Full Stack Notes App

A full stack notes application built with the MERN stack. Users can register, log in, and manage their personal notes with a clean dark UI.

**Live Demo:** [notely-nine-gold.vercel.app](https://notely-nine-gold.vercel.app)

---

## Features

- User registration and login with JWT authentication
- Password hashing with bcrypt
- Create, read, update and delete notes
- 3-panel dashboard — sidebar, notes list, and editor
- Protected routes — unauthenticated users are redirected to login
- Persistent sessions using localStorage
- Dark mode UI with Inter font
- Responsive design with mobile hamburger menu

---

## Tech Stack

**Frontend**
- React (Vite)
- React Router v6
- Axios
- Plain CSS

**Backend**
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

**Deployment**
- Frontend: Vercel
- Backend: Render

---

## Project Structure

```
Notely/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── noteController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Note.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── noteRoutes.js
│   ├── .env
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Register.jsx
    │   │   ├── Login.jsx
    │   │   └── Dashboard.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── index.html
```

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register a new user | No |
| POST | /api/auth/login | Login and get token | No |
| GET | /api/note | Get all user notes | Yes |
| POST | /api/note | Create a new note | Yes |
| PUT | /api/note/:id |
