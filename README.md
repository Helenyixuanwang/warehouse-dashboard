# 🏭 Warehouse Task Dashboard

A real-time warehouse task management dashboard inspired by robotics automation systems like Symbotic...

## 🌐 Live Demo

- **Frontend:** https://frontend-production-127d.up.railway.app
- **Backend API:** https://backend-production-ccf8.up.railway.app/tasks

> Deployed on Railway with PostgreSQL and Redis

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   React Frontend │─────────▶   NestJS Backend │─────────▶   Redis Queue   │
│  TypeScript/MUI  │  axios  │   BullMQ Worker  │ BullMQ  │   (BullMQ)      │
│  Jotai State    │◀─────────│   REST API       │◀────────│                 │
└─────────────────┘  polling └─────────────────┘  events └─────────────────┘
```

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Material UI, Jotai |
| Backend | NestJS, TypeScript, BullMQ |
| Queue | Redis (via Docker) |
| Containerization | Docker, Docker Compose |

## ✨ Features

- Add warehouse tasks (picking, packing, shipping) with priority levels
- Tasks enter a BullMQ queue backed by Redis
- Background worker simulates robot processing (2–4 seconds)
- Dashboard polls every 3 seconds for live status updates
- Color-coded status chips: queued → processing → completed → failed
- Real-time stats bar showing task counts by status
- Dark theme professional UI

## 🛠️ Running Locally

### Option 1 — Docker Compose (recommended)
```bash
docker-compose up --build
```
Then open http://localhost:5173

### Option 2 — Manual
```bash
# Terminal 1: Redis
docker run -d --name warehouse-redis -p 6379:6379 redis:alpine

# Terminal 2: Backend
cd backend && npm install && npm run start:dev

# Terminal 3: Frontend
cd frontend && npm install && npm run dev
```

## 📁 Project Structure

```
warehouse-dashboard/
├── backend/
│   ├── src/
│   │   ├── tasks/
│   │   │   ├── task.interface.ts    # TypeScript interfaces
│   │   │   ├── tasks.controller.ts  # REST endpoints
│   │   │   ├── tasks.service.ts     # Business logic
│   │   │   ├── tasks.processor.ts   # BullMQ worker
│   │   │   └── tasks.module.ts      # NestJS module
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx        # Main page + polling
│   │   │   ├── TaskForm.tsx         # Add task form
│   │   │   └── TaskList.tsx         # Task table
│   │   ├── store/
│   │   │   └── atoms.ts             # Jotai global state
│   │   └── services/
│   │       └── api.ts               # Axios API calls
│   └── Dockerfile
└── docker-compose.yml
```

## 💡 Why This Stack?

- **NestJS** — enterprise-grade Node.js framework with TypeScript first-class support
- **BullMQ** — production-ready job queue used in high-throughput systems, analogous to warehouse conveyor routing
- **Redis** — in-memory data store powering the queue, chosen for sub-millisecond latency
- **Jotai** — atomic state management, minimal boilerplate compared to Redux
- **Material UI** — professional component library for rapid dashboard development