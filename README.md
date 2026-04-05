# Finance Dashboard Backend

A secure, role-based finance dashboard backend built with Node.js, Express, MongoDB, and TypeScript.

## Features

- **User Authentication**: Secure JWT-based authentication with Access and Refresh tokens.
- **RBAC (Role-Based Access Control)**: Three distinct roles - `Viewer`, `Analyst`, and `Admin`.
- **Financial Records**: Full CRUD operations for income and expense records with advanced filtering.
- **Dashboard Analytics**: Real-time aggregation of financial data, category-wise distributions, and monthly trends.
- **Robust Validation**: Input validation using Zod schemas.
- **Standardized Responses**: Unified API error and response formats.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Security**: bcryptjs, jsonwebtoken, cookie-parser, cors
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `.env`:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   CORS_ORIGIN=*
   ```

### Running the App

- **Development**:
  ```bash
  npm run dev
  ```
- **Build**:
  ```bash
  npm run build
  ```
- **Production**:
  ```bash
  npm start
  ```

## API Documentation

Testing guides for each phase are available in the `brain` directory:

- [Phase 2: Authentication](file:///home/rachit/.gemini/antigravity/brain/d08f3b73-66f6-4ba9-8ed8-0cff21a5c2be/postman_phase2.md)
- [Phase 3: Records Management](file:///home/rachit/.gemini/antigravity/brain/d08f3b73-66f6-4ba9-8ed8-0cff21a5c2be/postman_phase3.md)
- [Phase 4: Dashboard & Analytics](file:///home/rachit/.gemini/antigravity/brain/d08f3b73-66f6-4ba9-8ed8-0cff21a5c2be/postman_phase4.md)

## RBAC Matrix

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to users, records, and dashboard |
| **Analyst** | Access to view records and dashboard summaries |
| **Viewer** | Access to dashboard summaries only |
