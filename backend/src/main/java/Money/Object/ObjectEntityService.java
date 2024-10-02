package Money.Object;

import Money.Fact.FactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class ObjectEntityService {

    private final ObjectRepository objectRepository;
    private final FactRepository factRepository; // Инжектируем FactRepository

    @Autowired
    public ObjectEntityService(ObjectRepository objectRepository, FactRepository factRepository) {
        this.objectRepository = objectRepository;
        this.factRepository = factRepository; // Инициализируем FactRepository через конструктор
    }

    // Метод для создания нового ObjectEntity
    public ObjectEntity createObjectEntity(ObjectEntityDTO objectEntityDto) {
        // Проверка на уникальность по полям, например, name
        if (objectRepository.existsByName(objectEntityDto.getName())) {
            throw new IllegalArgumentException("Object with such name already exists");
        }

        // Преобразуем DTO в сущность
        ObjectEntity objectEntity = mapToEntity(objectEntityDto);

        // Сохраняем объект
        return objectRepository.save(objectEntity);
    }
    private ObjectEntity mapToEntity(ObjectEntityDTO objectEntityDto) {
        ObjectEntity objectEntity = new ObjectEntity();
        objectEntity.setName(objectEntityDto.getName());
        return objectEntity;
    }

    // Метод для получения ObjectEntity по id
    public ObjectEntity getObjectEntityById(Long id) {
        return objectRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("ObjectEntity not found with id: " + id));
    }

    // Метод для обновления существующего ObjectEntity
    public ObjectEntity updateObjectEntity(Long id, ObjectEntityDTO objectEntityDto) {
        ObjectEntity existingObject = objectRepository.findById(id)
                .orElseThrow(() -> new ObjectNotFoundException("Object not found with id: " + id));

        // Проверяем уникальность, если изменяется имя
        if (!existingObject.getName().equals(objectEntityDto.getName()) &&
                objectRepository.existsByName(objectEntityDto.getName())) {
            throw new IllegalArgumentException("Object with such name already exists");
        }
        // Обновляем поля объекта
        existingObject.setName(objectEntityDto.getName());

        return objectRepository.save(existingObject);
    }

    // Метод для удаления ObjectEntity по id
    public void deleteObject(Long id) {
        // Сначала проверяем, существует ли объект и не используется ли он в Fact
        if (!objectRepository.existsById(id)) {
            throw new ObjectNotFoundException("Object not found with id: " + id);
        }

        // Проверка использования Object в Fact
        if (factRepository.existsByObjectId(id)) {
            throw new IllegalStateException("Cannot delete object. It is used in a fact.");
        }

        objectRepository.deleteById(id); // Удаление Object
    }

    // Метод для получения всех ObjectEntities
    public Page<ObjectEntity> getAllObjectEntities(Pageable pageable) {
        return objectRepository.findAll(pageable);
    }

}
