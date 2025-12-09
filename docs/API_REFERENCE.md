# ELYSIUM API Reference

Complete API documentation for the ELYSIUM backend.

## Base URL

- **Development:** `http://localhost:3000`
- **Production:** `https://yourdomain.com`

## Authentication

All authenticated endpoints require a valid session cookie from NextAuth.js.

### Sign In
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
}
```

## User Profile

### Get Profile
```http
GET /api/user/profile
Cookie: next-auth.session-token=...
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "profile": {
    "phone": "+44...",
    "preferences": {}
  },
  "addresses": []
}
```

### Update Profile
```http
PUT /api/user/profile
Cookie: next-auth.session-token=...
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+44...",
  "preferences": {
    "newsletter": true
  }
}
```

## Addresses

### Get All Addresses
```http
GET /api/user/addresses
Cookie: next-auth.session-token=...
```

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "BILLING",
    "line1": "123 Main St",
    "city": "London",
    "postalCode": "SW1A 1AA",
    "country": "GB",
    "isDefault": true
  }
]
```

### Create Address
```http
POST /api/user/addresses
Cookie: next-auth.session-token=...
Content-Type: application/json

{
  "type": "BILLING",
  "line1": "123 Main St",
  "line2": "Apt 4",
  "city": "London",
  "state": "",
  "postalCode": "SW1A 1AA",
  "country": "GB",
  "isDefault": true
}
```

### Update Address
```http
PUT /api/user/addresses/{id}
Cookie: next-auth.session-token=...
Content-Type: application/json

{
  "line1": "456 New St",
  "isDefault": true
}
```

### Delete Address
```http
DELETE /api/user/addresses/{id}
Cookie: next-auth.session-token=...
```

## Shopping Cart

### Get Cart
```http
GET /api/cart
Cookie: next-auth.session-token=...
```

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "productSlug": "seraphina-signature-six-claw",
      "configuration": {
        "metal": "18k-yellow-gold",
        "size": "M",
        "diamond": {
          "shape": "round",
          "carat": 1.5,
          "color": "D",
          "clarity": "VVS1"
        }
      },
      "quantity": 1,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

### Add to Cart
```http
POST /api/cart
Cookie: next-auth.session-token=...
Content-Type: application/json

{
  "productSlug": "seraphina-signature-six-claw",
  "configuration": {
    "metal": "18k-yellow-gold",
    "size": "M",
    "diamond": {
      "shape": "round",
      "carat": 1.5,
      "color": "D",
      "clarity": "VVS1"
    },
    "engraving": "Forever Yours"
  },
  "quantity": 1
}
```

### Update Cart Item
```http
PUT /api/cart/{id}
Cookie: next-auth.session-token=...
Content-Type: application/json

{
  "quantity": 2
}
```

**Note:** Setting quantity to 0 removes the item.

### Remove from Cart
```http
DELETE /api/cart/{id}
Cookie: next-auth.session-token=...
```

### Clear Cart
```http
DELETE /api/cart
Cookie: next-auth.session-token=...
```

## Checkout & Orders

### Create Checkout Session
```http
POST /api/checkout
Content-Type: application/json

{
  "items": [
    {
      "productSlug": "seraphina-signature-six-claw",
      "title": "Seraphina Signature Six-Claw",
      "price": 450000,
      "quantity": 1,
      "configuration": {
        "metal": "18k-yellow-gold",
        "size": "M"
      }
    }
  ],
  "customerEmail": "customer@example.com",
  "customerName": "Jane Doe",
  "billingAddressId": "uuid",
  "shippingAddressId": "uuid"
}
```

**Response:**
```json
{
  "id": "cs_...",
  "url": "https://checkout.stripe.com/...",
  "orderId": "uuid",
  "orderNumber": "ELY-ABC123-XYZ"
}
```

### Get User Orders
```http
GET /api/orders
Cookie: next-auth.session-token=...
```

