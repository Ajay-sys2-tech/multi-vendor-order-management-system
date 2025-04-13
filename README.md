🛍️ Multi-Vendor Order Management System API  

A scalable and modular Node.js + Express API for managing a multi-vendor e-commerce platform. This backend service handles vendor onboarding, customer orders, order splitting, and real-time analytics for vendors and administrators.

🌟 Key Features  

🔒 Secure Authentication & Role Management  

- JWT-based authentication with role-based access control (Admin, Vendor, Customer)

- Bcrypt password hashing for enhanced security

- Session management and token refresh

🏪 Vendor Management Suite
- Complete vendor onboarding workflow

- Product catalog management (CRUD operations)

- Real-time inventory tracking

- Vendor performance dashboard

🚀 Order Processing Engine
    Atomic order creation with MongoDB transactions

    Automatic order splitting by vendor

    Multi-vendor cart functionality

    Order status tracking (Pending → Fulfilled → Completed)

📊 Advanced Analytics
    Real-time sales analytics for vendors and admins

    Revenue tracking across multiple dimensions

    Product performance metrics

    Custom reporting capabilities

⚙️ Operational Excellence
    Containerized deployment with Docker

    Schema validation with Zod

    Comprehensive error handling

    Automated testing suite  

🛠️ Technology Stack

| Component         | Technology                | Purpose                          |
|------------------|---------------------------|----------------------------------|
| Runtime          | Node.js                   | JavaScript execution environment |
| Framework        | Express.js                | API routing and middleware       |
| Database         | MongoDB                   | NoSQL data storage               |
| ORM/ODM          | Mongoose                  | MongoDB object modeling          |
| Authentication   | JWT + Bcrypt              | Secure user authentication       |
| Validation       | Zod                       | Request/response validation      |
| Containerization | Docker + Docker Compose   | Environment standardization      |
| Transactions     | MongoDB Transactions      | Atomic operations                |


📦 Project Structure
```
multi-vendor-order-management/
├── db/                  # Database connection setup
├── models/              # MongoDB schemas and models
├── routes/              # API endpoint definitions
├── middlewares/         # Custom Express middleware
├── repositories/        # Data access layer
├── services/            # Business logic layer
├── utils/               # Helper functions and utilities
├── schema/              # Validation schemas
├── tests/               # Test suites
├── .env                 # Environment configuration
├── app.js               # Express application setup
├── Dockerfile           # Container configuration
├── docker-compose.yml   # Service orchestration
└── index.js             # Application entry point
```

⚙️ Getting Started
    Prerequisites
    Node.js
    Docker
    Docker Compose

🐳 Docker Setup (Recommended)
Clone the repository
```bash
git clone https://github.com/Ajay-sys2-tech/multi-vendor-order-management-system.git
cd multi-vendor-order-management-system
```

Start the services
```bash
docker-compose up --build
```

Local Setup
```bash
npm install
npm start
```

API will be running at:
http://localhost:4000

🧪 Run Tests

```bash
npm run test
```

🔐 Roles & Access
| Role     | Capabilities                                                                 |
|----------|------------------------------------------------------------------------------|
| Admin    | Manage users & vendors, view full analytics                                  |
| Vendor   | Manage own products, view vendor-specific sales & product performance        |
| Customer | Browse products, place orders across multiple vendors                        |


📊 Analytics Features
    Total revenue by vendor or platform-wide

    Top-selling products

    Order volume trends

    Per-vendor order performance

    Powered by MongoDB Aggregation Framework

📬 API Endpoints (Partial Overview)
| Method     | Endpoint                           |	Description	                       | Auth   |
|------------|------------------------------------|------------------------------------|--------|
| POST |	/users/register | Register as customer or vendor or admin	| ❌ Public |
| POST |	/users/login	| Login and receive JWT	| ❌ Public |
| GET	 |  /products	    | List all products	 | ❌ Public |
| GET    | /products/{productId}   | Get a product by ID | ❌ Public   |
| POST   | /products               | Add a product       | ✅ Vendor   |
| PUT    | /products/{productId}   | Update a product    | ✅ Vendor   |
| DELETE | /products/{productId}   | Delete a product    | ✅ Vendor   |
| GET    | /carts                | Get cart items                                           | ✅ Customer  |
| POST   | /carts/{productId}    | Add product to cart                                      | ✅ Customer  |
| PATCH  | /carts/{cartId}       | Update quantity of a product (use `remove: true` to reduce) | ✅ Customer  |
| DELETE | /carts/{cartId}       | Delete a cart                                            | ✅ Customer  |
| GET    | /orders?orderStatus=created               | Get customer orders(`created/dispatched/delivered`)                   | ✅ Customer |
| GET    | /orders/{orderId}      | Get order by ID                       | ✅ Customer |
| POST   | /orders                | Create order from cart (checkout)     | ✅ Customer |
| GET    | /orders/recieved?orderStatus=created      | Get received orders (vendor)          | ✅ Vendor   |
| PUT    | /orders/{orderId}      | Update order status                   | ✅ Vendor   |
| GET    | /admin/revenue            | Get vendor revenue for the last few days        | ✅ Admin   |
| GET    | /admin/order-analysis?days=30&limit=5     | Get top product by sales & average order value  | ✅ Admin   |
| GET    | /vendor/sales?days=7         | Get daily sales for last X days     | ✅ Vendor  |
| GET    | /vendor/low-stock?maxStock=10    | Get low stock items                 | ✅ Vendor  |

🧰 Environment Variables  

    Copy .env.example to .env and update values as needed

🙌 Contributions  

    Contributions, issues, and feature requests are welcome!
    Feel free to open a pull request.

📄 License  

    This project is licensed under the MIT License.

