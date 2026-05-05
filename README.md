# 🗺️ Reto — Issue Tracking & Geolocation App

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MobX](https://img.shields.io/badge/MobX-FF9955?style=for-the-badge&logo=mobx&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

## 📌 About This Project

**Reto** is a full-stack web application designed for users to report geographical issues (e.g., broken infrastructure, environmental hazards). Users can select coordinates on a map, attach descriptions, and upload photos to create trackable reports.

**📝 Note for Reviewers:** 
This project serves primarily as an **architectural showcase and a demonstration of software engineering best practices**, rather than a fully-featured production product (e.g., it currently lacks a comprehensive admin panel). The main focus is on clean code architecture, strict security implementations, robust state management, and accessibility.

## ✨ Key Features & UI/UX
*   **Internationalization (i18n):** Full support for English, Finnish, and Russian.
*   **Accessibility & Design:** Responsive UI built with custom CSS variables and strict adherence to a11y best practices. Includes a component library documented with **Storybook**.
*   **Interactive Maps:** Select coordinates directly on the map for accurate issue reporting.
*   **Image Gallery:** Upload up to 3 photos per issue, displayed in a custom gallery.

## 🏗️ Architectural Highlights & Security

### Backend & Storage
*   **Strict Layered Architecture:** Implemented Dependency Injection (DI) with a strict separation between Controllers, Services, and Repositories.
*   **Secure File Handling:** Files are handled via `multer` with strict image-only validation and size limits. Only filenames are stored in the database to prevent path traversal, and files are served securely from a dedicated `/uploads` directory.
*   **Advanced Authentication:** JWT-based auth with server-side refresh token revocation (hashed tokens stored in the DB to prevent session hijacking).
*   **App Hardening:** Integrated `helmet` for secure HTTP headers, payload size limits (`10kb`), and `express-rate-limit` to prevent brute-force attacks on auth routes. In-memory CSRF tokens with timing-safe validation (`crypto.timingSafeEqual`).
*   **Graceful Shutdown:** Proper handling of `SIGTERM` and `SIGINT` to safely drain HTTP requests and close database connection pools.

### Frontend
*   **State Management:** Powered by **MobX-State-Tree (MST)** for strict runtime type-checking and robust generator-based async flows.
*   **Memory Safety:** Elimination of cyclic dependencies between API interceptors and the global store via custom DOM Event architecture (`auth:expired`).
*   **React Best Practices:** Elimination of direct DOM manipulations using `useRef`, optimization of re-renders using the Latest Callback pattern, and strict adherence to the `observer` pattern to prevent state duplication.

---

## 🐳 Running the Full Stack in Docker (Demo Mode)

If you prefer to run the entire application (Frontend, Backend, and Database) inside Docker containers without setting up a local Node.js environment:

1. Ensure your root `.env` file is configured (see below).
2. From the root of the project, run:
   ```bash
   docker-compose up -d --build
   
```
3. Once the build is complete and the containers are running:
   - **Frontend** will be available at `http://localhost:8080` (or as configured)
   - **Backend** will be available at `http://localhost:3000`

To stop the application and clean up the containers, run:
```bash
docker-compose down
```

---

## 🚀 Getting Started (Local Development)

The project is configured for a modern local development workflow: the database runs in Docker, while the backend and frontend run natively on the host machine to allow for easy IDE debugging.

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+ recommended)
*   [Docker](https://www.docker.com/) & Docker Compose

### 1. Environment Setup

Depending on how you want to run the application (fully Dockerized vs. local Node.js development), you will need the appropriate `.env` files.

**For Docker (Full Stack Execution)**
Create a `.env` file in the **root** of the project. Docker Compose uses this to provision the database and inject variables into the containers:
```env
# /.env
# DB
MYSQL_ROOT_PASSWORD=password
MYSQL_DATABASE=reto_db

# Backend
# Example tokens. Use your own generated secrets!
JWT_SECRET=9c17a376db5a197f0b84223f4fe1a97a3c814ac32b6f04db0361fd70c8026133
REFRESH_TOKEN_SECRET=b47e7f7fdcee1f9fb6a32e6b8d7182cb88253ef84cc4e01dbb9c9a3b7189c1c7
DB_USER=root
DB_PASSWORD=password
DB_NAME=reto_db
DB_HOST=db
DB_PORT=3306
FRONTEND_HOST=http://localhost:8080

# Frontend (used during building)
VITE_API_URL=http://localhost:3000
```

**For Local Development (Backend & Frontend natively, DB in Docker)**
If you are running the backend and frontend via `npm run dev` for hot-reloading, create these two separate `.env` files:

1. In the **`backend/`** directory:
```env
# backend/.env
# Local development — backend connects to Dockerized MySQL (host port 3307)
# Example tokens. Use your own generated secrets!
JWT_SECRET=9c17a376db5a197f0b84223f4fe1a97a3c814ac32b6f04db0361fd70c8026133
REFRESH_TOKEN_SECRET=b47e7f7fdcee1f9fb6a32e6b8d7182cb88253ef84cc4e01dbb9c9a3b7189c1c7

DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=root
DB_PASSWORD=password
DB_NAME=reto_db

PORT=3000
FRONTEND_HOST=http://localhost:5173
```

2. In the **`reto/`** directory:
```env
# reto/.env
# Local development — frontend talks to local backend on port 3000
VITE_API_BASE_URL=http://localhost:3000
```

### 2. Start the Database
From the root of the project, start the MySQL container:
```bash
docker-compose up -d db
```

### 3. Start the Backend
```bash
cd backend
npm install
npm run dev
```

### 4. Start the Frontend
In a new terminal window:
```bash
cd reto
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 🗄️ Database Schema

<details>
<summary>Click to view the raw MySQL tables</summary>

```sql
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  `role` enum('user','admin','moderator') DEFAULT 'user',
  `refresh_token` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `idx_username` (`username`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `issues` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `photos` json DEFAULT NULL,
  `coordinates` point NOT NULL /*!80003 SRID 4326 */,
  `status` enum('open','in_progress','closed') DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  SPATIAL KEY `idx_coordinates` (`coordinates`),
  KEY `idx_status` (`status`),
  CONSTRAINT `issues_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
</details>

---

## 🗺️ Roadmap / Future Improvements
- [ ] Implement a full Admin Panel for moderation.
- [ ] Add a public landing page.
- [ ] Expand unit test coverage for MobX stores and backend API services.
- [ ] Implement CI/CD pipelines (GitHub Actions).

## 📄 License
MIT