**Response:**
```json
{
  "orders": [
    {
      "id": "uuid",
      "orderNumber": "ELY-ABC123-XYZ",
      "status": "PAID",
      "totalAmountGbp": "4500.00",
      "currency": "GBP",
      "items": [...],
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

### Get Order by ID
```http
GET /api/orders/{id}
Cookie: next-auth.session-token=...
```

**Response:**
```json
{
  "id": "uuid",
  "orderNumber": "ELY-ABC123-XYZ",
  "status": "PAID",
  "totalAmountGbp": "4500.00",
  "items": [
    {
      "productSlug": "seraphina-signature-six-claw",
      "configuration": {...},
      "quantity": 1,
      "unitPriceGbp": "4500.00",
      "totalPriceGbp": "4500.00"
    }
  ],
  "billingAddress": {...},
  "shippingAddress": {...}
}
```

### Order Status Values
- `PENDING` - Order created, payment pending
- `PROCESSING` - Payment initiated
- `PAYMENT_FAILED` - Payment failed
- `PAID` - Payment successful
- `FULFILLED` - Order being prepared
- `SHIPPED` - Order shipped
- `DELIVERED` - Order delivered
- `CANCELLED` - Order cancelled
- `REFUNDED` - Order refunded

## Inventory

### Get Product Inventory
```http
GET /api/inventory?productSlug=seraphina-signature-six-claw
```

**Response:**
```json
{
  "inventory": [
    {
      "productSlug": "seraphina-signature-six-claw",
      "variantKey": "18k-yellow-gold-M",
      "stockLevel": 10,
      "reservedStock": 2,
      "lowStockThreshold": 5
    }
  ]
}
```

### Check Availability
```http
GET /api/inventory?productSlug=seraphina-signature-six-claw&variantKey=18k-yellow-gold-M&quantity=1
```

**Response:**
```json
{
  "available": true,
  "stock": 8
}
```

## Wishlist

### Get Wishlist
```http
GET /api/wishlist
Cookie: next-auth.session-token=...
```

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "productSlug": "luna-low-set-solitaire",
      "configuration": null,
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

### Add to Wishlist
```http
POST /api/wishlist
Cookie: next-auth.session-token=...
Content-Type: application/json

{
  "productSlug": "luna-low-set-solitaire",
  "configuration": {
    "metal": "platinum",
    "size": "L"
  }
}
```

### Remove from Wishlist
```http
DELETE /api/wishlist?productSlug=luna-low-set-solitaire
Cookie: next-auth.session-token=...
```

## Analytics

### Track Product View
```http
POST /api/analytics/track-view
Content-Type: application/json

{
  "productSlug": "seraphina-signature-six-claw",
  "sessionId": "anonymous-session-id"
}
```

### Get Recently Viewed
```http
GET /api/analytics/recently-viewed?sessionId=anonymous-session-id&limit=10
Cookie: next-auth.session-token=... (optional)
```

**Response:**
```json
{
  "products": [
    "seraphina-signature-six-claw",
    "luna-low-set-solitaire",
    "celeste-six-claw-solitaire"
  ]
}
```

## Bespoke Enquiries

### Submit Bespoke Enquiry
```http
POST /api/bespoke
Content-Type: multipart/form-data

name=John+Doe&email=john@example.com&phone=%2B44...&budget=10000-15000&notes=Looking+for+custom+design
```

**Response:**
```json
{
  "ok": true,
  "leadId": "uuid"
}
```

## Webhooks

### Stripe Webhook
```http
POST /api/webhooks/stripe
Stripe-Signature: ...

{
  "type": "payment_intent.succeeded",
  "data": {...}
}
```

**Handled Events:**
- `checkout.session.completed` - Checkout completed
- `payment_intent.succeeded` - Payment successful
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Charge refunded

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": [
    {
      "code": "invalid_type",
      "path": ["email"],
      "message": "Invalid email address"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting middleware for production.

## CORS

CORS is handled by Next.js. Update `next.config.mjs` for custom CORS policies.

## Pagination

Currently not implemented. Consider adding pagination for:
- Order history
- Product views
- Wishlist items

Example future implementation:
```http
GET /api/orders?page=1&limit=20
```

## Filtering & Sorting

Currently not implemented. Consider adding for:
- Orders (by status, date)
- Inventory (low stock)
- Analytics (date range)

## WebSockets

Not currently implemented. Consider for:
- Real-time inventory updates
- Order status notifications
- Live chat support
