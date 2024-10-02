package Money.Contract;

import Money.Contract.Enum.ContractStatus;
import Money.Contract.Enum.ContractType;
import Money.Contract.Enum.Contractor;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContractDTO {

    private Long id;

    private String name; // Наименование договора

    private String contractNumber; // Номер договора

    private LocalDate contractDate; // Дата договора

    private ContractStatus status; // Статус договора

    private ContractType type; // Тип договора

    private Contractor contractor; // Подрядчик

    private LocalDate startDate; // Дата начала договора

    private LocalDate endDate; // Дата окончания договора

    private BigDecimal plannedCostWithoutVAT; // Плановая стоимость без НДС

    private BigDecimal plannedVAT; // Плановая НДС

    private BigDecimal actualCostWithoutVAT; // Фактическая стоимость без НДС

    private BigDecimal actualVAT; // Фактический НДС

    private BigDecimal warrantyReserve; // Гарантийный резерв (%)

    private BigDecimal plannedAdvancePercent; // Плановый аванс (%)

    private BigDecimal plannedAdvance; // Плановый аванс (руб), рассчитывается на бэкенде

    private BigDecimal plannedCost; // Плановая стоимость, рассчитывается на бэкенде

    private BigDecimal actualCost; // Фактическая стоимость, рассчитывается на бэкенде

    private BigDecimal actualAdvance; // Фактический аванс (руб)
}
