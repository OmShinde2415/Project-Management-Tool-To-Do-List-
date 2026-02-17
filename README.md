🚀 Project Management Tool (Trello / Asana Clone)

A full-stack collaborative project management web application built as an internship task.

This application allows users to create projects, manage tasks, collaborate with team members, and communicate through task-based comments using a Kanban-style workflow.

🌍 Live Demo

Frontend:
https://project-management-tool-to-do-list.vercel.app

Backend API:
https://pm-tool-backend-qmlz.onrender.com

🛠 Tech Stack
Frontend

Next.js 14 (App Router)

TypeScript

TailwindCSS

Axios

Socket.io Client

Backend

Node.js

Express.js

MongoDB Atlas

Mongoose

JWT Authentication

Socket.io

🔐 Authentication

User Registration

User Login

Protected Routes

JWT stored in HTTP-only cookies

CORS-secured production deployment

📁 Features
✅ Projects

Create new projects

Only owner can delete project

Members can access shared projects

✅ Tasks

Create tasks inside projects

Update status: todo, in-progress, done

Delete tasks

Kanban-style column layout

✅ Comments

Add comments inside tasks

View all comments per task

Only project members can comment

📂 Folder Structure
pm-tool-stepwise/
  backend/
  frontend/
  README.md
⚙️ Local Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/OmShinde2415/Project-Management-Tool-To-Do-List-.git
cd Project-Management-Tool-To-Do-List-
2️⃣ Backend Setup
cd backend
npm install
npm run dev

Backend runs on:

http://localhost:5001
3️⃣ Frontend Setup
cd ../frontend
npm install
npm run dev

Frontend runs on:

http://localhost:3000
🌍 Environment Variables
Backend (.env)
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
🚀 Deployment

Backend deployed on Render

Frontend deployed on Vercel

MongoDB hosted on MongoDB Atlas

🔮 Future Improvements

Real-time task status sync across users

Notification system

Drag-and-drop task movement

Role-based permissions

UI/UX enhancements

Activity logs

👨‍💻 Author

Om Shinde

Full-Stack Internship Project
Built using MERN + Next.js
