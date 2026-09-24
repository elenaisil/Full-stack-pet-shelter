# 🐾 ADOPT Pet Shelter

A full-stack pet adoption management web application for **ADOPT Pet Shelter**, based in Pecs, Hungary. The platform allows visitors to browse pets and shelters, and submit adoption applications — all powered by a RESTful backend API.

> *"Where rescue, care, and community come together until every pet has a home."*

---

## 📁 Repository Structure

```
midv/
├── backend/        ← Node.js + Express REST API
├── frontend/       ← Angular (Angular Shelter) web application
├── pet.sql         ← PostgreSQL schema + seed data
└── README.md       ← This file
```

---

## 🛠️ Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | Angular (Angular Shelter scaffold), TypeScript, SCSS |
| Backend    | Node.js, Express.js v5                      |
| Database   | PostgreSQL                                  |
| Auth       | JWT (JSON Web Tokens) + bcrypt              |
| API Docs   | Swagger UI (OpenAPI 3.0)                    |

---

## 🚀 Quick Start

### 1. Set up the database

```bash
psql -U postgres -f pet.sql
```

### 2. Configure the backend

```bash
cd backend
# Create a .env file with your DB credentials and JWT secret
# (See backend/README.md for all required variables)
npm install
node server.js
```

### 3. Open the app

```
http://localhost:3000
```

The backend automatically serves the frontend as static files — no additional setup needed.

---

## 📖 Documentation

- 📘 [Backend README](./backend/README.md) — API structure, folder breakdown, endpoints, and project flow
- 📗 [Frontend README](./frontend/README.md) — Pages, features, API integration, and project flow
- 📖 [Swagger API Docs](http://localhost:3000/api-docs) — Interactive API documentation (server must be running)

---

## 🗄️ Database ERD

The database consists of 4 tables with the following relationships:

```
shelter ──< pet          (one shelter has many pets)
adopter ──< adoption     (one adopter can have many applications)
pet     ──< adoption     (one pet can have many application records)
```

> 📎 See `pet.sql` for the full schema with constraints and seed data.

---

## ✨ Key Features

- 🐾 **Browse Pets** — View all available animals with species-based filtering
- 🏠 **Find Shelters** — Discover partner shelters with location and capacity info
- 📋 **Adopt Online** — Submit an adoption application directly from the website
- 📊 **Live Stats** — Real-time counters for pets, adoptions, and shelters
- 🔐 **Secure Auth** — JWT-based login with bcrypt password hashing
- 👑 **Admin Controls** — Admins can approve/reject applications and manage all data
- 📖 **API Docs** — Full Swagger UI documentation at `/api-docs`



[//]: # (> 📍 Pecs, Hungary, 7633 &nbsp;|&nbsp; 📞 +36 630-355-2299 &nbsp;|&nbsp; ✉️ info@adoptpetshelter.org  )

[//]: # (> © 2026 ADOPT Pet Shelter. All rights reserved.)
