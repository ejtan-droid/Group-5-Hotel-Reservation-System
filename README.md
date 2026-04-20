# Auberge de Grandeur — Hotel Reservation System
**Group 5 | BSCS 2A | Academic Year 2025-2026**

---

### Members
| Name | Role |
|---|---|
| Eldion John T. Tan | Lead Developer / UI-UX Designer |
| Trestan Khian B. Malagkit | UI-UX Designer / UX Researcher |
| Shan Louie P. Ortula | Project Manager / Writer |
| Denise Margarette D. Sia | Documentation Lead / Prototype Developer |

---

### What's New
- Phone number format validation (09XXXXXXXXX) with live hint
- Register form auto-clears after successful signup
- Time scheduling for reservations (check-in/check-out time picker)
- Time scheduling for service requests (time picker)
- Modify reservation — edit dates and times, conflict check, cost recalculation
- Modify service — change scheduled date and time (PENDING only, future dates only)
- Admin Panel — separate staff-only dashboard at admin.html
- MySQL database support via XAMPP (Phase 2 — see guide below)

---

### How to Open in VS Code

1. Download the project folder
2. Open **VS Code**
3. Go to **File → Open Folder** and select `AubergeDeGrandeur`
4. Install the **Live Server** extension if you haven't yet:
   - Press `Ctrl+Shift+X` → search "Live Server" → Install
5. Right-click `index.html` → click **Open with Live Server**
6. The system opens in your browser at `http://127.0.0.1:5500`

> Without Live Server you can also just double-click `index.html` in File Explorer and it will open in Chrome. All features work without a server in localStorage mode.

---

### Default Login Credentials

| Role | Username | Password |
|---|---|---|
| Admin (Staff) | `admin` | `admin2026` |
| Guest | Register a new account from the login page | — |

---

### Project Structure

```
AubergeDeGrandeur/
│
├── index.html                 
├── README.md
│
├── api/                   
│   ├── config.php            
│   ├── auth.php              
│   ├── rooms.php             
│   ├── reservations.php       
│   ├── services.php          
│   └── setup.sql             
├── frontend/
│   ├── css/style.css
│   ├── js/
│   │   ├── app.js             
│   │   └── nav.js             
│   └── pages/
│       ├── dashboard.html
│       ├── rooms.html
│       ├── reservation.html   
│       ├── billing.html
│       ├── services.html      
│       ├── profile.html
│       └── admin.html         
│
└── backend/src/        
    ├── Person.java
    ├── Guest.java
    ├── Room.java
    ├── StandardRoom.java
    ├── DeluxeRoom.java
    ├── SuiteRoom.java
    ├── Reservation.java
    ├── Hotel.java
    └── Main.java
```

---

## XAMPP Database Connection Guide

The system runs on **localStorage by default** — no server needed (Phase 1).

Follow these steps to switch to a real **MySQL database via XAMPP** (Phase 2).

---

### STEP 1 — Start XAMPP

1. Open **XAMPP Control Panel** from your Start menu
2. Click **Start** next to **Apache** — wait for it to turn green
3. Click **Start** next to **MySQL** — wait for it to turn green

> If MySQL fails to start: click **Config** next to MySQL → open `my.ini` → find `port=3306` → change it to `port=3307` → save the file → click Start again

---

### STEP 2 — Create the Database

1. Open your browser and go to: `http://localhost/phpmyadmin`
2. In the left sidebar, click **New**
3. In the "Database name" box, type: `auberge_db`
4. Leave the collation as default → click **Create**
5. Click on **auberge_db** in the left sidebar to select it
6. Click the **SQL** tab at the top of the page
7. Open the file `api/setup.sql` from the project in VS Code
8. Select all the text (Ctrl+A) and copy it (Ctrl+C)
9. Paste it (Ctrl+V) into the phpMyAdmin SQL tab
10. Click the **Go** button
11. You should see a table of results and the message: **Database setup complete!**

Check that these tables were created in the left sidebar under `auberge_db`:
- `users`
- `rooms`
- `reservations`
- `services`

---

### STEP 3 — Copy the API Files to XAMPP

1. Open **File Explorer**
2. Navigate to: `C:\xampp\htdocs\`
3. Create a new folder and name it: `auberge`
4. Open your project folder in another window
5. Copy the entire `api` folder and paste it inside `C:\xampp\htdocs\auberge\`

When done, the file paths should look like this:
```
C:\xampp\htdocs\auberge\api\config.php
C:\xampp\htdocs\auberge\api\auth.php
C:\xampp\htdocs\auberge\api\rooms.php
C:\xampp\htdocs\auberge\api\reservations.php
C:\xampp\htdocs\auberge\api\services.php
```

---

### STEP 4 — Test the API Connection

Open your browser and go to: `http://localhost/auberge/api/rooms.php`

You should see something like this (JSON data):
```json
[
  {"id":1,"roomNumber":101,"type":"Standard","pricePerNight":"100.00","capacity":2,...},
  {"id":2,"roomNumber":102,"type":"Standard",...},
  ...
]
```

If you see that — the connection is working. If you see an error, go back to Step 1 and make sure both Apache and MySQL are running.

---

### STEP 5 — Update app.js to Use MySQL

Open `frontend/js/app.js` in VS Code.

**Add this at the very top of the file (line 1):**
```javascript
const API = "http://localhost/auberge/api";
```

Then replace the `Auth` object's `register` and `login` methods to use `fetch()` instead of localStorage.

**Replace Auth.register with:**
```javascript
async register(data) {
  const res = await fetch(`${API}/auth.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "register", ...data })
  });
  return res.json();
},
```

**Replace Auth.login with:**
```javascript
async login(username, password) {
  const res = await fetch(`${API}/auth.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", username, password })
  });
  const data = await res.json();
  if (data.success) Store.setCurrentUser(data.user);
  return data;
},
```

The same for:
- `Bookings.create` → POST to `reservations.php` with `action: "create"`
- `Bookings.cancel` → POST to `reservations.php` with `action: "cancel"`
- `Bookings.modify` → POST to `reservations.php` with `action: "modify"`
- `Bookings.getForUser` → GET from `reservations.php?action=get&userId=...`
- `Services.request` → POST to `services.php` with `action: "create"`
- `Services.modify` → POST to `services.php` with `action: "modify"`
- `Services.updateStatus` → POST to `services.php` with `action: "updateStatus"`
- `Services.getForUser` → GET from `services.php?action=get&userId=...`

> All functions that use fetch() must be marked `async` and called with `await` on the page. Migrate one function at a time and test in the browser after each change.

---

### STEP 6 — Test the Full System

1. Make sure XAMPP has both Apache and MySQL running (green in Control Panel)
2. Open the project with Live Server or open `index.html` in Chrome
3. Register a new account
4. Go to phpMyAdmin → `auberge_db` → `users` table — your new account should appear there
5. Log in, make a reservation, request a service
6. Check the `reservations` and `services` tables in phpMyAdmin — your data should appear

If data is showing in the database — it is fully connected and working.

Make sure you typed `admin` and `admin2026` exactly. Admin uses sessionStorage so it clears when the tab is closed |

---

### Running the Java Backend

```bash
cd backend/src
javac *.java
java Main
```

Requires Java 11 or higher installed. The Java backend is a console demo for the OOP subject presentation.

---

### Instructor
Mrs. Harnelyn Lamson Amar
