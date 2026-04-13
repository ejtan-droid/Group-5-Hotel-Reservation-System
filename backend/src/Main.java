import java.util.List;

/*
 * Main.java
 * This is the entry point for the Java backend demo.
 * Run this to see all OOP concepts working together in the terminal.
 *
 * Group 5 - BSCS 2A | Object-Oriented Programming
 * Academic Year 2025-2026
 */
public class Main {

    public static void main(String[] args) {

        System.out.println("=========================================");
        System.out.println("  Auberge de Grandeur");
        System.out.println("  Hotel Reservation System - Backend Demo");
        System.out.println("=========================================\n");

        // Create the hotel
        Hotel hotel = new Hotel("Auberge de Grandeur");

        // --- Register two guests ---
        // This shows Encapsulation — the Guest object holds
        // all the guest data privately and we access it through methods
        Guest guest1 = new Guest("Maria", "Santos", "maria@gmail.com",
                                  "09171234567", "maria_s", "pass1234");
        Guest guest2 = new Guest("Juan", "Dela Cruz", "juan@gmail.com",
                                  "09281234567", "juan_dc", "pass5678");

        hotel.registerGuest(guest1);
        hotel.registerGuest(guest2);
        System.out.println("2 guests registered.\n");

        // --- Show available rooms ---
        // This shows Polymorphism — Room references point to
        // StandardRoom, DeluxeRoom, or SuiteRoom objects
        // and displayDetails() behaves differently for each
        System.out.println("--- Available Rooms ---");
        for (Room r : hotel.getAvailableRooms()) {
            r.displayDetails();
            System.out.println();
        }

        // --- Login ---
        // validatePassword() is inside Person class — Encapsulation
        Guest loggedIn = hotel.login("maria_s", "pass1234");
        if (loggedIn != null) {
            System.out.println("Login successful!");
            loggedIn.displayProfile(); // Polymorphism — overrides abstract method from Person
            System.out.println();
        }

        // --- Make a reservation ---
        Room chosen = hotel.findRoom(201); // Deluxe Room 201
        if (chosen != null && chosen.isAvailable()) {
            Reservation res = new Reservation(
                loggedIn, chosen, "2026-04-15", "2026-04-18", 3
            );
            hotel.addReservation(res);
            System.out.println("Reservation confirmed for " + loggedIn.getFullName());
            System.out.println("Room: " + chosen.getRoomType() + " #" + chosen.getRoomNumber());
            System.out.println("Check-in: " + res.getCheckInDate() + "  Check-out: " + res.getCheckOutDate());
            System.out.println("Room cost: $" + res.getTotalRoomCost() + "\n");
        }

        // --- Request services ---
        Service s1 = new Service(loggedIn, Service.ServiceType.ROOM_CLEANING, "2026-04-15");
        Service s2 = new Service(loggedIn, Service.ServiceType.FOOD_SERVICE, "2026-04-16");
        hotel.addService(s1);
        hotel.addService(s2);
        System.out.println("Service requests added: Room Cleaning + Food Service\n");

        // --- Generate billing ---
        List<Reservation> myReservations = hotel.getReservationsForGuest(loggedIn);
        if (!myReservations.isEmpty()) {
            Billing bill = hotel.generateBilling(myReservations.get(0));
            System.out.println(bill.getSummary());
        }

        System.out.println("Demo complete.");
        System.out.println("The full system runs in the browser via index.html");
    }
}
