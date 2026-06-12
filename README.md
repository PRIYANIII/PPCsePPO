# CareerPilot

AI-powered placement coaching platform built with the MERN stack.

## Tech Stack

- **MongoDB** — User data & dashboard info
- **Express.js** — REST API with JWT authentication
- **React** — Frontend with Vite & Tailwind CSS
- **Node.js** — Backend runtime

## Prerequisites

- Node.js 18+
- MongoDB running locally (or update `MONGODB_URI` in `backend/.env`)

## Setup

```bash
# Install all dependencies
npm run install:all

# Start both backend (port 5000) and frontend (port 5173)
npm run dev
```

Or run separately:

```bash
# Terminal 1 — Backend
cd backend && npm install && npm run dev

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | User login |
| `/signup` | User registration |
| `/dashboard` | Protected user dashboard |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (requires JWT) |

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and update as needed:

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/careerpilot
JWT_SECRET=your_secret_key
```
