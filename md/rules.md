# Coding Guidelines and Rules
## Credit Solutions Goa - Full Stack Project

### 1. What to Do (Best Practices)
*   **Modular Code:** Keep React components small and focused on a single responsibility.
*   **Consistent Naming:** Use `PascalCase` for React components (e.g., `EmiCalculator.jsx`) and `camelCase` for variables and functions.
*   **Environment Variables:** Always use `.env` files for sensitive data (Database URI, JWT Secrets, API URLs). Never hardcode these.
*   **Input Validation:** Always validate user input on both the frontend (for UX) and the backend (for security) using tools like Mongoose schemas or explicit checks.
*   **Responsive Design:** Design mobile-first using Tailwind CSS utility classes. Ensure the site looks good on phones, tablets, and desktops.

### 2. What to Avoid (Anti-Patterns)
*   **Direct DOM Manipulation:** Do not use `document.getElementById` or similar methods in React; rely on state and refs instead.
*   **Unnecessary Dependencies:** Avoid adding heavy libraries (like Lodash or jQuery) if native JavaScript methods can do the job.
*   **Committing Secrets:** Never commit `.env` files or node_modules to version control (ensure they are in `.gitignore`).
*   **Callback Hell:** Avoid deeply nested callbacks in Node.js; use `async/await` and Promises.

### 3. Error Handling
*   **Backend:** 
    *   Implement a global error handling middleware in Express to catch unhandled exceptions.
    *   Use `try...catch` blocks in all asynchronous route controllers.
    *   Always return appropriate HTTP status codes (400 for bad request, 401 for unauthorized, 404 for not found, 500 for server error).
*   **Frontend:**
    *   Display user-friendly error messages (e.g., toast notifications) when an API call fails.
    *   Do not expose raw backend error traces or stack details to the user.

### 4. Permitted Libraries & Tech
*   **Frontend:** React (Vite), Tailwind CSS, React Router DOM, Axios/Fetch, Lucide React (icons).
*   **Backend:** Node.js, Express, Mongoose, bcryptjs, jsonwebtoken, cors, dotenv.
*   *Avoid introducing new technologies outside this stack unless strictly necessary for a specific feature.*

### 5. Boundaries & Instructions for AI Generation
*   **Complete Files:** When generating code for this project, provide the complete, runnable code for the requested file. Avoid omitting critical imports or boilerplate.
*   **No Placeholders for Logic:** Implement the actual logic (e.g., the EMI calculation math) rather than leaving `// TODO` comments, unless the logic requires external paid APIs.
*   **Clear File Paths:** Always indicate the exact directory and filename (e.g., `frontend/src/components/Navbar.jsx`) before outputting the code block.
*   **Keep it Secure:** AI should automatically hash passwords before database insertion and sanitize inputs in the generated code.
