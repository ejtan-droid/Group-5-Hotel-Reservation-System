/**
 * Abstract base class representing a Person in the Hotel Reservation System.
 * Demonstrates Abstraction and Encapsulation OOP principles.
 *
 * @author Group 5 - BSCS 2A
 * @version 1.0
 */
public abstract class Person {

    // Encapsulation: private fields
    private String firstName;
    private String lastName;
    private String email;
    private String contactNumber;
    private String username;
    private String password;
    private String profileImagePath;

    /**
     * Constructor for Person.
     *
     * @param firstName     Person's first name
     * @param lastName      Person's last name
     * @param email         Person's email address
     * @param contactNumber Person's contact number
     * @param username      Login username
     * @param password      Login password
     */
    public Person(String firstName, String lastName, String email,
                  String contactNumber, String username, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.contactNumber = contactNumber;
        this.username = username;
        this.password = password;
        this.profileImagePath = "default_profile.png";
    }

    // Getters
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getContactNumber() { return contactNumber; }
    public String getUsername() { return username; }
    public String getPassword() { return password; }
    public String getProfileImagePath() { return profileImagePath; }

    // Setters with validation
    public void setFirstName(String firstName) {
        if (firstName != null && !firstName.trim().isEmpty()) {
            this.firstName = firstName;
        }
    }

    public void setLastName(String lastName) {
        if (lastName != null && !lastName.trim().isEmpty()) {
            this.lastName = lastName;
        }
    }

    public void setEmail(String email) {
        if (email != null && email.contains("@")) {
            this.email = email;
        }
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public void setProfileImagePath(String profileImagePath) {
        this.profileImagePath = profileImagePath;
    }

    /**
     * Validates password input against stored password.
     *
     * @param inputPassword Password to validate
     * @return true if passwords match, false otherwise
     */
    public boolean validatePassword(String inputPassword) {
        return this.password != null && this.password.equals(inputPassword);
    }

    /**
     * Abstract method to display profile.
     * Must be implemented by all subclasses (Abstraction).
     */
    public abstract void displayProfile();

    /**
     * Returns full name of the person.
     *
     * @return Full name as a string
     */
    public String getFullName() {
        return firstName + " " + lastName;
    }
}
