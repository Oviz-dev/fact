package Money.Contract.Enum;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ContractType {
    PIR("ПИР"),
    SMR("СМР"),
    OTHER("Прочие");

    private final String displayName;

    ContractType(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static ContractType fromString(String value) {
        for (ContractType type : ContractType.values()) {
            if (type.displayName.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Некорректное значение: " + value);
    }
}