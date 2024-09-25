package Money.Service;

import Money.Model.ObjectEntity;
import Money.Model.Unit;
import Money.Repository.ObjectRepository;
import Money.Repository.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

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

    // Импорт объектов
    private void importObjects(List<String[]> csvData) {
        List<ObjectEntity> objects = new ArrayList<>();
        for (String[] row : csvData) {
            String name = row[1]; // Предполагаем, что во второй колонке имя объекта
            ObjectEntity objectEntity = new ObjectEntity();
            objectEntity.setName(name);
            objects.add(objectEntity);
        }
        objectRepository.saveAll(objects); // Сохраняем объекты в базу
    }

    // Импорт юнитов
    private void importUnits(List<String[]> csvData) {
        List<Unit> units = new ArrayList<>();
        for (String[] row : csvData) {
            String name = row[1]; // Предполагаем, что во второй колонке имя юнита
            Unit unitEntity = new Unit();
            unitEntity.setName(name);
            units.add(unitEntity);
        }
        unitRepository.saveAll(units); // Сохраняем юниты в базу
    }
}
