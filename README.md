# 🛍️ StyleHub - Full-Stack E-Commerce Platform

> A complete Indian fashion e-commerce platform with React frontend and Node.js backend

StyleHub is a modern, production-ready e-commerce application featuring user authentication, product catalog management, shopping cart, order processing with unique tracking IDs, product reviews, and an admin dashboard. Built with TypeScript, it includes 39 pre-seeded products across fashion categories with real product images and reviews.

## 📸 Screenshots

![StyleHub Banner](./stylehub-showcase/public/fashion-clothing-store-hero-banner.png)

## ✨ Key Features

### For Customers
- 🔐 **Secure Authentication** - JWT-based login/signup with bcrypt password hashing
- 🛍️ **Product Catalog** - 39 products across Men, Women, Kids & Accessories categories
- 🔍 **Advanced Filters** - Search by category, price (₹100-₹10,000), size, and brand
- ⭐ **Reviews & Ratings** - 5-star rating system with 195+ pre-seeded reviews
- 🛒 **Shopping Cart** - Add/remove items with real-time price calculation including GST
- ❤️ **Wishlist** - Save favorite products
- 📦 **Order Management** - Place orders with Cash on Delivery option
- 🔍 **Order Tracking** - Track orders using Order ID, Tracking ID, or Order Number
- 👤 **Profile Management** - Update profile, manage multiple shipping addresses
- 📱 **Fully Responsive** - Works on mobile, tablet, and desktop

### For Admins
- 📊 **Admin Dashboard** - Overview of orders, products, and customers
- 📝 **Order Management** - View all orders and update status (Pending → Processing → Shipped → Delivered)
- 📈 **Analytics** - Product count, category breakdown, user statistics

## 🛠️ Tech Stack

### Frontend (`stylehub-showcase/`)
- **React 18** with **TypeScript** - Type-safe component development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - High-quality accessible components (40+ components)
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Context API** - Global state management (auth, cart, orders, wishlist)
- **Lucide React** - Beautiful icon library

### Backend (`backend/`)
- **Node.js 18+** with **TypeScript**
- **Express 4.21** - Web framework
- **Prisma 5.22** - Type-safe ORM with PostgreSQL
- **JWT** - Token-based authentication (7-day expiry)
- **bcryptjs** - Password hashing
- **express-validator** - Request validation
- **CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** - Primary database
- **Prisma ORM** - Type-safe database access
- **11 Models** - User, Product, Order, OrderItem, OrderTracking, TrackingStep, Review, Address, OTPCode
- **Migrations** - Version-controlled schema changes

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **npm** or **bun** package manager
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/SahilGarg15/StyleHub.git
cd StyleHub
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `backend/.env` with your configuration:**

```env
DATABASE_URL="postgresql://username:password@localhost:5432/stylehub"
JWT_SECRET="your-super-secret-key-min-32-characters"
JWT_EXPIRES_IN="7d"
PORT=5000
```

**Initialize Database:**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations to create tables
npx prisma migrate dev

# Seed database with products and users
npx prisma db seed

# Seed reviews for all products
npx tsx prisma/seedReviews.ts
```

**Start Backend Server:**

```bash
npm run dev
```

✅ Backend running at `http://localhost:5000`

### 3. Frontend Setup

Open a **new terminal** window:

```bash
cd stylehub-showcase

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `stylehub-showcase/.env`:**

```env
VITE_API_URL=http://localhost:5000/api
```

**Start Frontend Server:**

```bash
npm run dev
```

✅ Frontend running at `http://localhost:8080`

### 4. Test the Application

Open your browser to `http://localhost:8080` and login with:

**Admin User:**
- UserName: `demo123`
- Password: `demo12`

## 📁 Project Structure

