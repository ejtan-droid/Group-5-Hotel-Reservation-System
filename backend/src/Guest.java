/**
 * Guest class extending Person.
 * Demonstrates Inheritance OOP principle.
 *
 * @author Group 5 - BSCS 2A
 * @version 1.0
 */
public class Guest extends Person {

    /**
     * Constructor for Guest.
     *
     * @param firstName     Guest's first name
     * @param lastName      Guest's last name
     * @param email         Guest's email address
     * @param contactNumber Guest's contact number
     * @param username      Login username
     * @param password      Login password
     */
    public Guest(String firstName, String lastName, String email,
                 String contactNumber, String username, String password) {
        super(firstName, lastName, email, contactNumber, username, password);
    }

    /**
     * Displays guest profile information.
     * Overrides abstract method from Person (Polymorphism).
     */
    @Override
    public void displayProfile() {
        System.out.println("=== Guest Profile ===");
        System.out.println("Name    : " + getFullName());
        System.out.println("Email   : " + getEmail());
        System.out.println("Contact : " + getContactNumber());
        System.out.println("Username: " + getUsername());
    }

    /**
     * Converts Guest data to JSON string for frontend integration.
     *
     * @return JSON-formatted string of guest data
     */
    public String toJson() {
        return String.format(
            "{\"firstName\":\"%s\",\"lastName\":\"%s\",\"email\":\"%s\"," +
            "\"contactNumber\":\"%s\",\"username\":\"%s\",\"profileImage\":\"%s\"}",
            getFirstName(), getLastName(), getEmail(),
            getContactNumber(), getUsername(), getProfileImagePath()
        );
    }
}
