# Inventory Management API

A modern, scalable RESTful API for inventory management built with Node.js, TypeScript, and Prisma. This project demonstrates advanced design patterns, strict type safety, and a clean, layered architecture.

## 🚀 Key Features

*   **Dynamic Inventory Structure:** Create inventories with customizable fields (text, numbers, booleans) and unique custom ID formats.
*   **Hybrid Authentication:** Support for Email/Password and Social Auth (Google/Facebook) via Passport.js and JWT.
*   **Access Control & Roles:** Role-based access (User/Admin) and granular permissions for specific inventories.
*   **Full-Text Search:** Efficient searching across items and inventories using PostgreSQL's native search capabilities.
*   **Optimistic Locking:** Built-in protection against data conflicts during concurrent updates using versioning.
*   **Advanced ID Generator:** A modular engine for generating unique item identifiers based on complex business rules and formats.

## 🏗 Architecture

The project follows **Clean Architecture** principles and is divided into logical layers to ensure maintainability and testability:

1.  **Routes:** Endpoint definitions and validator binding.
2.  **Validators:** Input validation layer powered by `Joi` and `Celebrate`.
3.  **Controllers:** Handling HTTP requests and orchestrating data flow.
4.  **Services:** Core business logic (Email integration, token generation, ID logic).
5.  **Models (Data Access):** Direct database interaction using Prisma Client.

## 🛠 Tech Stack

*   **Runtime:** Node.js (v18+)
*   **Language:** TypeScript
*   **Framework:** Express.js
*   **ORM:** Prisma (PostgreSQL)
*   **Auth:** Passport.js, JWT, Bcrypt
*   **Validation:** Joi, Celebrate
*   **Logging:** Winston / Morgan

## ⚙️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/lazysl0th/inventory-management-api.git
    cd inventory-management-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory (use `.env.example` as a template):
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/inventory_db"
    JWT_SECRET="your_super_secret_key"
    ```

4.  **Run Database Migrations:**
    ```bash
    npx prisma migrate dev
    ```

5.  **Start the Application:**
    ```bash
    # Development mode
    npm run dev

    # Build and Production start
    npm run build
    npm start
    ```

## 📖 API Documentation (Highlights)

### Auth
*   `POST /signup` — Register a new user.
*   `POST /signin` — Login and receive JWTs (AccessToken/RefreshToken).
*   `GET /refreshAccessToken` — Refresh an expired access token.
*   `GET /signin/google` — Register/Login via Google.
*   `GET /signin/facebook` — Register/Login via Facebook.
*   `GET /signout` — Refresh an expired access token.
*   `POST /resetPassword` — Reset user password.
*   `POST /changePassword` — Change user password.

### Inventories
*   `GET /inventories` — Fetch available inventories.
*   `POST /inventories` — Create a new inventory (JWT Required).
*   `PATCH /inventories/:inventoryId` — Update inventory settings and custom fields.
*   `GET /inventories/search` — Full-text serch.

### Items
*   `GET /inventories/:inventoryId/items` — List items within a specific inventory.
*   `POST /inventories/:inventoryId/items` — Add a new item with dynamic field values.
*   `PUT /inventories/:inventoryId/items/:itemId/like` — Like an item.


### Integrations
*   `GET /integration/cloudinary` — Upload image.
*   `POST /integration/dropbox` — Send support request.
*   `PUT /integration/salesForce` — Integration with Sales Force.

---

## 💎 Why This Project?

This repository goes beyond a basic CRUD application by implementing:
- **Transactional ID Generation:** Uses Prisma's `$transaction` to ensure atomic increments for custom item IDs.
- **Dependency Injection:** A manual DI implementation for better decoupling and easier unit testing.
- **Deep Type Safety:** Extensive use of TypeScript Generics to ensure type safety from the database layer all the way to the API response.
- **Social Integration:** Ready-to-use boilerplate for social provider integration.

## 🤝 Contact

*   **Author:** [lazysl0th](https://github.com/lazysl0th)
*   **GitHub:** [inventory-management-api](https://github.com/lazysl0th/inventory-management-api)