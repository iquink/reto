# Reto Issue Tracker

A full-stack issue tracker web application with file/image upload, gallery display, and robust backend file handling. Built with React (TypeScript, MobX-State-Tree), Node.js/Express, and MySQL.

---

## Features
- User authentication (register/login)
- Create, view, and manage issues with:
  - Title, description, coordinates (select on map)
  - Image/file upload (max 3 images per issue)
  - Gallery display for uploaded images
  - Status tracking (open, in progress, closed)
- Responsive, accessible UI using a custom design system
- Internationalization (i18n) support
- Secure backend file handling (Multer, unique filenames, image-only, size limits)
- Docker & Docker Compose support for easy setup

---

## Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- MySQL (with a database named `reto_db` and the provided schema)

### Database Schema

**Users Table:**
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`),
  KEY `idx_username` (`username`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Issues Table:**
```sql
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

---

## Running the App

### 1. Backend
```
cd backend
npm install
npm run start
```
- The backend will connect to your MySQL `reto_db` database (configure credentials in `backend/.env`).

### 2. Frontend
```
cd reto
npm install
npm run dev
```
- The frontend runs on Vite (default: http://localhost:5173)

---

## File Uploads
- Max 3 images per issue (validated on frontend)
- Only image files are accepted
- Uploaded files are stored in `/uploads` and served securely by the backend
- Only the filename is stored in the database (not the full path)

---

## Docker & Compose
- See `docker-compose.yml` for full stack setup (frontend, backend, MySQL)
- Environment variables for DB and API URLs are handled in `.env` files

---

## Accessibility & Design
- All UI components follow accessibility best practices
- Consistent design system with CSS variables
- Responsive layout for desktop and mobile

---

## Development
- Storybook stories for key components
- ESLint and TypeScript for code quality
- i18n support (English, Finnish, Russian)

---

## License
MIT
