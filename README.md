# StyleHub - Full-Stack E-Commerce Platform

A modern, full-featured e-commerce platform built with React, TypeScript, Node.js, Express, Prisma, and PostgreSQL. Features include user authentication, product management, shopping cart, order tracking, reviews, and an admin dashboard.

![StyleHub Banner](./stylehub-showcase/public/fashion-clothing-store-hero-banner.png)

## 🚀 Features

### Customer Features
- **User Authentication**: Secure JWT-based authentication with email/password
- **Product Browsing**: Browse products by categories (Men, Women, Kids, Accessories)
- **Advanced Filtering**: Filter by price range, size, brand, and sort options
- **Product Reviews**: View and submit product reviews with ratings
- **Shopping Cart**: Add, update, and remove items from cart
- **Wishlist**: Save favorite products for later
- **Order Management**: Place orders with COD payment option
- **Order Tracking**: Track orders with unique tracking IDs
- **Profile Management**: Update personal information and addresses
- **Recently Viewed**: Keep track of recently viewed products

### Admin Features
- **Order Management**: View and update order statuses
- **Product Statistics**: View total products and categories
- **Customer Overview**: Monitor registered users
- **Order Overview**: Track pending, processing, and completed orders

### Technical Features
- **Full-Stack TypeScript**: End-to-end type safety
- **RESTful API**: Well-structured backend API with Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with 7-day expiry
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: shadcn/ui components with Radix UI primitives
- **State Management**: React Context API for global state
- **Form Validation**: Comprehensive validation on frontend and backend
- **Error Handling**: Global error handling with custom error classes
- **Internationalization**: Indian localization (INR currency, GST)

## 📋 Prerequisites

- Node.js 18+ and npm/bun
- PostgreSQL database (or Neon serverless PostgreSQL)
- Git

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/SahilGarg15/StyleHub.git
cd StyleHub
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

Configure your `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/stylehub"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=5000
```

Run database migrations and seed data:

```bash
npx prisma migrate dev
npx prisma db seed
npx tsx prisma/seedReviews.ts  # Add product reviews
```

Start the backend server:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd stylehub-showcase
npm install

# Create .env file
cp .env.example .env
```

Configure your `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:8080`

## 📁 Project Structure

```
StyleHub/
├── backend/                    # Node.js Express backend
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   ├── seed.ts            # Seed products and users
│   │   └── seedReviews.ts     # Seed product reviews
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Auth and error middleware
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Helper functions
│   │   └── index.ts           # Server entry point
│   └── package.json
│
└── stylehub-showcase/         # React TypeScript frontend
    ├── public/                # Static assets and product images
    ├── src/
    │   ├── components/        # Reusable UI components
    │   │   ├── layout/        # Layout components (Header, Footer)
    │   │   ├── product/       # Product-related components
    │   │   └── ui/            # shadcn/ui components
    │   ├── contexts/          # React Context providers
    │   ├── hooks/             # Custom React hooks
    │   ├── lib/               # Utilities and API services
    │   ├── pages/             # Page components
    │   ├── types/             # TypeScript type definitions
    │   └── App.tsx            # Main app component
    └── package.json

```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID

### Orders
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/status` - Update order status (protected)
- `GET /api/orders/:id/track` - Track order

### Users
- `GET /api/users/favorites` - Get user favorites (protected)
- `POST /api/users/favorites/:productId` - Add to favorites (protected)
- `DELETE /api/users/favorites/:productId` - Remove from favorites (protected)

## 🎨 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Query** - Server state management
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - CORS handling

## 💾 Database Schema

### Main Models
- **User**: User accounts with authentication
- **Product**: Product catalog with categories
- **Order**: Customer orders with tracking
- **OrderItem**: Individual items in orders
- **OrderTracking**: Order status tracking
- **TrackingStep**: Tracking timeline steps
- **Review**: Product reviews and ratings
- **Address**: User shipping addresses
- **OTPCode**: Email verification codes

## 🔐 Default Credentials

After seeding the database, you can use these credentials:

**Admin Account:**
- Email: `admin@stylehub.com`
- Password: `admin123`

**Test User:**
- Email: `user@stylehub.com`
- Password: `user123`

## 🚢 Deployment

### Backend Deployment (Railway/Render)

1. Create a new service and connect your GitHub repo
2. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `PORT`
3. Build command: `cd backend && npm install && npx prisma generate && npx prisma migrate deploy`
4. Start command: `cd backend && npm start`

### Frontend Deployment (Vercel/Netlify)

1. Create a new project and connect your GitHub repo
2. Set build settings:
   - Base directory: `stylehub-showcase`
   - Build command: `npm run build`
   - Output directory: `dist`
3. Set environment variable:
   - `VITE_API_URL`: Your deployed backend URL

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=           # PostgreSQL connection string
JWT_SECRET=             # Secret key for JWT tokens
JWT_EXPIRES_IN=7d       # Token expiration time
PORT=5000               # Server port
```

### Frontend (.env)
```env
VITE_API_URL=           # Backend API URL (e.g., http://localhost:5000/api)
```

## 🧪 Testing

### Test User Registration
1. Go to `/auth` page
2. Click "Sign Up"
3. Fill in registration form
4. Login with created credentials

### Test Order Flow
1. Browse products at `/shop`
2. Add items to cart
3. Go to `/cart`
4. Proceed to checkout at `/checkout`
5. Fill in shipping details
6. Place order with COD
7. View order confirmation
8. Track order at `/track-order`

## 🐛 Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Run `npx prisma generate`
- Check port 5000 is not in use

### Frontend won't start
- Verify VITE_API_URL in .env
- Check backend is running on correct port
- Clear node_modules and reinstall

### Orders not showing
- Ensure you're logged in
- Check backend console for errors
- Verify JWT token is being sent (check Network tab)

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Sahil Garg**
- GitHub: [@SahilGarg15](https://github.com/SahilGarg15)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Prisma](https://www.prisma.io/) for the excellent ORM
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Lucide](https://lucide.dev/) for icons

---

Made with ❤️ by Sahil Garg
