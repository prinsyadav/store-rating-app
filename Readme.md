# Store Rating Application

A comprehensive web application that allows users to submit ratings for stores. The platform features a role-based authorization system with three distinct user types: System Administrator, Normal User, and Store Owner.

## Features

### System Administrator

- Add new stores, normal users, and admin users
- View dashboard with statistics (total users, stores, ratings)
- Manage users (add, view, filter, update)
- Manage stores (add, view, filter)
- Filter listings by Name, Email, Address, and Role

### Normal User

- Sign up and login to the platform
- Update password
- View and search stores
- Submit and modify ratings for stores (1-5 scale)

### Store Owner

- Login to dedicated dashboard
- Update password
- View users who've rated their store
- Monitor store's average rating

## Technologies

### Frontend

- React with Vite
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling

### Backend

- Node.js with Express
- PostgreSQL database with Sequelize ORM
- JWT for authentication
- bcrypt for password hashing

## Installation

### Prerequisites

- Node.js (v18+)
- npm or yarn
- PostgreSQL database

### Backend Setup

1. Navigate to the backend directory:

   ```
   cd store-rating-app/backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key

   # Database configuration
   DB_USERNAME=postgres_username
   DB_PASSWORD=postgres_password
   DB_NAME=store_rating
   DB_HOST=localhost
   DB_PORT=5432
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```
   cd store-rating-app/frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with:

   ```
   VITE_API_URL=http://localhost:3000/api
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Usage

### Default Admin Account

- Email: admin@example.com
- Password: Admin@123456

### System Administrator

1. Login with admin credentials
2. Use the dashboard to view system statistics
3. Add and manage users and stores
4. Apply filters to find specific users or stores

### Normal User

1. Register a new account or login
2. Browse available stores
3. Submit ratings for stores (1-5 stars)
4. Modify your ratings as needed

### Store Owner

1. Login with store owner credentials
2. View your store's average rating
3. See which users have rated your store

## Validation Rules

- **Name**:

  - Minimum 20 characters
  - Maximum 60 characters

- **Address**:

  - Maximum 400 characters

- **Password**:

  - 8-16 characters
  - Must include at least one uppercase letter
  - Must include at least one special character

- **Email**:
  - Standard email validation

## Database Schema

The application uses the following main entities:

- Users (Admin, User, Store Owner)
- Stores
- Ratings

## Additional Features

- Sorting on all tables (ascending/descending)
- Responsive design for mobile and desktop
- Protected routes based on user roles
- Form validation for all input fields
