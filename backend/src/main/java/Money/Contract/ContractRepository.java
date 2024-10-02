package Money.Contract;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractRepository extends JpaRepository<ContractModel, Long> {
    // Дополнительные методы поиска можно добавить здесь, если потребуется
}
