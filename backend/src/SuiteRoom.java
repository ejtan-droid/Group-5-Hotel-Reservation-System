/*
 * SuiteRoom.java
 * Extends Room class — Inheritance + Polymorphism
 */
public class SuiteRoom extends Room {

    public SuiteRoom(int roomNumber, double pricePerNight) {
        super(roomNumber, pricePerNight,
              "Luxury suite with a separate living area, jacuzzi, kitchenette, butler service, and panoramic views.",
              4, "suite_room.jpg");
    }

    // Overrides the abstract method from Room (Polymorphism)
    @Override
    public String getRoomType() {
        return "Suite";
    }
}
