# GatePass Code Generator — Frontend

A modern, responsive web frontend for the **GatePass Code Generator System**. Built with vanilla HTML, CSS, JavaScript, and Tailwind CSS. Designed to work with the [GatePass Code Generator Backend API](https://github.com/mustaphagithub/Gatepass-Code-Generator-System) (.NET 10).

---

## Features

- **Role-Based Access** — Separate dashboards and navigation for Administrator, Host, and Security roles
- **Gatepass Management** — Hosts can create gatepass requests for visitors (Visitor, Employee, Contractor, Vehicle, Material)
- **Security Operations** — Verify gatepasses, check in/out visitors with built-in **QR code scanner** (camera-based)
- **Admin Panel** — Create user accounts (auto-generated passwords emailed to users), manage system settings, view audit logs
- **Reports & Statistics** — Role-specific statistics, daily visitor logs, overstay reports
- **Organization Management** — Manage departments and access points
- **JWT Authentication** — Login with automatic token refresh; password reset via email
- **Fully Responsive** — Works on desktop, tablet, and mobile devices

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) (CDN) + custom CSS |
| Logic | Vanilla JavaScript (ES6+) |
| QR Scanner | [html5-qrcode](https://github.com/mebjas/html5-qrcode) v2.3.8 |
| Font | [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts) |
| Backend API | ASP.NET Core (.NET 10) — separate repository |

## Project Structure

```
├── index.html              # Login page
├── dashboard.html          # Role-based dashboard
├── gatepass.html           # Create gatepass request (Host/Admin)
├── security.html           # Verify, Check In/Out + QR scanner (Security)
├── admin.html              # Create users, settings, audit logs (Admin)
├── organization.html       # Departments & access points (Admin)
├── reports.html            # Statistics, daily log, overstay report
├── forgot-password.html    # Request password reset
├── reset-password.html     # Reset password with token
├── css/
│   └── custom.css          # Custom styles, animations, utilities
├── js/
│   ├── config.js           # API base URL, roles, gatepass types, constants
│   ├── auth.js             # Auth management, token handling, UI helpers
│   └── api.js              # API service layer (all endpoint calls)
└── README.md
```

## Getting Started

### Prerequisites

- A running instance of the **GatePass Code Generator Backend API** on `https://localhost:7130`
- A modern web browser (Chrome, Edge, Firefox, Safari)
- A local web server (e.g., VS Code **Live Server** extension)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mustaphagithub/Gatepass-Code-Generator-Frontend.git
   cd Gatepass-Code-Generator-Frontend
   ```

2. **Configure the API URL** (if needed)
   Edit `js/config.js` and update `API_BASE_URL`:
   ```javascript
   const CONFIG = {
       API_BASE_URL: 'https://localhost:7130/api',
       // ...
   };
   ```

3. **Serve the files**
   - Open the project folder in VS Code
   - Right-click `index.html` → **Open with Live Server**
   - The app will open at `http://127.0.0.1:5500` or `http://localhost:5500`

4. **Login**
   - Use an Administrator account to create Host and Security users from the Admin panel
   - There is no public registration — accounts are created by administrators only

### CORS

The backend must allow your frontend origin. By default, the backend permits:
- `http://127.0.0.1:5500`
- `http://localhost:5500`

## Pages Overview

| Page | Access | Description |
|------|--------|-------------|
| `index.html` | Public | Login form |
| `dashboard.html` | All roles | Role-specific stats & quick actions |
| `gatepass.html` | Admin, Host | Create gatepass requests for visitors |
| `security.html` | Security | Verify codes, check in/out with QR scanner |
| `admin.html` | Admin | Create users, system settings, audit logs |
| `organization.html` | Admin | Manage departments & access points |
| `reports.html` | All roles | Statistics, daily visitor log, overstay report |
| `forgot-password.html` | Public | Request password reset email |
| `reset-password.html` | Public | Reset password using emailed token |

## API Endpoints Used

| Category | Endpoint | Method |
|----------|----------|--------|
| Auth | `/api/auth/login` | POST |
| Auth | `/api/auth/refresh-token` | POST |
| Auth | `/api/auth/forgot-password` | POST |
| Auth | `/api/auth/reset-password` | POST |
| Admin | `/api/admin/users` | POST |
| Admin | `/api/admin/settings` | GET, PUT |
| Admin | `/api/admin/auditlogs` | GET |
| Gatepass | `/api/gatepassrequests` | POST |
| Security | `/api/security/verify` | POST |
| Security | `/api/security/checkin` | POST |
| Security | `/api/security/checkout` | POST |
| Organization | `/api/organization/departments` | GET, POST |
| Organization | `/api/organization/accesspoints` | GET, POST |
| Reports | `/api/reports/statistics/admin` | GET |
| Reports | `/api/reports/statistics/host` | GET |
| Reports | `/api/reports/statistics/security` | GET |
| Reports | `/api/reports/daily-log` | GET |
| Reports | `/api/reports/overstays` | GET |

## License

This project is for educational and internal use.
