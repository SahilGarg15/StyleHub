import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Checking database connection...')
  
  // Test connection
  try {
    await prisma.$connect()
    console.log('✅ Connected to database')
  } catch (error) {
    console.error('❌ Failed to connect to database:', error)
    process.exit(1)
  }

  // Check if data already exists
  const productCount = await prisma.product.count()
  console.log(`Found ${productCount} products in database`)
  
  if (productCount > 0) {
    console.log('Database already has data. Skipping seed.')
    return
  }

  console.log('Seeding database...')

  // Create a demo user for login testing
  const hashedPassword = await bcrypt.hash('demo123', 12)

  const testUser = await prisma.user.upsert({
    where: { email: 'demo@stylehub.com' },
    update: {},
    create: {
      email: 'demo@stylehub.com',
      password: hashedPassword,
      name: 'Demo User',
      phone: '+91 98765 43210',
      isVerified: true,
      role: 'USER',
    },
  })

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@stylehub.com' },
    update: {},
    create: {
      email: 'admin@stylehub.com',
      password: hashedPassword,
      name: 'Admin User',
      phone: '+91 98765 43211',
      isVerified: true,
      role: 'ADMIN',
    },
  })

  console.log(`Created users: ${testUser.email}, ${adminUser.email}`)

  // Create products
  const products = [
    {
      name: 'Classic White Sneakers',
      description: 'Comfortable and stylish white sneakers perfect for everyday wear',
      category: 'Shoes',
      price: 2499,
      basePrice: 3499,
      stock: 50,
      sku: 'SH-SHOE-001',
      image: '/images/shoes/white-sneakers-1.jpg',
      images: JSON.stringify(['/images/shoes/white-sneakers-1.jpg', '/images/shoes/white-sneakers-2.jpg']),
      sizes: JSON.stringify(['6', '7', '8', '9', '10', '11']),
      colors: JSON.stringify(['White', 'Off-White']),
      inStock: true,
      isActive: true,
    },
    {
      name: 'Premium Leather Jacket',
      description: 'High-quality genuine leather jacket with modern design',
      category: 'Outerwear',
      price: 8999,
      basePrice: 12999,
      stock: 25,
      sku: 'SH-OUT-001',
      image: '/images/outerwear/leather-jacket-1.jpg',
      images: JSON.stringify(['/images/outerwear/leather-jacket-1.jpg']),
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['Black', 'Brown']),
      inStock: true,
      isActive: true,
    },
    // Add more products as needed
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }

  console.log(`✅ Seeded ${products.length} products`)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
