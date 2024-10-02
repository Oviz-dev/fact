package Money.Contract.Enum;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ContractStatus {
    DRAFT("Черновик"),
    ACTIVE("Действует"),
    COMPLETED("Выполнен"),
    CANCELLED("Отменён");

    private final String displayName;

    ContractStatus(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static ContractStatus fromString(String value) {
        for (ContractStatus status : ContractStatus.values()) {
            if (status.displayName.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Некорректное значение: " + value);
    }
}
