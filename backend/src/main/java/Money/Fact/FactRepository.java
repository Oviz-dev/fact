package Money.Fact;
import Money.Object.ObjectEntity;
import Money.Model.PnL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.math.BigDecimal;
import java.time.LocalDate;

//public interface FactRepository extends JpaRepository<Fact, Long> {}

public interface FactRepository extends JpaRepository<Fact, Long>, JpaSpecificationExecutor<Fact> {
    // Проверка уникальности факта по нескольким полям
    boolean existsByNameAndDateAndCostAndObjectAndBasisAndPnl(
            String name,
            LocalDate date,
            BigDecimal cost,
            ObjectEntity object,  // Здесь нужно использовать ObjectEntity, а не Long
            String basis,
            PnL pnl  // То же самое для PnL, если у вас сущность PnL
    );
    boolean existsByPnlId(Long pnlId);
    boolean existsByUnitId(Long unitId);
    boolean existsByObjectId(Long objectId);

}

