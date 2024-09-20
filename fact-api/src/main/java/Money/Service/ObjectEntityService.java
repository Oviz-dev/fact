package Money.Service;

import Money.DTO.ObjectEntityDTO;
import Money.Exception.ObjectNotFoundException;
import Money.Model.ObjectEntity;
import Money.Repository.ObjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class ObjectEntityService {

    private final ObjectRepository objectRepository;

    @Autowired
    public ObjectEntityService(ObjectRepository objectRepository) {
        this.objectRepository = objectRepository;
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
    public void deleteObjectEntity(Long id) {
        if (!objectRepository.existsById(id)) {
            throw new ObjectNotFoundException("ObjectEntity not found with id: " + id);
        }
        objectRepository.deleteById(id);
    }

    // Метод для получения всех ObjectEntities
    public Page<ObjectEntity> getAllObjectEntities(Pageable pageable) {
        return objectRepository.findAll(pageable);
    }

}
