package Money.Fact;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FactDto {
    private Long id;
    private String name;              // наименование
    private LocalDate date;           // дата
    private BigDecimal cost;          // стоимость
    private BigDecimal amount;        // количество
    private Long unitId;              // id единицы измерения
    private Long objectId;            // id объекта
    private String basis;             // основание
    private String description;       // описание
    private Long pnlId;               // id статьи (PnL)
}

