package Money.DTO;

import Money.Model.Fact;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class FactFilter {
    private String name; // наименование
    private LocalDate startDate; // начало периода
    private LocalDate endDate; // конец периода
    private BigDecimal minCost; // минимальная стоимость
    private BigDecimal maxCost; // максимальная стоимость
    private Long objectId; // объект
    private Long pnlId; // статья
}
