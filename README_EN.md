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
- Hotel listing search (location-based, keyword search, date filter, star rating filter, price range)
- Hotel detail display (room types auto-sorted by price ascending)
- Long list optimization rendering (virtual list, pull-to-refresh, infinite scroll)
- User authentication (login, registration, email verification for password reset)
- Order management (create booking, booking list, booking details, cancel booking)
- Order countdown timer (15-minute payment deadline)
- Personal center (settings, language switching, about us)
- Internationalization support (Chinese/English)

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
   npm run dev
   ```

   Start PC management client (default port 3002):
   ```bash
   cd client-pc
   npm run dev
   ```

4. **Access the application**

   - Mobile: http://localhost:3001
   - PC Management: http://localhost:3002
   - API Documentation: http://localhost:3000/api/v1/docs

---

## Project Structure

```
EasyStay/
├── client-mobile/          # Mobile frontend application (React + TypeScript + Vite)
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
├── README.md               # Chinese documentation
└── README_EN.md            # English documentation
```

---

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **State Management**: React Context API (SearchContext, AuthContext)
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios
- **UI Library**: Ant Design Mobile 5 (Mobile) / Ant Design (PC)
- **Styling**: Tailwind CSS 3
- **Internationalization**: i18next
- **Date Handling**: date-fns
- **Testing**: Vitest + Testing Library

### Backend
- **Runtime**: Node.js
- **Web Framework**: Express.js
- **Data Storage**: SQLite (better-sqlite3)
- **Caching**: In-memory Map cache
- **Authentication**: JWT Token
- **Password Hashing**: bcryptjs

### Development Tools
- **Version Control**: Git
- **Code Linting**: ESLint
- **Code Formatting**: Prettier

### AI-Assisted Development (Vibe Coding)

This project is developed using Vibe Coding methodology with the following AI development tools:

| Tool | Description |
|------|-------------|
| **Trae CN** | ByteDance's AI programming assistant |
| **Trae** | International version of Trae AI coding tool |
| **Antigravity** | AI-assisted development tool |
| **Claude Code** | Anthropic's official CLI programming assistant |

**AI Models Used**:
- GLM-5
- Doubao-Seed-Code
- Gemini-3.1 Pro
- Claude Opus 4.6
- Claude Sonnet 4.6

---

## API Endpoints

The system uses RESTful API design with base path `/api/v1`

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Mobile Endpoints
- `GET /mobile/home/banners` - Get homepage banners
- `GET /mobile/home/popular-cities` - Get popular cities
- `GET /mobile/hotels` - Hotel listing search (multi-dimension filtering)
- `GET /mobile/hotels/:id` - Get hotel details
- `POST /mobile/bookings` - Create booking
- `GET /mobile/bookings` - Get booking list
- `GET /mobile/bookings/:id` - Get booking details
- `PATCH /mobile/bookings/:id/cancel` - Cancel booking

### Management Endpoints
- `POST /merchant/hotels` - Input hotel information
- `PUT /merchant/hotels/:id` - Edit hotel information
- `PATCH /admin/audit/:hotelId` - Audit hotel information
- `PATCH /admin/publish/:hotelId` - Publish/unpublish hotel

> See [docs/technical/api_spec.md](docs/technical/api_spec.md) for details

---

## Data Structure

The system uses SQLite database (`server/data/easystay.db`), containing the following four tables:

### Hotels Table

| Field | Type | Description |
|------|------|------|
| `id` | TEXT | Unique hotel ID (UUID) |
| `name_cn` | TEXT | Hotel name (Chinese) |
| `name_en` | TEXT | Hotel name (English) |
| `address` | TEXT | Hotel detailed address |
| `star_level` | INTEGER | Star rating (1-5) |
| `location` | TEXT | Location info (JSON: province, city, address, coordinates) |
| `description` | TEXT | Hotel description |
| `facilities` | TEXT | Facilities list (JSON array) |
| `rating` | REAL | Rating (0-5) |
| `image` | TEXT | Main image URL |
| `images` | TEXT | Image list (JSON array) |
| `tags` | TEXT | Tags (JSON array) |
| `price_start` | REAL | Starting price |
| `open_date` | TEXT | Opening date |
| `banner_url` | TEXT | Banner image URL |
| `audit_status` | TEXT | Audit status (Pending/Approved/Rejected) |
| `is_offline` | INTEGER | Offline flag (0/1) |
| `fail_reason` | TEXT | Audit rejection reason |
| `merchant_id` | TEXT | Merchant ID |
| `merchant_username` | TEXT | Merchant username |
| `created_at` | TEXT | Creation time |
| `updated_at` | TEXT | Update time |

### Rooms Table

| Field | Type | Description |
|------|------|------|
| `id` | TEXT | Unique room type ID (UUID) |
| `name` | TEXT | Room type name |
| `price` | REAL | Room type price |
| `capacity` | INTEGER | Capacity (persons) |
| `description` | TEXT | Room type description |
| `image_url` | TEXT | Room type image URL |
| `amenities` | TEXT | Amenities list (JSON array) |
| `hotelId` | TEXT | Hotel ID (foreign key) |

### Users Table

| Field | Type | Description |
|------|------|------|
| `id` | TEXT | Unique user ID (UUID) |
| `phone` | TEXT | Phone number (mobile login) |
| `email` | TEXT | Email (for password reset) |
| `username` | TEXT | Username (PC login) |
| `password` | TEXT | Hashed password (bcryptjs) |
| `name` | TEXT | User nickname |
| `avatar` | TEXT | User avatar URL |
| `role` | TEXT | Role (user/merchant/admin) |
| `created_at` | TEXT | Registration time |

### Orders Table

| Field | Type | Description |
|------|------|------|
| `id` | TEXT | Unique order ID |
| `user_id` | TEXT | Booking user ID (foreign key) |
| `hotel_id` | TEXT | Booked hotel ID (foreign key) |
| `room_id` | TEXT | Booked room type ID (foreign key) |
| `check_in_date` | TEXT | Check-in date (yyyy-MM-dd) |
| `check_out_date` | TEXT | Check-out date (yyyy-MM-dd) |
| `guests` | INTEGER | Number of guests |
| `total_price` | REAL | Total order price |
| `status` | TEXT | Order status (pending/confirmed/completed/cancelled) |
| `payment_status` | TEXT | Payment status (unpaid/paid/refunded) |
| `guestName` | TEXT | Guest name |
| `guestPhone` | TEXT | Guest phone number |
| `hotelName` | TEXT | Hotel name (redundant field) |
| `hotelImage` | TEXT | Hotel image (redundant field) |
| `roomType` | TEXT | Room type name (redundant field) |
| `nights` | INTEGER | Number of nights |
| `created_at` | TEXT | Creation time |
| `updated_at` | TEXT | Update time |

> For complete definitions, see [docs/technical/data_schema.md](docs/technical/data_schema.md)

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
