package Money.Service;

import Money.DTO.FactDto;
import Money.Exception.*;
import Money.Model.*;
import Money.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FactService {

    private final FactRepository factRepository;
    private final UnitRepository unitRepository;
    private final PnLRepository pnlRepository;
    private final ObjectRepository objectRepository;

    @Autowired
    public FactService(FactRepository factRepository, UnitRepository unitRepository, PnLRepository pnlRepository, ObjectRepository objectRepository) {
        this.factRepository = factRepository;
        this.unitRepository = unitRepository;
        this.pnlRepository = pnlRepository;
        this.objectRepository = objectRepository;
    }

    public Fact createFact(FactDto factDto) {
        // Преобразуем ID в объекты через репозитории
        ObjectEntity objectEntity = getObjectById(factDto.getObjectId());
        PnL pnl = getPnlById(factDto.getPnlId());

        // Проверка на уникальность
        if (factRepository.existsByNameAndDateAndCostAndObjectAndBasisAndPnl(
                factDto.getName(),
                factDto.getDate(),
                factDto.getCost(),
                objectEntity,  // Передаём объект, а не ID
                factDto.getBasis(),
                pnl)) {  // Передаём объект, а не ID
            throw new FactAlreadyExistsException("Fact with such data already exists");
        }

        // Сохраняем факт
        Fact fact = mapToEntity(factDto);
        return factRepository.save(fact);
    }

    public Fact getFactById(Long id) {
        return factRepository.findById(id)
                .orElseThrow(() -> new FactNotFoundException("Fact not found with id: " + id));
    }

    private Unit getUnitById(Long unitId) {
        return unitRepository.findById(unitId)
                .orElseThrow(() -> new UnitNotFoundException("Единица измерения не найдена"));
    }

    private PnL getPnlById(Long pnlId) {
        return pnlRepository.findById(pnlId)
                .orElseThrow(() -> new PnLNotFoundException("Статья не найдена"));
    }

    private ObjectEntity getObjectById(Long objectId) {
        return objectRepository.findById(objectId)
                .orElseThrow(() -> new ObjectNotFoundException("Объект не найден"));
    }

    public Fact updateFact(Long id, FactDto factDto) {
        Fact existingFact = factRepository.findById(id)
                .orElseThrow(() -> new FactNotFoundException("Fact not found with id: " + id));

        // Обновляем поля факта
        existingFact.setName(factDto.getName());
        existingFact.setDate(factDto.getDate());
        existingFact.setCost(factDto.getCost());

        // Получаем объект и PnL из репозиториев
        ObjectEntity object = objectRepository.findById(factDto.getObjectId())
                .orElseThrow(() -> new ObjectNotFoundException("Объект не найден"));
        PnL pnl = pnlRepository.findById(factDto.getPnlId())
                .orElseThrow(() -> new PnLNotFoundException("Статья не найдена"));

        // Устанавливаем объект и PnL
        existingFact.setObject(object);
        existingFact.setPnl(pnl);

        existingFact.setBasis(factDto.getBasis());

        return factRepository.save(existingFact);
    }

    // Метод преобразования DTO в сущность Fact
    public Fact mapToEntity(FactDto factDto) {
        Fact fact = new Fact();
        fact.setName(factDto.getName());
        fact.setDate(factDto.getDate());
        fact.setCost(factDto.getCost());
        fact.setAmount(factDto.getAmount());

        // Преобразование ID в объекты через репозитории
        ObjectEntity object = objectRepository.findById(factDto.getObjectId())
                .orElseThrow(() -> new IllegalArgumentException("Object not found"));
        PnL pnl = pnlRepository.findById(factDto.getPnlId())
                .orElseThrow(() -> new IllegalArgumentException("PnL not found"));

        fact.setObject(object);
        fact.setPnl(pnl);
        fact.setBasis(factDto.getBasis());
        fact.setDescription(factDto.getDescription());

        return fact;
    }

    public void deleteFact(Long id) {
        if (!factRepository.existsById(id)) {
            throw new FactNotFoundException("Fact not found with id: " + id);
        }
        factRepository.deleteById(id);
    }
}
