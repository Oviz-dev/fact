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
    private boolean isAccepted;       // состояние принятия факта
    private String name;              // наименование
    private String factNumber;        // номер
    private LocalDate date;           // дата
    private BigDecimal cost;          // стоимость
    private BigDecimal actualVAT;     // Фактический НДС
    private BigDecimal amount;        // количество
    private Long unitId;              // id единицы измерения
    private Long objectId;            // id объекта
    private Long contractId;          // id договора
    private Long pnlId;               // id статьи (PnL)
    private String basis;             // основание
    private String description;       // описание
}

