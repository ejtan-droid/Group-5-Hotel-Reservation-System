/**
 * Reservation class - handles booking details.
 * Demonstrates Encapsulation OOP principle.
 *
 * @author Group 5 - BSCS 2A
 * @version 1.0
 */
public class Reservation {

    private static int idCounter = 1000;

    private int reservationId;
    private Guest guest;
    private Room room;
    private String checkInDate;
    private String checkOutDate;
    private int numberOfNights;
    private double totalRoomCost;
    private String status; // "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"

    /**
     * Constructor for Reservation.
     *
     * @param guest          The guest making the reservation
     * @param room           The room being reserved
     * @param checkInDate    Check-in date string (YYYY-MM-DD)
     * @param checkOutDate   Check-out date string (YYYY-MM-DD)
     * @param numberOfNights Number of nights to stay
     */
    public Reservation(Guest guest, Room room, String checkInDate,
                       String checkOutDate, int numberOfNights) {
        this.reservationId = ++idCounter;
        this.guest = guest;
        this.room = room;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.numberOfNights = numberOfNights;
        this.totalRoomCost = room.getPricePerNight() * numberOfNights;
        this.status = "CONFIRMED";
        room.setAvailable(false); // Mark room as booked
    }

    // Getters
    public int getReservationId() { return reservationId; }
    public Guest getGuest() { return guest; }
    public Room getRoom() { return room; }
    public String getCheckInDate() { return checkInDate; }
    public String getCheckOutDate() { return checkOutDate; }
    public int getNumberOfNights() { return numberOfNights; }
    public double getTotalRoomCost() { return totalRoomCost; }
    public String getStatus() { return status; }

    // Setters
    public void setStatus(String status) { this.status = status; }

    /**
     * Cancels the reservation and makes room available again.
     */
    public void cancel() {
        this.status = "CANCELLED";
        this.room.setAvailable(true);
    }

    /**
     * Converts Reservation to JSON string for frontend integration.
     *
     * @return JSON-formatted string
     */
    public String toJson() {
        return String.format(
            "{\"reservationId\":%d,\"guestName\":\"%s\",\"roomType\":\"%s\"," +
            "\"roomNumber\":%d,\"checkIn\":\"%s\",\"checkOut\":\"%s\"," +
            "\"nights\":%d,\"roomCost\":%.2f,\"status\":\"%s\"}",
            reservationId, guest.getFullName(), room.getRoomType(),
            room.getRoomNumber(), checkInDate, checkOutDate,
            numberOfNights, totalRoomCost, status
        );
    }
}


// ─────────────────────────────────────────────────────────────────────────────

/**
 * Service class - represents a guest service request.
 * Demonstrates Encapsulation OOP principle.
 *
 * @author Group 5 - BSCS 2A
 * @version 1.0
 */
class Service {

    public enum ServiceType {
        ROOM_CLEANING("Room Cleaning", 15.00),
        FOOD_SERVICE("Food Service", 25.00),
        LAUNDRY("Laundry", 20.00),
        AIRPORT_TRANSFER("Airport Transfer", 50.00),
        SPA("Spa Treatment", 80.00);

        private final String displayName;
        private final double cost;

        ServiceType(String displayName, double cost) {
            this.displayName = displayName;
            this.cost = cost;
        }

        public String getDisplayName() { return displayName; }
        public double getCost() { return cost; }
    }

    private Guest guest;
    private ServiceType serviceType;
    private String requestDate;
    private String status; // "PENDING", "IN_PROGRESS", "COMPLETED"

    /**
     * Constructor for Service.
     *
     * @param guest       Guest requesting service
     * @param serviceType Type of service requested
     * @param requestDate Date of request
     */
    public Service(Guest guest, ServiceType serviceType, String requestDate) {
        this.guest = guest;
        this.serviceType = serviceType;
        this.requestDate = requestDate;
        this.status = "PENDING";
    }

    // Getters
    public Guest getGuest() { return guest; }
    public ServiceType getServiceType() { return serviceType; }
    public String getServiceName() { return serviceType.getDisplayName(); }
    public double getCost() { return serviceType.getCost(); }
    public String getRequestDate() { return requestDate; }
    public String getStatus() { return status; }

    // Setters
    public void setStatus(String status) { this.status = status; }

    /**
     * Converts Service to JSON string.
     *
     * @return JSON-formatted string
     */
    public String toJson() {
        return String.format(
            "{\"serviceName\":\"%s\",\"cost\":%.2f,\"date\":\"%s\",\"status\":\"%s\"}",
            getServiceName(), getCost(), requestDate, status
        );
    }
}


// ─────────────────────────────────────────────────────────────────────────────

/**
 * Billing class - calculates and summarizes charges for a guest stay.
 * Demonstrates Encapsulation OOP principle.
 *
 * @author Group 5 - BSCS 2A
 * @version 1.0
 */
class Billing {

    private Reservation reservation;
    private java.util.List<Service> services;

    /**
     * Constructor for Billing.
     *
     * @param reservation The reservation being billed
     * @param services    List of services requested by the guest
     */
    public Billing(Reservation reservation, java.util.List<Service> services) {
        this.reservation = reservation;
        this.services = services;
    }

    /**
     * Calculates total services cost for this guest.
     *
     * @return Total services cost
     */
    public double getServicesCost() {
        double total = 0;
        for (Service s : services) {
            if (s.getGuest().getUsername().equals(reservation.getGuest().getUsername())) {
                total += s.getCost();
            }
        }
        return total;
    }

    /**
     * Calculates grand total (room + services).
     *
     * @return Grand total
     */
    public double calculateTotal() {
        return reservation.getTotalRoomCost() + getServicesCost();
    }

    /**
     * Returns a formatted billing summary string.
     *
     * @return Billing summary
     */
    public String getSummary() {
        return "=== Billing Summary - Auberge de Grandeur ===\n" +
               "Reservation ID : #" + reservation.getReservationId() + "\n" +
               "Guest          : " + reservation.getGuest().getFullName() + "\n" +
               "Room           : " + reservation.getRoom().getRoomType() +
               " #" + reservation.getRoom().getRoomNumber() + "\n" +
               "Check-in       : " + reservation.getCheckInDate() + "\n" +
               "Check-out      : " + reservation.getCheckOutDate() + "\n" +
               "Nights         : " + reservation.getNumberOfNights() + "\n" +
               "Room Cost      : $" + String.format("%.2f", reservation.getTotalRoomCost()) + "\n" +
               "Services Cost  : $" + String.format("%.2f", getServicesCost()) + "\n" +
               "─────────────────────────────────────────\n" +
               "TOTAL          : $" + String.format("%.2f", calculateTotal()) + "\n";
    }

    /**
     * Converts Billing to JSON string for frontend.
     *
     * @return JSON-formatted string
     */
    public String toJson() {
        return String.format(
            "{\"reservationId\":%d,\"guestName\":\"%s\",\"roomType\":\"%s\"," +
            "\"roomNumber\":%d,\"checkIn\":\"%s\",\"checkOut\":\"%s\"," +
            "\"nights\":%d,\"roomCost\":%.2f,\"servicesCost\":%.2f,\"total\":%.2f}",
            reservation.getReservationId(), reservation.getGuest().getFullName(),
            reservation.getRoom().getRoomType(), reservation.getRoom().getRoomNumber(),
            reservation.getCheckInDate(), reservation.getCheckOutDate(),
            reservation.getNumberOfNights(), reservation.getTotalRoomCost(),
            getServicesCost(), calculateTotal()
        );
    }
}
