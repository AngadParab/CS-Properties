# Product Requirements Document (PRD) 
## Credit Solutions Goa - Full Stack Website Update

### 1. Project Overview & What to Build
The goal of this project is to build a modern, responsive, full-stack web application for **Credit Solutions Goa**. The current website serves as a basic informational portfolio. The new application will transform it into an interactive, high-performance platform that not only showcases their financial services (0% commission loans) but also actively captures leads, provides interactive tools for users, and includes a backend system for admins to manage inquiries and listings.

### 2. Targeted Users
**A. End Users (Clients):**
*   **Individuals:** People in Goa looking for Personal Loans, Home/Mortgage Loans, or Vehicle ("Wheels") financing.
*   **Business Owners:** Local entrepreneurs seeking Working Capital, Expansion Funds, or Equipment Financing.
*   **Property Investors/Buyers:** Users interested in the "Properties" segment for real estate loans or property listings.

**B. Internal Users (Administrators/Agents):**
*   **Financial Advisors/Staff:** Employees of Credit Solutions Goa who need to review client inquiries, process KYC documents, and manage the lending pipeline.
*   **Content Admins:** Staff responsible for updating the "Properties" and "Wheels" portfolio listings.

### 3. Core Features & Requirements

#### Client-Facing Frontend (Public Website)
*   **Modern Landing Page:** High-converting hero section emphasizing "0% Commission" and the network of 30+ banks. 
*   **Service Portfolios:** Dedicated, SEO-friendly pages for:
    *   Business Loans
    *   Mortgage Loans
    *   Loan Against Property
    *   Personal Loans
    *   Properties & Wheels (Dynamic listings)
*   **Interactive Tools:**
    *   **EMI Calculator:** Allow users to estimate their monthly payments based on loan type, amount, and tenure.
    *   **Eligibility Checker:** A quick step-by-step quiz matching users with the best financial product.
*   **Lead Generation & Onboarding:**
    *   "Get a Quote" / "Apply Now" multi-step forms.
    *   Secure Contact page with map integration (Margao office).
*   **Performance & SEO:** Fast load times, mobile-first responsive design, and proper meta tags.

#### Secure Backend & Admin Dashboard
*   **Lead Management System (CRM Lite):** Dashboard to view, filter, and update the status of incoming loan inquiries (e.g., New, Document Pending, Approved, Rejected).
*   **Content Management (CMS):** Interface to add/edit/delete listings for the "Properties" and "Wheels" sections.
*   **Secure File Uploads:** A secure way for clients to submit initial KYC documents (optional phase depending on scope).
*   **Authentication:** Secure login for Admins to access the dashboard (JWT or Session-based).

### 4. Out of Scope (For Now)
*   Direct bank API integrations for live loan approvals (too complex for initial college project; will simulate or use manual status updates).
*   Handling actual monetary transactions or loan disbursements.
