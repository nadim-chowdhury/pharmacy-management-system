# Pharmacy Management System (POS)

A responsive Single-Page Application (SPA) point-of-sale solution tailored for pharmacies. This system handles medicine catalogs, shopping carts, customer management, and payment processing with a modern tech stack.

## 🏗️ System Architecture & Data Flow

The application follows a standard 3-tier architecture:

1. **Presentation Layer (Frontend)**:
   - Built with **Angular** and **Tailwind CSS**.
   - Handles the SPA UI, responsive layouts, and state management (e.g., Cart state).
   - Communicates with the backend via RESTful HTTP calls.

2. **Application Layer (Backend)**:
   - Built with **NestJS** (Node.js framework).
   - Exposes a RESTful API.
   - Handles business logic: subtotal calculation validations, stock checks, and payment processing logic.

3. **Data Access & Persistence Layer (Database)**:
   - **PostgreSQL** database managed via **TypeORM**.
   - Ensures ACID compliance for critical transactional data (Orders, Payments, Inventory levels).

**Data Flow Example (Checkout Process):**
`Client (Angular) -> POST /orders (Payload) -> NestJS Controller -> OrderService (Validates Stock/Calculates Totals) -> TypeORM -> PostgreSQL -> response back to Client.`

## 🚀 How to Run the Project

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm

### 1. Backend (NestJS)
1. Navigate to the backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file from the example: `copy .env.example .env` (Windows) or `cp .env.example .env` (Linux/Mac)
4. Update the `.env` file with your PostgreSQL database credentials and a `JWT_SECRET`.
5. Run the application: `npm run start:dev`
   - API will be available at: `http://localhost:5000/api/v1`
   - Swagger Docs: `http://localhost:5000/api/docs`

### 2. Frontend (Angular)
1. Navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Run the application: `npm start`
4. Access the SPA at: `http://localhost:4200`

### 🛠️ Initial Setup (First User)
Since authentication is now active, use the temporary registration endpoint to create your first admin user:
- **POST** `http://localhost:5000/api/v1/auth/register`
- **Body**: `{ "username": "admin", "email": "admin@example.com", "password": "securepassword", "role": "ADMIN" }`

## 📂 File & Folder Structure

This repository is organized as a monorepo containing both the frontend and backend applications.

```text
pharmacy-management-system/
│
├── backend/                   # NestJS RESTful API
│   ├── src/
│   │   ├── modules/           # Feature modules (Medicines, Orders, Customers)
│   │   ├── config/            # Environment and Database configurations
│   │   ├── common/            # Shared guards, interceptors, and filters
│   │   └── main.ts            # Application entry point
│   ├── package.json
│   └── .env.example           # Example backend environment variables
│
├── frontend/                  # Angular SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/          # Singleton services, interceptors, models
│   │   │   ├── shared/        # Reusable UI components (Tailwind)
│   │   │   └── features/      # Lazy-loaded modules (Catalog, Cart, POS)
│   │   ├── environments/      # API configurations
│   │   └── styles.css         # Global Tailwind directives
│   ├── package.json
│   └── tailwind.config.js     # Tailwind design system configuration
│
└── README.md                  # Project documentation (You are here)
```
