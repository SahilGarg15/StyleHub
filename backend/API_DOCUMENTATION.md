# StyleHub External API Documentation

## Authentication

All external API requests require an API key. Include your API key in one of two ways:

**Option 1: Header (Recommended)**
```
X-API-Key: sk_test_stylehub_ai_integration_key_2024
```

**Option 2: Query Parameter**
```
?api_key=sk_test_stylehub_ai_integration_key_2024
```

## Base URLs

- **Production**: `https://backend-xi-murex-46.vercel.app/api/external`
- **Development**: `http://localhost:5000/api/external`

---

## Endpoints

### 1. Get All Products

Fetch a list of products with optional filtering.

**Endpoint:** `GET /api/external/products`

**Query Parameters:**
- `category` (optional): Filter by category (men, women, children)
- `subcategory` (optional): Filter by subcategory (accessories, attire, footwear)
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `search` (optional): Search by product name or description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Example Request:**
```bash
curl -X GET "https://backend-xi-murex-46.vercel.app/api/external/products?category=men&limit=10" \
  -H "X-API-Key: sk_test_stylehub_ai_integration_key_2024"
```

**Example Response:**
```json
{
  "status": "success",
  "results": 10,
  "total": 45,
  "page": 1,
  "totalPages": 5,
  "products": [
    {
      "id": "cm4rkmzy00000q4t9x9xkq9xk",
      "name": "Classic Denim Jacket",
      "description": "Timeless denim jacket...",
      "price": 89.99,
      "originalPrice": 129.99,
      "images": ["https://..."],
      "category": "men",
      "subcategory": "attire",
      "sizes": ["S", "M", "L", "XL"],
      "colors": ["Blue", "Black"],
      "brand": "Levi's",
      "inStock": true,
      "stockQuantity": 50,
      "reviewCount": 12,
      "averageRating": 4.5
    }
  ]
}
```

---

### 2. Get Single Product

Fetch detailed information about a specific product.

**Endpoint:** `GET /api/external/products/:id`

**Path Parameters:**
- `id` (required): Product ID

**Example Request:**
```bash
curl -X GET "https://backend-xi-murex-46.vercel.app/api/external/products/cm4rkmzy00000q4t9x9xkq9xk" \
  -H "X-API-Key: sk_test_stylehub_ai_integration_key_2024"
```

**Example Response:**
```json
{
  "status": "success",
  "product": {
    "id": "cm4rkmzy00000q4t9x9xkq9xk",
    "name": "Classic Denim Jacket",
    "description": "Timeless denim jacket...",
    "price": 89.99,
    "images": ["https://..."],
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Blue", "Black"],
    "reviews": [
      {
        "id": "review123",
        "userName": "John Doe",
        "rating": 5,
        "comment": "Great quality!",
        "date": "2024-12-15T10:30:00Z",
        "verified": true
      }
    ],
    "reviewCount": 12,
    "averageRating": 4.5
  }
}
```

---

### 3. Create Order

Place a new order for products.

**Endpoint:** `POST /api/external/orders`

**Request Body:**
```json
{
  "items": [
    {
      "productId": "cm4rkmzy00000q4t9x9xkq9xk",
      "quantity": 2,
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
```

**Example Request:**
```bash
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
    "customerPhone": "+1234567890",
    "customerEmail": "john@example.com"
  }'
```

**Example Response:**
```json
{
  "status": "success",
  "order": {
    "id": "order_abc123",
    "orderNumber": "ORD-2024-001234",
    "items": [
      {
        "product": {
          "id": "cm4rkmzy00000q4t9x9xkq9xk",
          "name": "Classic Denim Jacket",
          "price": 89.99,
          "images": ["https://..."]
        },
        "quantity": 1,
        "size": "L",
        "price": 89.99
      }
    ],
    "status": "pending",
    "subtotal": 89.99,
    "shipping": 0,
    "tax": 0,
    "total": 89.99,
    "shippingAddress": {
      "name": "John Doe",
      "phone": "+1234567890",
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "createdAt": "2024-12-17T10:30:00Z"
  }
}
```

---

### 4. Get Order by ID

Retrieve order details using order ID.

**Endpoint:** `GET /api/external/orders/:id`

**Example Request:**
```bash
curl -X GET "https://backend-xi-murex-46.vercel.app/api/external/orders/order_abc123" \
  -H "X-API-Key: sk_test_stylehub_ai_integration_key_2024"
```

---

### 5. Get Order by Order Number

Retrieve order details using order number.

**Endpoint:** `GET /api/external/orders/number/:orderNumber`

**Example Request:**
```bash
curl -X GET "https://backend-xi-murex-46.vercel.app/api/external/orders/number/ORD-2024-001234" \
  -H "X-API-Key: sk_test_stylehub_ai_integration_key_2024"
```

---

## Error Responses

All errors follow this format:

```json
{
  "status": "error",
  "message": "Error description",
  "statusCode": 400
}
```

**Common Error Codes:**
- `401`: API key missing or invalid
- `403`: API key authentication failed
- `404`: Resource not found
- `500`: Internal server error

---

## API Keys

**Test Key (Development):**
```
sk_test_stylehub_ai_integration_key_2024
```

**Important:** Store your API key securely. Never expose it in client-side code or public repositories.

---

## Rate Limiting

Currently no rate limiting is enforced. Fair usage is expected.

---

## Support

For API support or to request additional endpoints, contact: support@stylehub.com
