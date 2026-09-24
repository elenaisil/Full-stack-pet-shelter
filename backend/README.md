# ADOPT Pet Shelter — Backend API

A RESTful API for the **ADOPT Pet Shelter** platform, built with **Node.js** and **Express.js**. It manages pets, shelters, adopters, and adoption records, with JWT-based authentication and role-based access control.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Folder Breakdown](#folder-breakdown)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Project Flow](#project-flow)

---

## Tech Stack

| Layer            | Technology                            |
| ---------------- | ------------------------------------- |
| Runtime          | Node.js                               |
| Framework        | Express.js v5                         |
| Database         | PostgreSQL (via `pg` connection pool) |
| Authentication   | JSON Web Tokens (JWT)                 |
| Password Hashing | bcrypt                                |
| API Docs         | Swagger UI (OpenAPI 3.0)              |
| Config           | dotenv                                |

---

## Project Structure

```
backend/
├── config/
│   └── db.js
├── controller/
│   ├── AdopterController.js
│   ├── AdoptionController.js
│   ├── PetController.js
│   └── ShelterController.js
├── middleware/
│   ├── auth.js
│   └── isAdmin.js
├── model/
│   ├── Adopter.js
│   ├── Adoption.js
│   ├── Pet.js
│   └── Shelter.js
├── route/
│   ├── AdopterRoute.js
│   ├── AdoptionRoute.js
│   ├── PetRoute.js
│   └── ShelterRoute.js
├── .env
├── package.json
├── server.js
└── swagger.js
```

---

## Folder Breakdown

### `config/`

> **Purpose:** Centralized database configuration.

- **`db.js`** — Creates and exports a PostgreSQL **connection pool** using the `pg` library. All database credentials (`DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`) are read from the `.env` file. The pool is shared across all models so that the app doesn't open a new DB connection for every query.

---

### `model/`

> **Purpose:** Direct interface with the database. Each file represents one database table and contains **static methods** that execute SQL queries.

- **`Adopter.js`** — Handles all queries for the `adopter` table:
  - `findByEmail(email)` — Used during login to look up a user by email.
  - `create({...})` — Inserts a new adopter (signup), returning their `id`, `name`, and `email`.
  - `findAll()` — Returns all adopters (admin-only view), excluding the password field.
  - `findById(id)` — Fetches a single adopter's profile by their ID.

- **`Pet.js`** — Handles all queries for the `pet` table:
  - `findAll()` — Returns every pet in the database, ordered by ID.
  - `findById(id)` — Fetches a single pet record.
  - `findSpecies()` — Returns a deduplicated list of all species (e.g., Dog, Cat, Bird).
  - `count()` — Returns the total number of pets.
  - `findBySpecies(species)` — Filters pets by species using a case-insensitive search (`ILIKE`).
  - `create({...})` — Inserts a new pet record.
  - `update(id, {...})` — Updates pet details including `adopted` status.
  - `delete(id)` — Permanently removes a pet.
  - `markAsAdopted(id)` — Sets `adopted = true` when an adoption is confirmed.

- **`Shelter.js`** — Handles all queries for the `shelter` table:
  - `findAll()` — Lists all registered shelters.
  - `searchByName(keyword)` — Partial-match search on shelter name.
  - `searchByLocation(location)` — Partial-match search on location field.
  - `create(data)` — Adds a new shelter record.
  - `findById(id)` — Fetches a single shelter.
  - `update(id, {...})` — Updates shelter information.
  - `delete(id)` — Removes a shelter.

- **`Adoption.js`** — Handles all queries for the `adoption` table (the bridge between pets and adopters):
  - `create(pet_id, adopter_id)` — Creates a new adoption record with status `Pending`.
  - `findAllWithDetails()` — Joins `adoption`, `pet`, and `adopter` tables to return human-readable adoption data (names instead of raw IDs).
  - `updateStatus(id, status)` — Updates the adoption status (`Pending`, `Approved`, `Rejected`, `Completed`).
  - `findByAdopterId(adopter_id)` — Returns all adoptions belonging to a specific user.
  - `deletePending(id, adopter_id)` — Allows a user to cancel their own application only if it's still `Pending`.

---

### `controller/`

> **Purpose:** Business logic layer. Controllers receive HTTP requests, call the appropriate model methods, apply any business rules, and send back HTTP responses.

- **`AdopterController.js`** — Handles user registration and login:
  - `signup` — Checks for duplicate emails, hashes the password with `bcrypt`, saves the new user, and returns a success message.
  - `login` — Finds the user by email, compares the hashed password, and issues a signed JWT token (24h expiry) containing the user's `id` and `role`.
  - `getAllAdopters` — Returns all adopters (admin-only).
  - `getAdopterById` — Returns a single adopter's data.

- **`PetController.js`** — Handles all pet-related operations:
  - `getAllPets` — Retrieves and returns the full list of pets.
  - `getPetById` — Retrieves a single pet by ID.
  - `countPet` — Returns the total count of pets.
  - `findPetBySpecies` — Filters pets by species from the URL param.
  - `getAllSpecies` — Returns all unique species.
  - `addPet` — Creates a new pet from the request body.
  - `editPet` — Updates an existing pet record.
  - `deletePet` — Deletes a pet and responds with `204 No Content`.

- **`ShelterController.js`** — Handles all shelter-related operations:
  - `getAllShelter` — Returns the full shelter list.
  - `getShelterById` — Returns a single shelter.
  - `searchShelter` — Searches shelters by name keyword.
  - `searchShelterLocation` — Searches shelters by location keyword.
  - `createShelter` — Creates a new shelter.
  - `updateShelter` — Updates an existing shelter.
  - `deleteShelter` — Deletes a shelter.

- **`AdoptionController.js`** — Handles the full adoption lifecycle:
  - `createAdoption` — Checks that the pet exists and is not already adopted, marks it as adopted, then creates an `Adoption` record with status `Pending`.
  - `getAllAdoptions` — Admin view of all adoptions with pet and adopter names joined in.
  - `getMyAdoptions` — Returns only the current user's adoption applications (scoped by `req.user.id` from the JWT).
  - `updateAdoptionStatus` — Admin can approve or reject an application; if approved, the pet is also marked adopted.
  - `cancelAdoption` — Allows the adopter to cancel their own pending application.

---

### `middleware/`

> **Purpose:** Functions that run between the incoming request and the controller. Used for authentication and authorization guards.

- **`auth.js`** — **JWT Verification Middleware**
  - Reads the `Authorization` header and extracts the Bearer token.
  - Verifies the token against `JWT_SECRET`.
  - On success, attaches the decoded user payload (`id`, `role`) to `req.user` and calls `next()`.
  - On failure (missing or invalid token), responds with `400 Bad Request`.

- **`isAdmin.js`** — **Role-Based Access Control Middleware**
  - Checks `req.user.role === 'admin'` (populated by `auth.js` before it).
  - Allows the request to proceed if the user is an admin; otherwise returns `400 Access Denied`.
  - Must always be used **after** `auth.js` in the route chain.

---

### `route/`

> **Purpose:** Maps HTTP methods and URL paths to the correct controller functions. Also applies the appropriate middleware guards.

- **`AdopterRoute.js`** — Routes under `/api/adopter`
  - `POST /signup` — Public. Register a new adopter.
  - `POST /login` — Public. Login and receive a JWT.
  - `GET /` — Protected (verify + isAdmin). View all adopters.
  - `GET /:id` — Protected (verify). View a specific adopter.

- **`PetRoute.js`** — Routes under `/api/pets`
  - `GET /` — All pets.
  - `GET /count` — Total count.
  - `GET /species/` — All unique species.
  - `GET /species/:species` — Pets filtered by species.
  - `GET /:id` — Single pet.
  - `POST /` — Add a pet.
  - `PUT /:id` — Update a pet.
  - `DELETE /:id` — Delete a pet.

- **`ShelterRoute.js`** — Routes under `/api/shelters`
  - `GET /` — All shelters.
  - `GET /search/name/:keyword` — Search by name.
  - `GET /search/location/:location` — Search by location.
  - `GET /:id` — Single shelter.
  - `POST /` — Add shelter.
  - `PUT /:id` — Update shelter.
  - `DELETE /:id` — Delete shelter.

- **`AdoptionRoute.js`** — Routes under `/api/adoption`
  - `POST /` — Protected (verify). Submit an adoption application.
  - `GET /me` — Protected (verify). View your own applications.
  - `DELETE /:id` — Protected (verify). Cancel your own pending application.
  - `GET /` — Protected (verify + isAdmin). View all adoptions.
  - `PUT /:id/status` — Protected (verify + isAdmin). Approve or reject an application.

---

### Root Files

- **`server.js`** — The entry point of the application. Initializes Express, registers middleware (`express.json()`), mounts all routes, serves the frontend static files, and starts the HTTP server.
- **`swagger.js`** — Configures and generates the OpenAPI 3.0 specification using `swagger-jsdoc`. Defines schemas for all four entities and security scheme (Bearer JWT).
- **`.env`** — Environment configuration file (not committed to Git). Stores DB credentials and JWT secret.
- **`package.json`** — Project metadata and dependency list.

---

## 🗄️ Database Schema

```sql
-- Shelter: A registered pet shelter
CREATE TABLE shelter (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(100) NOT NULL,
    location     VARCHAR(100),
    capacity     INT CHECK (capacity >= 0),
    phone        VARCHAR(20),
    creation_day DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Adopter: A user who can register, login, and adopt pets
CREATE TABLE adopter (
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    email    VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    role     VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    phone    VARCHAR(50),
    address  VARCHAR(255),
    city     VARCHAR(100)
);

-- Pet: An animal available in a shelter
CREATE TABLE pet (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    species    VARCHAR(100),
    age        INT CHECK (age >= 0),
    gender     VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Unknown')),
    adopted    BOOLEAN DEFAULT FALSE,
    shelter_id INT REFERENCES shelter(id) ON DELETE SET NULL
);

-- Adoption: Records which adopter applied for which pet
CREATE TABLE adoption (
    id            BIGSERIAL PRIMARY KEY,
    pet_id        INT NOT NULL REFERENCES pet(id) ON DELETE CASCADE,
    adopter_id    INT NOT NULL REFERENCES adopter(id) ON DELETE CASCADE,
    adoption_date DATE DEFAULT CURRENT_DATE,
    status        VARCHAR(50) DEFAULT 'Pending'
                  CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Completed'))
);
```

> 📎 See `pet.sql` in the root of the repository to set up and seed the database.

---

## 🔗 API Endpoints Summary

| Method | Endpoint                        | Auth       | Description                      |
| ------ | ------------------------------- | ---------- | -------------------------------- |
| POST   | `/api/adopter/signup`           | Public     | Register a new user              |
| POST   | `/api/adopter/login`            | Public     | Login and get JWT token          |
| GET    | `/api/adopter`                  | Admin only | Get all adopters                 |
| GET    | `/api/adopter/:id`              | User       | Get adopter by ID                |
| GET    | `/api/pets`                     | Public     | Get all pets                     |
| GET    | `/api/pets/count`               | Public     | Get total pet count              |
| GET    | `/api/pets/species`             | Public     | Get all unique species           |
| GET    | `/api/pets/species/:species`    | Public     | Get pets by species              |
| GET    | `/api/pets/:id`                 | Public     | Get pet by ID                    |
| POST   | `/api/pets`                     | Public     | Add a new pet                    |
| PUT    | `/api/pets/:id`                 | Public     | Update a pet                     |
| DELETE | `/api/pets/:id`                 | Public     | Delete a pet                     |
| GET    | `/api/shelters`                 | Public     | Get all shelters                 |
| GET    | `/api/shelters/search/name/:kw` | Public     | Search shelters by name          |
| GET    | `/api/shelters/search/location` | Public     | Search shelters by location      |
| GET    | `/api/shelters/:id`             | Public     | Get shelter by ID                |
| POST   | `/api/shelters`                 | Public     | Add a shelter                    |
| PUT    | `/api/shelters/:id`             | Public     | Update a shelter                 |
| DELETE | `/api/shelters/:id`             | Public     | Delete a shelter                 |
| POST   | `/api/adoption`                 | User       | Submit an adoption application   |
| GET    | `/api/adoption/me`              | User       | View your own applications       |
| DELETE | `/api/adoption/:id`             | User       | Cancel your pending application  |
| GET    | `/api/adoption`                 | Admin only | View all adoption records        |
| PUT    | `/api/adoption/:id/status`      | Admin only | Approve or reject an application |

<!-- > 📖 Full interactive documentation available at: `http://localhost:3000/api-docs` -->

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory with the following:

```env
DB_USER=your_postgres_user
DB_HOST=localhost
DB_NAME=your_database_name
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_super_secret_key
PORT=3000
```

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/midv.git
cd midv/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

```bash
psql -U postgres -f ../pet.sql
```

### 4. Configure environment

Create a `.env` file based on the [Environment Variables](#environment-variables) section above.

### 5. Start the server

```bash
node server.js
```

The server will start on `http://localhost:3000`.

---

## Project Flow

This section describes how the backend was built, step by step from start to finish.

```
Phase 1: Planning
```


![ERD](../Screenshot%20(388).png)
```
└── Designed the database schema (4 tables: shelter, adopter, pet, adoption)
└── Defined relationships (pet belongs to shelter, adoption links pet + adopter)
└── Created pet.sql with CREATE TABLE + seed data

Phase 2: Project Setup
└── Initialized Node.js project (npm init)
└── Installed dependencies: express, pg, dotenv, bcrypt, jsonwebtoken, swagger-jsdoc, swagger-ui-express
└── Created folder structure: config/, model/, controller/, middleware/, route/

Phase 3: Database Connection
└── config/db.js — Created a shared PostgreSQL connection pool
└── Used dotenv to load credentials from .env

Phase 4: Models (Data Layer)
└── Shelter.js — SQL queries for shelter table (CRUD + search)
└── Adopter.js — SQL queries for adopter table (findByEmail, create, findAll, findById)
└── Pet.js     — SQL queries for pet table (CRUD + species filter + markAsAdopted)
└── Adoption.js — SQL queries for adoption table (create, status update, cancel)

Phase 5: Authentication Middleware
└── middleware/auth.js   — JWT token verification (extracts user from Bearer token)
└── middleware/isAdmin.js — Role check (allows only role='admin' to proceed)

Phase 6: Controllers (Business Logic)
└── AdopterController.js — signup (hash password, save user) + login (compare hash, issue JWT)
└── PetController.js     — CRUD + species filtering + count
└── ShelterController.js — CRUD + name/location search
└── AdoptionController.js — Apply, view, cancel, approve/reject with pet status sync

Phase 7: Routes (HTTP Mapping)
└── AdopterRoute.js  — Map POST /signup, POST /login, GET /, GET /:id with auth guards
└── PetRoute.js      — Map all pet CRUD + species routes
└── ShelterRoute.js  — Map all shelter CRUD + search routes
└── AdoptionRoute.js — Map adoption lifecycle routes with auth + admin guards

Phase 8: Server Assembly
└── server.js — Registered all routes, served frontend static files, started HTTP server

Phase 9: API Documentation
└── swagger.js — Defined OpenAPI 3.0 spec with schemas and JWT security scheme
└── server.js  — Mounted Swagger UI at /api-docs
```

---

## Team

| Name                      | Role     |
| ------------------------- |----------|
| Isil Sengul               | Frontend |
| Chea Rithea Vatey         | Backend  |
| Meriem Chaabani           | Frontend |
| Dana Lorena Montes Gamboa | Backend  |

[//]: # (> 📍 ADOPT Pet Shelter — Pecs, Hungary, 7633 | info@adoptpetshelter.org)
