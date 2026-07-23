# CS-Properties: Premium Real Estate Platform

An enterprise-grade real estate listings catalog and lead ingestion system designed for high-end properties, luxury villas, and commercial real estate. The project is split into a client-facing catalog app and a real estate CRM dashboard.

---

## 🏛 Project Architecture & Structure

```
CS-Properties/
├── app/                      # Next.js App Router (CRM Dashboard)
│   ├── api/                  # Auth session endpoints
│   ├── dashboard/            # Lead Kanban and Property Catalog views
│   └── properties/           # Public read-only listing pages
├── components/               # Next.js UI elements
├── dataconnect/              # Firebase SQL Connect (PostgreSQL Database)
│   ├── schema/               # Database definitions (schema.gql)
│   └── connector/            # GraphQL operations (queries, mutations)
├── frontend/                 # Vite + React Client Showcase App
│   ├── src/
│   │   ├── components/       # Modular presentation components
│   │   ├── config/           # Firebase client initialization
│   │   ├── context/          # React Auth, Filter & Property contexts
│   │   ├── hooks/            # Custom React hooks (useProperties)
│   │   └── pages/            # Home, Properties Catalog, Admin views
│   └── public/               # Asset folders
├── functions/                # Firebase Cloud Functions (v2, TypeScript)
│   ├── src/auth/             # Auth sync triggers (onUserCreated)
│   └── src/leads/            # Webhook lead ingestion endpoints
├── lib/                      # Core backend utilities (auth, leads, storage)
├── storage.rules             # Role-based Cloud Storage security rules
└── README.md                 # Project documentation
```

---

## ⚙️ Prerequisites & Node.js Version

- **Node.js**: `v20.x` or later (Active LTS recommended).
- **Package Manager**: `npm` (v10.x or later).
- **Firebase CLI**: Install globally via `npm install -g firebase-tools`.
- **Java Runtime Environment (JRE)**: Version 11 or higher (required for Firebase Local Emulators).

---

## 🛠️ Local Environment Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/AngadParab/CS-Properties.git
   cd CS-Properties
   ```

2. **Backend & Next.js CRM Setup**:
   * Create a `.env.local` file in the root directory:
     ```env
     NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
     FIREBASE_WEBHOOK_SECRET=your_webhook_secure_secret
     ```
   * Install root dependencies:
     ```bash
     npm install
     ```

3. **Frontend Client Setup**:
   * Navigate to the `frontend/` folder:
     ```bash
     cd frontend
     ```
   * Copy the environment template:
     ```bash
     cp .env.example .env.local
     ```
   * Fill out the Firebase API credentials inside `frontend/.env.local`.
   * Install frontend dependencies:
     ```bash
     npm install
     ```

---

## 🏃 Available Scripts

### Next.js CRM Root Project
* Run development server: `npm run dev`
* Compile production bundle: `npm run build`
* Run Next.js server: `npm run start`

### Vite Frontend App (`/frontend`)
* Run development server: `npm run dev`
* Compile production build: `npm run build`
* Preview production build locally: `npm run preview`

---

## 🚀 Deployment Overview

### Frontend Deploy
The client showcase application is deployed to Firebase Hosting:
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### Backend & Cloud Functions Deploy
Functions, Storage Rules, and Data Connect connectors are deployed from the root directory:
```bash
firebase deploy --only functions,storage,dataconnect
```

---

## 🤝 Git Workflow & Conventional Commits

We follow the **Conventional Commits** specification for commit messages and structured branch naming rules.

### Branch Naming Conventions
- **Feature Branches**: `feature/your-feature-name` (e.g., `feature/property-filters`)
- **Fix Branches**: `fix/bug-description` (e.g., `fix/mobile-modal`)
- **Refactoring Branches**: `refactor/component-name` (e.g., `refactor/use-properties-hook`)

### Commit Message Syntax
Format: `<type>(<scope>): <short description>`

*   `feat`: A new feature (e.g., `feat(auth): add role custom claim synchronization`)
*   `fix`: A bug fix (e.g., `fix(search): resolve cumulative layout shifts in grid`)
*   `refactor`: Code changes that neither fix a bug nor add a feature (e.g., `refactor(list): extract modular PropertyCard component`)
*   `docs`: Documentation updates (e.g., `docs(readme): update environment variable guide`)
*   `chore`: Maintain tasks or build config modifications (e.g., `chore: update tailwind dependency`)
