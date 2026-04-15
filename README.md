# Auberge de Grandeur
## Hotel Reservation System

**Group 5 | BSCS 2A | Academic Year 2025-2026**

---

### Members

| Name | Role (OOP) | Role (HCI) |
|---|---|---|
| Eldion John T. Tan | Lead Developer | UI/UX Designer |
| Trestan Khian B. Malagkit | UI / Logic Developer | UX Researcher |
| Shan Louie P. Ortula | Project Lead | Project Manager / Writer |
| Denise Margarette D. Sia | Documentation Lead | Prototype Developer |

---

### What is this?

This is our final project for Object-Oriented Programming and Human-Computer Interaction. We built a Hotel Reservation System where guests can register, log in, browse rooms, make reservations, request services, and view their billing.

The system is split into two parts:
- **Java** handles the backend logic using OOP principles
- **HTML/CSS/JavaScript** handles the front-end interface

---

### How to Run

**To open the website (frontend):**
1. Download or clone the project
2. Open `index.html` in Chrome or any browser
3. Register an account and log in
4. That's it — all features should work

> Note: Data is saved in the browser's localStorage so it stays even after you refresh. To reset everything, open DevTools > Application > Local Storage > Clear all.

**To run the Java backend demo:**

Make sure you have Java 11 or higher installed.

```bash
cd backend/src
javac *.java
java Main
```

This will run a demo in the terminal showing how the OOP classes work together.

---

### Project Structure

```
AubergeDeGrandeur/
│
├── index.html               
│
├── frontend/
│   ├── css/
│   │   └── style.css        
│   ├── js/
│   │   ├── app.js          
│   │   └── nav.js           
│   └── pages/
│       ├── dashboard.html
│       ├── rooms.html
│       ├── reservation.html
│       ├── billing.html
│       ├── services.html
│       └── profile.html
│
└── backend/
    └── src/
        ├── Person.java
        ├── Guest.java
        ├── Room.java
        ├── StandardRoom.java  
        ├── Reservation.java  
        ├── Hotel.java
        └── Main.java
```

---

### OOP Concepts Used

- **Encapsulation** — all class fields are private, accessed only through getters and setters
- **Inheritance** — Guest extends Person; StandardRoom, DeluxeRoom, SuiteRoom all extend Room
- **Polymorphism** — getRoomType() is overridden in each Room subclass; displayProfile() in Guest
- **Abstraction** — Person and Room are abstract classes that cannot be directly created

---

### Features

- Register and login system with validation
- Browse rooms by type (Standard, Deluxe, Suite) with filter buttons
- Reserve a room with check-in/check-out date picker and cost preview
- Cancel a reservation
- Request hotel services (room cleaning, food, laundry, airport transfer, spa)
- Billing summary with print receipt option
- Edit profile info and upload a profile picture
- Social media links on login page (Facebook, TikTok, X, Instagram)

---

### Instructor

Mrs. Harnelyn Lamson Amar
