# ShopNova API Testing Guide

## API Endpoints Overview

### 1. **Authentication** (`/api/v1/auth`)

- `POST /signup` - Register new user
- `POST /login` - User login
- `POST /forgotPassword` - Request password reset
- `POST /verifyResetCode` - Verify reset code
- `PUT /resetPassword` - Reset password

### 2. **Users** (`/api/v1/users`)

- `GET /` - Get all users
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user

### 3. **Categories** (`/api/v1/categories`)

- `GET /` - Get all categories
- `POST /` - Create category (admin only)
- `GET /:id` - Get category by ID
- `PUT /:id` - Update category (admin only)
- `DELETE /:id` - Delete category (admin only)

### 4. **Sub-Categories** (`/api/v1/subcategories`)

- `GET /` - Get all sub-categories
- `POST /` - Create sub-category (admin only)
- `GET /:id` - Get sub-category by ID
- `PUT /:id` - Update sub-category (admin only)
- `DELETE /:id` - Delete sub-category (admin only)

### 5. **Brands** (`/api/v1/brands`)

- `GET /` - Get all brands
- `POST /` - Create brand (admin only)
- `GET /:id` - Get brand by ID
- `PUT /:id` - Update brand (admin only)
- `DELETE /:id` - Delete brand (admin only)

### 6. **Products** (`/api/v1/products`)

- `GET /` - Get all products
- `POST /` - Create product (admin only)
- `GET /:id` - Get product by ID
- `PUT /:id` - Update product (admin only)
- `DELETE /:id` - Delete product (admin only)

### 7. **Reviews** (`/api/v1/reviews`)

- `GET /` - Get all reviews
- `POST /` - Create review
- `GET /:id` - Get review by ID
- `PUT /:id` - Update review
- `DELETE /:id` - Delete review

### 8. **Wishlist** (`/api/v1/wishlist`)

- `GET /` - Get user wishlist
- `POST /:id` - Add product to wishlist
- `DELETE /:id` - Remove product from wishlist

### 9. **Addresses** (`/api/v1/address`)

- `GET /` - Get user addresses
- `POST /` - Create address
- `GET /:id` - Get address by ID
- `PUT /:id` - Update address
- `DELETE /:id` - Delete address

### 10. **Cart** (`/api/v1/cart`)

- `GET /` - Get cart
- `POST /` - Add to cart
- `PUT /:id` - Update cart item
- `DELETE /` - Clear cart
- `DELETE /:id` - Remove item from cart

### 11. **Coupons** (`/api/v1/coupons`)

- `GET /` - Get all coupons
- `POST /` - Create coupon (admin only)
- `GET /:id` - Get coupon by ID
- `PUT /:id` - Update coupon (admin only)
- `DELETE /:id` - Delete coupon (admin only)

### 12. **Orders** (`/api/v1/orders`)

- `GET /` - Get user orders
- `POST /` - Create order
- `GET /:id` - Get order by ID
- `PUT /:id` - Update order (admin only)
- `DELETE /:id` - Delete order (admin only)

---

## Testing Methods

### Option 1: Manual Testing with Postman

1. Import the PostmanCollection.json file into Postman
2. Set environment variables:
   - `baseURL`: http://localhost:3000
   - `authToken`: Your JWT token from login response
3. Test each endpoint manually

### Option 2: Command Line Testing with cURL

```bash
# Example: Get all products
curl http://localhost:3000/api/v1/products

# Example: Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Option 3: Automated Testing with Jest (Recommended)

```bash
npm install --save-dev jest supertest
npm test
```

---

## Pre-Deployment Checklist

- [ ] All endpoints return correct status codes (200, 201, 400, 401, 404, 500)
- [ ] Authentication protection works (require auth token)
- [ ] Admin-only endpoints reject non-admin users
- [ ] Input validation works for required fields
- [ ] Error messages are clear and helpful
- [ ] Database connections are stable
- [ ] File uploads work (images for products, categories, brands, users)
- [ ] Payment/Checkout endpoints work with Stripe
- [ ] Pagination works for GET endpoints with large data
- [ ] Filtering and sorting work for product endpoints
- [ ] User roles are correctly enforced
- [ ] CORS is properly configured
- [ ] Response formats are consistent
- [ ] No console errors or warnings

---

## Quick Test Flow

1. **Start the server**

   ```bash
   npm run dev
   ```

2. **Test Auth endpoints**
   - Sign up new user
   - Log in and save token
   - Use token for protected endpoints

3. **Test CRUD operations**
   - Create, Read, Update, Delete resources
   - Check permissions (admin vs user)

4. **Test business logic**
   - Add products to cart
   - Apply coupons
   - Create orders
   - Process payments

5. **Check error handling**
   - Send invalid data
   - Try unauthorized access
   - Try to delete non-existent resources
