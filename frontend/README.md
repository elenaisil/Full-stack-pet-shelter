# 🐾 ADOPT Pet Shelter — Frontend

The user-facing website for the **ADOPT Pet Shelter** platform. Built with **Angular** (using the Angular Shelter scaffold) — it communicates with the NestJS backend REST API to display pets, shelters, live statistics, and process adoption requests.

---

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Components](#pages--components)
- [Features](#features)
- [API Integration](#api-integration)
- [Getting Started](#getting-started)
- [Project Flow](#project-flow)

---

## 🛠️ Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Framework   | Angular (Angular Shelter scaffold) |
| Language    | TypeScript                        |
| Styling     | SCSS / Component-scoped CSS       |
| HTTP Calls  | Angular `HttpClient` (`HttpClientModule`) |
| Auth        | JWT stored in `localStorage`, sent via `HttpInterceptor` |
| Routing     | Angular Router (`RouterModule`)   |
| State       | Component-level state + Services  |
| Fonts/Icons | System defaults + emoji           |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/
│   │   │   │   ├── pet.service.ts          ← Pet API calls
│   │   │   │   ├── shelter.service.ts      ← Shelter API calls
│   │   │   │   ├── adoption.service.ts     ← Adoption API calls
│   │   │   │   └── auth.service.ts         ← Login / signup / JWT
│   │   │   └── interceptors/
│   │   │       └── auth.interceptor.ts     ← Attaches Bearer token to requests
│   │   │
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.component.html
│   │   │   │   └── home.component.scss
│   │   │   ├── pets/
│   │   │   │   ├── pets.component.ts
│   │   │   │   ├── pets.component.html
│   │   │   │   └── pets.component.scss
│   │   │   ├── about/
│   │   │   │   ├── about.component.ts
│   │   │   │   ├── about.component.html
│   │   │   │   └── about.component.scss
│   │   │   └── admin/
│   │   │       ├── admin.component.ts
│   │   │       ├── admin.component.html
│   │   │       └── admin.component.scss
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── pet-card/               ← Reusable pet card component
│   │   │   │   ├── shelter-card/           ← Reusable shelter card component
│   │   │   │   ├── adopt-modal/            ← Adoption form modal
│   │   │   │   ├── donate-modal/           ← Donation form modal
│   │   │   │   ├── navbar/                 ← Shared navigation bar
│   │   │   │   └── footer/                 ← Shared footer
│   │   │   └── models/
│   │   │       ├── pet.model.ts
│   │   │       ├── shelter.model.ts
│   │   │       ├── adoption.model.ts
│   │   │       └── adopter.model.ts
│   │   │
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.module.ts                   ← Root module, imports, providers
│   │   └── app-routing.module.ts           ← Route definitions
│   │
│   ├── assets/
│   │   └── images/
│   │       ├── logoFinal.jpg
│   │       ├── logo.jpg
│   │       ├── Isil.jpeg
│   │       ├── Vatey.jpeg
│   │       ├── Meriem.jpeg
│   │       └── Dana.jpeg
│   │
│   ├── environments/
│   │   ├── environment.ts          ← Dev: apiUrl = 'http://localhost:3000/api'
│   │   └── environment.prod.ts     ← Prod: apiUrl = '<production API>'
│   │
│   ├── styles.scss                 ← Global styles & CSS variables
│   └── main.ts
│
├── angular.json
├── package.json
└── tsconfig.json
```

---

## 📄 Pages & Components

### `HomeComponent` — Home Page (`/`)
The main landing page. Contains:
- **Navbar** — Logo + links to all pages and sections (via `RouterLink` and `scrollIntoView`).
- **Hero Section** — Bold call-to-action with "View Available Animals" and "Donate Now" buttons.
- **Stats Section** — Live counters fetched on `ngOnInit` via `PetService`, `AdoptionService`, and `ShelterService`: Total Pets, Available for Adoption, Happy Adoptions, Partner Shelters.
- **About Us Preview** — Short description with a `RouterLink` to `/about`.
- **Meet Our Babies** — Grid of up to 6 available pets rendered via `*ngFor` on `PetCardComponent`, each with an "Adopt" button that opens `AdoptModalComponent`.
- **Partner Shelters** — Grid of all shelters using `ShelterCardComponent`.
- **Footer / Contact** — Address, phone, email, copyright.
- **DonateModalComponent** — Pop-up triggered by the hero button.
- **AdoptModalComponent** — Pop-up adoption form shared across pages.

### `PetsComponent` — All Pets Page (`/pets`)
Dedicated page showing **all pets** in the database:
- Full pet grid rendered with `*ngFor` + `PetCardComponent` (including adopted ones, marked as unavailable).
- Auto-refresh via `setInterval` inside `ngOnInit`, cleared with `clearInterval` in `ngOnDestroy`.
- Adopted pets display a disabled "Already Adopted" button via `[disabled]` binding.
- Shares the same `AdoptModalComponent`.

### `AboutComponent` — About Page (`/about`)
Tells the story of the shelter and its founders:
- **Our Story** — Background on the four co-founders.
- **Meet Our Founders** — Team cards with photos and quotes for Isil, Vatey, Meriem, and Dana.
- **Our Mission** — Statistics section (500+ adoptions, 4 founders, 100% heart & soul).
- **Our Location** — Google Maps embed for the Pecs, Hungary address with opening hours.
- **CTA Section** — "Ready to Adopt?" section linking back to `/pets`.

### `AdminComponent` — Admin Dashboard (`/admin`)
Protected route (guarded by `AuthGuard`). Allows shelter staff to:
- View and approve/reject pending adoption applications.
- Manage pets (add, edit, delete records).
- View all shelter information.

---

## ✨ Features

| Feature                     | Description                                                                      |
|-----------------------------|----------------------------------------------------------------------------------|
| 🔴 Live Stats               | Pet count, available pets, adoption count, and shelter count loaded via services |
| 🐾 Pet Cards                | Dynamically rendered `PetCardComponent` with species-specific images             |
| 🏠 Shelter Cards            | `ShelterCardComponent` with location, phone, capacity, and founding date         |
| 📋 Adoption Flow            | Modal form → auto signup/login → JWT token → POST adoption record                |
| 💸 Donate Modal             | Pop-up donation confirmation form via `DonateModalComponent`                     |
| 🔄 Auto Refresh             | Pages auto-reload data every 30 seconds using `setInterval` + `ngOnDestroy`      |
| 🔐 Auth Guard               | `AuthGuard` protects the `/admin` route; redirects if no valid JWT present       |
| 🌐 HTTP Interceptor         | `AuthInterceptor` automatically attaches `Authorization: Bearer <token>` header  |
| 📱 Responsive Navigation    | Angular Router navigation + smooth scroll to sections                            |
| 🗺️ Google Maps Embed        | Interactive map in `AboutComponent` showing shelter location in Pecs             |

---

## 🔗 API Integration

All API calls are made through Angular services using `HttpClient`. The base URL is defined per environment:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Services & Key API Calls

| Service               | Method            | HTTP Call                           | Purpose                               |
|-----------------------|-------------------|-------------------------------------|---------------------------------------|
| `PetService`          | `getAll()`        | `GET /api/pets`                     | Fetch all pets                        |
| `PetService`          | `getAvailable()`  | `GET /api/pets` (filtered)          | Fetch only available pets             |
| `ShelterService`      | `getAll()`        | `GET /api/shelters`                 | Fetch all shelter cards               |
| `AdoptionService`     | `getAll()`        | `GET /api/adoption`                 | Fetch adoption records (stats)        |
| `AdoptionService`     | `create(petId)`   | `POST /api/adoption` *(Bearer)*     | Submit an adoption application        |
| `AuthService`         | `signup(data)`    | `POST /api/adopter/signup`          | Register a new adopter                |
| `AuthService`         | `login(creds)`    | `POST /api/adopter/login`           | Log in and receive a JWT token        |
| `AuthService`         | `isLoggedIn()`    | Reads `localStorage`                | Check if a user is authenticated      |

### Adoption Flow (Step by Step)

```
User clicks "Adopt [Pet Name]"
    → AdoptModalComponent opens with petId and petName bound via @Input()
    → User fills name, email, phone, address, city

User clicks "Complete Adoption"
    → AdoptionService.confirm() runs:
        1. AuthService.signup()   → POST /api/adopter/signup  (register; 409 = already exists, continue)
        2. AuthService.login()    → POST /api/adopter/login   (get JWT, stored in localStorage)
        3. AdoptionService.create(petId) → POST /api/adoption (Bearer token via interceptor)
    → On success: success message emitted via @Output() → modal closes → data refreshed
```

### Auth Interceptor

```typescript
// src/app/core/interceptors/auth.interceptor.ts
intercept(req: HttpRequest<any>, next: HttpHandler) {
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next.handle(req);
}
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm** v9+
- **Angular CLI** v17+: `npm install -g @angular/cli`
- The **backend server must be running** on `http://localhost:3000` (see [backend README](../backend/README.md)).

### Install Dependencies

```bash
cd frontend
npm install
```

### Run the Development Server

```bash
ng serve
```

Then open your browser and navigate to:

```
http://localhost:4200
```

The Angular dev server proxies API calls to `http://localhost:3000` (configured in `proxy.conf.json`).

### Build for Production

```bash
ng build --configuration production
```

The compiled output will be placed in `dist/`. Copy these files to your backend's `public/` or `frontend/` static folder so Express/NestJS can serve them.

> **Tip:** When running in production, update `environment.prod.ts` with your actual API URL before building.

---

## 🔄 Project Flow

This section describes how the Angular frontend was built, phase by phase.

```
Phase 1: Planning & Design
└── Decided on a page structure: Home, Pets, About, Admin
└── Defined Angular component tree and shared module structure
└── Chose a warm, animal-rescue-inspired color palette in styles.scss

Phase 2: Base Setup (Angular Shelter scaffold)
└── Generated project with Angular CLI / Angular Shelter scaffold
└── Configured AppRoutingModule with lazy-loaded page routes
└── Defined global CSS variables and shared SCSS in styles.scss
└── Registered HttpClientModule and AuthInterceptor in AppModule

Phase 3: Core Services (src/app/core/services/)
└── PetService       — getAll(), getAvailable() using HttpClient
└── ShelterService   — getAll() using HttpClient
└── AdoptionService  — getAll(), create() using HttpClient + JWT
└── AuthService      — signup(), login(), logout(), isLoggedIn()

Phase 4: Shared Components (src/app/shared/components/)
└── NavbarComponent  — Angular Router links, active route highlighting
└── FooterComponent  — Contact info, copyright
└── PetCardComponent — @Input() pet, @Output() adopt event
└── ShelterCardComponent — @Input() shelter
└── AdoptModalComponent  — @Input() petId/petName, @Output() adopted
└── DonateModalComponent — Donation form, processed locally

Phase 5: Pages (src/app/pages/)
└── HomeComponent    — Stats, hero, pet grid (6 items), shelter grid
└── PetsComponent    — Full pet grid, auto-refresh (30s)
└── AboutComponent   — Story, team cards, mission, map embed, CTA
└── AdminComponent   — Auth-guarded admin dashboard

Phase 6: Auth & Guards
└── AuthInterceptor  — Auto-attach Bearer token to all outgoing requests
└── AuthGuard        — Protect /admin; redirect to /home if unauthenticated
└── AuthService      — Manage JWT in localStorage, expose isLoggedIn()
```

---

## 🖼️ Asset Notes

Pet images are sourced from **Unsplash** by species keyword (via `PetService` or a dedicated pipe):

| Species | Image URL |
|---------|-----------|
| Dog     | `photo-1543466835-00a7907e9de1` |
| Cat     | `photo-1514888286974-6c03e2ca1dba` |
| Bird    | `photo-1552728089-57bdde30beb3` |
| Rabbit  | `photo-1535241749838-299277b6305f` |
| Default | `photo-1450778869180-41d0601e046e` |

Team and logo images are stored locally in `src/assets/images/`.

---

## 👩‍💻 Team

| Name                      | Role       |
|---------------------------|------------|
| Isil Sengul               | Co-Founder |
| Chea Rithea Vatey         | Co-Founder |
| Meriem Chaabani           | Co-Founder |
| Dana Lorena Montes Gamboa | Co-Founder |

> 📍 ADOPT Pet Shelter — Pecs, Hungary, 7633 | info@adoptpetshelter.org
