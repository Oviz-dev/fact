package Money.PnL.Exception;

public class PnLInUseException extends RuntimeException {
    public PnLInUseException(String message) {
        super(message);
    }
}
