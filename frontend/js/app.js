/**
 * Auberge de Grandeur — Hotel Reservation System
 * Frontend Data Store (simulates Java backend via localStorage)
 * Group 5 | BSCS 2A | Academic Year 2025-2026
 */

const HOTEL = {
  name: "Auberge de Grandeur",
  contact: "09103354758",
  rooms: [
    { roomNumber: 101, type: "Standard", pricePerNight: 100, capacity: 2,
      description: "Comfortable room with a queen bed, private bathroom, flat-screen TV, and complimentary Wi-Fi.", available: true },
    { roomNumber: 102, type: "Standard", pricePerNight: 100, capacity: 2,
      description: "Comfortable room with a queen bed, private bathroom, flat-screen TV, and complimentary Wi-Fi.", available: true },
    { roomNumber: 103, type: "Standard", pricePerNight: 100, capacity: 2,
      description: "Comfortable room with a queen bed, private bathroom, flat-screen TV, and complimentary Wi-Fi.", available: true },
    { roomNumber: 201, type: "Deluxe", pricePerNight: 200, capacity: 3,
      description: "Spacious deluxe room with king bed, mini-bar, city balcony view, and premium toiletries.", available: true },
    { roomNumber: 202, type: "Deluxe", pricePerNight: 200, capacity: 3,
      description: "Spacious deluxe room with king bed, mini-bar, city balcony view, and premium toiletries.", available: true },
    { roomNumber: 203, type: "Deluxe", pricePerNight: 200, capacity: 3,
      description: "Spacious deluxe room with king bed, mini-bar, city balcony view, and premium toiletries.", available: true },
    { roomNumber: 301, type: "Suite", pricePerNight: 350, capacity: 4,
      description: "Luxury suite with separate living area, jacuzzi, kitchenette, butler service, and panoramic views.", available: true },
    { roomNumber: 302, type: "Suite", pricePerNight: 350, capacity: 4,
      description: "Luxury suite with separate living area, jacuzzi, kitchenette, butler service, and panoramic views.", available: true },
    { roomNumber: 303, type: "Suite", pricePerNight: 350, capacity: 4,
      description: "Luxury suite with separate living area, jacuzzi, kitchenette, butler service, and panoramic views.", available: true },
  ],
  services: [
    { id: "room_cleaning", name: "Room Cleaning",    cost: 15,  icon: "🧹" },
    { id: "food_service",  name: "Food Service",     cost: 25,  icon: "🍽️" },
    { id: "laundry",       name: "Laundry",          cost: 20,  icon: "👕" },
    { id: "airport",       name: "Airport Transfer", cost: 50,  icon: "✈️" },
    { id: "spa",           name: "Spa Treatment",    cost: 80,  icon: "💆" },
  ]
};

