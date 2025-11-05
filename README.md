# Firecracker E-Commerce Platform

A full-stack MERN-based e-commerce website for selling firecrackers with dynamic UPI payment integration.

## Technology Stack

- **Frontend**: React 18 with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Payment**: Dynamic UPI QR Code generation

## Project Structure

```
firecracker-ecommerce/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin pages
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── tailwind.config.js
│   └── package.json
├── server/                 # Express Backend
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── server.js
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## Features

### Customer Features
- **Product Browsing**: Browse products by category (Day Crackers, Night Crackers, Accessories, Display Boxes)
- **Product Details**: View detailed product information with multiple images, safety warnings, and demo videos
- **Shopping Cart**: Add, update, and remove products from cart
- **User Authentication**: Register and login functionality
- **Order Management**: View order history and status
- **Dynamic UPI Payment**: Generate QR codes for UPI payment with real-time order amount

### Admin Features
- **Product Management**: Add, edit, and delete products with multiple images
- **Order Management**: View all orders and update order status
- **Payment Verification**: Manually verify customer payments
- **Order Status Updates**: Change order status (Pending, Payment Verified, Processing, Shipped, Delivered, Cancelled)

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/firecracker_db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the React app:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Root Setup

From the project root, you can:
```bash
npm run install-all    # Install all dependencies
npm run dev            # Start both server and client concurrently
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products (with optional query params: category, featured, bestSeller)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

## Database Schemas

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  isAdmin: Boolean,
  address: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: ['Day Crackers', 'Night Crackers', 'Accessories', 'Display Boxes'],
  stock: Number,
  productImageURLs: [String],      // Multiple image URLs
  safetyWarningText: String,       // Safety warning text
  demoVideoURL: String,            // Demo video embed URL
  featured: Boolean,
  bestSeller: Boolean,
  rating: Number,
  numReviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  orderNumber: String (unique),
  user: ObjectId (ref: User),
  orderItems: [{
    product: ObjectId (ref: Product),
    name: String,
    image: String,
    price: Number,
    quantity: Number
  }],
  shippingAddress: Object,
  paymentMethod: String,
  upiPaymentLink: String,          // Dynamic UPI payment link
  itemsPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  orderStatus: String,            // Pending, Payment Verified, Processing, Shipped, Delivered, Cancelled
  paidAt: Date,
  deliveredAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Dynamic UPI Payment Flow

The system generates a unique UPI payment link for each order using the format:
```
upi://pay?pa={MERCHANT_UPI_ID}&pn={MERCHANT_NAME}&am={ORDER_AMOUNT}&tr={ORDER_ID}&cu=INR&tn={TRANSACTION_NOTE}
```

Where:
- `pa` = Merchant Payment Address (UPI ID)
- `pn` = Merchant Payee Name
- `am` = Transaction Amount
- `tr` = Transaction Reference (Order ID)
- `cu` = Currency (INR)
- `tn` = Transaction Note

A QR code is then generated from this link and displayed to the customer for scanning and payment.

**Note**: Update the merchant UPI ID in `server/routes/orders.js` line 14.

## Usage

1. **Register/Login**: Create an account or login to existing account
2. **Browse Products**: Browse products by category on homepage
3. **View Product Details**: Click on any product to see details with images, safety warning, and demo video
4. **Add to Cart**: Add products to cart and adjust quantities
5. **Checkout**: Proceed to checkout, enter shipping information
6. **Payment**: Scan the dynamically generated UPI QR code to make payment
7. **Order Confirmation**: Receive order confirmation after payment
8. **Track Orders**: View order status in profile page

## Admin Portal

Access the admin portal at `/admin` (requires admin account)

### Admin Features:
- **Dashboard**: Access product and order management
- **Product Management**: Add products with multiple images, safety warnings, and demo videos
- **Order Management**: View all orders and update order status
- **Payment Verification**: Mark orders as "Payment Verified" after manual verification

## Important Notes

⚠️ **Safety Warnings**:
- All products must include safety warning text
- Products are categorized for easy browsing
- Demo videos show how firecrackers work

🔒 **Security**:
- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Admin routes are protected
- User authentication required for orders

💳 **Payment**:
- Payment verification is manual by admin
- UPI payment links are generated dynamically
- QR codes generated in real-time
- Order tracking available for customers

## Customization

### Update Merchant UPI ID
Edit `server/routes/orders.js` and update the merchant UPI ID:

```javascript
const upiId = 'your-merchant@paytm'; // Change this
```

### Modify Product Categories
Edit the category enum in `server/models/Product.js` and categoryMap in `client/src/pages/HomePage.js`

## Troubleshooting

- **MongoDB Connection Error**: Ensure MongoDB is running and check connection string in `.env`
- **CORS Issues**: CORS is enabled for development, adjust in production
- **QR Code Not Showing**: Check if `qrcode` package is installed in client
- **Admin Access**: Create an admin user or manually update user document in MongoDB

## License

This project is for educational purposes.

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## Support

For issues or questions, please open an issue on the project repository.

---

🎆 **Built with ❤️ for Firecracker Enthusiasts**









