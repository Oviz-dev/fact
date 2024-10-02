package Money.Contract;

import Money.Contract.Enum.ContractStatus;
import Money.Contract.Enum.ContractType;
import Money.Contract.Enum.Contractor;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "contracts")
public class ContractModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Наименование договора

    @Column(nullable = false)
    private String contractNumber; // Номер договора

    @Column(nullable = false)
    private LocalDate contractDate; // Дата договора

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContractStatus status; // Статус договора

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ContractType type; // Тип договора

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Contractor contractor; // Подрядчик

    private LocalDate startDate; // Дата начала договора

    private LocalDate endDate; // Дата окончания договора

    @Column(nullable = false)
    private BigDecimal plannedCostWithoutVAT; // Плановая стоимость без НДС

    @Column(nullable = false)
    private BigDecimal plannedVAT; // Плановая НДС

    @Column(nullable = false)
    private BigDecimal actualCostWithoutVAT; // Фактическая стоимость без НДС

    @Column(nullable = false)
    private BigDecimal actualVAT; // Фактический НДС

    private BigDecimal warrantyReserve; // Гарантийный резерв (%)

    private BigDecimal plannedAdvancePercent; // Плановый аванс (%)

    @Transient
    private BigDecimal plannedAdvance; // Плановый аванс (руб.), рассчитывается динамически

    @Transient
    private BigDecimal plannedCost; // Плановая стоимость, рассчитывается динамически

    @Transient
    private BigDecimal actualCost; // Фактическая стоимость, рассчитывается динамически

    private BigDecimal actualAdvance; // Фактический аванс (руб.)
}
