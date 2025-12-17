const axios = require('axios');

const API_KEY = 'sk_test_stylehub_ai_integration_key_2024';
const BASE_URL = 'https://backend-xi-murex-46.vercel.app/api/external';

// Test 1: Fetch all products
async function testFetchProducts() {
  console.log('\n🔍 TEST 1: Fetching Products...\n');
  
  try {
    const response = await axios.get(`${BASE_URL}/products`, {
      headers: { 'X-API-Key': API_KEY },
      params: {
        category: 'men',
        limit: 5
      }
    });
    
    console.log('✅ SUCCESS - Products fetched');
    console.log(`Found ${response.data.results} products (showing ${response.data.products.length}):\n`);
    
    response.data.products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Price: $${product.price}`);
      console.log(`   Category: ${product.category} - ${product.subcategory}`);
      console.log(`   In Stock: ${product.inStock}`);
      console.log(`   Sizes: ${product.sizes.join(', ')}`);
      console.log(`   Product ID: ${product.id}\n`);
    });
    
    return response.data.products[0]; // Return first product for order test
  } catch (error) {
    console.error('❌ ERROR fetching products:', error.response?.data || error.message);
    throw error;
  }
}

// Test 2: Fetch single product
async function testFetchSingleProduct(productId) {
  console.log(`\n🔍 TEST 2: Fetching Single Product (${productId})...\n`);
  
  try {
    const response = await axios.get(`${BASE_URL}/products/${productId}`, {
      headers: { 'X-API-Key': API_KEY }
    });
    
    const product = response.data.product;
    console.log('✅ SUCCESS - Product details fetched');
    console.log(`\nProduct: ${product.name}`);
    console.log(`Description: ${product.description.substring(0, 100)}...`);
    console.log(`Price: $${product.price}`);
    console.log(`Sizes: ${product.sizes.join(', ')}`);
    console.log(`Colors: ${product.colors.join(', ')}`);
    console.log(`Stock: ${product.stockQuantity} units`);
    console.log(`Rating: ${product.averageRating} (${product.reviewCount} reviews)`);
    
    return product;
  } catch (error) {
    console.error('❌ ERROR fetching product:', error.response?.data || error.message);
    throw error;
  }
}

// Test 3: Place an order
async function testPlaceOrder(product) {
  console.log('\n📦 TEST 3: Placing Order...\n');
  
  const orderData = {
    items: [
      {
        productId: product.id,
        quantity: 2,
        size: product.sizes[0] // Use first available size
      }
    ],
    shippingAddress: {
      name: 'Test User',
      phone: '+1234567890',
      street: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345',
      country: 'USA'
    },
    customerName: 'Test User',
    customerPhone: '+1234567890',
    customerEmail: 'test@example.com',
    paymentMethod: 'cod'
  };
  
  try {
    const response = await axios.post(`${BASE_URL}/orders`, orderData, {
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    const order = response.data.order;
    console.log('✅ SUCCESS - Order placed');
    console.log(`\nOrder Number: ${order.orderNumber}`);
    console.log(`Order ID: ${order.id}`);
    console.log(`Status: ${order.status}`);
    console.log(`\nOrder Items:`);
    order.items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.product.name}`);
      console.log(`     Quantity: ${item.quantity}`);
      console.log(`     Size: ${item.size}`);
      console.log(`     Price: $${item.price}`);
    });
    console.log(`\nSubtotal: $${order.subtotal}`);
    console.log(`Shipping: $${order.shipping}`);
    console.log(`Tax: $${order.tax}`);
    console.log(`Total: $${order.total}`);
    console.log(`\nShipping Address:`);
    console.log(`  ${order.shippingAddress.name}`);
    console.log(`  ${order.shippingAddress.street}`);
    console.log(`  ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`);
    console.log(`\n🔗 Track this order at:`);
    console.log(`   https://stylehub-showcase.vercel.app/track?id=${order.orderNumber}`);
    
    return order;
  } catch (error) {
    console.error('❌ ERROR placing order:', error.response?.data || error.message);
    throw error;
  }
}

// Test 4: Get order by order number
async function testGetOrder(orderNumber) {
  console.log(`\n🔍 TEST 4: Fetching Order (${orderNumber})...\n`);
  
  try {
    const response = await axios.get(`${BASE_URL}/orders/number/${orderNumber}`, {
      headers: { 'X-API-Key': API_KEY }
    });
    
    const order = response.data.order;
    console.log('✅ SUCCESS - Order retrieved');
    console.log(`\nOrder Number: ${order.orderNumber}`);
    console.log(`Status: ${order.status}`);
    console.log(`Total: $${order.total}`);
    console.log(`Items: ${order.items.length}`);
    
    return order;
  } catch (error) {
    console.error('❌ ERROR fetching order:', error.response?.data || error.message);
    throw error;
  }
}

// Test without API key (should fail)
async function testWithoutApiKey() {
  console.log('\n🚫 TEST 5: Testing without API key (should fail)...\n');
  
  try {
    await axios.get(`${BASE_URL}/products`);
    console.log('❌ UNEXPECTED - Request succeeded without API key!');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ SUCCESS - Request properly rejected without API key');
      console.log(`Error message: "${error.response.data.message}"`);
    } else {
      console.error('❌ UNEXPECTED ERROR:', error.message);
    }
  }
}

// Run all tests
async function runAllTests() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   StyleHub External API Integration Test  ║');
  console.log('╚════════════════════════════════════════════╝');
  console.log(`\nAPI Base URL: ${BASE_URL}`);
  console.log(`API Key: ${API_KEY.substring(0, 20)}...`);
  
  try {
    // Test 1: Fetch products
    const firstProduct = await testFetchProducts();
    
    // Test 2: Fetch single product
    await testFetchSingleProduct(firstProduct.id);
    
    // Test 3: Place order
    const order = await testPlaceOrder(firstProduct);
    
    // Test 4: Get order
    await testGetOrder(order.orderNumber);
    
    // Test 5: Without API key
    await testWithoutApiKey();
    
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║         All Tests Completed! ✅            ║');
    console.log('╚════════════════════════════════════════════╝\n');
    
  } catch (error) {
    console.log('\n╔════════════════════════════════════════════╗');
    console.log('║         Tests Failed! ❌                   ║');
    console.log('╚════════════════════════════════════════════╝\n');
    process.exit(1);
  }
}

// Run tests
runAllTests();
