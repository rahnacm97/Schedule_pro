# 4N EcoTech - Appointment Management System

A premium, modern appointment scheduling platform that allows users to manage their availability and let others book meetings effortlessly.

## Overview

4N EcoTech is a full-stack scheduling solution with a focus on premium design, ease of use, and robust functionality. It synchronizes with calendars to prevent double bookings and provides a seamless interface for both hosts and guests.

## Features

- **Dynamic Booking Flow**: Public booking pages with customizable meeting durations (30 min, 60 min, or custom).
- **User Dashboard**: Real-time stats and a focused "Upcoming Appointments" view.
- **Appointment Management**: Comprehensive list of all bookings with pagination, status filtering (Scheduled, Completed, Cancelled), and search.
- **Detailed Insights**: View full meeting notes and context via a specialized "Eye" icon modal.
- **Availability Control**: Fine-grained weekly schedule configuration.
- **Premium UI/UX**: Theme-aware interface (Dark/Light mode) with smooth micro-animations and responsive design.
- **Secure Auth**: JWT-based authentication system with profile management including name and booking link customization.

## Technology Stack

### Frontend

- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS with modern tokens & Tailwind CSS
- **State/Form**: React Hook Form + Zod validation
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **API**: Axios with interceptors

### Backend

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (Mongoose)
- **Security**: JWT Authentication, bcryptjs password hashing
- **Validation**: Joi (Booking flow)
- **Tooling**: ESLint 9+ (Flat config)

## Project Structure

```text
4N EcoTech/
├── frontend/           # React + Vite application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Auth and Theme providers
│   │   ├── pages/      # Feature pages (Booking, Dashboard, etc.)
│   │   └── shared/     # Constants, Enums, and Routes
├── backend/            # Express.js API
│   ├── src/
│   │   ├── controllers/# Request handlers
│   │   ├── models/     # Mongoose schemas
│   │   ├── repositories/# Database abstraction layer
│   │   ├── routes/     # API endpoints
│   │   └── services/   # Business logic
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or via Atlas)

### 1. Setup Backend

```bash
cd backend
npm install
npm run dev
```

### 2. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

## Quality Control

Both projects are equipped with **ESLint**. Run linting checks using:

```bash
npm run lint
```

## License

Copyright © 2026 4N EcoTech. All rights reserved.
