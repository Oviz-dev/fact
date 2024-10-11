package Money.Fact.Exception;

public class FactNotFoundException extends RuntimeException {
    public FactNotFoundException(String message) {
        super(message);
    }
}