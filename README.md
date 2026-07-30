# 🏎️ Rentzy - Premium 3D Car Showroom & Rental Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io/)

Rentzy is a modern full-stack rental platform featuring an interactive 3D WebGL showroom, dynamic supercar customization, and reservation management. Built within a clean `pnpm` monorepo architecture, it strictly isolates the Next.js presentation layer from the NestJS business logic and database operations.

---

## 🏗 Architecture & Tech Stack

The workspace is organized as a **pnpm monorepo** containing two main applications:

### 🎨 Frontend (`apps/frontend`)
* **Framework:** Next.js 16 (App Router)
* **3D Engine:** Three.js, React Three Fiber (R3F), `@react-three/drei`
* **Styling:** Tailwind CSS (Glassmorphism Dark Aesthetics)
* **Form & Validation:** React Hook Form & Zod
* **State & Server Actions:** Next.js Server Actions & HTTP-only JWT Cookie Session Management

### ⚙️ Backend (`apps/backend`)
* **Framework:** NestJS (Modular Architecture)
* **Database & ORM:** PostgreSQL & Prisma ORM
* **Authentication:** JWT (JSON Web Tokens) with Passport strategy & HTTP-only Cookies
* **Validation & Security:** `class-validator`, Zod schemas, CORS, Rate Limiting

---

## ✨ Key Features

* **3D Showroom & Garage:** Interactive WebGL 3D car viewer (`CarShowcase`) supporting real-time material paint customization, engine sound simulation, camera orbit controls, and variant previews.
* **Supercar Fleet Catalog:** Brand filtering (Ferrari, BMW M, Mercedes-AMG, Porsche), responsive car cards (`CarCard`), and brand carousel section (`BrandScrollSection`).
* **Dynamic Car Detail & Rental:** Dedicated supercar detail pages (`/cars/[id]`) displaying engine specs, performance metrics (HP, 0-100 acceleration, top speed), and instant rental actions.
* **Overlapping Reservation Logic:** Backend validation engine that prevents duplicate or overlapping booking dates for car variants using date range queries.
* **Authentication Flow:** User registration and login flows (`/login`, `/register`) using React Hook Form, Zod validation, and secure JWT session management.
* **Unified DRY Layout:** Global Next.js App Router root layout managing shared `Navbar` and `Footer` components across all application routes.

---

## 📂 Project Structure

```text
Rentzy/
├── apps/
│   ├── frontend/                 # Next.js Web Application
│   │   ├── src/
│   │   │   ├── actions/          # Server actions (Auth & Rental)
│   │   │   ├── app/              # Next.js App Router pages & layout
│   │   │   ├── components/       # Shared UI, 3D Showcase & Navbar/Footer
│   │   │   ├── constants/        # Car models & showcase mock metadata
│   │   │   └── validations/      # Zod validation schemas
│   └── backend/                  # NestJS REST API
│       ├── prisma/               # Schema & DB Migrations
│       └── src/
│           ├── auth/             # Auth module, JWT strategies & guards
│           ├── cars/             # Car catalog & brand controllers/services
│           ├── reservations/     # Overlap-safe booking logic & queries
│           └── users/            # User account management
├── ai-rules.md                   # Project engineering rules & standards
├── pnpm-workspace.yaml           # Monorepo configuration
└── package.json                  # Root dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18 or higher)
* **pnpm** (v8 or higher)
* **PostgreSQL** database instance (or Supabase / local Postgres)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bgungor1/Rentzy.git
   cd Rentzy
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Environment Setup:**
   Configure environment files for both apps:
   - Copy `apps/backend/.env.example` to `apps/backend/.env` and update `DATABASE_URL` and `JWT_SECRET`.
   - Copy `apps/frontend/.env.local.example` (or create `.env.local`) to configure `NEXT_PUBLIC_API_URL`.

4. **Database Migration & Prisma Client:**
   ```bash
   cd apps/backend
   pnpm exec prisma migrate dev
   cd ../..
   ```

---

## 🏃 Running the Application

You can start both frontend and backend development servers in separate terminals:

**Backend Server (NestJS API on port 4000):**
```bash
cd apps/backend
pnpm run start:dev
```

**Frontend Application (Next.js on port 3000):**
```bash
cd apps/frontend
pnpm run dev
```

---

## 📄 License
This project is licensed under the MIT License.
