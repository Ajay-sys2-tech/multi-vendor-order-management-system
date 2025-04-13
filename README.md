🛍️ Multi-Vendor Order Management System API
A scalable and modular Node.js + Express API for managing a multi-vendor e-commerce platform. This backend service handles vendor onboarding, customer orders, order splitting, and real-time analytics for vendors and administrators.

Built with: Node.js, Express, MongoDB, Docker, JWT, Mongoose, Zod

🚀 Features
🔐 Authentication & RBAC
Supports Admin, Vendor, and Customer roles with secure JWT-based authentication and route-level authorization.

🧑‍💼 Vendor Portal
Vendors can manage their products, view performance analytics, and track order fulfillment.

🛒 Customer Orders
Customers can place orders across multiple vendors in a single checkout. Orders are automatically split per vendor.

🧾 Order Management
Order creation uses MongoDB transactions to ensure atomic updates to inventory and order records.

📊 Analytics Dashboards
Aggregated statistics for Admins and Vendors to track revenue, top-selling products, and order trends.

🧩 Clean and Modular Architecture
Follows a scalable folder structure with reusable services, middlewares, and models.

🐳 Dockerized Environment
Easily spin up the API and database using Docker and Docker Compose.

🛠️ Tech Stack
Tool/Library	Purpose
Node.js + Express	Backend server and routing
MongoDB + Mongoose	NoSQL database and ODM
JWT	Stateless authentication
Bcrypt	Password hashing
Zod	Schema validation
Docker	Containerization & easy setup
MongoDB Transactions	Atomic operations on orders and inventory
📦 Project Structure


├── db
├── models
├── routes
├── middlewares
├── repositories
├── services
├── utils
├── schema
├── __tests__
├── .env
├── app.js
├── Dockerfile
├── docker-compose.yml
└── index.js

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
Role	Capabilities
Admin	Manage users & vendors, view full analytics
Vendor	Manage own products, view vendor-specific sales & product performance
Customer	Browse products, place orders across multiple vendors

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
| vPOST |	/orders	        | Place order with multiple vendors |	✅ Customer |
| GET  |	/api/analytics/vendor |	Vendor analytics	| ✅ Vendor |
| GET	 |  /api/analytics/admin  |	Admin analytics	 | ✅ Admin |

🧰 Environment Variables
Copy .env.example to .env and update values as needed

🙌 Contributions
Contributions, issues, and feature requests are welcome!
Feel free to open a pull request.

📄 License
This project is licensed under the MIT License.

