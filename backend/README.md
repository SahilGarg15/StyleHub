# StyleHub Backend API

Backend API for StyleHub E-commerce Platform built with Node.js, Express, Prisma, and PostgreSQL.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your database credentials and other configuration.

3. Set up Prisma and database:
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

4. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-email` - Verify email with OTP
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with OTP

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get products by category

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/:id/track` - Track order

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/product/:productId` - Get product reviews
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/addresses` - Get user addresses
- `POST /api/users/addresses` - Create address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address
- `GET /api/users/favorites` - Get user favorites
- `POST /api/users/favorites/:productId` - Add to favorites
- `DELETE /api/users/favorites/:productId` - Remove from favorites

## Database

This project uses PostgreSQL with Prisma ORM. You can use:
- Local PostgreSQL installation
- Docker PostgreSQL container
- Cloud PostgreSQL (Neon, Supabase, Railway, etc.)

### Using Neon (Recommended for production)
1. Create a free account at https://neon.tech
2. Create a new project
3. Copy the connection string to your `.env` file

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with sample data
- `npm run prisma:studio` - Open Prisma Studio (GUI for database)