```
StyleHub/
├── README.md                           # This file
├── .gitignore                          # Git ignore rules
│
├── backend/                            # Express + Prisma backend
│   ├── .env.example                    # Environment template
│   ├── package.json                    # Backend dependencies
│   ├── tsconfig.json                   # TypeScript config
│   │
│   ├── prisma/
│   │   ├── schema.prisma               # Database schema (11 models)
│   │   ├── seed.ts                     # Seeds 39 products + 2 users
│   │   ├── seedReviews.ts              # Seeds 5-8 reviews per product
│   │   └── migrations/                 # Database migrations
│   │
│   └── src/
│       ├── server.ts                   # Express server entry
│       ├── controllers/                # Route handlers
│       │   ├── authController.ts       # Authentication logic
│       │   ├── productController.ts    # Product CRUD
│       │   ├── orderController.ts      # Order management
│       │   ├── reviewController.ts     # Review management
│       │   └── userController.ts       # User profile & favorites
│       ├── middleware/
│       │   ├── auth.ts                 # JWT verification
│       │   └── errorHandler.ts         # Global error handling
│       ├── routes/                     # API route definitions
│       └── utils/                      # Helpers (JWT, generators, errors)
│
└── stylehub-showcase/                  # React + Vite frontend
    ├── .env.example                    # Frontend environment template
    ├── package.json                    # Frontend dependencies
    ├── vite.config.ts                  # Vite configuration
    ├── tailwind.config.ts              # Tailwind CSS config
    │
    ├── public/                         # Static assets (100+ product images)
    │
    └── src/
        ├── main.tsx                    # React entry point
        ├── App.tsx                     # Root component + routing
        │
        ├── components/
        │   ├── layout/                 # Header, Footer, Layout
        │   ├── product/                # Product cards, filters, reviews
        │   └── ui/                     # shadcn/ui components (40+)
        │
        ├── pages/                      # Page components
        │   ├── Index.tsx               # Homepage
        │   ├── Shop.tsx                # Product listing
        │   ├── ProductDetail.tsx       # Product details
        │   ├── Cart.tsx                # Shopping cart
        │   ├── Checkout.tsx            # Checkout flow
        │   ├── OrderConfirmation.tsx   # Order success
        │   ├── TrackOrder.tsx          # Order tracking
        │   ├── Profile.tsx             # User profile
        │   ├── Wishlist.tsx            # Saved items
        │   ├── Auth.tsx                # Login/Register
        │   ├── AdminDashboard.tsx      # Admin panel
        │   ├── About.tsx               # About page
        │   ├── Contact.tsx             # Contact page
        │   └── NotFound.tsx            # 404 page
        │
        ├── contexts/
        │   └── AppContext.tsx          # Global state (auth, cart, orders, wishlist)
        │
        ├── hooks/                      # Custom React hooks
        │   ├── useAuth.ts              # Authentication hook
        │   ├── useCart.ts              # Cart management
        │   ├── useOrders.ts            # Order management
        │   └── useWishlist.ts          # Wishlist management
        │
        ├── lib/
        │   ├── api.ts                  # Axios instance with interceptors
        │   ├── apiServices.ts          # API service functions
        │   └── utils.ts                # Helper utilities
        │
        └── types/
            └── index.ts                # TypeScript type definitions
```

## 🔌 API Endpoints

### Authentication (`/api/auth`)
```
POST   /register        Register new user
POST   /login           Login (returns JWT token)
GET    /me              Get authenticated user (requires token)
```

### Products (`/api/products`)
```
GET    /                Get all products (supports filters)
GET    /:id             Get product by ID (includes reviews)
```

**Query Parameters:**
- `category` - Filter by category (Men, Women, Kids, Accessories)
- `subcategory` - Filter by subcategory
- `minPrice`, `maxPrice` - Price range filter
- `size` - Filter by size
- `brand` - Filter by brand
- `sort` - Sort by (price_asc, price_desc, popular, newest)

### Orders (`/api/orders`)
```
POST   /                Create new order (requires auth)
GET    /                Get user's orders (requires auth)
GET    /:id             Get order details
PATCH  /:id/status      Update order status (requires auth)
GET    /:id/track       Track order by ID/trackingId/orderNumber
GET    /number/:num     Get order by order number
```

### Users (`/api/users`)
```
GET    /favorites            Get favorited products (requires auth)
POST   /favorites/:id        Add product to favorites (requires auth)
DELETE /favorites/:id        Remove from favorites (requires auth)
```

### Reviews (`/api/reviews`)
```
GET    /product/:id          Get reviews for product
POST   /                     Create review (requires auth)
```

**Authentication:** Protected routes require `Authorization: Bearer <token>` header

## 💾 Database Schema

The application uses **11 Prisma models**:

| Model | Description | Key Fields |
|-------|-------------|------------|
| **User** | User accounts | email, password (hashed), name, phone, role |
| **Product** | Product catalog | name, price, category, subcategory, sizes, images |
| **Review** | Product reviews | rating (1-5), title, comment, userName |
| **Order** | Customer orders | orderNumber, trackingId, status, total |
| **OrderItem** | Items in order | productId, quantity, price, size |
| **OrderTracking** | Order status | status, location, currentStep |
| **TrackingStep** | Tracking events | step, description, timestamp |
| **Address** | Shipping addresses | street, city, state, postalCode, country |
| **OTPCode** | Verification codes | code, expiresAt |

