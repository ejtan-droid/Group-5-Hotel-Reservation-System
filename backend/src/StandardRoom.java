/*
 * StandardRoom.java
 * Extends Room class — Inheritance + Polymorphism
 */
public class StandardRoom extends Room {

    public StandardRoom(int roomNumber, double pricePerNight) {
        super(roomNumber, pricePerNight,
              "Comfortable room with a queen bed, private bathroom, flat-screen TV, and free Wi-Fi.",
              2, "standard_room.jpg");
    }

    // Overrides the abstract method from Room (Polymorphism)
    @Override
    public String getRoomType() {
        return "Standard";
    }
}
