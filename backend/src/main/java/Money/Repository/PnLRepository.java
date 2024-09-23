package Money.Repository;

import Money.Model.PnL;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PnLRepository extends JpaRepository<PnL, Long> {
    // Поиск дочерних элементов по ID родителя
    List<PnL> findByParentPnL(PnL parentPnL);
}
