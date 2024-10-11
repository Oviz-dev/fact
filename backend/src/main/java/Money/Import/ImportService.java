package Money.Import;

import Money.Object.ObjectEntity;
import Money.Unit.Unit;
import Money.Object.ObjectRepository;
import Money.Unit.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ImportService {

    private final ObjectRepository objectRepository;
    private final UnitRepository unitRepository;

    @Autowired
    public ImportService(ObjectRepository objectRepository, UnitRepository unitRepository) {
        this.objectRepository = objectRepository;
        this.unitRepository = unitRepository;
    }

    // Универсальный метод импорта
    public void importData(MultipartFile file, String entityType) throws Exception {
        List<String[]> csvData = parseCsv(file); // Парсим CSV

        switch (entityType.toLowerCase()) {
            case "object":
                importObjects(csvData);
                break;
            case "unit":
                importUnits(csvData);
                break;
            default:
                throw new IllegalArgumentException("Неподдерживаемый тип сущности: " + entityType);
        }
    }

    // Парсинг CSV файла
    private List<String[]> parseCsv(MultipartFile file) throws Exception {
        List<String[]> rows = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] columns = line.split(",");
                rows.add(columns);
            }
        }
        return rows;
    }

    // Универсальная функция для фильтрации дублей по имени
    private <T> List<T> filterDuplicates(List<T> newEntities, Set<String> existingNames, java.util.function.Function<T, String> nameExtractor) {
        return newEntities.stream()
                .filter(entity -> !existingNames.contains(nameExtractor.apply(entity)))
                .collect(Collectors.toList());
    }

    // Импорт объектов с проверкой дублей
    private void importObjects(List<String[]> csvData) {
        // Получаем список имен, которые уже есть в базе
        Set<String> existingNames = objectRepository.findAll().stream()
                .map(ObjectEntity::getName)
                .collect(Collectors.toSet());

        // Подготавливаем новые объекты
        List<ObjectEntity> objects = csvData.stream()
                .map(row -> {
                    String name = row[1]; // Предполагаем, что во второй колонке наименование
                    ObjectEntity objectEntity = new ObjectEntity();
                    objectEntity.setName(name);
                    return objectEntity;
                })
                .collect(Collectors.toList());

        // Фильтруем дубликаты
        List<ObjectEntity> uniqueObjects = filterDuplicates(objects, existingNames, ObjectEntity::getName);

        // Сохраняем только уникальные объекты
        objectRepository.saveAll(uniqueObjects);
    }

    // Импорт юнитов с проверкой дублей
    private void importUnits(List<String[]> csvData) {
        // Получаем список имен, которые уже есть в базе
        Set<String> existingNames = unitRepository.findAll().stream()
                .map(Unit::getName)
                .collect(Collectors.toSet());

        // Подготавливаем новые юниты
        List<Unit> units = csvData.stream()
                .map(row -> {
                    String name = row[1]; // Предполагаем, что во второй колонке наименование
                    Unit unitEntity = new Unit();
                    unitEntity.setName(name);
                    return unitEntity;
                })
                .collect(Collectors.toList());

        // Фильтруем дубликаты
        List<Unit> uniqueUnits = filterDuplicates(units, existingNames, Unit::getName);

        // Сохраняем только уникальные юниты
        unitRepository.saveAll(uniqueUnits);
    }
}
