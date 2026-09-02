# 🍕 Pizza Delivery App

A full-stack pizza ordering and inventory management platform built with **React.js, Node.js, Express.js, and MongoDB**.

The application provides separate user and admin experiences, secure authentication, email verification, custom pizza creation, online payment testing, order tracking, inventory management, and automated low-stock notifications.

## 🚀 Live Demo

**Frontend:** https://pizza-delivery-app-eight.vercel.app/

**Backend API:** https://pizza-delivery-backend-5qz3.onrender.com/

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* React Router
* Context API
* CSS

### Backend

* Node.js
* Express.js
* JWT Authentication
* Nodemailer / Brevo
* Socket.IO
* Node-Cron
* Razorpay Test Mode

### Database

* MongoDB
* MongoDB Atlas
* Mongoose

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database

## ✨ Features

### 👤 User Features

* User registration with email verification
* Real Gmail OTP verification
* JWT-based authentication
* Secure login
* Forgot password and password reset
* Browse available pizzas
* Custom pizza builder

  * Choose pizza base
  * Choose sauce
  * Choose cheese
  * Select multiple vegetables
* Shopping cart
* Increase/decrease item quantity
* Remove items from cart
* Order summary
* Razorpay test payment flow
* View placed orders
* Track order status

### 👨‍💼 Admin Features

* Separate admin login
* Protected admin routes
* Admin dashboard
* View and manage customer orders
* Update order status
* Inventory dashboard
* View current stock
* Manually update inventory
* Automatic inventory deduction after orders
* Automated low-stock email notifications
* Scheduled inventory monitoring using Node-Cron

## 🔄 Order Flow

```text
Register
   ↓
Email OTP Verification
   ↓
Login
   ↓
Browse / Customize Pizza
   ↓
Add to Cart
   ↓
Checkout
   ↓
Test Payment
   ↓
Order Created
   ↓
Order Received
   ↓
In Kitchen
   ↓
Sent to Delivery
```

## 📦 Project Structure

```text
pizza-delivery-app/
│
├── backend/
│   ├── controllers/
│   ├── jobs/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── package.json
│
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
│
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Environment Variables

Create a `.env` file for the backend and add the required environment variables.

Example:

```env
PORT=10000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BREVO_API_KEY=your_brevo_api_key
EMAIL_USER=your_sender_email
```

**Never commit your `.env` file to GitHub.**

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/shalu-sihag/pizza-delivery-app.git
cd pizza-delivery-app
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create:

```text
backend/.env
```

and add your environment variables.

### 5. Start the backend

```bash
npm run dev
```

### 6. Start the frontend

From the project root:

```bash
npm run dev
```

## 🔒 Security

* JWT-based authentication
* Password hashing
* Email verification
* Protected admin routes
* Environment variables for sensitive credentials
* Secrets excluded from Git using `.gitignore`

## 🎯 Project Objective

The goal of this project is to demonstrate the development of a production-style full-stack food ordering platform with authentication, payments, inventory management, automated notifications, and separate user/admin workflows.

## 👩‍💻 Author

**Shalu Sihag**

B.Tech Computer Science & Engineering

GitHub: https://github.com/shalu-sihag
