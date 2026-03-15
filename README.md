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