// ── Storage ────────────────────────────────────────────────────────────────
const Store = {
  get(key)      { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
  remove(key)   { localStorage.removeItem(key); },

  getUsers()          { return this.get('adg_users') || []; },
  saveUsers(u)        { this.set('adg_users', u); },
  getReservations()   { return this.get('adg_reservations') || []; },
  saveReservations(r) { this.set('adg_reservations', r); },
  getServices()       { return this.get('adg_services') || []; },
  saveServices(s)     { this.set('adg_services', s); },
  getRooms()          { return this.get('adg_rooms') || HOTEL.rooms; },
  saveRooms(r)        { this.set('adg_rooms', r); },
  getCurrentUser()    { return this.get('adg_current_user'); },
  setCurrentUser(u)   { this.set('adg_current_user', u); },
  logout()            { this.remove('adg_current_user'); },
};

if (!localStorage.getItem('adg_rooms')) Store.saveRooms(HOTEL.rooms);

// ── Auth ───────────────────────────────────────────────────────────────────
const Auth = {
  register(data) {
    const users = Store.getUsers();
    if (users.find(u => u.username === data.username))
      return { success: false, message: 'Username already exists. Please choose another.' };
    if (users.find(u => u.email === data.email))
      return { success: false, message: 'Email already registered. Please use a different email.' };
    users.push({ ...data, profileImage: null, createdAt: new Date().toISOString() });
    Store.saveUsers(users);
    return { success: true, message: 'Account created successfully!' };
  },

  login(username, password) {
    const users = Store.getUsers();
    const user  = users.find(u => u.username === username && u.password === password);
    if (user) { Store.setCurrentUser(user); return { success: true, user }; }
    return { success: false, message: 'Incorrect username or password. Please try again.' };
  },

  requireAuth() {
    const user = Store.getCurrentUser();
    if (!user) { window.location.href = '../../index.html'; return null; }
    return user;
  }
};

// ── Bookings ───────────────────────────────────────────────────────────────
const Bookings = {
  create(guest, roomNumber, checkIn, checkOut, nights) {
    const rooms  = Store.getRooms();
    const roomIdx = rooms.findIndex(r => r.roomNumber === roomNumber);
    if (roomIdx === -1 || !rooms[roomIdx].available)
      return { success: false, message: 'Sorry, this room is no longer available.' };
    if (nights <= 0)
      return { success: false, message: 'Check-out date must be after check-in date.' };

    const room = rooms[roomIdx];
    const reservation = {
      reservationId: 1000 + Store.getReservations().length + 1,
      username:      guest.username,
      guestName:     `${guest.firstName} ${guest.lastName}`,
      roomNumber:    room.roomNumber,
      roomType:      room.type,
      pricePerNight: room.pricePerNight,
      checkIn, checkOut, nights,
      totalRoomCost: room.pricePerNight * nights,
      status:        'CONFIRMED',
      createdAt:     new Date().toISOString()
    };

    rooms[roomIdx].available = false;
    Store.saveRooms(rooms);
    const reservations = Store.getReservations();
    reservations.push(reservation);
    Store.saveReservations(reservations);
    return { success: true, reservation };
  },

  getForUser(username) {
    return Store.getReservations().filter(r => r.username === username);
  },

  cancel(reservationId) {
    let reservations = Store.getReservations();
    const idx = reservations.findIndex(r => r.reservationId === reservationId);
    if (idx === -1) return;
    const roomNum = reservations[idx].roomNumber;
    reservations[idx].status = 'CANCELLED';
    Store.saveReservations(reservations);
    let rooms = Store.getRooms();
    const rIdx = rooms.findIndex(r => r.roomNumber === roomNum);
    if (rIdx !== -1) rooms[rIdx].available = true;
    Store.saveRooms(rooms);
  }
};

// ── Services ───────────────────────────────────────────────────────────────
const Services = {
  request(guest, serviceId, date) {
    const svc = HOTEL.services.find(s => s.id === serviceId);
    if (!svc) return { success: false, message: 'Service not found.' };
    const entry = {
      id: Date.now() + Math.random(),
      username:    guest.username,
      serviceName: svc.name,
      serviceId:   svc.id,
      cost:        svc.cost,
      date,
      status: 'PENDING'
    };
    const services = Store.getServices();
    services.push(entry);
    Store.saveServices(services);
    return { success: true, service: entry };
  },
  getForUser(username) {
    return Store.getServices().filter(s => s.username === username);
  }
};

// ── Billing ────────────────────────────────────────────────────────────────
const Billing = {
  generate(reservation, services) {
    const servicesCost = services.reduce((sum, s) => sum + s.cost, 0);
    return {
      reservationId: reservation.reservationId,
      guestName:     reservation.guestName,
      roomType:      reservation.roomType,
      roomNumber:    reservation.roomNumber,
      checkIn:       reservation.checkIn,
      checkOut:      reservation.checkOut,
      nights:        reservation.nights,
      roomCost:      reservation.totalRoomCost,
      pricePerNight: reservation.pricePerNight,
      servicesCost,
      total: reservation.totalRoomCost + servicesCost
    };
  }
};

// ── UI Utilities ───────────────────────────────────────────────────────────
const UI = {
  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✓', error: '✕', info: 'i' };
    toast.innerHTML = `<span style="font-weight:700;font-size:0.95rem;flex-shrink:0">${icons[type]||'i'}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  formatCurrency(amount) {
    return '$' + Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  },

  renderAvatar(user, container) {
    if (user && user.profileImage) {
      container.innerHTML = `<img src="${user.profileImage}" alt="Profile" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
      container.style.cssText = '';
    } else {
      const initials = ((user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')).toUpperCase();
      container.textContent = initials || '?';
      container.style.cssText = `
        display:flex;align-items:center;justify-content:center;
        background:var(--brown-warm);color:white;
        font-family:var(--font-display);font-size:1rem;font-weight:600;border-radius:50%;
      `;
    }
  }
};

function getRoomGradient(type) {
  const g = {
    Standard: 'linear-gradient(135deg,#8b6245,#5c3317)',
    Deluxe:   'linear-gradient(135deg,#6b4226,#3b1f0e)',
    Suite:    'linear-gradient(135deg,#c9a84c,#8b5e3c)',
  };
  return g[type] || g.Standard;
}

// Returns a greeting based on current hour — makes the dashboard feel warmer
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
