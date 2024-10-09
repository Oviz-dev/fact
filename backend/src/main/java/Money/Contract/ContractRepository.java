package Money.Contract;

import jakarta.persistence.metamodel.SingularAttribute;
import org.springframework.data.jpa.domain.AbstractPersistable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.io.Serializable;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<ContractModel, Long> {
    // Дополнительные методы поиска можно добавить здесь, если потребуется
    Optional<ContractModel> findById(Long ID);
}
