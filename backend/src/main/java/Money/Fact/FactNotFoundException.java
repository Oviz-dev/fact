package Money.Fact;

public class FactNotFoundException extends RuntimeException {
    public FactNotFoundException(String message) {
        super(message);
    }
}