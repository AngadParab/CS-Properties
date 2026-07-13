# System Architecture & Tech Stack
## Credit Solutions Goa - Full Stack Website

### 1. Technology Stack
For this college project, we will use the **MERN Stack**, which provides a robust, modern, and easily explainable architecture for full-stack applications.

*   **Frontend (Client-Side):**
    *   **Framework:** React.js (initialized via Vite for speed).
    *   **Styling:** Tailwind CSS (for rapid, responsive UI development).
    *   **Routing:** React Router DOM.
    *   **State Management:** React Context API (or Redux Toolkit if state becomes complex).
    *   **Icons & Components:** Lucide React, Radix UI (or standard HTML/CSS).
*   **Backend (Server-Side):**
    *   **Runtime/Framework:** Node.js with Express.js.
    *   **Authentication:** JSON Web Tokens (JWT) & bcrypt (for secure admin login).
    *   **File Handling:** Multer (for handling KYC document uploads/property images).
*   **Database:**
    *   **DBMS:** MongoDB (NoSQL).
    *   **ODM:** Mongoose (for schema modeling and data validation).

### 2. Application Flow
1.  **Public User Flow:**
    *   User navigates to the landing page.
    *   User interacts with frontend components (e.g., clicks on "Business Loans", uses the EMI Calculator).
    *   User fills out the "Apply Now" form.
    *   Frontend sends a `POST` request to the Backend API.
    *   Backend validates data, stores the lead in MongoDB, and sends a success response.
    *   Frontend displays a confirmation message.
2.  **Admin User Flow:**
    *   Admin navigates to `/admin-login`.
    *   Admin inputs credentials -> Backend verifies with bcrypt -> Returns JWT.
    *   Admin accesses the protected `/dashboard` route.
    *   Frontend fetches leads and listings via authenticated `GET` requests (JWT in header).
    *   Admin can update lead statuses or add/delete property listings (`PUT`/`DELETE` requests to MongoDB).

### 3. High-Level Directory Structure
We will use a standard monorepo-style structure, keeping the frontend and backend in separate folders within the root project directory.

```text
credit-solutions-goa/
│
├── backend/                  # Node.js & Express Server
│   ├── src/
│   │   ├── config/           # Database connection and env configurations
│   │   ├── controllers/      # Route logic (e.g., leadController.js, authController.js)
│   │   ├── middlewares/      # Custom middleware (e.g., verifyToken, errorHandler)
│   │   ├── models/           # Mongoose schemas (e.g., Lead.js, User.js, Listing.js)
│   │   ├── routes/           # API route definitions (e.g., leadRoutes.js)
│   │   └── utils/            # Helper functions (e.g., emiCalculator.js)
│   ├── .env                  # Backend environment variables
│   ├── server.js             # Entry point for the backend application
│   └── package.json
│
├── frontend/                 # React UI Application
│   ├── public/               # Static assets (images, icons)
│   ├── src/
│   │   ├── assets/           # Local assets
│   │   ├── components/       # Reusable UI components (Navbar, Footer, Button, Calculator)
│   │   ├── context/          # React Context (AuthContext)
│   │   ├── hooks/            # Custom React hooks (useFetch, etc.)
│   │   ├── pages/            # Page-level components (Home, Services, Contact, AdminDashboard)
│   │   ├── services/         # API integration files (axios/fetch calls to backend)
│   │   ├── App.jsx           # Main React component and Route setup
│   │   └── main.jsx          # React DOM rendering
│   ├── .env                  # Frontend environment variables (VITE_API_URL)
│   ├── tailwind.config.js    # Tailwind configuration
│   └── package.json
│
└── README.md                 # Project documentation
```
