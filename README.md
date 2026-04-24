# AI Study Planner — MERN + Three.js + GSAP

A full-stack **AI-powered study planner** that turns a learner's subject, goal, exam date, and daily time budget into a personalized day-by-day study schedule. The interface is built with **React + Three.js + GSAP** for a smooth, immersive 3D experience.

> Stack: **MongoDB · Express · React (Vite) · Node.js**, plus **Three.js**, **GSAP**, **JWT auth**, and an **OpenAI-compatible** AI gateway for plan generation.

---

## ✨ Features

- 🔐 JWT-based auth (register / login / me)
- 🤖 AI plan generation via OpenAI-compatible chat completions with **tool calling** for structured JSON
- 📚 CRUD for study plans, with per-task completion toggles
- 🌌 3D animated background (icosahedron + particles + parallax) using **Three.js**
- 💜 3D **Progress Orb** that shifts color/glow as you complete tasks
- ✨ Page transitions and entrance animations with **GSAP**
- 🛡 Helmet, CORS, rate limiting, Zod validation, central error handler

---

## 📁 Project structure

```
ai-study-planner/
├── backend/
│   ├── config/
│   │   ├── db.js            # MongoDB connection
│   │   └── openai.js        # OpenAI-compatible client
│   ├── controllers/
│   │   ├── ai.controller.js
│   │   ├── auth.controller.js
│   │   └── plan.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   ├── models/
│   │   ├── StudyPlan.js
│   │   └── User.js
│   ├── routes/
│   │   ├── ai.routes.js
│   │   ├── auth.routes.js
│   │   └── plan.routes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/      # Navbar, ProtectedRoute
    │   ├── lib/             # api.js (axios), auth.js (zustand)
    │   ├── pages/           # Home, Login, Register, Dashboard, NewPlan, PlanDetail
    │   ├── three/           # ThreeBackground, ProgressOrb (Three.js + GSAP)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── styles.css
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── .env.example
```

---

## ✅ Prerequisites

- **Node.js 18+** and **npm**
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string
- An **OpenAI-compatible API key** (OpenAI, OpenRouter, Groq, Together, etc.)

---

## ⚙️ Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGO_URI, JWT_SECRET, OPENAI_API_KEY (and OPENAI_BASE_URL/OPENAI_MODEL if needed)

npm install
npm run dev      # http://localhost:5000  (with nodemon)
# or
npm start
```

### Backend dependencies (installed automatically by `npm install`)

Runtime: `express`, `mongoose`, `cors`, `helmet`, `morgan`, `dotenv`, `jsonwebtoken`, `bcryptjs`, `express-rate-limit`, `zod`, `openai`
Dev: `nodemon`

### Backend environment variables

| Var | Purpose |
|---|---|
| `PORT` | Server port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string for signing JWTs |
| `JWT_EXPIRES_IN` | e.g. `7d` |
| `CLIENT_ORIGIN` | Allowed CORS origin (e.g. `http://localhost:5173`) |
| `OPENAI_API_KEY` | API key for the AI provider |
| `OPENAI_BASE_URL` | Defaults to `https://api.openai.com/v1`. Override for OpenRouter/Groq/etc. |
| `OPENAI_MODEL` | e.g. `gpt-4o-mini` |

---

## 🎨 Frontend setup

```bash
cd frontend
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api

npm install
npm run dev                # http://localhost:5173
```

### Frontend dependencies (installed automatically by `npm install`)

Runtime: `react`, `react-dom`, `react-router-dom`, `axios`, `zustand`, `three`, `gsap`
Dev: `vite`, `@vitejs/plugin-react`, `@types/three`

---

## 🚀 Run both apps

In two terminals:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

Open <http://localhost:5173>, register an account, then create a plan from **New plan**.

---

## 🔌 API reference

Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register` — `{ name, email, password }` → `{ token, user }`
- `POST /auth/login` — `{ email, password }` → `{ token, user }`
- `GET  /auth/me` — *(Bearer)* current user

### Plans (all require `Authorization: Bearer <token>`)
- `GET    /plans` — list user's plans
- `POST   /plans` — create plan manually
- `GET    /plans/:id` — get plan
- `PUT    /plans/:id` — update plan
- `DELETE /plans/:id` — delete plan
- `PATCH  /plans/:id/tasks/:taskId/toggle` — toggle a task's completion

### AI
- `POST /ai/generate-plan` — *(Bearer)* `{ subject, goal, examDate?, hoursPerDay?, level?, save? }`
  Uses OpenAI tool-calling to return a structured plan and (by default) saves it.

---

## 🧠 How the 3D UI works

- `src/three/ThreeBackground.jsx` — full-screen Three.js scene with a wireframe icosahedron, a particle field, mouse-driven parallax, GSAP entrance, and scroll-linked rotation.
- `src/three/ProgressOrb.jsx` — animated emissive orb whose hue, glow, and ring rotation are driven by the plan's completion ratio. GSAP animates the value smoothly when tasks are toggled.
- Page transitions and section reveals use **GSAP timelines**.

---

## 🛡 Production notes

- Set strong `JWT_SECRET` and a real `MONGO_URI`.
- Tighten `CLIENT_ORIGIN` to your deployed frontend URL.
- Build the frontend with `npm run build` and serve `dist/` from any static host (Vercel, Netlify, Nginx, etc.).
- Deploy the backend to Render, Railway, Fly.io, a VPS, etc.
- Consider adding refresh tokens, email verification, and per-user AI rate limits if you push this further.

---

## 📜 License

MIT — do whatever you want, attribution appreciated.
