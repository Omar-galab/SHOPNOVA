# ShopNova API - Quick Testing Guide

## 📋 All API Endpoints Summary

| Method             | Endpoint                       | Auth | Role  | Description            |
| ------------------ | ------------------------------ | ---- | ----- | ---------------------- |
| **AUTH**           |
| POST               | `/api/v1/auth/signup`          | ❌   | -     | Register new user      |
| POST               | `/api/v1/auth/login`           | ❌   | -     | Login user             |
| POST               | `/api/v1/auth/forgotPassword`  | ❌   | -     | Request password reset |
| POST               | `/api/v1/auth/verifyResetCode` | ❌   | -     | Verify reset code      |
| PUT                | `/api/v1/auth/resetPassword`   | ❌   | -     | Reset password         |
| **CATEGORIES**     |
| GET                | `/api/v1/categories`           | ❌   | -     | Get all categories     |
| POST               | `/api/v1/categories`           | ✅   | admin | Create category        |
| GET                | `/api/v1/categories/:id`       | ❌   | -     | Get category           |
| PUT                | `/api/v1/categories/:id`       | ✅   | admin | Update category        |
| DELETE             | `/api/v1/categories/:id`       | ✅   | admin | Delete category        |
| **SUB-CATEGORIES** |
| GET                | `/api/v1/subcategories`        | ❌   | -     | Get all                |
| POST               | `/api/v1/subcategories`        | ✅   | admin | Create                 |
| GET                | `/api/v1/subcategories/:id`    | ❌   | -     | Get by ID              |
| PUT                | `/api/v1/subcategories/:id`    | ✅   | admin | Update                 |
| DELETE             | `/api/v1/subcategories/:id`    | ✅   | admin | Delete                 |
| **BRANDS**         |
| GET                | `/api/v1/brands`               | ❌   | -     | Get all                |
| POST               | `/api/v1/brands`               | ✅   | admin | Create                 |
| GET                | `/api/v1/brands/:id`           | ❌   | -     | Get by ID              |
| PUT                | `/api/v1/brands/:id`           | ✅   | admin | Update                 |
| DELETE             | `/api/v1/brands/:id`           | ✅   | admin | Delete                 |
| **PRODUCTS**       |
| GET                | `/api/v1/products`             | ❌   | -     | Get all (paginated)    |
| POST               | `/api/v1/products`             | ✅   | admin | Create                 |
| GET                | `/api/v1/products/:id`         | ❌   | -     | Get by ID              |
| PUT                | `/api/v1/products/:id`         | ✅   | admin | Update                 |
| DELETE             | `/api/v1/products/:id`         | ✅   | admin | Delete                 |
| **CART**           |
| GET                | `/api/v1/cart`                 | ✅   | user  | Get cart               |
| POST               | `/api/v1/cart`                 | ✅   | user  | Add to cart            |
| PUT                | `/api/v1/cart/:id`             | ✅   | user  | Update item            |
| DELETE             | `/api/v1/cart`                 | ✅   | user  | Clear cart             |
| DELETE             | `/api/v1/cart/:id`             | ✅   | user  | Remove item            |
| **ORDERS**         |
| GET                | `/api/v1/orders`               | ✅   | user  | Get my orders          |
| POST               | `/api/v1/orders`               | ✅   | user  | Create order           |
| GET                | `/api/v1/orders/:id`           | ✅   | user  | Get order              |
| PUT                | `/api/v1/orders/:id`           | ✅   | admin | Update order           |
| DELETE             | `/api/v1/orders/:id`           | ✅   | admin | Delete order           |
| **WISHLIST**       |
| GET                | `/api/v1/wishlist`             | ✅   | user  | Get wishlist           |
| POST               | `/api/v1/wishlist/:id`         | ✅   | user  | Add to wishlist        |
| DELETE             | `/api/v1/wishlist/:id`         | ✅   | user  | Remove from wishlist   |
| **REVIEWS**        |
| GET                | `/api/v1/reviews`              | ❌   | -     | Get all                |
| POST               | `/api/v1/reviews`              | ✅   | user  | Create review          |
| GET                | `/api/v1/reviews/:id`          | ❌   | -     | Get review             |
| PUT                | `/api/v1/reviews/:id`          | ✅   | user  | Update review          |
| DELETE             | `/api/v1/reviews/:id`          | ✅   | user  | Delete review          |
| **ADDRESSES**      |
| GET                | `/api/v1/address`              | ✅   | user  | Get addresses          |
| POST               | `/api/v1/address`              | ✅   | user  | Create address         |
| GET                | `/api/v1/address/:id`          | ✅   | user  | Get address            |
| PUT                | `/api/v1/address/:id`          | ✅   | user  | Update address         |
| DELETE             | `/api/v1/address/:id`          | ✅   | user  | Delete address         |
| **COUPONS**        |
| GET                | `/api/v1/coupons`              | ❌   | -     | Get all                |
| POST               | `/api/v1/coupons`              | ✅   | admin | Create                 |
| GET                | `/api/v1/coupons/:id`          | ❌   | -     | Get by ID              |
| PUT                | `/api/v1/coupons/:id`          | ✅   | admin | Update                 |
| DELETE             | `/api/v1/coupons/:id`          | ✅   | admin | Delete                 |

