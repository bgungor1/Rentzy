# Project Overview
Name: Premium 3D Car Showroom & Rental Platform
Description: A high-end, interactive web experience showcasing an exclusive collection of 6 premium car models. The platform seamlessly combines cinematic 3D rendering (scrollytelling) with an enterprise-grade, secure, and strictly separated backend for luxury car rental reservations.

# Core Tech Stack
- Frontend: Next.js (App Router), Tailwind CSS, R3F (React Three Fiber), Three.js, @react-three/drei
- Animations: GSAP (Core & ScrollTrigger), @gsap/react
- State Management: Zustand
- Backend: Next.js Server Actions, Route Handlers, Node.js paradigms
- Database & ORM: Prisma (PostgreSQL/MySQL)
- Validation: Zod
- Testing: Vitest, Playwright, React Testing Library

# AI Coding Guidelines & Rules

## 1. Architectural Paradigm (SOLID, KISS, DRY & Separation of Concerns)
- **Frontend is a DUMB Presentation Layer:** React components (`/components`) MUST NOT contain any business logic, price calculations, or data filtering. The UI only exists to display data and dispatch user actions.
- **Backend is the BRAIN:** ALL business logic, mathematical calculations, date validations, and database mutations MUST occur strictly within the backend (Server Actions / APIs).
- **SOLID Principles:** Adhere strictly to Single Responsibility (functions do one thing), Open/Closed, and Dependency Inversion. Keep modules and classes focused and extendable.
- **KISS & DRY:** Keep It Simple, Stupid. Do not over-engineer solutions. Don't Repeat Yourself; extract reusable logic (e.g., date formatting, error handling, math formulas) into shared utility functions.

## 2. Backend Layering: Controller vs. Service Separation
- **Controllers (Server Actions & Route Handlers):** Act strictly as *supervisors* (denetleyiciler) and entry points. Their ONLY responsibilities are:
  1. Receiving incoming client requests.
  2. Validating payloads strictly via Zod schemas.
  3. Delegating the operational workload by calling the appropriate Service Layer function.
  4. Returning a standardized response structure or error code.
  - ⚠️ **CONSTRAINT:** NEVER write database queries, pricing formulas, or complex business logic directly inside Server Actions (`/src/actions`) or Route Handlers (`/src/app/api`).
- **Service Layer (`/src/services`):** Carries the entire operational workload and domain logic. All Prisma DB interactions, date-overlap calculations, race-condition prevention, and pricing computations MUST be encapsulated inside dedicated service files (e.g., `rental.service.ts`, `car.service.ts`, `payment.service.ts`).
- **Repository Pattern (Optional DRY):** If Prisma queries become too repetitive across services, extract the raw database access into `/src/repositories` so services remain focused purely on business rules.

## 3. Backend & Database Architecture (Enterprise Grade)
- **Data Mutation:** Always use Next.js Server Actions for writing/mutating data. Actions must be strictly isolated in the `/src/actions` directory.
- **Zod Validation (Mandatory):** EVERY incoming request to the backend MUST be validated using a Zod schema before any processing or database interaction occurs. Never trust client-side payloads.
- **Database Transactions (ACID):** Creating a reservation involves multiple steps (checking availability, creating record, processing payment state). ALWAYS use `prisma.$transaction` to ensure operations either fully succeed or completely rollback.
- **Race Condition Prevention:** For bookings, utilize pessimistic locking or strictly check for overlapping dates (`startDate` and `endDate`) within the exact moment of the transaction to prevent double-booking.
- **Database Optimization:** Ensure proper Prisma indexing (`@index`, `@unique`) on heavily queried fields like `carId`, `startDate`, and `endDate`.
- **Schema Conventions:** Use PascalCase for Prisma Models (`Car`, `Reservation`, `Variant`) and camelCase for fields (`startDate`, `totalPrice`). Define clear relational data models.

## 4. Car Rental Business Logic (Strict Rules)
- **Price Calculation:** NEVER calculate the total price on the client side. The frontend sends `carId`, `startDate`, and `endDate`; the backend fetches the base price from the DB, calculates the total based on duration and variant multipliers, and returns it.
- **Availability Matrix:** The backend should pre-calculate and return a list of "booked dates" for a specific car variant so the frontend date picker can disable those days efficiently.

