/**
 * Abstract base class representing a Room in the Hotel Reservation System.
 * Demonstrates Abstraction and Encapsulation OOP principles.
 *
 * @author Group 5 - BSCS 2A
 * @version 1.0
 */
public abstract class Room {

    // Encapsulation: private fields
    private int roomNumber;
    private double pricePerNight;
    private boolean isAvailable;
    private String description;
    private int capacity;
    private String imageFile;

    /**
     * Constructor for Room.
     *
     * @param roomNumber   Unique room number
     * @param pricePerNight Price per night in USD
     * @param description  Room description
     * @param capacity     Maximum guest capacity
     * @param imageFile    Image filename for frontend display
     */
    public Room(int roomNumber, double pricePerNight, String description,
                int capacity, String imageFile) {
        this.roomNumber = roomNumber;
        this.pricePerNight = pricePerNight;
        this.description = description;
        this.capacity = capacity;
        this.imageFile = imageFile;
        this.isAvailable = true;
    }

    // Getters
    public int getRoomNumber() { return roomNumber; }
    public double getPricePerNight() { return pricePerNight; }
    public boolean isAvailable() { return isAvailable; }
    public String getDescription() { return description; }
    public int getCapacity() { return capacity; }
    public String getImageFile() { return imageFile; }

    // Setters
    public void setAvailable(boolean available) { this.isAvailable = available; }
    public void setPricePerNight(double price) {
        if (price > 0) this.pricePerNight = price;
    }

    /**
     * Abstract method to get room type.
     * Must be implemented by subclasses (Abstraction + Polymorphism).
     *
     * @return Room type as a string
     */
    public abstract String getRoomType();

    /**
     * Displays room details to console.
     * Uses getRoomType() polymorphically.
     */
    public void displayDetails() {
        System.out.println("--- " + getRoomType() + " Room #" + roomNumber + " ---");
        System.out.println("Price    : $" + pricePerNight + "/night");
        System.out.println("Capacity : " + capacity + " guests");
        System.out.println("Status   : " + (isAvailable ? "Available" : "Booked"));
        System.out.println("Details  : " + description);
    }

    /**
     * Converts Room data to JSON string for frontend integration.
     *
     * @return JSON-formatted string of room data
     */
    public String toJson() {
        return String.format(
            "{\"roomNumber\":%d,\"type\":\"%s\",\"pricePerNight\":%.2f," +
            "\"description\":\"%s\",\"capacity\":%d,\"available\":%b,\"image\":\"%s\"}",
            roomNumber, getRoomType(), pricePerNight,
            description, capacity, isAvailable, imageFile
        );
    }
}
