# HR Management System

A full-stack HR Management System built with React (Frontend) and Node.js/Express (Backend), featuring role-based access control, employee management, leave applications, attendance tracking, and comprehensive reporting.

## 📁 Project Structure

```
y/
│
├── 📄 package.json                 # Root package.json with build scripts
├── 📄 package-lock.json
├── 📄 README.md                    # This file
│
├── 📁 client/                      # Frontend React Application
│   └── 📁 hr_management/
│       ├── 📄 package.json         # React app dependencies
│       ├── 📄 package-lock.json
│       ├── 📄 README.md
│       │
│       ├── 📁 build/               # Production build output (generated)
│       │   ├── static/
│       │   │   ├── css/            # Minified CSS files
│       │   │   └── js/             # Minified JavaScript files
│       │   ├── asset-manifest.json
│       │   ├── index.html
│       │   ├── favicon.ico
│       │   ├── logo192.png
│       │   ├── logo512.png
│       │   ├── manifest.json
│       │   └── robots.txt
│       │
│       ├── 📁 public/              # Public assets
│       │   ├── index.html          # HTML template
│       │   ├── favicon.ico
│       │   ├── logo192.png
│       │   ├── logo512.png
│       │   ├── manifest.json
│       │   └── robots.txt
│       │
│       └── 📁 src/                 # React source code
│           ├── 📄 index.js         # Entry point
│           ├── 📄 index.css        # Global styles
│           ├── 📄 App.js           # Main App component with routing
│           ├── 📄 Firebase.js      # Firebase configuration
│           ├── 📄 Login.js         # Login page component
│           ├── 📄 Dashboard.js     # Landing page/Dashboard
│           ├── 📄 Dashboard.css    # Landing page styles
│           ├── 📄 setupTests.js    # Jest test configuration
│           │
│           ├── 📁 Admin/           # Admin role components
│           │   ├── 📄 Dashboard.js
│           │   ├── 📄 EmployeeList.js
│           │   ├── 📄 LeaveApplications.js
│           │   ├── 📄 Navbar.js
│           │   ├── 📄 Reports.js
│           │   ├── 📄 Settings.js
│           │   └── 📄 style.css
│           │
│           ├── 📁 HR/              # HR role components
│           │   ├── 📄 Attendance.js
│           │   ├── 📄 Dashboard.js
│           │   ├── 📄 EmployeeList.js
│           │   ├── 📄 LeaveApplications.js
│           │   ├── 📄 Navbar.js
│           │   ├── 📄 Profile.js
│           │   ├── 📄 Recruitment.js
│           │   ├── 📄 Reports.js
│           │   ├── 📄 Settings.js
│           │   └── 📄 style.css
│           │
│           ├── 📁 Manager/         # Manager role components
│           │   ├── 📄 Attendance.js
│           │   ├── 📄 Dashboard.js
│           │   ├── 📄 LeaveApplications.js
│           │   ├── 📄 Navbar.js
│           │   ├── 📄 Profile.js
│           │   ├── 📄 Reports.js
│           │   ├── 📄 Settings.js
│           │   └── 📄 style.css
│           │
│           └── 📁 Employee/        # Employee role components
│               ├── 📄 Attendance.js
│               ├── 📄 Dashboard.js
│               ├── 📄 Leaves.js
│               ├── 📄 Navbar.js
│               ├── 📄 Settings.js
│               └── 📄 style.css
│
├── 📁 server/                      # Backend Node.js/Express API
│   ├── 📄 package.json             # Server dependencies
│   ├── 📄 package-lock.json
│   ├── 📄 README.md                # Server-specific documentation
│   ├── 📄 env.example              # Environment variables template
│   │
│   ├── 📁 db/                      # Database scripts
│   │   └── 📄 schema.sql           # Database schema
│   │
│   ├── 📁 uploads/                 # File uploads directory (generated)
│   │
│   └── 📁 src/                     # Server source code
│       ├── 📄 server.js            # Server entry point
│       ├── 📄 app.js               # Express app configuration
│       │
│       ├── 📁 config/              # Configuration files
│       │   ├── 📄 database.js      # MySQL connection pool
│       │   ├── 📄 db.js            # Knex.js database instance
│       │   └── 📄 firebaseAdmin.js # Firebase Admin SDK setup
│       │
│       ├── 📁 controllers/         # Route controllers
│       │   ├── 📄 employeeController.js
│       │   ├── 📄 leaveController.js
│       │   └── 📄 attendanceController.js
│       │
│       ├── 📁 services/            # Business logic layer
│       │   ├── 📄 employeeService.js
│       │   ├── 📄 leaveService.js
│       │   └── 📄 attendanceService.js
│       │
│       ├── 📁 routes/              # API routes
│       │   ├── 📄 index.js         # Route aggregator
│       │   ├── 📄 employeeRoutes.js
│       │   ├── 📄 leaveRoutes.js
│       │   └── 📄 attendanceRoutes.js
│       │
│       ├── 📁 middlewares/         # Express middlewares
│       │   ├── 📄 auth.js          # Firebase authentication
│       │   ├── 📄 errorHandler.js  # Error handling
│       │   ├── 📄 asyncHandler.js  # Async wrapper
│       │   └── 📄 validator.js     # Request validation
│       │
│       ├── 📁 validators/          # Request validators
│       │   └── 📄 leaveValidators.js
│       │
│       └── 📁 utils/               # Utility functions
│           ├── 📄 logger.js        # Winston logger
│           └── 📄 uploader.js      # File upload handler
│
└── 📁 logs/                        # Application logs (generated)
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **MySQL** 8+ database
- **Firebase** project with service account credentials

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```
   This installs dependencies for root, client, and server.