## 5. 3D & WebGL Performance (Critical Frontend)
- **Asset Loading:** ALL `.glb` models MUST be loaded dynamically (`next/dynamic` or React `lazy` combined with `Suspense`). Do not block the main thread.
- **Preloading:** Implement `useGLTF.preload()` for background fetching of 3D assets to ensure zero-delay transitions between brand and car detail pages.
- **Canvas Constraints:** Keep the R3F `<Canvas>` as high up in the DOM tree as possible. Avoid re-mounting the Canvas. Use `dpr={[1, 2]}` for crisp visuals without tanking mobile GPU performance.
- **Lighting & Shadows:** Prioritize `@react-three/drei`'s `<Stage>`, `<Environment>`, and `<ContactShadows>` for cinematic, realistic lighting over raw Three.js lights to maintain the premium feel.
- **Render Loop Optimization:** Do NOT put state updates (`setState`) inside R3F `useFrame` unless absolutely necessary, as it triggers re-renders and destroys FPS. Use direct ref mutations for frame-by-frame animations.

## 6. Animation & Scrollytelling (GSAP)
- **Framework Integration:** ALWAYS use `@gsap/react`'s `useGSAP()` hook for animations inside React components to ensure proper garbage collection and prevent memory leaks.
- **ScrollTrigger:** When pinning elements or creating scrollytelling sequences, ensure `ScrollTrigger.refresh()` is handled correctly alongside Next.js route changes.
- **Separation of Concerns:** Do not mix CSS transitions with GSAP on the same elements. GSAP is the single source of truth for complex DOM and R3F animations.

## 7. Global State Management (Zustand)
- Store ONLY UI-specific state (e.g., `isCartOpen`, `selectedColor`, `activeCarId`, `rentalStep`) in Zustand.
- Structure the store modularly. Do NOT store large Three.js objects (like meshes, scenes, or textures) directly in Zustand; store primitive values (strings, hex codes, booleans) and use them to drive R3F components.
- Do NOT store raw server data in Zustand if it can be fetched via React Server Components (RSC) or SWR/React Query.

## 8. UI/UX, Design Language & Error Handling
- **Design Language:** The UI must reflect a "Premium, Luxury, Cinematic" aesthetic. Dark mode by default (`bg-[#050505]` or similar deep blacks).
- **Glassmorphism:** Utilize Glassmorphism (blur, transparent backgrounds, subtle borders) for UI panels (pricing, specs, rental forms) overlaid on top of the 3D Canvas.
- **Responsiveness:** Ensure the 3D Canvas scales perfectly on mobile devices, dynamically adjusting the camera `fov` or `position` based on viewport width.
- **Error Handling:** Return structured error objects from Server Actions (e.g., `{ success: false, error: "Dates unavailable", code: 409 }`). The frontend must gracefully handle these errors with premium, non-intrusive UI feedback (e.g., custom toast notifications, NEVER native browser alerts).

## 9. Directory Structure Strictness
- `/public/models/`: ONLY for optimized, Draco-compressed `.glb` files.
- `/src/app/`: Next.js App Router pages and layouts.
- `/src/actions/`: Controllers for business logic and DB mutations (Next.js Server Actions).
- `/src/services/`: Heavy domain workload, business logic, pricing, and Prisma DB operations.
- `/src/repositories/`: (Optional) Raw Prisma database query abstracts.
- `/src/lib/db.ts`: Prisma client instantiation.
- `/src/lib/validations/`: Zod schemas.
- `/src/lib/utils/`: DRY helper functions (e.g., date calculation, currency formatting).
- `/src/components/Three/`: R3F specific components (Canvas, Car models, Lights, Cameras).
- `/src/components/UI/`: Dumb Tailwind/Next.js DOM elements overlaying the canvas.
- `/src/store/`: Zustand state definitions.
- `/prisma/schema.prisma`: Single source of truth for DB models.

## 10. Code Style & TypeScript Standards
- Write clean, declarative, and highly modular React/Node.js code. Avoid massive single-file components.
- Extract complex Prisma queries into separate utility files or repositories to keep services clean and readable.
- Use strict TypeScript interfaces/types for all API responses, component props, and Zustand stores. Avoid `any`.
- Leave brief, explanatory comments for complex GSAP timelines or Three.js mathematical calculations.

## 11. Testing Strategy
- **Frameworks:** Use `Vitest` for Unit/Integration tests and `Playwright` for E2E tests. Use `React Testing Library` for DOM components.
- **Backend First:** Prioritize testing Next.js Server Actions, Service logic, pricing calculations, and Zod schemas.
- **Mocking:** Always mock the Prisma client (`vitest-mock-extended`) in unit tests to avoid hitting the real database.
- **3D Testing Constraints:** DO NOT attempt to visually snapshot or test the Three.js `<Canvas>` directly. Test the Zustand state and props that feed the 3D components instead.
- **E2E Critical Path:** Write Playwright tests ONLY for the core rental flow (Selection -> Date Picking -> Booking -> Success/Error state).