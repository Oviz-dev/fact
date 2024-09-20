package Money.Service;

import Money.DTO.UnitDTO;
import Money.Exception.UnitNotFoundException;
import Money.Model.Unit;
import Money.Repository.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class UnitService {

    private final UnitRepository unitRepository;

    @Autowired
    public UnitService(UnitRepository unitRepository) {
        this.unitRepository = unitRepository;
    }

    // Метод для создания нового Unit
    public Unit createUnit(UnitDTO unitDTO) {
        // Проверка на уникальность по полям, например, name
        if (unitRepository.existsByName(unitDTO.getName())) {
            throw new IllegalArgumentException("Object with such name already exists");
        }

        // Преобразуем DTO в сущность
        Unit unit = mapToEntity(unitDTO);

        // Сохраняем объект
        return unitRepository.save(unit);
    }
    private Unit mapToEntity(UnitDTO unitDTO) {
        Unit unit = new Unit();
        unit.setName(unitDTO.getName());
        return unit;
    }

    // Метод для получения Unit по id
    public Unit getUnitById(Long id) {
        return unitRepository.findById(id)
                .orElseThrow(() -> new UnitNotFoundException("Unit not found with id: " + id));
    }

    // Метод для обновления существующего Unit
    public Unit updateUnit(Long id, UnitDTO unitDTO) {
        Unit existingUnit = unitRepository.findById(id)
                .orElseThrow(() -> new UnitNotFoundException("Object not found with id: " + id));

        // Проверяем уникальность, если изменяется имя
        if (!existingUnit.getName().equals(unitDTO.getName()) &&
                unitRepository.existsByName(unitDTO.getName())) {
            throw new IllegalArgumentException("Object with such name already exists");
        }
        // Обновляем поля объекта
        existingUnit.setName(unitDTO.getName());

        return unitRepository.save(existingUnit);
    }

    // Метод для удаления Unit по id
    public void deleteUnit(Long id) {
        if (!unitRepository.existsById(id)) {
            throw new UnitNotFoundException("Unit not found with id: " + id);
        }
        unitRepository.deleteById(id);
    }

    // Метод для получения всех ObjectEntities
    public Page<Unit> getAllObjectEntities(Pageable pageable) {
        return unitRepository.findAll(pageable);
    }

}