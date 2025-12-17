import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const reviewTemplates = [
  {
    rating: 5,
    comments: [
      'Absolutely love this product! Quality is top-notch and fits perfectly.',
      'Best purchase I made this year! Highly recommend to everyone.',
      'Amazing quality and fast delivery. Will definitely buy again!',
      'Perfect fit and excellent material. Worth every rupee!',
      'Outstanding product! Exceeded my expectations in every way.',
    ],
  },
  {
    rating: 4,
    comments: [
      'Great product overall. Minor fit issues but still satisfied.',
      'Good quality for the price. Would recommend with minor reservations.',
      'Nice product, delivery was a bit slow but worth the wait.',
      'Pretty good purchase. Fits well and looks great.',
      'Quality is good, just wish it came in more colors.',
    ],
  },
  {
    rating: 5,
    comments: [
      'Exactly as described! Very happy with this purchase.',
      'Superior quality and stylish design. Love it!',
      'This is my third purchase from StyleHub. Never disappointed!',
      'Fantastic product! My friends are asking where I got it.',
      'Premium quality at reasonable price. Highly satisfied!',
    ],
  },
  {
    rating: 4,
    comments: [
      'Good value for money. Comfortable and looks nice.',
      'Solid product. Could be better but overall satisfied.',
      'Nice addition to my wardrobe. Fits as expected.',
      'Quality is decent. Would buy again on sale.',
      'Pretty happy with this purchase. Minor stitching issues.',
    ],
  },
  {
    rating: 5,
    comments: [
      'Incredible! This is now my favorite item.',
      'Perfect in every way. Cannot fault it at all.',
      'Best quality I have seen in this price range.',
      'Impressed by the attention to detail. Excellent!',
      'This exceeded all my expectations. Five stars!',
    ],
  },
]

const reviewerNames = [
  'Rahul Sharma',
  'Priya Patel',
  'Amit Kumar',
  'Sneha Singh',
  'Vijay Reddy',
  'Ananya Gupta',
  'Rohan Malhotra',
  'Kavya Iyer',
  'Arjun Mehta',
  'Divya Nair',
  'Karan Verma',
  'Pooja Desai',
  'Sanjay Joshi',
  'Meera Rao',
  'Aditya Kapoor',
]

async function seedReviews() {
  console.log('🌱 Seeding reviews...')

  try {
    // Get all products
    const products = await prisma.product.findMany({
      select: { id: true, name: true },
    })

    console.log(`Found ${products.length} products`)

    // Get all users (we'll use existing users for reviews)
    let users = await prisma.user.findMany({
      select: { id: true, name: true },
    })

    // If no users exist, create demo users for reviews
    if (users.length === 0) {
      console.log('No users found, creating demo users for reviews...')
      const demoUsers = []
      for (let i = 0; i < 15; i++) {
        const user = await prisma.user.create({
          data: {
            email: `reviewer${i + 1}@example.com`,
            password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYuP.NWEyZu', // hashed "password"
            name: reviewerNames[i],
            isVerified: true,
            role: 'USER',
          },
        })
        demoUsers.push(user)
      }
      users = demoUsers
      console.log(`Created ${users.length} demo users`)
    }

    let reviewCount = 0

    // Add 3-5 reviews per product
    for (const product of products) {
      const numReviews = Math.floor(Math.random() * 3) + 3 // 3 to 5 reviews
      const usedUserIds = new Set<string>()

      for (let i = 0; i < numReviews; i++) {
        // Select a random user that hasn't reviewed this product yet
        let randomUser
        let attempts = 0
        do {
          randomUser = users[Math.floor(Math.random() * users.length)]
          attempts++
        } while (usedUserIds.has(randomUser.id) && attempts < 20)

        if (usedUserIds.has(randomUser.id)) continue

        usedUserIds.add(randomUser.id)

        // Select a random rating template
        const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)]
        const comment = template.comments[Math.floor(Math.random() * template.comments.length)]

        try {
          await prisma.review.create({
            data: {
              userId: randomUser.id,
              productId: product.id,
              rating: template.rating,
              comment: comment,
              isVerified: Math.random() > 0.3, // 70% verified purchases
              createdAt: new Date(
                Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000 // Random date within last 90 days
              ),
            },
          })
          reviewCount++
        } catch (error: any) {
          if (error.code === 'P2002') {
            // Unique constraint violation, skip
            continue
          }
          throw error
        }
      }
    }

    console.log(`✅ Successfully created ${reviewCount} reviews for ${products.length} products`)

    // Calculate and display average ratings
    const productsWithReviews = await prisma.product.findMany({
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    })

    console.log('\n📊 Review Statistics:')
    productsWithReviews.forEach((product) => {
      if (product.reviews.length > 0) {
        const avgRating = (
          product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
        ).toFixed(1)
        console.log(`  ${product.name}: ${product.reviews.length} reviews, ${avgRating}⭐ avg rating`)
      }
    })
  } catch (error) {
    console.error('❌ Error seeding reviews:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedReviews()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
