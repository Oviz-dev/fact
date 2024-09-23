package Money.Repository;

import Money.Model.ObjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ObjectRepository extends JpaRepository<ObjectEntity, Long> {
    // Проверка, существует ли объект с данным именем
    boolean existsByName(String name);

    // Пример метода для поиска по имени, если нужно
    Optional<ObjectEntity> findByName(String name);
}
