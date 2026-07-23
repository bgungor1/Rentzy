# Project Overview
Name: Rentzy (Premium 3D Car Showroom & Rental Platform)
Description: A high-end, interactive web experience showcasing an exclusive collection of premium car models. The platform features cinematic 3D rendering and is built on a scalable `pnpm` monorepo architecture, strictly separating the Next.js presentation layer from the NestJS business logic layer.

# Core Tech Stack (Monorepo)
- **Workspace:** `pnpm-workspace`
- **Frontend (`apps/frontend`):** Next.js (App Router), Tailwind CSS, R3F (React Three Fiber), Three.js, GSAP, Zustand.
- **Backend (`apps/backend`):** NestJS, Prisma (PostgreSQL/Supabase), Passport.js (JWT), class-validator/Zod, Helmet, Throttler.
- **Testing:** Vitest/Jest (Unit/Integration), Playwright (E2E).

# AI Coding Guidelines & Rules

## 1. Monorepo Architectural Paradigm & Separation of Concerns (SoC)
- **Absolute Separation:** The architecture strictly enforces Separation of Concerns. The `apps/frontend` directory is exclusively a Presentation and State Layer. The `apps/backend` directory is exclusively a Logic, Security, Validation, and Data Access Layer. They must NEVER bleed into each other's domain.
- **Frontend is a DUMB Layer:** UI components MUST NOT contain business logic, data mutation formulas, raw API formatting, or security checks. They exist solely to consume REST APIs, update Zustand state, and trigger GSAP/R3F renders.
- **Backend is the BRAIN & FORTRESS:** NestJS controls all single points of truth. Authentication, RBAC authorization, validation, race-condition checks, pricing algorithms, and DB transactions are strictly isolated here.
- **Environment Variables:** Maintain strict isolation. Frontend uses `apps/frontend/.env.local` (only `NEXT_PUBLIC_` vars). Backend uses `apps/backend/.env` (contains `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, etc.).

## 2. Engineering Principles (SOLID, KISS, DRY)
- **Single Responsibility Principle (SRP):** Every function, class, and component must have exactly one reason to change. 
  - *NestJS:* A service handling car retrieval must not also handle payment processing or JWT signing.
  - *Next.js:* A React component rendering a 3D car model should not also manage the rental form state or API call retries.
- **Dependency Inversion & Open/Closed:** Use NestJS Dependency Injection correctly. Write modular services that are open for extension (e.g., adding a new payment gateway or discount provider) but closed for modification.
- **DRY (Don't Repeat Yourself):** Never duplicate logic.
  - Extract repetitive UI patterns into shared Tailwind components.
  - Extract repetitive backend logic (e.g., date-overlap math, price multipliers) into shared `/utils` or distinct helper services.
  - Share DTO interfaces/types between frontend and backend wherever possible to maintain a single source of truth for API contracts.
- **KISS (Keep It Simple, Stupid):** Avoid over-engineering. Do not create convoluted abstractions if a simple, readable service function does the job. Prioritize code readability and security over clever syntax.

## 3. Backend Architecture & Security (NestJS & Prisma)
- **Layered Structure (Strict):** 
  - **Controllers:** Act strictly as HTTP endpoints. They receive requests, validate payloads via DTOs, enforce Auth Guards, and delegate work to Services. NEVER write business logic, raw SQL, or Prisma queries in a Controller.
  - **Services:** Carry the operational workload. All Prisma DB interactions, date-overlap calculations, and pricing computations MUST be encapsulated here.
- **Prisma Location:** The Prisma schema and migrations reside strictly in `apps/backend/prisma/`.
- **Validation & DTOs:** EVERY incoming request MUST be validated using NestJS `ValidationPipe` with `class-validator` (or Zod) DTOs (`whitelist: true`, `forbidNonWhitelisted: true`) before any processing occurs.
- **Authentication & Guards:** Secure all non-public endpoints with NestJS `Guards` (e.g., `@UseGuards(JwtAuthGuard, RolesGuard)`). Utilize custom decorators (`@CurrentUser()`, `@Roles()`) for role-based access control (RBAC).
- **Security Hardening:**
  - **Rate Limiting:** Protect APIs against DDoS and brute-force attacks using `@nestjs/throttler`.
  - **CORS & Helmet:** Enable `Helmet` for secure HTTP headers and restrict `CORS` origins strictly to the frontend URL.
  - **Global Exception Filters:** Use NestJS `ExceptionFilter` to sanitize internal errors (DB stack traces, raw error codes) before sending client responses.
- **Transactions & Race Condition Prevention (ACID):**
  - For reservation creation, ALWAYS use Prisma Interactive Transactions (`prisma.$transaction`).
  - Perform strict date-overlap checks (`startDate` < `existingEndDate` AND `endDate` > `existingStartDate`) **inside the transaction block** or leverage row-level locking (`Pessimistic Locking`) to prevent double-booking (Race Conditions) during concurrent user requests.

## 4. Car Rental Business Logic
- **Price Calculation:** NEVER calculate total prices on the frontend. The frontend sends `carId`, `startDate`, and `endDate`; the NestJS service fetches the base car price, computes duration, applies seasonal/variant multipliers server-side, and returns the final calculated amount.
- **Availability Matrix:** The NestJS API pre-calculates and returns a list of "booked date ranges" for a specific car variant so the frontend date picker can disable unavailable dates efficiently.

## 5. 3D & WebGL Performance (Frontend)
- **Asset Loading:** ALL `.glb` models MUST be loaded dynamically (`next/dynamic` / React `Suspense`). Do not block the main thread. Use `useGLTF.preload()` for background fetching of Draco-compressed 3D assets.
- **Canvas Constraints:** Keep the R3F `<Canvas>` high up in the DOM tree. Avoid re-mounting. Use `dpr={[1, 2]}` for crisp visuals without sacrificing mobile GPU performance.
- **Lighting & Shadows:** Prioritize `@react-three/drei`'s `<Stage>` and `<ContactShadows>` for cinematic lighting over unoptimized raw Three.js lights.
- **Render Loop Optimization:** Do NOT put React state updates (`setState`) inside R3F `useFrame`. Use direct ref mutations for frame-by-frame WebGL animations to maintain 60+ FPS.

## 6. Animation & Global State (Frontend)
- **GSAP Integration:** ALWAYS use `@gsap/react`'s `useGSAP()` hook inside React components to ensure proper cleanup and prevent memory leaks. Trigger `ScrollTrigger.refresh()` alongside Next.js route changes.
- **Zustand:** Store ONLY UI-specific state (e.g., `selectedColor`, `rentalStep`, `isCartOpen`) in Zustand. Do NOT store server entity data in Zustand if it can be fetched directly from the NestJS API via SWR, React Query, or React Server Components.
- **Glassmorphism UI:** Utilize Tailwind CSS for Glassmorphism (backdrop-blur, translucent borders) for UI panels overlaid on top of the 3D Canvas.

## 7. Code Style & TypeScript Standards
- Use strict TypeScript interfaces/types across both apps. Avoid `any`.
- Keep complex NestJS services modular; use dependency injection properly.
- Return standardized API response shapes (e.g., `{ success: true, data: ..., timestamp: ... }`).

## 8. Testing Strategy
- **Backend:** Prioritize testing NestJS Services, Prisma logic, pricing math, Guards, and DTO validations. Mock the Prisma client (`vitest-mock-extended` / `jest-mock-extended`) in unit tests.
- **Frontend 3D Constraints:** DO NOT attempt to visually snapshot or test the Three.js `<Canvas>` directly. Test the Zustand state and React props feeding the 3D components instead.
- **E2E Critical Path:** Write Playwright tests ONLY for the core rental flow across the entire stack (Selection -> Date Picking -> Auth -> Booking -> Confirmation).