# 🚗 CarHub — Self Drive Car Rental System

## 📌 Overview

CarHub is a full-stack web application that allows users to rent self-drive cars online. It includes secure authentication, booking management, admin controls, and real-time status updates.

---

## 🚀 Features

### 👤 User Features

* User Registration & Login (JWT Authentication)
* OTP Verification via Email
* Forgot Password (OTP-based reset)
* Search & Filter Cars
* Book Cars with Date Validation
* Prevent Double Booking
* View Booking History (Confirmed, Cancelled, Completed)

---

### 🛠️ Admin Features

* Add / Update / Delete Cars
* Upload Car Images
* View All Bookings
* Confirm / Cancel Bookings
* Admin Dashboard (Users, Cars, Bookings)
* Admin Approval System via Email

---

### 🔐 Security Features

* JWT Authentication
* Role-based Access Control (ADMIN / USER)
* OTP Expiry System
* Protected Routes

---

### 📊 System Features

* Pagination for Cars & Bookings
* Booking Status Automation (Completed after end date)
* Email Notifications for Booking Confirmation
* Responsive UI (Mobile + Desktop)

---

## 🧱 Tech Stack

### Frontend

* React.js
* Axios
* SweetAlert2

### Backend

* Spring Boot
* Spring Security (JWT)
* Hibernate / JPA

### Database

* MySQL

### Other

* JavaMail (SMTP for OTP & Notifications)
* File Upload System

---

## 📸 Screenshots

(Add screenshots here)

---

## ⚙️ Setup Instructions

### Backend

```bash
mvnw.cmd spring-boot:run
```

### Frontend

```bash
npm install
npm run dev
```

---

## 🌐 API Base URL

```
http://localhost:8080/api
```

---

## 🎯 Future Enhancements

* Payment Integration (Razorpay)
* Cloud Image Storage (AWS / Cloudinary)
* Real-time Notifications
* Advanced Analytics Dashboard

---

## 👨‍💻 Author

Venkatesh
