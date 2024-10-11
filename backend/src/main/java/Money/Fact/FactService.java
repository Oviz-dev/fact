package Money.Fact;

import Money.Contract.ContractModel;
import Money.Contract.ContractRepository;
import Money.Contract.Exception.ContractNotFoundException;
import Money.Fact.Exception.FactAlreadyExistsException;
import Money.Fact.Exception.FactNotFoundException;
import Money.Object.ObjectEntity;
import Money.Object.ObjectNotFoundException;
import Money.Object.ObjectRepository;
import Money.PnL.PnL;
import Money.PnL.Exception.PnLNotFoundException;
import Money.PnL.PnLRepository;
import Money.Unit.Unit;
import Money.Unit.UnitNotFoundException;
import Money.Unit.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FactService {

    private final FactRepository factRepository;
    private final UnitRepository unitRepository;
    private final PnLRepository pnlRepository;
    private final ObjectRepository objectRepository;
    private final ContractRepository contractRepository;

    @Autowired
    public FactService(FactRepository factRepository, UnitRepository unitRepository, PnLRepository pnlRepository, ObjectRepository objectRepository, ContractRepository contractRepository) {
        this.factRepository = factRepository;
        this.unitRepository = unitRepository;
        this.pnlRepository = pnlRepository;
        this.objectRepository = objectRepository;
        this.contractRepository = contractRepository;
    }

    public Fact createFact(FactDto factDto) {
        // Преобразуем ID в объекты через репозитории
        ObjectEntity objectEntity = getObjectById(factDto.getObjectId());
        PnL pnl = getPnlById(factDto.getPnlId());
        ContractModel contract = getContractById(factDto.getContractId());  // Здесь возвращаем ContractModel, а не ContractRepository

        // Проверка на уникальность
        if (factRepository.existsByNameAndFactNumberAndDateAndCostAndObjectIdAndContractIdAndBasisAndPnlId(
                factDto.getName(),
                factDto.getFactNumber(),
                factDto.getDate(),
                factDto.getCost(),
                objectEntity.getId(),
                contract.getId(),
                factDto.getBasis(),
                pnl.getId()
        )) {
            throw new FactAlreadyExistsException("Fact with such data already exists");
        }

        // Сохраняем факт
        Fact fact = mapToEntity(factDto);
        return factRepository.save(fact);
    }

    private ContractModel getContractById(Long contractId) {
        return contractRepository.findById(contractId)
                .orElseThrow(() -> new ContractNotFoundException("Contract not found with id: " + contractId));
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
        existingFact.setFactNumber(factDto.getFactNumber());
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
        fact.setFactNumber(factDto.getFactNumber());
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
