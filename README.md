
# CodeCollab — Real-time Collaborative Code Editor

A full-stack real-time code editor that allows multiple users to collaborate in the same coding room with live synchronization, cursor presence, and chat.

---

## 🚀 Features

* Real-time collaborative code editing
* Conflict-free synchronization using CRDTs
* Live cursor and user presence tracking
* Room-based collaboration with shareable links
* Built-in chat for communication
* Monaco Editor (VS Code editor)
* Responsive and clean UI

---

## 🛠️ Tech Stack

**Frontend**

* React + TypeScript
* Monaco Editor
* Yjs (CRDT)
* Tailwind CSS
* Vite

**Backend**

* Node.js + Express
* WebSocket (ws)
* y-websocket

---

## 📦 Setup

### Clone

```bash
git clone https://github.com/rohitYadav03/CodeCollab
cd CodeCollab
```

### Backend

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=3000
```

Start server:

```bash
npm start
```

---

### Frontend

```bash
cd client
npm install
```

Create `.env`:

```env
VITE_WS_URL=ws://localhost:3000
```

Start app:

```bash
npm run dev
```

---

## 🌐 Deployment

* **Backend**: AWS EC2 with PM2
* **Frontend**: Vercel
* Environment-based WebSocket configuration using Vite

---

## 📁 Structure

```
codecollab/
├── client/
├── backend/
```
