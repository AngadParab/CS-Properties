# Development Phases
## Credit Solutions Goa - Full Stack Project

To ensure a smooth workflow for this college assignment, the project is divided into 6 manageable phases.

### Phase 1: Project Setup & Initialization (Days 1-2)
*   **Repository Setup:** Initialize Git and create the `frontend` and `backend` directories.
*   **Frontend Init:** Set up React using Vite, install Tailwind CSS, React Router, and Lucide Icons.
*   **Backend Init:** Set up Node.js with Express, install necessary packages (mongoose, dotenv, cors, express).
*   **Database:** Create a MongoDB Atlas cluster and connect the backend.

### Phase 2: Frontend UI & Static Pages (Days 3-5)
*   **Base Layout:** Build the reusable `Navbar` and `Footer`. Set up React Router for navigation.
*   **Landing Page:** Build the Hero section, "3-Step Pipeline" section, and Services overview.
*   **Service Pages:** Create individual pages for Business Loans, Personal Loans, Mortgages, etc.
*   **Interactive Tools:** Build the static UI for the EMI Calculator.

### Phase 3: Backend APIs & Database Models (Days 6-8)
*   **Models:** Create Mongoose schemas for `Lead` (inquiries/applications) and `User` (admin accounts).
*   **Routes & Controllers:** 
    *   `POST /api/leads` - Endpoint to receive form submissions.
    *   `POST /api/auth/login` - Endpoint for admin login.
    *   `GET /api/leads` - Protected endpoint to fetch leads.
*   **Middleware:** Implement error handling and JWT verification.

### Phase 4: Integration & State Management (Days 9-11)
*   **API Connection:** Use `fetch` or `axios` in React to connect forms to the backend.
*   **Form Logic:** Implement frontend validation and submit "Apply Now" data to the `POST /api/leads` endpoint.
*   **Calculator Logic:** Write the JavaScript math to make the EMI calculator functional.

### Phase 5: Admin Dashboard & Authentication (Days 12-14)
*   **Auth State:** Implement an `AuthContext` in React to manage the admin's logged-in state.
*   **Admin UI:** Build a protected route `/admin` that displays a table of incoming leads.
*   **Lead Management:** Add functionality for the admin to update lead statuses (e.g., from "Pending" to "Contacted").

### Phase 6: Polish, Testing & Deployment (Days 15+)
*   **Testing:** Test all forms, routing, responsive design on mobile, and API edge cases.
*   **Optimization:** Ensure images are compressed and meta tags are set for SEO.
*   **Deployment:** 
    *   Deploy the Backend to Render or Railway.
    *   Deploy the Frontend to Vercel or Netlify.
