# Notely
 
A full stack notes application built with the MERN stack. Users can register, log in, and create, edit, and delete personal notes — all behind secure JWT authentication.
 
## Live Demo
 
- **Frontend:** https://notely-nine-gold.vercel.app
- **Backend API:** https://notely-0tkz.onrender.com
 
## Features
 
- User registration and login with JWT authentication
- Passwords encrypted with bcrypt
- Create, read, update and delete notes
- 3-panel dashboard layout — sidebar, notes list, and editor
- Notes linked to authenticated users only
- Protected routes — unauthenticated users redirected to login
- Mobile responsive — collapsible sidebar, full screen editor, floating action button
- Search notes by title
- Dark mode UI
 
## Tech Stack
 
**Frontend**
- React (Vite)
- React Router v6
- Axios
- CSS (custom, no framework)
 
**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
 
**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
 
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
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   └── ProtectedRoute.jsx
        ├── pages/
        │   ├── Register.jsx
        │   ├── Login.jsx
        │   └── Dashboard.jsx
        ├── App.jsx
        └── main.jsx
```
 
## Running Locally
 
### Prerequisites
- Node.js installed
- MongoDB Atlas account
 
### Backend
 
```bash
cd backend
npm install
```
 
Create a `.env` file in the `backend` folder:
 
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```
 
```bash
npm run dev
```
 
### Frontend
 
```bash
cd frontend
npm install
```
 
Create a `.env` file in the `frontend` folder:
 
```
VITE_API_URL=http://localhost:5000
```
 
```bash
npm run dev
```
 
The app will be running at `http://localhost:5173`
 
## API Endpoints
 
### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and receive JWT token |
 
### Notes (requires Authorization header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/note | Get all notes for logged in user |
| POST | /api/note | Create a new note |
| PUT | /api/note/:id | Update a note |
| DELETE | /api/note/:id | Delete a note |
 
## Author
 
Oladare — Federal University of Technology Akure (FUTA)  
GitHub: [@DareOlolade](https://github.com/DareOlolade)
