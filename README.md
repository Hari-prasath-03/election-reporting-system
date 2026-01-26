# TN Election Reporting System

**A high-performance, enterprise-grade Election Reporting & Management System built for scale.**
This application serves as a centralized hub for managing constituencies, parties, and candidates, while providing real-time election result aggregation through a secure Informer portal.

---

## 🏗️ System Architecture & Scale

This project represents a **hybrid Next.js 15+ architecture**, leveraging both **Server Actions** for type-safe mutations and **REST API routes** for external integrations and complex data fetching.

### By the Numbers

- **Structure**: Modular "Feature-Sliced" Architecture
- **Scale**: ~214+ Source Files
- **Components**: 50+ Reusable UI Components
- **Server Actions**: 22+ Remote Procedure Calls (RPCs)
- **API Endpoints**: 14+ Dedicated REST Routes

---

## 📂 Complete Project Structure

The project follows a rigorous directory structure designed for maintainability and scalability.

```
src/
├── actions/                          # ⚡ Server Actions (RPC Layer)
│   ├── assignment/                   #   - assign/unassign-informer
│   ├── auth/                         #   - login, logout, password-reset
│   ├── candidate/                    #   - create, update, delete candidates
│   ├── counting-center/              #   - center management logic
│   ├── party/                        #   - party symbol & data management
│   ├── user/                         #   - RBAC user management
│   └── vote/                         #   - live vote counting logic
├── app/                              # 🌐 Application Routing Layer
│   ├── (auth)/                       #   - /login, /forgot-password
│   ├── (protected)/                  #   🔒 Secured Routes (Middleware Guarded)
│   │   ├── (admin)/                  #     - /dashboard (Admin Console)
│   │   ├── (informer)/               #     - /assigned (Informer Workspace)
│   │   ├── api/                      #     🔌 REST API Layer
│   │   │   ├── assignments/          #         - GET /available-informers
│   │   │   ├── auth/callback/        #         - OAuth/Magic Link Handlers
│   │   │   ├── candidates/           #         - GET /by-constituency, /rounds
│   │   │   ├── constituencies/       #         - GET /select (Dropdown data)
│   │   │   ├── counting-centers/     #         - GET /with-assignments
│   │   │   ├── parties/              #         - GET / (Master data)
│   │   │   └── users/                #         - GET / (Staff list)
├── components/                       # 🧩 UI Component Library
│   ├── assignment/                   #   - Assignment dialogs & tables
│   ├── auth/                         #   - Login forms, OTP inputs
│   ├── candidate/                    #   - Candidate cards, master tables
│   ├── constituencies/               #   - Constituency detailed views
│   ├── counting-center/              #   - Center management forms
│   ├── informer/                     #   - Submission history, active tasks
│   ├── party/                        #   - Symbol uploaders, party lists
│   ├── ui/                           #   🎨 Shadcn UI Primitives
│   │   ├── (base components...)      #      (Button, Card, Dialog, Sheet, Table...)
│   │   ├── form-input.tsx            #      - Custom Form Abstraction
│   │   ├── image-upload-preview.tsx  #      - Cloudinary Widget
│   │   └── multi-select-combobox.tsx #      - Complex Selection UI
│   └── update-count/                 #   - Live Round Reporting UI
├── lib/                              # ⚙️ Core Utilities
│   ├── cloudinary/                   #   - Image upload/delete strategies
│   ├── supabase/                     #   - Server/Client/Admin Supabase Clients
│   └── query-builder.ts              #   - Advanced SQL-like Query Builder Class
├── middleware.ts                     # 🛡️ Edge Middleware (Auth & RBAC)
└── ...
```

---

## 🔌 API Reference & Data Layer

The application exposes a dual-layer data interface:

### 1. Server Actions (Internal RPC)

Used for all data mutations (POST/PUT/DELETE operations) directly from UI components.

- **Auth**: `loginAction`, `resetPasswordAction`
- **Operations**: `assignInformerAction`, `updateVoteRoundAction`
- **Management**: `createPartyAction`, `updateCandidateAction`

### 2. REST API Endpoints (External/Fetch)

Used for data hydration and third-party integrations.

| Endpoint                                 | Method | Description                                     |
| :--------------------------------------- | :----- | :---------------------------------------------- |
| `/api/candidates/by-constituency/[id]`   | `GET`  | Fetch all candidates in a specific constituency |
| `/api/candidates/[id]/rounds`            | `GET`  | Get live vote rounds for a candidate            |
| `/api/assignments/available-informers`   | `GET`  | List informers ready for assignment             |
| `/api/constituencies/select`             | `GET`  | Optimized lightweight list for dropdowns        |
| `/api/counting-centers/with-assignments` | `GET`  | Centers mapped with assigned staff              |
| `/api/parties`                           | `GET`  | Master list of registered parties               |

---

## 🚀 Key Features

### 🔐 Enterprise Security

- **RBAC (Role-Based Access Control)**: Strict separation of _Admin_, _Informer_, and _User_ capabilities.
- **Middleware Protection**: Edge-level route guarding.
- **Secure Auth**: Supabase-powered authentication flow.

### 🗳️ Live Election Reporting Module

- **Real-time Aggregation**: Atomic vote updates pushed immediately to the dashboard.
- **Informer Portal**: Mobile-optimization workspace for field agents to report round-wise counts.
- **Data Integrity**: Server-side validation using Zod schemas for every vote entry.

### 📊 Advanced Dashboard

- **Dynamic Data Tables**: Server-side pagination, filtering, and sorting using generic `QueryBuilder`.
- **Media Management**: Integrated Cloudinary pipeline for Party Symbols and Candidate Photos.

---

## 🛠️ Tech Stack

- **Core**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4, Shadcn UI
- **State**: Zustand (Client), TanStack Query (Server State)
- **Backend Service**: Supabase (PostgreSQL + Auth)
- **Storage**: Cloudinary (Optimized Assets)
- **Validation**: Zod + React Hook Form

---

## 🗄️ Database Schema

![Database Schema](public/database-schema.png)

## ⚙️ Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 🧑‍💻 Developed and managed by [Hari prasath](https://github.com/hari-prasath-03)
