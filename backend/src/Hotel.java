import java.util.ArrayList;
import java.util.List;

/**
 * Hotel class - central manager for the Hotel Reservation System.
 * Manages all guests, rooms, reservations, and service requests.
 * Demonstrates Encapsulation and use of Java Collections.
 *
 * @author Group 5 - BSCS 2A
 * @version 1.0
 */
public class Hotel {

    private String hotelName;
    private List<Guest> guests;
    private List<Room> rooms;
    private List<Reservation> reservations;
    private List<Service> services;

    /**
     * Constructor for Hotel. Initializes all data structures
     * and pre-populates rooms.
     *
     * @param hotelName Name of the hotel
     */
    public Hotel(String hotelName) {
        this.hotelName = hotelName;
        this.guests = new ArrayList<>();
        this.rooms = new ArrayList<>();
        this.reservations = new ArrayList<>();
        this.services = new ArrayList<>();
        initializeRooms();
    }

    /**
     * Pre-populates the hotel with rooms.
     * Uses polymorphism — Room references hold subclass objects.
     */
    private void initializeRooms() {
        // Standard Rooms
        rooms.add(new StandardRoom(101, 100.00));
        rooms.add(new StandardRoom(102, 100.00));
        rooms.add(new StandardRoom(103, 100.00));
        rooms.add(new StandardRoom(104, 100.00));

        // Deluxe Rooms
        rooms.add(new DeluxeRoom(201, 200.00));
        rooms.add(new DeluxeRoom(202, 200.00));
        rooms.add(new DeluxeRoom(203, 200.00));

        // Suite Rooms
        rooms.add(new SuiteRoom(301, 350.00));
        rooms.add(new SuiteRoom(302, 350.00));
        rooms.add(new SuiteRoom(303, 350.00));
    }

    // ── Guest Management ──────────────────────────────────────────────────────

    /**
     * Registers a new guest in the system.
     *
     * @param guest Guest to register
     * @return true if registered successfully, false if username already exists
     */
    public boolean registerGuest(Guest guest) {
        for (Guest g : guests) {
            if (g.getUsername().equals(guest.getUsername())) {
                return false; // Username taken
            }
        }
        guests.add(guest);
        return true;
    }

    /**
     * Authenticates a guest by username and password.
     *
     * @param username Login username
     * @param password Login password
     * @return Guest object if login succeeds, null otherwise
     */
    public Guest login(String username, String password) {
        for (Guest g : guests) {
            if (g.getUsername().equals(username) && g.validatePassword(password)) {
                return g;
            }
        }
        return null;
    }

    /**
     * Checks if a username is already taken.
     *
     * @param username Username to check
     * @return true if taken
     */
    public boolean isUsernameTaken(String username) {
        for (Guest g : guests) {
            if (g.getUsername().equals(username)) return true;
        }
        return false;
    }

    // ── Room Management ───────────────────────────────────────────────────────

    /**
     * Returns all rooms.
     *
     * @return List of all rooms
     */
    public List<Room> getAllRooms() { return rooms; }

    /**
     * Returns only available rooms.
     *
     * @return List of available rooms
     */
    public List<Room> getAvailableRooms() {
        List<Room> available = new ArrayList<>();
        for (Room r : rooms) {
            if (r.isAvailable()) available.add(r);
        }
        return available;
    }

    /**
     * Finds a room by its room number.
     *
     * @param roomNumber Room number to search
     * @return Room if found, null otherwise
     */
    public Room findRoom(int roomNumber) {
        for (Room r : rooms) {
            if (r.getRoomNumber() == roomNumber) return r;
        }
        return null;
    }

    // ── Reservation Management ────────────────────────────────────────────────

    /**
     * Adds a reservation to the system.
     *
     * @param reservation Reservation to add
     */
    public void addReservation(Reservation reservation) {
        reservations.add(reservation);
    }

    /**
     * Returns all reservations for a specific guest.
     *
     * @param guest The guest
     * @return List of reservations belonging to the guest
     */
    public List<Reservation> getReservationsForGuest(Guest guest) {
        List<Reservation> result = new ArrayList<>();
        if (guest == null) return result;
        for (Reservation r : reservations) {
            if (r.getGuest().getUsername().equals(guest.getUsername())) {
                result.add(r);
            }
        }
        return result;
    }

    // ── Service Management ────────────────────────────────────────────────────

    /**
     * Adds a service request to the system.
     *
     * @param service Service request to add
     */
    public void addService(Service service) {
        services.add(service);
    }

    /**
     * Returns all service requests for a specific guest.
     *
     * @param guest The guest
     * @return List of services for the guest
     */
    public List<Service> getServicesForGuest(Guest guest) {
        List<Service> result = new ArrayList<>();
        if (guest == null) return result;
        for (Service s : services) {
            if (s.getGuest().getUsername().equals(guest.getUsername())) {
                result.add(s);
            }
        }
        return result;
    }

    // ── Billing ───────────────────────────────────────────────────────────────

    /**
     * Generates a Billing object for a specific reservation.
     *
     * @param reservation Reservation to bill
     * @return Billing object
     */
    public Billing generateBilling(Reservation reservation) {
        return new Billing(reservation, getServicesForGuest(reservation.getGuest()));
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    public String getHotelName() { return hotelName; }
    public List<Guest> getAllGuests() { return guests; }
    public List<Reservation> getAllReservations() { return reservations; }
    public List<Service> getAllServices() { return services; }

    /**
     * Generates a JSON array of all rooms for frontend.
     *
     * @return JSON array string of all rooms
     */
    public String getRoomsJson() {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < rooms.size(); i++) {
            sb.append(rooms.get(i).toJson());
            if (i < rooms.size() - 1) sb.append(",");
        }
        sb.append("]");
        return sb.toString();
    }
}
