# 🏎️ Rentzy - Modern Rent-a-Car Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Three.js](https://img.shields.io/badge/Three.js-black?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

Rentzy is a full-stack, visually driven rent-a-car platform featuring immersive 3D model integration, advanced scroll animations, and a robust role-based architecture. Built within a modern monorepo structure, it ensures end-to-end type safety and scalable development.

---

## 🏗 Architecture & Tech Stack

This project leverages **pnpm workspaces** to manage a monorepo containing both the client and the API architectures, ensuring seamless orchestration between services.

### 🎨 Frontend (`apps/frontend`)
*   **Framework:** [Next.js](https://nextjs.org/) (App Router)
*   **3D Integration:** [Three.js](https://threejs.org/), [React Three Fiber (R3F)](https://docs.pmnd.rs/react-three-fiber), [Drei](https://github.com/pmndrs/drei)
*   **Animations:** [GSAP](https://greensock.com/gsap/) & [ScrollTrigger](https://greensock.com/scrolltrigger/)
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)

### ⚙️ Backend (`apps/backend`)
*   **Framework:** [NestJS](https://nestjs.com/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/)
*   **ORM:** [Prisma](https://www.prisma.io/)
*   **Authentication:** JWT (JSON Web Tokens) with Passport strategy

---

## ✨ Core Features

*   **Scrollytelling & 3D Integration:** Interactive 3D car models integrated seamlessly into the DOM using R3F and animated via GSAP for a high-performance visual experience.
*   **Role-Based Access Control (RBAC):** Secure routing and data access managed by NestJS Guards for distinct user roles (`Admin`, `Company`, `Member`).
*   **End-to-End Type Safety:** Shared TypeScript interfaces and Prisma-generated schemas across the frontend and backend.
*   **Optimized Asset Loading:** Lazy-loaded 3D models and transient state updates via Zustand to maintain 60fps rendering performance.

---

## 📂 Project Structure

```text
rentzy/
├── apps/
│   ├── frontend/       # Next.js web application
│   └── backend/        # NestJS REST API
├── pnpm-workspace.yaml # Monorepo configuration
├── package.json        # Root dependencies and scripts
└── README.md           # Documentation
```

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js** (v18 or higher)
*   **pnpm** (v8 or higher)
*   **PostgreSQL** database

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/rentzy.git
    cd rentzy
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Setup:**
    Navigate to `apps/backend` and copy the `.env.example` to `.env`.
    ```bash
    cp apps/backend/.env.example apps/backend/.env
    ```
    Update the `DATABASE_URL` in `.env` with your PostgreSQL credentials.

4.  **Database Migration:**
    ```bash
    cd apps/backend
    pnpm exec prisma migrate dev
    cd ../..
    ```

### Running the Application

Open two separate terminals to start the development servers:

**Terminal 1 (Backend):**
```bash
cd apps/backend
pnpm run start:dev
```

**Terminal 2 (Frontend):**
```bash
cd apps/frontend
pnpm run dev
```

---

## 🛠 Development Guidelines

*   **Commit Standard:** Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (e.g., `feat:`, `fix:`, `chore:`).
*   **3D Assets:** Ensure all `.glb`/`.gltf` models are **Draco-compressed** before adding them to the `/public` directory to maintain optimal performance.
*   **Code Style:** Strict TypeScript usage is required for both frontend and backend to ensure workspace-wide type integrity.
*   **Linting & Formatting:** Run `pnpm lint` and `pnpm format` to ensure code consistency.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
