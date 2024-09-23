package Money.Controller;

import Money.Model.ObjectEntity;
import Money.Repository.ObjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/objects")
@RequiredArgsConstructor
public class ObjectController {
    private final ObjectRepository objectRepository;

    @GetMapping
    public List<ObjectEntity> getAllObjects() {
        return objectRepository.findAll();
    }

    @PostMapping
    public ObjectEntity createObject(@RequestBody ObjectEntity object) {
        return objectRepository.save(object);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ObjectEntity> updateObject(@PathVariable Long id, @RequestBody ObjectEntity updatedObject) {
        return objectRepository.findById(id)
                .map(object -> {
                    object.setName(updatedObject.getName());
                    objectRepository.save(object);
                    return ResponseEntity.ok(object);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteObject(@PathVariable Long id) {
        return objectRepository.findById(id)
                .map(object -> {
                    objectRepository.delete(object);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
