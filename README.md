# 💬 Real-Time Chat Application

A full-stack chat application with a WhatsApp-like interface, real-time messaging, and secure authentication. Built using **Spring Boot**, following clean architecture principles, scalable design patterns, and modern UI practices.

---

## 🚀 Features

* 🔐 Secure User Authentication & Authorization
* 💬 Real-Time Messaging
* 👥 User Registration & Login
* 📱 Responsive WhatsApp-Inspired Interface
* ⚡ Fast Message Delivery
* 🟢 Online User Presence
* 🔒 Spring Security Integration
* 📂 Layered Architecture (Controller → Service → Repository)
* 🎨 Clean and Modern UI

---

## 🛠️ Tech Stack

### Backend

* Java 17
* Spring Boot
* Spring MVC
* Spring Security
* Spring Data JPA
* Maven

### Database

* MySQL

### Authentication

* JWT Authentication
* Spring Security

### Frontend

* HTML5
* CSS3
* JavaScript

### Development Tools

* IntelliJ IDEA / Eclipse
* Postman
* Git & GitHub

---

## 📂 Project Structure

```text
src
└── main
    └── java
        └── com.example.chatApp
            ├── Controller
            ├── config
            ├── dto
            ├── model
            ├── repository
            ├── security
            ├── service
            └── ChatAppApplication.java
```

---

## 🏗️ Architecture

```text
Client/UI
    │
    ▼
Controller Layer
    │
    ▼
Service Layer
    │
    ▼
Repository Layer
    │
    ▼
MySQL Database
```

---

## ⚙️ Getting Started

### Clone Repository

```bash
git clone https://github.com/Suryanshdhiman18/chat-App.git
cd chat-App
```

### Configure Database

Update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/chat_app
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
```

### Run Application

```bash
mvn clean install
mvn spring-boot:run
```

Application will start on:

```text
http://localhost:8080
```

---

## 🔑 Key Modules

### Authentication Module

* User Registration
* Secure Login
* JWT Token Generation
* Authorization

### Chat Module

* Send Messages
* Receive Messages
* Conversation Management
* Real-Time Updates

### User Module

* User Profiles
* User Management
* Online Status Tracking

---

## 📸 Screenshots

Add screenshots of:

* Login Page
* Registration Page
* Chat Dashboard
* Conversation Window
* User List

---

## 🎯 Learning Outcomes

This project demonstrates:

* Spring Boot Development
* REST API Design
* JWT Authentication
* Spring Security Implementation
* Database Integration using JPA
* Layered Architecture
* Full-Stack Application Development

---

## 🔮 Future Enhancements

* Group Chat Support
* File Sharing
* Voice Messages
* Video Calling
* Message Encryption
* Dark Mode
* Push Notifications

---

## 👨‍💻 Author

**Suryansh Dhiman**

Associate Software Engineer | Backend Developer & SDET

GitHub: https://github.com/Suryanshdhiman18

---

⭐ If you found this project useful, consider giving it a star!
