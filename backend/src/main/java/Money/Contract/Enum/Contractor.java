package Money.Contract.Enum;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Contractor {
    CONTRACTOR_A("Подрядчик по СМР"),
    CONTRACTOR_B("Подрядчик по ПИР"),
    CONTRACTOR_C("Подрядчик по прочим");

    private final String displayName;

    Contractor(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static Contractor fromString(String value) {
        for (Contractor contractor : Contractor.values()) {
            if (contractor.displayName.equalsIgnoreCase(value)) {
                return contractor;
            }
        }
        throw new IllegalArgumentException("Некорректное значение: " + value);
    }
}