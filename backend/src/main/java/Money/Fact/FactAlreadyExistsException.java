package Money.Fact;

public class FactAlreadyExistsException extends RuntimeException {
    public FactAlreadyExistsException(String message) {
        super(message);
    }
}