**Relationships:**
- User → Orders (one-to-many)
- User → Reviews (one-to-many)
- Product → Reviews (one-to-many)
- Order → OrderItems (one-to-many)
- Order → OrderTracking (one-to-one)

**Seeded Data:**
- ✅ 39 Products (Traditional & Western wear)
- ✅ 195+ Reviews (5-8 per product)
- ✅ 2 Users (admin + test user)

## 🧪 Testing Checklist

- [ ] **Register**: Create new account at `/auth`
- [ ] **Login**: Login with `user@stylehub.com` / `user123`
- [ ] **Browse**: Visit `/shop` and filter products
- [ ] **Product**: Click product to view details and reviews
- [ ] **Cart**: Add items to cart, adjust quantities
- [ ] **Wishlist**: Toggle heart icon to save favorites
- [ ] **Checkout**: Complete order with shipping details
- [ ] **Track**: Copy tracking ID and track at `/track-order`
- [ ] **Profile**: View order history and manage addresses
- [ ] **Admin**: Login as admin and view dashboard at `/admin`

## 🚢 Deployment Guide

### Backend (Railway / Render / Heroku)

1. **Create PostgreSQL database** (e.g., Neon, Railway)

2. **Deploy Backend:**
   - Connect GitHub repository
   - Set root directory: `backend`
   - Build command: `npm install && npx prisma generate && npm run build`
   - Start command: `npm start`

3. **Environment Variables:**
   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname
   JWT_SECRET=your-production-secret-min-32-chars
   JWT_EXPIRES_IN=7d
   PORT=5000
   ```

4. **Run Migrations:**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   npx tsx prisma/seedReviews.ts
   ```

### Frontend (Vercel / Netlify)

1. **Deploy Frontend:**
   - Connect GitHub repository
   - Base directory: `stylehub-showcase`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node version: `18.x`

2. **Environment Variable:**
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```

## 🐛 Troubleshooting

### Backend Won't Start

```bash
# Check PostgreSQL is running
# Windows: services.msc → PostgreSQL
# Mac: brew services list

# Regenerate Prisma Client
cd backend
npx prisma generate

# Check port availability
netstat -an | findstr :5000  # Windows
lsof -i :5000                # Mac/Linux
```

### Database Errors

```bash
cd backend

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Re-run migrations
npx prisma migrate deploy

# Reseed data
npx prisma db seed
npx tsx prisma/seedReviews.ts
```

### Frontend Issues

```bash
cd stylehub-showcase

# Check .env exists and has correct API URL
cat .env

# Verify backend is running
curl http://localhost:5000/api/products

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Common Problems

**Authentication not persisting:**
- Check browser localStorage for `authToken` key
- Verify JWT_SECRET is set in backend `.env`
- Check browser console for auth errors

**CORS errors:**
- Ensure frontend URL is correct in backend CORS config
- Check `VITE_API_URL` in frontend `.env`

**Images not loading:**
- Images are in `stylehub-showcase/public/` folder
- Check vite.config.ts publicDir setting

## 📝 Environment Variables Reference

### Backend `.env`
```env
# Database connection (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/stylehub"

# JWT configuration
JWT_SECRET="your-super-secret-key-minimum-32-characters-long"
JWT_EXPIRES_IN="7d"

# Server port
PORT=5000
```

### Frontend `.env`
```env
# Backend API URL (include /api at the end)
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👨‍💻 Author

**Sahil Garg**
- GitHub: [@SahilGarg15](https://github.com/SahilGarg15)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/sahilgarg15/)

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful and accessible UI components
- **Prisma** - Next-generation ORM for Node.js
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible components
- **Lucide** - Beautiful icon library
- **Neon** - Serverless PostgreSQL

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Open an issue on [GitHub Issues](https://github.com/SahilGarg15/StyleHub/issues)
3. Contact: gargsahil156@gmail.com

---

<div align="center">

**Built with ❤️ using React, TypeScript, Node.js, and PostgreSQL**

⭐ Star this repo if you find it helpful!

[Report Bug](https://github.com/SahilGarg15/StyleHub/issues) · [Request Feature](https://github.com/SahilGarg15/StyleHub/issues)

</div>
