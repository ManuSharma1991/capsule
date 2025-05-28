# Tribunal Case Management System (TCMS) - [Project Codename/Your Name's Project]

This project is a web application designed to manage tribunal cases, hearings, and related data for routine office work. It features a backend API built with Node.js (Express.js) and TypeScript, a frontend built with React and TypeScript, and uses SQLite as its database. The application is designed to be deployed via Docker.

## Table of Contents

- [Tribunal Case Management System (TCMS) - \[Project Codename/Your Name's Project\]](#tribunal-case-management-system-tcms---project-codenameyour-names-project)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Core Features (Phase 1)](#core-features-phase-1)
  - [Technology Stack](#technology-stack)
  - [Project Structure (Monorepo)](#project-structure-monorepo)
  - [Setup and Installation](#setup-and-installation)
    - [Prerequisites](#prerequisites)
    - [Local Development Setup](#local-development-setup)
  - [Running the Application](#running-the-application)
    - [Development Mode](#development-mode)
    - [Production Mode (Docker)](#production-mode-docker)
  - [API Endpoints (Phase 1 Summary)](#api-endpoints-phase-1-summary)
  - [Data Import Strategy](#data-import-strategy)
  - [Deployment Strategy](#deployment-strategy)
  - [Future Enhancements (Post Phase 1)](#future-enhancements-post-phase-1)
  - [License](#license)

## Project Overview

The TCMS aims to streamline the management of legal cases within a tribunal setting. It provides functionalities for tracking case details, scheduling and managing hearings, importing historical data, and generating reports.

This README serves as initial documentation and will be updated as the project progresses.

## Core Features (Phase 1)

*   **User Authentication:** Secure login for authorized personnel.
*   **Case Management:**
    *   Create, Read, Update, Delete (CRUD) operations for cases.
    *   Unique case numbering (e.g., "ITA 123/NAG/2025").
    *   Soft and hard delete options.
    *   Advanced filtering and search capabilities.
*   **Hearing Management:**
    *   Schedule hearings for cases.
    *   View hearings in list and calendar formats.
    *   Update and cancel hearings.
*   **Data Import:**
    *   Two-database model (Staging DB for raw imports, Main DB for clean data).
    *   API endpoints to import case details, hearing details, and status details from files (Excel, text).
    *   Lenient import into Staging DB with `PATCH`-like data accumulation.
    *   UI for reviewing, cleaning, and promoting data from Staging DB to Main DB (batch promotion).
    *   Ability to view original imported raw data for promoted cases.
*   **Lookups:** API endpoints for predefined values (e.g., case types, place codes).
*   **Reporting:** (Initial focus on API structure, specific reports in later phases)
    *   Dedicated `/reports` namespace for complex queries.
    *   Example: `POST /reports/cases-by-criteria` for advanced searches.

## Technology Stack

*   **Backend:**
    *   Node.js
    *   Express.js
    *   TypeScript
    *   SQLite (for both Staging and Main databases)
    *   JWT for authentication
    *   Libraries: `better-sqlite3`, `jsonwebtoken`, `passport`, `cors`, etc.
*   **Frontend:**
    *   React
    *   TypeScript
    *   Vite (build tool)
    *   Libraries: `axios`, `react-router-dom`, (UI library TBD, e.g., Material-UI, Ant Design)
*   **Shared:**
    *   TypeScript for shared types between backend and frontend.
*   **Deployment:**
    *   Docker & Docker Compose
    *   Nginx (as reverse proxy and for serving frontend static files)
    *   GitHub Actions (for CI/CD)
    *   Docker Hub (for image registry)
    *   Portainer (for managing Docker deployments on Raspberry Pi)
*   **Version Control:** Git & GitHub

## Project Structure (Monorepo)

The project uses an npm workspaces monorepo structure:

tcms/
├── package.json # Root package.json for workspaces
├── packages/
│ ├── backend/ # Node.js API
│ ├── frontend/ # React App
│ └── shared-types/ # Shared TypeScript types
├── docker-compose.yml
├── nginx.conf # Example Nginx configuration
└── .gitignore


## Setup and Installation

### Prerequisites

*   Node.js (v18.x or later recommended)
*   npm (v8.x or later recommended, comes with Node.js)
*   Docker & Docker Compose (for production deployment)
*   Git

### Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone [your-repo-url]
    cd tcms
    ```
2.  **Install root dependencies and workspace dependencies:**
    ```bash
    npm install
    ```
    (This should install dependencies for all workspaces: `backend`, `frontend`, `shared-types`)

3.  **Setup Environment Variables:**
    *   Navigate to `packages/backend` and create a `.env` file based on `.env.example` (you'll need to create this example file).
    *   Example `.env` content for backend:
        ```
        NODE_ENV=development
        PORT=3001
        DATABASE_MAIN_PATH=./data/tribunal_main.db
        DATABASE_STAGING_PATH=./data/tribunal_staging.db
        JWT_SECRET=yourSuperSecretAndLongKeyForJWT
        # Add other necessary variables
        ```
    *   Ensure the `./data/` directory exists within `packages/backend/` or adjust paths as needed.

4.  **Initialize Databases (if not done automatically by the app on first run):**
    *   You might need to run initial schema migration scripts for SQLite.
    *   (Details TBD on how migrations are handled)

## Running the Application

### Development Mode

1.  **Start the Backend API:**
    ```bash
    npm run dev:backend
    ```
    (This typically runs `nodemon` or `ts-node-dev` for the backend, listening on `http://localhost:3001` or as configured)

2.  **Start the Frontend Development Server:**
    Open a new terminal:
    ```bash
    npm run dev:frontend
    ```
    (This typically runs Vite dev server, accessible at `http://localhost:5173` or similar, with proxy configured to the backend API)

### Production Mode (Docker)

1.  **Ensure Docker and Docker Compose are installed and running.**
2.  **Build and run the Docker containers:**
    From the project root directory:
    ```bash
    docker-compose up --build -d
    ```
3.  The application should be accessible via Nginx (typically on `http://localhost` or your configured domain if deployed).

## API Endpoints (Phase 1 Summary)

*   **Authentication (`/auth`)**
    *   `POST /login`
    *   `POST /logout`
    *   `GET /me`
*   **Cases (`/cases`)**
    *   `GET /` (List, filter, sort, paginate)
    *   `POST /` (Create)
    *   `GET /{case_no_id}` (Read)
    *   `PATCH /{case_no_id}` (Update)
    *   `DELETE /{case_no_id}` (Soft delete)
    *   `POST /{case_no_id}/restore`
    *   `POST /search` (Advanced search)
*   **Bulk Case Operations (`/cases/bulk...`)**
    *   `POST /bulk` (Import)
    *   `PATCH /bulk-edit`
    *   `POST /bulk-delete`
*   **Hearings (`/hearings`, `/cases/{id}/hearings`)**
    *   `POST /cases/{case_no_id}/hearings`
    *   `GET /cases/{case_no_id}/hearings`
    *   `GET /hearings` (Calendar view)
    *   `GET /{hearing_id}`
    *   `PUT /{hearing_id}`
    *   `DELETE /{hearing_id}`
*   **Lookups (`/lookups`)**
    *   `GET /case-types`
    *   `GET /place-codes`
*   **Import & Staging (`/import/*`, `/staging/*`)**
    *   `POST /import/case-details`
    *   `POST /import/hearing-details`
    *   `POST /import/case-status-details`
    *   `GET /staging/cases` (List staging cases for review/promotion)
    *   `GET /staging/cases/{staging_id}`
    *   `PATCH /staging/cases/{staging_id}` (Clean data in staging)
    *   `POST /staging/promote-selected` (Promote to Main DB)
    *   `GET /staging/cases/for-main-case/{main_case_no_id}` (View raw imported data)
*   **Reports (`/reports`)**
    *   `POST /reports/cases-by-criteria`

*(This list is illustrative and should be kept in sync with actual implementation, potentially linking to more detailed API documentation like Swagger/OpenAPI if generated)*

## Data Import Strategy

A two-database model is used:
1.  **Staging Database:** Raw data is imported here from various file formats. Data accumulation uses a `PATCH`-like logic to merge information for the same case ID from different sources.
2.  **Main Database:** Clean, validated data promoted from the Staging DB.

A UI will facilitate reviewing, cleaning, and batch-promoting data from Staging to Main. Original imported data remains in the Staging DB for audit and reference.

## Deployment Strategy

The application is designed to be deployed using Docker Compose.
*   **CI/CD:** GitHub Actions will be used to:
    1.  Build backend and frontend.
    2.  Build Docker images for the backend and the Nginx-served frontend.
    3.  Push images to Docker Hub.
    4.  Trigger a Portainer webhook to pull the new images and redeploy the stack on the target server (Raspberry Pi).
*   **Nginx:** Acts as a reverse proxy, handles SSL (Let's Encrypt), and serves the static frontend assets.
*   **Portainer:** Manages the Docker stack on the deployment server.

## Future Enhancements (Post Phase 1)

*   More comprehensive reporting features.
*   User role management and permissions (RBAC).
*   Detailed audit trails for case modifications.
*   Integration of web scraping (if CAPTCHA challenges can be addressed).
*   Notifications system.

## License

This project is licensed under the **GNU Affero General Public License v3.0**. See the `LICENSE` file for more details.