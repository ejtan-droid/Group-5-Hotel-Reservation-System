/*
 * DeluxeRoom.java
 * Extends Room class — Inheritance + Polymorphism
 */
public class DeluxeRoom extends Room {

    public DeluxeRoom(int roomNumber, double pricePerNight) {
        super(roomNumber, pricePerNight,
              "Spacious room with a king bed, mini-bar, city balcony view, and premium toiletries.",
              3, "deluxe_room.jpg");
    }

    // Overrides the abstract method from Room (Polymorphism)
    @Override
    public String getRoomType() {
        return "Deluxe";
    }
}
