<div align="center">

# EasyStay Hotel Booking Platform

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Web-lightgrey.svg)
![Framework](https://img.shields.io/badge/frontend-React-61DAFB.svg)
![Backend](https://img.shields.io/badge/backend-Node.js-339933.svg)

**English** | [简体中文](./README.md)

</div>

---

## Overview

EasyStay is a comprehensive hotel booking management system with a frontend-backend separation architecture. The system provides dedicated interfaces for different user roles:

- **Mobile Users**: Browse hotel information, view room prices, complete bookings
- **Merchants**: Input hotel information, manage room types, update pricing and inventory
- **Administrators**: Audit hotel information, control publication status, platform management

The system implements a complete information audit workflow—hotel information submitted by merchants requires administrator approval before going live. It also supports virtual deletion (offline) functionality to ensure data safety and recoverability.

---

## Features

### User Side (Mobile)
- Homepage banner display and navigation
- Hotel listing search (location-based, keyword search, date filter, star rating filter)
- Hotel detail display (room types auto-sorted by price ascending)
- Long list optimization rendering

### Management Side (PC)
- **Merchant Features**
  - Hotel information input and editing
  - Room type and pricing management
  - Real-time data updates
- **Administrator Features**
  - Hotel information audit (Approved/Rejected/Pending)
  - Publication management (Online/Offline)
  - Virtual deletion and data recovery

### Technical Highlights
- Frontend-backend separation architecture, RESTful API design
- **SQLite lightweight local database**, no external database installation required
- Permission hierarchy and role management
- Virtual deletion mechanism for data safety
- Intelligent room type sorting (price ascending)
- In-memory caching for frequently accessed data

---

## Quick Start

### Prerequisites

- Node.js >= 16.x
- npm >= 8.x or yarn >= 1.22.x

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/EasyStay.git
   cd EasyStay
   ```

2. **Install dependencies**

   Server:
   ```bash
   cd server
   npm install
   ```

   Mobile client:
   ```bash
   cd client-mobile
   npm install
   ```

   PC management client:
   ```bash
   cd client-pc
   npm install
   ```

3. **Start services**

   Start backend server (default port 3000):
   ```bash
   cd server
   npm start
   ```

   Start mobile client (default port 3001):
   ```bash
   cd client-mobile
   npm start
   ```

   Start PC management client (default port 3002):
   ```bash
   cd client-pc
   npm start
   ```

4. **Access the application**

   - Mobile: http://localhost:3001
   - PC Management: http://localhost:3002
   - API Documentation: http://localhost:3000/api/v1/docs

---

## Project Structure

```
EasyStay/
├── client-mobile/          # Mobile frontend application (React)
├── client-pc/              # PC management frontend application (React)
├── server/                 # Backend service (Node.js + SQLite)
│   ├── config/             # Configuration files
│   │   ├── database.js     # SQLite connection & table initialization
│   │   └── cache.js        # In-memory cache
│   ├── controllers/        # Controllers (business logic)
│   ├── data/               # SQLite database file (auto-generated)
│   │   └── easystay.db     # SQLite database
│   ├── routes/             # API route handlers
│   ├── uploads/            # Uploaded image files
│   └── middlewares/        # Middleware (auth, upload, validation)
├── common/                 # Shared utilities and type definitions
├── docs/                   # Project documentation
│   ├── product/            # Product requirement documents
│   ├── technical/          # Technical specification documents
│   └── teamwork/           # Team collaboration documents
├── .gitignore
└── README.md
```

---

## Tech Stack

### Frontend
- **Framework**: React 18
- **State Management**: React Context / Hooks
- **HTTP Client**: Axios
- **UI Library**: Ant Design Mobile (Mobile) / Ant Design (PC)

### Backend
- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Data Storage**: SQLite (better-sqlite3)
- **Caching**: In-memory Map cache
- **Authentication**: JWT Token
- **Password Hashing**: bcryptjs

### Development Tools
- Git (Version Control)
- ESLint (Code Linting)
- Prettier (Code Formatting)

---

## API Endpoints

The system uses RESTful API design with base path `/api/v1`

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Mobile Endpoints
- `GET /mobile/home/banners` - Get homepage banners
- `GET /mobile/hotels` - Hotel listing search
- `GET /mobile/hotels/:id` - Get hotel details

### Management Endpoints
- `POST /merchant/hotels` - Input hotel information
- `PUT /merchant/hotels/:id` - Edit hotel information
- `PATCH /admin/audit/:hotelId` - Audit hotel information
- `PATCH /admin/publish/:hotelId` - Publish/unpublish hotel

> See [docs/technical/api_spec.md](docs/technical/api_spec.md) for details

---

## Data Structure

The system uses SQLite database (`server/data/easystay.db`) with four tables: `users`, `hotels`, `rooms`, and `orders`.

### Hotels Table
| Field | Type | Description |
|-------|------|-------------|
| `id` | TEXT | Unique hotel ID (UUID) |
| `name_cn` | TEXT | Hotel name (Chinese) |
| `name_en` | TEXT | Hotel name (English) |
| `address` | TEXT | Hotel address |
| `star_level` | INTEGER | Star rating (1-5) |
| `audit_status` | TEXT | Audit status (Pending/Approved/Rejected) |
| `is_offline` | INTEGER | Offline flag (0/1) |
| `tags` | TEXT | Tags (JSON array) |

### Users Table
| Field | Type | Description |
|-------|------|-------------|
| `id` | TEXT | Unique user ID |
| `phone` | TEXT | Phone number (mobile) |
| `username` | TEXT | Username (PC) |
| `password` | TEXT | Hashed password |
| `role` | TEXT | Role (user/merchant/admin) |

> See [docs/technical/data_schema.md](docs/technical/data_schema.md) for complete schema

---

## Documentation

| Document | Description |
|----------|-------------|
| [Product Requirements](docs/product/requirements_specification.md) | Product feature requirements |
| [Technical Specification](docs/technical/technical_specification.md) | Technical architecture design |
| [API Specification](docs/technical/api_spec.md) | API interface definitions |
| [Data Schema](docs/technical/data_schema.md) | Data model documentation |
| [Team Collaboration](docs/teamwork/teamwork_distribution.md) | Development team workflow |

---

## Development Guidelines

1. **API First**: All endpoint paths and response fields must strictly follow API specifications
2. **Frontend Mock**: Frontend can use local constant data for development before backend completion
3. **Real-time Updates**: Merchant data changes must update mobile side in real-time
4. **Virtual Deletion**: Offline operations use virtual deletion to ensure data recoverability
5. **Price Sorting**: Room type lists on detail pages must be sorted by price ascending

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by EasyStay Team**

**English** | [简体中文](./README.md)

</div>
