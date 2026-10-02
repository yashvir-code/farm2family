# 🌱 Farm2Family

**Farm2Family** is a full-stack web application that connects farmers directly with customers and makes fresh farm produce accessible through a digital platform.

The platform allows farmers to create and manage vegetable baskets, customers to browse and order fresh produce, and administrators to manage farmers, customers, memberships, orders, and platform activities.

---

## 🚀 Features

### 👨‍💼 Admin Panel

- Admin Login
- JWT Authentication
- Admin Dashboard
- Dashboard Analytics
- Farmer Verification
  - Pending
  - Verified
- Membership Management
  - View Membership Plans
  - Add Membership Plans
  - Edit Membership Plans
  - Delete Membership Plans
- Subscribers Management
- Admin Profile
- Order Management
- Platform Management

### 🚜 Farmer Panel

- Farmer Registration
- Farmer Login
- JWT Authentication
- Farmer Dashboard
- Add Vegetable Packets
- Multiple Vegetables per Packet
- Edit Packets
- Enable / Disable Packets
- View My Packets
- View Orders
- Manage Orders
- Earnings Dashboard
- Farmer Profile Management

### 👤 Customer Panel

- Customer Registration
- Customer Login
- JWT Authentication
- Customer Dashboard
- Browse Vegetable Baskets
- View Basket Details
- Place Orders
- Cash on Delivery
- Online Payment with Razorpay
- Order History
- Membership Plans
- Membership Purchase
- Subscription Management
- Customer Profile Management

---

## 💳 Payment Integration

Farm2Family uses **Razorpay** for online payments.

### Payment Features

- Razorpay Test Mode Integration
- Razorpay Order Creation
- Payment Verification
- Secure Payment Signature Verification
- Online Basket Orders
- Membership Payments
- Payment Status Tracking

> Razorpay secret keys are stored in environment variables and are not included in the repository.

---

## 🔐 Authentication & Security

The application uses JWT-based authentication for protected APIs.

### Authentication

- JWT Authentication
- bcrypt Password Hashing
- Protected Backend Routes
- Customer Authentication
- Farmer Authentication
- Admin Authentication

### Security Practices

- Passwords are hashed using bcrypt.
- Sensitive environment variables are not committed to GitHub.
- Razorpay Secret Key is stored only on the backend.
- JWT Secret is stored securely using environment variables.
- Admin registration is restricted.
- Protected APIs require authentication.

---

## 🛠 Tech Stack

### Frontend

- Next.js
- React.js
- TypeScript
- CSS

### Backend

- Node.js
- Express.js

### Database

- MySQL

### Authentication

- JWT (JSON Web Token)
- bcrypt

### Payment

- Razorpay

### Other Libraries

- Axios
- Multer
- CORS
- dotenv

---

## 📁 Project Structure

```text
Farm2Family/
│
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── utils/
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── f2f/
│   ├── app/
│   ├── admin_component/
│   ├── public/
│   ├── package.json
│   └── .env.local
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/farm2family.git
```

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd f2f
npm install
npm run dev
```

---
### Database Setup

Farm2Family uses MySQL as its database.

Create the database:
```
CREATE DATABASE farm2family;
```
Configure the database credentials in:
```
backend/.env
```
The project uses database modules for:

- Customer
- Farmer
- Admin
- Membership
- Orders
- Packets
- Packet Vegetables
- Subscription-related data

## Admin Access

### Admin registration is restricted and is not available as a public registration option.

For demonstration purposes, a Demo Admin account can be provided for testing the Admin Panel.

### Demo Admin
```
Admin Panel:
https://YOUR-DOMAIN.com/admin

Email:
admin@gmail.com

Password:
admin@0000
```
Demo credentials should only be used for testing and demonstration purposes.

## Customer Testing

Anyone can create a customer account from the application.

### Steps

1. Open the website.
2. Go to **Customer Registration**.
3. Create a new account.
4. Login with the registered credentials.
5. Open the **Customer Dashboard**.
6. Browse available vegetable baskets.
7. Place an order.
8. Test membership features if available.

---

##  Farmer Testing

Anyone can create a farmer account from the application.

### Steps

1. Open the website.
2. Go to **Farmer Registration**.
3. Create a farmer account.
4. Login with the registered credentials.
5. Complete the farmer profile.
6. Add vegetable packets.
7. Manage packets.
8. View customer orders.
9. Manage orders and earnings.

> Depending on the application workflow, farmer accounts may require Admin verification before certain features become available.


##  Razorpay Test Mode

The project currently supports **Razorpay Test Mode** for development and testing.

Razorpay credentials should be configured using environment variables:

```env
RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_KEY_SECRET
```

## Current Status

### Completed

- Customer Authentication
- Farmer Authentication
- Admin Authentication
- JWT Authentication
- Admin Dashboard
- Dashboard Analytics
- Farmer Verification System
- Packet Management
- Multiple Vegetable Packet Support
- Order Management
- Customer Order History
- Farmer Earnings Dashboard
- Customer Profile Management
- Farmer Profile Management
- Membership Plan Management
- Razorpay Payment Integration
- Online Order Payment
- Membership Payment Flow

### In Progress

- Admin-side Subscriber Management
- Subscriber Count and Customer Subscription Tracking
- Membership Payment and Customer Subscription Integration
- Integration of Membership Status with Customer Orders
- Admin Membership/Subscriber Management

### Planned

- Forgot Password / Password Reset
- AI Recommendation System
- Green Points / Reward System
- Delivery Tracking
- Notification System
- Additional AI-powered Features

### 👨‍💻 Developer
Yashvir Singh Parihar

B.Tech – Computer Science Engineering
Full-Stack Web Development | React | Next.js | Node.js | Express.js | MySQL

### 📜 License
This project is developed for educational, internship, portfolio, and demonstration purposes.
