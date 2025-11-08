# Firecracker E-Commerce - Quick Setup Guide

## Prerequisites
- Node.js (v14 or higher) installed
- MongoDB installed and running locally
- npm or yarn package manager

## Installation Steps

### 1. Clone or Extract the Project
Navigate to the project directory in your terminal.

### 2. Install All Dependencies

From the root directory, run:
```bash
npm run install-all
```

Or install manually:
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Setup MongoDB

Make sure MongoDB is running on your local machine. You can:
- Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud) and update the connection string

### 4. Configure Backend Environment

Create a `.env` file in the `server` directory:

```bash
cd server
```

Create `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/firecracker_db
JWT_SECRET=your_secret_key_change_this_in_production
NODE_ENV=development
```

**Note**: Change `JWT_SECRET` to a secure random string in production.

### 5. Update Merchant UPI ID

Edit `server/routes/orders.js` and update the merchant UPI ID (around line 14):

```javascript
const upiId = 'your-merchant@paytm'; // Replace with your actual UPI ID
```

### 6. Start the Application

From the root directory:
```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 3000) concurrently.

Or start them separately:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## Creating an Admin User

To create an admin user, you have two options:

### Option 1: Via MongoDB Shell
```javascript
use firecracker_db

db.users.insertOne({
  name: "Admin",
  email: "admin@firecrackerstore.com",
  password: "$2a$10$...", // This is a hashed password
  isAdmin: true
})
```

Generate a hashed password using Node.js:
```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('your_password', 10).then(hash => console.log(hash));
```

### Option 2: Register and Update via MongoDB
1. Register normally through the app
2. Connect to MongoDB and update the user:
```javascript
use firecracker_db
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { isAdmin: true } }
)
```

## Features Checklist

### Customer Features
- ✅ Register and login
- ✅ Browse products by category
- ✅ View product details with images, safety warnings, and demo videos
- ✅ Add products to cart
- ✅ Checkout with shipping information
- ✅ Dynamic UPI QR code payment
- ✅ Order confirmation
- ✅ View order history in profile

### Admin Features
- ✅ Admin dashboard
- ✅ Add/Edit/Delete products with multiple images
- ✅ View all orders
- ✅ Update order status (including "Payment Verified")
- ✅ View detailed order information

## Product Categories
1. **Day Crackers** - Products visible during daytime
2. **Night Crackers** - Products visible at night
3. **Accessories** - Sparklers, lighters, matches
4. **Display Boxes** - Assortments and gift boxes

## Important URLs

### Customer Pages
- Homepage: `/`
- Login: `/login`
- Register: `/register`
- Cart: `/cart`
- Profile: `/profile`
- Product Detail: `/product/:id`
- Category Pages: `/category/day-crackers`, `/category/night-crackers`, etc.

### Admin Pages
- Admin Dashboard: `/admin`
- Manage Products: `/admin/products`
- Manage Orders: `/admin/orders`

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `server/.env`
- Try: `mongodb://127.0.0.1:27017/firecracker_db`

### CORS Errors
- Backend has CORS enabled for all origins in development
- Adjust CORS settings in `server.js` for production

### QR Code Not Showing
- Ensure `qrcode` package is installed in client
- Check browser console for errors
- Verify the UPI payment link is being generated

### Admin Access Denied
- Ensure user has `isAdmin: true` in database
- Check JWT token is being sent in requests
- Verify admin routes have proper middleware

### Tailwind CSS Not Working
- Ensure Tailwind is installed: `npm install tailwindcss autoprefixer postcss`
- Check `tailwind.config.js` and `postcss.config.js` exist
- Verify `index.css` has Tailwind directives

## Testing the Application

1. **Create Test User**: Register a new account
2. **Browse Products**: Navigate through categories
3. **Add to Cart**: Add multiple products
4. **Checkout**: Complete shipping information
5. **Payment**: View the generated UPI QR code
6. **Admin Login**: Login as admin
7. **Add Product**: Create a new product with multiple images
8. **Manage Order**: View and update order status

## Production Deployment

### Backend
- Use environment variables for sensitive data
- Use a secure JWT secret
- Enable rate limiting
- Use HTTPS
- Configure CORS properly

### Frontend
- Build the app: `cd client && npm run build`
- Serve static files using Express or a CDN
- Update API URLs in production environment

### Database
- Use MongoDB Atlas for cloud database
- Enable authentication
- Configure backups
- Use connection pooling

## Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review the code comments
3. Check MongoDB logs
4. Check browser console for frontend errors
5. Check terminal for backend errors

---

**Note**: This is a demo application. Update all placeholder values (UPI ID, merchant name, etc.) before deploying to production.










