# HR Management Backend

Node.js + Express backend for the HR Management System.  
Features:

- Firebase Authentication (ID token verification via Admin SDK)
- MySQL (attendance_db) with connection pool
- Role-based access control for Admin, HR, Manager, Employee
- REST APIs for employees, leaves, attendance
- Structured architecture (routes → controllers → services)
- Centralised error handling, validation, logging, and rate limiting

## 1. Prerequisites

- Node.js 18+
- MySQL 8+ with an existing database named `attendance_db`
- Firebase service account credentials (JSON)

## 2. Install dependencies

```bash
cd server
npm install
```

## 3. Environment variables

Duplicate `env.example` to `.env` and provide values:

```bash
cp env.example .env
```

| Variable | Description |
| --- | --- |
| `PORT` | API port (default 5000) |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection info |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Firebase Admin service account details |
| `UPLOAD_DIR` | Directory to store uploaded profile photos (default `uploads`) |

> **Note:** `FIREBASE_PRIVATE_KEY` should keep newline characters escaped (`\n`).  

## 4. Database

- Run `db/schema.sql` against `attendance_db` to create tables.
- Seed the `roles` table with the four roles (`Admin`, `HR`, `Manager`, `Employee`).
- Insert employees mapped to Firebase `uid` values (since authentication is managed entirely by Firebase).

Example seeding snippet:

```sql
INSERT INTO roles (name) VALUES ('Admin'), ('HR'), ('Manager'), ('Employee')
ON DUPLICATE KEY UPDATE name = VALUES(name);
```

## 5. Development

```bash
npm run dev
```

- API base URL: `http://localhost:5000/api`
- Health check: `GET /api/health`
- Protected routes require an `Authorization: Bearer <Firebase ID token>` header obtained on the client after Firebase login.

## 6. Frontend integration

Set `REACT_APP_API_BASE_URL=http://localhost:5000/api` in the React `.env`.  
The provided endpoints match the fetch calls already present in the React application:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/employees/me` | Fetch logged-in employee summary |
| GET | `/api/employees/:uid/profile` | Detailed profile |
| PUT | `/api/employees/:uid` | Update profile |
| POST | `/api/employees/:uid/photo` | Upload avatar photo |
| GET | `/api/employees/:uid/devices` | Device/login history |
| GET | `/api/leaves/:employeeId/balances` | Leave balances |
| GET | `/api/leaves/:employeeId` | Leave history |
| GET | `/api/leaves/validate/check` | Balance validation |
| POST | `/api/leaves` | Submit leave |
| GET | `/api/attendance/me` | Personal attendance |
| GET | `/api/attendance` | (Admin/HR/Manager) attendance summary |

Role-restricted endpoints (Admin/HR/Manager) use the `authorizeRoles` helper.

## 7. Production notes

- Use a process manager (PM2) or container.
- Serve `/uploads` via a CDN/S3 in production (the code uses a pluggable `UPLOAD_DIR`).
- Configure HTTPS and strict CORS in production.
- Application logs are handled via Winston.

