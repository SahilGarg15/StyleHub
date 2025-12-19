const axios = require('axios');

const BASE_URL = 'https://backend-xi-murex-46.vercel.app/api';

console.log('╔════════════════════════════════════════════╗');
console.log('║       Guest Checkout Test (No Login)      ║');
console.log('╚════════════════════════════════════════════╝\n');

async function testGuestCheckout() {
  try {
    // Step 1: Get a product (no auth needed)
    console.log('📦 Step 1: Browsing products (no login)...\n');
    const productsResponse = await axios.get(`${BASE_URL}/products`, {
      params: { limit: 1, category: 'women' }
    });
    
    const product = productsResponse.data.products[0];
    console.log(`✅ Selected: ${product.name}`);
    console.log(`   Price: $${product.price}`);
    console.log(`   Size: ${product.sizes[0]}\n`);

    // Step 2: Place order WITHOUT authentication
    console.log('🛒 Step 2: Placing order as GUEST (no login)...\n');
    const orderData = {
      items: [
        {
          productId: product.id,
          quantity: 1,
          size: product.sizes[0]
        }
      ],
      shippingAddress: {
        street: '789 Guest Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400050',
        country: 'India'
      },
      customerName: 'Guest Customer',
      customerPhone: '+91-98765-43210',
      customerEmail: 'guest@example.com',
      paymentMethod: 'COD'
    };

    // NO AUTH TOKEN - this is the key test!
    const orderResponse = await axios.post(`${BASE_URL}/orders`, orderData, {
      headers: {
        'Content-Type': 'application/json'
        // NO Authorization header!
      }
    });

    const order = orderResponse.data.order;
    console.log('✅ Order placed successfully WITHOUT LOGIN!');
    console.log(`   Order Number: ${order.orderNumber}`);
    console.log(`   Customer: ${order.customerName} (Guest)`);
    console.log(`   Email: ${order.customerEmail}`);
    console.log(`   Total: $${order.total}`);
    console.log(`   Status: ${order.status}\n`);

    // Step 3: Track order (also no login needed)
    console.log('🔍 Step 3: Tracking order (no login)...\n');
    const trackResponse = await axios.get(`${BASE_URL}/orders/number/${order.orderNumber}`);
    
    const trackedOrder = trackResponse.data.order;
    console.log('✅ Order tracked successfully WITHOUT LOGIN!');
    console.log(`   Order: ${trackedOrder.orderNumber}`);
    console.log(`   Status: ${trackedOrder.status}\n`);

    // Summary
    console.log('╔════════════════════════════════════════════╗');
    console.log('║         GUEST CHECKOUT SUCCESS! ✅         ║');
    console.log('╚════════════════════════════════════════════╝');
    console.log('\n📊 What worked:');
    console.log('   ✅ Browsed products without login');
    console.log('   ✅ Placed order without login');
    console.log('   ✅ Order saved to database');
    console.log('   ✅ Tracked order without login\n');
    console.log(`🔗 Customer tracking URL:`);
    console.log(`   https://stylehub-showcase.vercel.app/track?id=${order.orderNumber}\n`);
    console.log('💡 Customer can complete entire purchase without creating account!\n');

  } catch (error) {
    if (error.response) {
      console.error('\n❌ Error:', error.response.status, error.response.data);
      if (error.response.status === 401) {
        console.error('\n⚠️  Authentication still required! Backend not deployed yet.');
        console.error('   Wait 30 seconds for Vercel deployment to complete.');
      }
    } else {
      console.error('\n❌ Error:', error.message);
    }
    process.exit(1);
  }
}

testGuestCheckout();
