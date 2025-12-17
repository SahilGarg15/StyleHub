# StyleHub AI Integration - Quick Start

## Your API Credentials

**API Key:** `sk_test_stylehub_ai_integration_key_2024`

**Base URL:** `https://backend-xi-murex-46.vercel.app/api/external`

---

## Quick Examples for Your AI

### 1. Search for Products
```python
import requests

API_KEY = "sk_test_stylehub_ai_integration_key_2024"
BASE_URL = "https://backend-xi-murex-46.vercel.app/api/external"

# Search for men's jackets
response = requests.get(
    f"{BASE_URL}/products",
    headers={"X-API-Key": API_KEY},
    params={
        "category": "men",
        "search": "jacket",
        "limit": 5
    }
)

products = response.json()
print(f"Found {products['results']} products")
for product in products['products']:
    print(f"- {product['name']}: ${product['price']}")
```

### 2. Get Product Details
```python
# Get specific product by ID
product_id = "cm4rkmzy00000q4t9x9xkq9xk"

response = requests.get(
    f"{BASE_URL}/products/{product_id}",
    headers={"X-API-Key": API_KEY}
)

product = response.json()['product']
print(f"Product: {product['name']}")
print(f"Price: ${product['price']}")
print(f"Available sizes: {', '.join(product['sizes'])}")
print(f"In stock: {product['inStock']}")
```

### 3. Place an Order
```python
# Create order
order_data = {
    "items": [
        {
            "productId": "cm4rkmzy00000q4t9x9xkq9xk",
            "quantity": 1,
            "size": "L"
        }
    ],
    "shippingAddress": {
        "name": "John Doe",
        "phone": "+1234567890",
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
    },
    "customerName": "John Doe",
    "customerPhone": "+1234567890",
    "customerEmail": "john@example.com",
    "paymentMethod": "cod"
}

response = requests.post(
    f"{BASE_URL}/orders",
    headers={
        "X-API-Key": API_KEY,
        "Content-Type": "application/json"
    },
    json=order_data
)

order = response.json()['order']
print(f"Order created: {order['orderNumber']}")
print(f"Total: ${order['total']}")
print(f"Status: {order['status']}")
print(f"\n🔗 Customer can track order at:")
print(f"https://stylehub-showcase.vercel.app/track?id={order['orderNumber']}")
```

### 4. Track Order
```python
# Get order by order number
order_number = "ORD-2024-001234"

response = requests.get(
    f"{BASE_URL}/orders/number/{order_number}",
    headers={"X-API-Key": API_KEY}
)

order = response.json()['order']
print(f"Order Status: {order['status']}")
print(f"Items: {len(order['items'])}")
print(f"\n🔗 Share tracking link:")
print(f"https://stylehub-showcase.vercel.app/track?id={order_number}")
```

---

## Available Query Parameters for Product Search

- `category`: men, women, children
- `subcategory`: accessories, attire, footwear
- `minPrice`: Minimum price (number)
- `maxPrice`: Maximum price (number)
- `search`: Search term for name/description
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 20)

---

## Using with JavaScript/Node.js

```javascript
const axios = require('axios');

const API_KEY = 'sk_test_stylehub_ai_integration_key_2024';
const BASE_URL = 'https://backend-xi-murex-46.vercel.app/api/external';

// Get products
async function getProducts() {
  const response = await axios.get(`${BASE_URL}/products`, {
    headers: { 'X-API-Key': API_KEY },
    params: { category: 'women', limit: 10 }
  });
  return response.data.products;
}

// Place order
async function placeOrder(orderData) {
  const response = await axios.post(`${BASE_URL}/orders`, orderData, {
    headers: { 
      'X-API-Key': API_KEY,
      'Content-Type': 'application/json'
    }
  });
  return response.data.order;
}
```

---

## Using with cURL

```bash
# Get products
curl -X GET "https://backend-xi-murex-46.vercel.app/api/external/products?category=men" \
  -H "X-API-Key: sk_test_stylehub_ai_integration_key_2024"

# Place order
curl -X POST "https://backend-xi-murex-46.vercel.app/api/external/orders" \
  -H "X-API-Key: sk_test_stylehub_ai_integration_key_2024" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": "cm4rkmzy00000q4t9x9xkq9xk", "quantity": 1, "size": "L"}],
    "shippingAddress": {
      "name": "John Doe",
      "phone": "+1234567890",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "customerName": "John Doe",
    "customerPhone": "+1234567890"
  }'
```

---

## Common AI Agent Tasks

### Task 1: Recommend Products
1. Use GET `/products` with search/category filters
2. Parse response and select top matches
3. Return product details to user

### Task 2: Check Product Availability
1. Use GET `/products/:id` to get specific product
2. Check `inStock` and `stockQuantity` fields
3. Check available `sizes`

### Task 3: Complete Purchase
1. Collect customer details (name, phone, address)
2. Collect product ID, size, quantity
3. Use POST `/orders` to place order
4. Return order number and total to user
5. **Provide tracking link**: `https://stylehub-showcase.vercel.app/track?id={orderNumber}`

### Task 4: Order Status
1. Get order number from user
2. Use GET `/orders/number/:orderNumber`
3. Return status and tracking info
4. **Customer can track without login** using the link above

---

## Order Database & Tracking

✅ **All orders are automatically saved to the database**
- Orders placed via API are immediately persisted
- No authentication required for order tracking
- Customers can track orders using: `https://stylehub-showcase.vercel.app/track?id=ORDER_NUMBER`

**Example Tracking Flow:**
```python
# After placing order
order = place_order(order_data)
tracking_url = f"https://stylehub-showcase.vercel.app/track?id={order['orderNumber']}"

# Share this URL with customer - they can track without logging in
print(f"Track your order: {tracking_url}")
```

---

## Error Handling

```python
try:
    response = requests.get(
        f"{BASE_URL}/products",
        headers={"X-API-Key": API_KEY}
    )
    response.raise_for_status()
    data = response.json()
except requests.exceptions.HTTPError as e:
    if e.response.status_code == 401:
        print("Invalid API key")
    elif e.response.status_code == 404:
        print("Resource not found")
    else:
        print(f"Error: {e.response.json()['message']}")
```

---

## Notes

- API key must be included in every request
- All responses are in JSON format
- Payment method currently only supports 'cod' (Cash on Delivery)
- Product IDs and order numbers are returned in responses for tracking

For full documentation, see: `backend/API_DOCUMENTATION.md`
