const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Define subcategory mappings
const subcategoryMappings = {
  // Men's Attire
  'Royal Blue Silk Kurta': 'attire',
  'Burgundy Silk Sherwani': 'attire',
  'Traditional White Dhoti Kurta Set': 'attire',
  'Embroidered Nehru Jacket': 'attire',
  'White Cotton Formal Shirt': 'attire',
  'Black Formal Trousers': 'attire',
  'Black Leather Jacket': 'attire',
  'Dark Blue Slim Fit Jeans': 'attire',
  
  // Men's Footwear
  'Premium Leather Formal Shoes': 'footwear',
  'Traditional Leather Mojari': 'footwear',
  
  // Men's Accessories
  'Genuine Leather Belt': 'accessories',
  'Traditional Watch': 'accessories',
  'Silk Pocket Square': 'accessories',
  
  // Women's Attire
  'Black High Waist Trousers': 'attire',
  'Classic Black Skirt': 'attire',
  'Red Embroidered Saree': 'attire',
  'Designer Silk Kurta': 'attire',
  
  // Women's Footwear
  'Traditional Ethnic Sandals': 'footwear',
  
  // Women's Accessories
  'Traditional Ethnic Jewelry Set': 'accessories',
  'Embroidered Handbag': 'accessories',
  
  // Children's Attire
  'Boys Kurta Pajama Set': 'attire',
  'Boys Bandhgala Set': 'attire',
  'Boys Casual Shirt': 'attire',
  'Girls Pink Lehenga Choli': 'attire',
  'Girls Anarkali Dress': 'attire',
  'Girls Pink Party Dress': 'attire',
  'Girls Denim Skirt': 'attire',
  'Girls Ghagra Set': 'attire',
  'Girls Sharara Set': 'attire',
  'Kids Colorful T-Shirt': 'attire',
  'Kids Denim Jacket': 'attire',
};

async function updateSubcategories() {
  console.log('Updating product subcategories...\n');
  
  let updated = 0;
  let notFound = 0;
  
  for (const [productName, subcategory] of Object.entries(subcategoryMappings)) {
    try {
      const product = await prisma.product.findFirst({
        where: { name: productName }
      });
      
      if (product) {
        await prisma.product.update({
          where: { id: product.id },
          data: { subcategory }
        });
        console.log(`✓ Updated: ${productName} -> ${subcategory}`);
        updated++;
      } else {
        console.log(`✗ Not found: ${productName}`);
        notFound++;
      }
    } catch (error) {
      console.error(`✗ Error updating ${productName}:`, error.message);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Updated: ${updated}`);
  console.log(`   Not found: ${notFound}`);
  console.log(`   Total: ${Object.keys(subcategoryMappings).length}`);
}

updateSubcategories()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