---

## 🚀 Getting Started

### 1. Start the Server

```bash
npm run dev
# Server runs on http://localhost:3000
```

### 2. Test with Postman

```bash
# Import postman-collection.json into Postman
# Then set environment variables:
# - baseURL: http://localhost:3000
# - authToken: (from login response)
```

### 3. Run Automated Tests

```bash
npm test
```

---

## 🔐 Authentication Flow

### Step 1: Create User Account

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "passwordConfirm": "SecurePass123!",
    "phone": "1234567890"
  }'
```

**Response:**

```json
{
  "data": {
    "user": {
      "_id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Step 2: Use Token for Protected Routes

```bash
# Save the token from response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Use it in Authorization header
curl http://localhost:3000/api/v1/cart \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🛍️ Complete Shopping Flow

```bash
# 1. LOGIN
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123!"}'

# Save token from response
TOKEN="your-token-here"

# 2. GET PRODUCTS
curl http://localhost:3000/api/v1/products?limit=10

# 3. ADD TO CART
curl -X POST http://localhost:3000/api/v1/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId":"product-id","quantity":1}'

# 4. VIEW CART
curl http://localhost:3000/api/v1/cart \
  -H "Authorization: Bearer $TOKEN"

# 5. ADD SHIPPING ADDRESS
curl -X POST http://localhost:3000/api/v1/address \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "details":"123 Main St",
    "city":"New York",
    "postalCode":"10001",
    "phone":"1234567890"
  }'

# 6. CREATE ORDER
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "shippingAddress":"address-id",
    "paymentMethod":"card"
  }'

# 7. VIEW ORDERS
curl http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer $TOKEN"
```

---

## ✅ Status Codes Expected

| Code | Meaning      | Example                |
| ---- | ------------ | ---------------------- |
| 200  | OK           | GET request successful |
| 201  | Created      | POST/PUT successful    |
| 400  | Bad Request  | Invalid input data     |
| 401  | Unauthorized | Missing/invalid token  |
| 403  | Forbidden    | Not enough permissions |
| 404  | Not Found    | Resource doesn't exist |
| 500  | Server Error | Database/server issues |

---

## 🐛 Testing Common Scenarios

### Test with Invalid Data

```bash
# Missing required field
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'
# Expected: 400 Bad Request
```

### Test Authentication

```bash
# Request without token
curl http://localhost:3000/api/v1/cart
# Expected: 401 Unauthorized
```

### Test Admin Access

```bash
# Create category with user token (should fail)
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{"name":"Electronics"}'
# Expected: 403 Forbidden
```

---

## 📊 Performance Considerations

- Products endpoint supports pagination (limit, page, sort, filters)
- Implement caching for categories/brands
- Use indexes on frequently searched fields
- Monitor response times in production

---

## 🔒 Security Checklist

- [ ] All passwords hashed with bcrypt
- [ ] JWT tokens expire after set time
- [ ] CORS only allows trusted domains
- [ ] Sensitive data not logged
- [ ] SQL injection protection (using mongoose)
- [ ] XSS protection enabled
- [ ] Rate limiting for auth endpoints
- [ ] HTTPS enabled in production