2. **Setup environment variables:**
   
   **Server:** Copy `server/env.example` to `server/.env` and fill in your values:
   ```bash
   cd server
   cp env.example .env
   ```
   
   **Client:** Create `client/hr_management/.env` with:
   ```env
   REACT_APP_API_BASE=http://localhost:5000
   ```

3. **Setup database:**
   - Create MySQL database: `attendance_db`
   - Run `server/db/schema.sql` to create tables
   - Seed roles: Admin, HR, Manager, Employee

### Development

```bash
# Start backend server (port 5000)
npm run dev:server

# Start frontend (port 3000)
npm run dev:client
```

### Build

```bash
# Build both client and server
npm run build

# Build only client
npm run build:client

# Build only server
npm run build:server
```

## 📋 Available Scripts

### Root Level (`package.json`)

| Command | Description |
|---------|-------------|
| `npm run build` | Build both client and server |
| `npm run build:client` | Build React client only |
| `npm run build:server` | Build server only |
| `npm run install:all` | Install all dependencies (root, client, server) |
| `npm run start:client` | Start client in production mode |
| `npm run start:server` | Start server |
| `npm run dev:client` | Start client in development mode |
| `npm run dev:server` | Start server with nodemon |

### Client (`client/hr_management/package.json`)

| Command | Description |
|---------|-------------|
| `npm start` | Start React development server |
| `npm run build` | Build for production |
| `npm test` | Run tests |

### Server (`server/package.json`)

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm run build` | Validate server setup |

## 🏗️ Architecture

### Frontend (React)
- **Framework:** React 19.2.0
- **Routing:** React Router DOM 7.9.6
- **Authentication:** Firebase Authentication
- **UI Libraries:** React Bootstrap, React Icons
- **State Management:** React Hooks (useState, useEffect)
- **API Communication:** Fetch API

### Backend (Node.js/Express)
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.22.1
- **Database:** MySQL 8+ with Knex.js ORM
- **Authentication:** Firebase Admin SDK
- **Validation:** Joi
- **Logging:** Winston
- **Security:** Helmet, CORS, Rate Limiting

## 🔐 Role-Based Access Control

The system supports four roles:

1. **Admin** - Full system access
   - Employee management
   - Leave approvals
   - Reports and analytics
   - System settings

2. **HR** - Human Resources access
   - Employee management
   - Leave management
   - Recruitment
   - Attendance tracking
   - Reports

3. **Manager** - Department management
   - Team attendance
   - Leave approvals
   - Team reports
   - Profile management

4. **Employee** - Self-service access
   - Personal attendance
   - Leave applications
   - Profile settings

## 📡 API Endpoints

### Employee Endpoints
- `GET /api/employees` - List all employees
- `GET /api/employees/:id` - Get employee details
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `GET /api/employees/me` - Get current user's profile

### Leave Endpoints
- `GET /api/leaves` - List leave applications (role-based)
- `GET /api/leaves/:id` - Get leave details
- `POST /api/leaves` - Submit leave application
- `PATCH /api/leaves/:id/status` - Approve/reject leave
- `GET /api/leaves/:employeeId/balances` - Get leave balances

### Attendance Endpoints
- `GET /api/attendance` - List attendance records (role-based)
- `GET /api/attendance/me` - Get current user's attendance
- `POST /api/attendance` - Mark attendance

## 🔒 Authentication

- Frontend: Firebase Authentication (Email/Password)
- Backend: Firebase Admin SDK verifies ID tokens
- Protected routes require `Authorization: Bearer <token>` header

## 📝 Notes

- Client build output: `client/hr_management/build/`
- Server logs: `logs/` directory
- File uploads: `server/uploads/`
- Database schema: `server/db/schema.sql`

## 🤝 Contributing

1. Follow the existing folder structure
2. Maintain consistent coding style
3. Add appropriate error handling
4. Update documentation as needed

## 📄 License

MIT

---

For detailed setup instructions, see:
- **Server:** `server/README.md`
- **Client:** `client/hr_management/README.md`

