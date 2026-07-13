# Project Memory / Status Tracker

## Currently Active Phase
- **Phase 6: Polish, Testing & Deployment**

## Roadmap Status
- [x] Phase 1: Project Setup & Initialization
- [x] Phase 2: Frontend UI & Static Pages
- [x] Phase 3: Backend APIs & Database Models
- [x] Phase 4: Integration & State Management
- [x] Phase 5: Admin Dashboard & Authentication
- [ ] Phase 6: Polish, Testing & Deployment (Active)

---

## Log & Decisions

### 2026-07-13: Project Setup Initialized
- Scaffolded workspace into `backend/` and `frontend/` folders.
- Initialized Express backend with modular architecture folders (`config`, `controllers`, `middlewares`, `models`, `routes`, `utils`).
- Initialized React frontend with Vite & Tailwind CSS.

### 2026-07-13: Phase 2 Completed
- Created Navbar and Footer reusable components.
- Developed Home landing page with metrics, Hero, and pipeline.
- Implemented interactive tabbed Services catalog page.
- Created search/filter listings pages for Properties and Wheels.
- Coded interactive EMI Calculator page with dynamic calculations and SVG-based pie chart.
- Developed multi-step Apply Now application form reading URL params.
- Verified all flows via interactive browser subagent testing.

### 2026-07-13: Phase 3 Completed
- Created User and Lead database schemas using Mongoose.
- Developed authController managing login checks and generating JWT token profiles.
- Implemented leadController supporting public lead insertions and protected listings.
- Created authMiddleware validating header Bearer tokens.
- Bound endpoints to routers and mounted routes on Express backend.
- Coded in-memory offline fallbacks in case database connection is offline.
- Verified endpoints (POST lead, login user, GET leads list, PUT status update) using REST test calls.

### 2026-07-13: Phase 4 Completed
- Configured frontend `.env` specifying the backend base URL.
- Implemented `api.js` client service wrapping fetch request helpers for auth and lead operations.
- Connected the multi-step `ApplyNow` form to submit inquiries to backend routes.
- Connected the `Contact` form to format feedback questions and submit as leads.
- Verified end-to-end form-to-api integration using the browser subagent, confirming new leads are successfully registered on the server.

### 2026-07-13: Phase 5 Completed
- Developed `AuthContext` to manage admin login state and save JWT tokens in `localStorage`.
- Created `ProtectedRoute` to shield administrative routes from unauthorized access.
- Wrapped the React rendering tree in the `AuthProvider` within `main.jsx`.
- Developed `AdminLogin` form checking validations and handling redirections.
- Built `AdminDashboard` containing lead overview cards, tabular CRM listings, inline status change selectors, and row details expanders.
- Verified route guards, login triggers, table updates, and sign-outs using interactive browser tests.

### 2026-07-13: Backend Shipped to Firebase
- Shifted the backend from custom Node.js Express server to a clientless serverless model using Firebase client SDK.
- Configured environment settings, initialized Firebase services in `firebase.js`, and rewrote the API service layer.
- Integrated AuthContext state observer with Firebase Authentication and updated forms to record entries directly into Cloud Firestore.
- Removed the legacy `backend/` directory from the workspace.

