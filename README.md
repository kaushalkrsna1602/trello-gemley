# 🧩 Trello-Style Task Management App

A full-stack Kanban board application inspired by Trello. Built with the **MERN** stack using **React (Vite)**, **Node.js**, **Express**, and **MongoDB**. Includes boards, lists, cards, drag-and-drop features, and role-based permissions.

---

## 🚀 Live Demo

- **Live App**: _Coming Soon_
- **GitHub Repo**: _Coming Soon_

---

## 🛠️ Tech Stack

| Layer       | Technology |
|-------------|------------|
| Frontend    | React (Vite), Tailwind CSS, React Router, @hello-pangea/dnd |
| Backend     | Node.js, Express |
| Database    | MongoDB, Mongoose |
| Auth        | JWT (Role-based access) |
| Realtime    | Socket.io (Bonus) |

---

## ✨ Core Features

- ✅ Create and manage multiple **Boards**
- ✅ Add and manage **Lists** inside boards
- ✅ Create, edit, and delete **Cards** inside lists
- ✅ **Drag-and-drop** cards across lists using `@hello-pangea/dnd`
- ✅ **Full CRUD** operations for boards, lists, and cards
- ✅ Delete individual cards and entire boards
- ✅ Clean and responsive UI with Tailwind CSS

---

## 🔐 Role-Based Access

| Role   | View | Create/Edit | Delete | Drag & Drop |
|--------|------|-------------|--------|-------------|
| Admin  | ✅    | ✅           | ✅      | ✅           |
| Editor | ✅    | ✅           | ❌      | ✅           |
| Viewer | ✅    | ❌           | ❌      | ❌           |

---

## 📁 Folder Structure

```
├── client/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
```

---

## ⚙️ API Endpoints

### Boards
- `GET /api/boards` — Fetch all boards
- `POST /api/boards` — Create a new board
- `GET /api/boards/:id` — Get board by ID
- `DELETE /api/boards/:id` — Delete board (and associated lists/cards)

### Lists
- `POST /api/lists` — Create list
- `PATCH /api/lists/:id` — Edit list name
- `DELETE /api/lists/:id` — Delete list

### Cards
- `POST /api/cards` — Create card
- `PATCH /api/cards/:id` — Edit card
- `DELETE /api/cards/:id` — Delete card

---

## 🧪 Bonus Features

- 🔄 **Real-time Syncing**: Live updates with Socket.io
- 🔒 **JWT Authentication** with role-based permissions
- 🛎️ **Activity Logs / Notifications**

---

## 🚧 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/kanban-app.git
cd kanban-app
```

### 2. Backend Setup

```bash
cd server
npm install
# Create a .env file with your MongoDB URI and JWT secret
npm start
```

> Server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

> Client will run on `http://localhost:5173`

---

## 📦 Deployment

- **Frontend**: Deploy to Vercel or Netlify
- **Backend**: Use Render, Railway, or Vercel Functions
- **Database**: MongoDB Atlas

---

