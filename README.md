# 🚀 Project Management Tool (Trello/Asana Clone)

A full-stack collaborative project management application built as an internship task.

This application allows users to:

- Create projects
- Create and manage tasks
- Assign tasks
- Add comments inside tasks
- Track progress using Kanban-style columns

---

## 🌟 Live Demo

(Will be added after deployment)

Frontend:  
Backend:  

---

## 🛠 Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Axios
- Socket.io Client

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Socket.io

---

## 🔐 Authentication

- User Registration
- User Login
- Protected Routes
- JWT stored in HTTP-only cookies

---

## 📁 Features

### ✅ Projects
- Create new projects
- Only owner can delete project
- Members can access shared projects

### ✅ Tasks
- Create tasks inside projects
- Update status: `todo`, `in-progress`, `done`
- Delete tasks
- Kanban-style layout

### ✅ Comments
- Add comments inside tasks
- View all comments per task
- Only project members can comment

---

## 📂 Folder Structure

```
pm-tool-stepwise/
  backend/
  frontend/
  README.md
```

---

## ⚙️ Local Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/OmShinde2415/Project-Management-Tool-To-Do-List-.git
cd Project-Management-Tool-To-Do-List-
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:
```
http://localhost:5001
```

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:3000
```

---

## 🌍 Environment Variables

### Backend (.env)

```
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

---

## 🚀 Future Improvements

- Real-time task updates
- Notifications system
- Drag-and-drop task movement
- Role-based permissions
- UI improvements
- Deployment optimization

---

## 👨‍💻 Author

**Om Shinde**

Internship Full-Stack Project  
Built using MERN + Next.js

---