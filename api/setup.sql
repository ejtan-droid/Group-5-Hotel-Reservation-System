CREATE DATABASE IF NOT EXISTS auberge_db CHARACTER SET utf8 COLLATE utf8_general_ci;
USE auberge_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  firstName     VARCHAR(50)  NOT NULL,
  lastName      VARCHAR(50)  NOT NULL,
  email         VARCHAR(100) NOT NULL UNIQUE,
  contactNumber VARCHAR(15),
  username      VARCHAR(50)  NOT NULL UNIQUE,
  password      VARCHAR(255) NOT NULL,
  role          ENUM('guest','admin') DEFAULT 'guest',
  profileImage  TEXT,
  createdAt     DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  roomNumber    INT NOT NULL UNIQUE,
  type          ENUM('Standard','Deluxe','Suite') NOT NULL,
  pricePerNight DECIMAL(10,2) NOT NULL,
  capacity      INT NOT NULL,
  description   TEXT,
  isAvailable   TINYINT(1) DEFAULT 1
);

-- Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  userId        INT NOT NULL,
  roomId        INT NOT NULL,
  checkIn       DATE NOT NULL,
  checkOut      DATE NOT NULL,
  checkInTime   VARCHAR(10) DEFAULT '14:00',
  checkOutTime  VARCHAR(10) DEFAULT '12:00',
  nights        INT NOT NULL,
  totalRoomCost DECIMAL(10,2) NOT NULL,
  status        ENUM('CONFIRMED','CANCELLED') DEFAULT 'CONFIRMED',
  lastModified  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  createdAt     DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (roomId) REFERENCES rooms(id)
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  userId        INT NOT NULL,
  serviceName   VARCHAR(100) NOT NULL,
  serviceId     VARCHAR(50)  NOT NULL,
  cost          DECIMAL(10,2) NOT NULL,
  scheduledDate DATE NOT NULL,
  scheduledTime VARCHAR(10) DEFAULT '09:00',
  status        ENUM('PENDING','IN_PROGRESS','COMPLETED') DEFAULT 'PENDING',
  lastModified  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  createdAt     DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Default rooms
INSERT IGNORE INTO rooms (roomNumber, type, pricePerNight, capacity, description) VALUES
(101,'Standard',100.00,2,'Comfortable room with a queen bed, private bathroom, flat-screen TV, and free Wi-Fi.'),
(102,'Standard',100.00,2,'Comfortable room with a queen bed, private bathroom, flat-screen TV, and free Wi-Fi.'),
(103,'Standard',100.00,2,'Comfortable room with a queen bed, private bathroom, flat-screen TV, and free Wi-Fi.'),
(201,'Deluxe',200.00,3,'Spacious room with king bed, mini-bar, city balcony view, and premium toiletries.'),
(202,'Deluxe',200.00,3,'Spacious room with king bed, mini-bar, city balcony view, and premium toiletries.'),
(203,'Deluxe',200.00,3,'Spacious room with king bed, mini-bar, city balcony view, and premium toiletries.'),
(301,'Suite',350.00,4,'Luxury suite with separate living area, jacuzzi, kitchenette, and panoramic views.'),
(302,'Suite',350.00,4,'Luxury suite with separate living area, jacuzzi, kitchenette, and panoramic views.'),
(303,'Suite',350.00,4,'Luxury suite with separate living area, jacuzzi, kitchenette, and panoramic views.');

-- Admin account
INSERT IGNORE INTO users (firstName,lastName,email,contactNumber,username,password,role)
VALUES ('Hotel','Admin','admin@auberge.com','09912345678','admin','admin2026','admin');