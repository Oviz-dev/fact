package Money.Import;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/import")
public class ImportController {

    private final ImportService importService;

    @Autowired
    public ImportController(ImportService importService) {
        this.importService = importService;
    }

    @PostMapping("/{entityType}")
    public ResponseEntity<?> importData(
            @RequestParam("file") MultipartFile file,
            @PathVariable String entityType) {

        try {
            importService.importData(file, entityType); // Вызываем универсальный метод сервиса
            return ResponseEntity.ok("Импорт успешно завершен.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ошибка импорта: " + e.getMessage());
        }
    }
}
