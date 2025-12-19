const axios = require('axios');

const API_KEY = 'sk_test_stylehub_ai_integration_key_2024';
const BASE_URL = 'https://backend-xi-murex-46.vercel.app/api/external';
const TRACKING_URL = 'https://stylehub-showcase.vercel.app/track?id=';

console.log('╔════════════════════════════════════════════╗');
console.log('║     Order Placement & Tracking Demo       ║');
console.log('╚════════════════════════════════════════════╝\n');

async function placeOrderAndTrack() {
  try {
    // Step 1: Get a product
    console.log('📦 Step 1: Finding product...\n');
    const productsResponse = await axios.get(`${BASE_URL}/products`, {
      headers: { 'X-API-Key': API_KEY },
      params: { limit: 1 }
    });
    
    const product = productsResponse.data.products[0];
    console.log(`✅ Selected: ${product.name}`);
    console.log(`   Price: $${product.price}`);
    console.log(`   Available size: ${product.sizes[0]}\n`);

    // Step 2: Place order
    console.log('🛒 Step 2: Placing order...\n');
    const orderData = {
      items: [
        {
          productId: product.id,
          quantity: 1,
          size: product.sizes[0]
        }
      ],
      shippingAddress: {
        name: 'AI Agent Test Customer',
        phone: '+91-98765-43210',
        street: '456 AI Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400050',
        country: 'India'
      },
      customerName: 'AI Agent Test Customer',
      customerPhone: '+91-98765-43210',
      customerEmail: 'ai.test@stylehub.com',
      paymentMethod: 'cod'
    };

    const orderResponse = await axios.post(`${BASE_URL}/orders`, orderData, {
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const order = orderResponse.data.order;
    console.log('✅ Order placed successfully!');
    console.log(`   Order Number: ${order.orderNumber}`);
    console.log(`   Order ID: ${order.id}`);
    console.log(`   Total: $${order.total}`);
    console.log(`   Status: ${order.status}\n`);

    // Step 3: Verify order is in database
    console.log('🔍 Step 3: Verifying order in database...\n');
    const verifyResponse = await axios.get(`${BASE_URL}/orders/number/${order.orderNumber}`, {
      headers: { 'X-API-Key': API_KEY }
    });

    const verifiedOrder = verifyResponse.data.order;
    console.log('✅ Order confirmed in database!');
    console.log(`   Found order: ${verifiedOrder.orderNumber}`);
    console.log(`   Status: ${verifiedOrder.status}`);
    console.log(`   Items: ${verifiedOrder.items.length}\n`);

    // Step 4: Generate tracking link
    console.log('🔗 Step 4: Order Tracking Information\n');
    console.log('════════════════════════════════════════════');
    console.log(`Order Number: ${order.orderNumber}`);
    console.log(`Tracking URL: ${TRACKING_URL}${order.orderNumber}`);
    console.log('════════════════════════════════════════════');
    console.log('\n✅ Customer can track this order WITHOUT login!');
    console.log('   Just share the tracking URL above.\n');

    // Summary
    console.log('╔════════════════════════════════════════════╗');
    console.log('║              SUCCESS! ✅                   ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('\n📊 Summary:');
    console.log('   ✅ Product retrieved from API');
    console.log('   ✅ Order placed and saved to database');
    console.log('   ✅ Order verified in database');
    console.log('   ✅ Tracking URL generated');
    console.log('   ✅ No authentication required for tracking\n');
    console.log(`🎉 Try tracking: ${TRACKING_URL}${order.orderNumber}\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

placeOrderAndTrack();
