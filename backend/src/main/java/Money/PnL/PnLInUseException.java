package Money.PnL;

public class PnLInUseException extends RuntimeException {
    public PnLInUseException(String message) {
        super(message);
    }
}
