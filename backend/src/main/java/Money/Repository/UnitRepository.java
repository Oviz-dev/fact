package Money.Repository;

import Money.Object.ObjectEntity;
import Money.Model.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UnitRepository extends JpaRepository<Unit, Long> {
    // Проверка, существует ли объект с данным именем
    boolean existsByName(String name);

    // Пример метода для поиска по имени, если нужно
    Optional<ObjectEntity> findByName(String name);
}
