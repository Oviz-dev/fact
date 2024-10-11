package Money.Fact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface FactRepository extends JpaRepository<Fact, Long>, JpaSpecificationExecutor<Fact> {
    // Проверка уникальности факта по нескольким полям
    boolean existsByNameAndFactNumberAndDateAndCost(
            String name,
            String factNumber,
            LocalDate date,
            BigDecimal cost
            /*Long objectId,
            Long contractId,
            Long pnlId*/
    );
    boolean existsByPnlId(Long pnlId);
    boolean existsByUnitId(Long unitId);
    boolean existsByObjectId(Long objectId);

}

