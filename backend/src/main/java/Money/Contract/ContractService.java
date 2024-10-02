package Money.Contract;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final ContractRepository contractRepository;

    // Получение всех контрактов
    public List<ContractDTO> getAllContracts() {
        List<ContractModel> contracts = contractRepository.findAll();
        return contracts.stream()
                .map(this::mapModelToDto) // Преобразуем в DTO
                .toList();
    }

    // Получение контракта по ID
    public Optional<ContractDTO> getContractById(Long id) {
        return contractRepository.findById(id)
                .map(this::mapModelToDto); // Преобразуем в DTO
    }

    // Создание нового контракта
    @Transactional
    public ContractDTO createContract(ContractDTO contractDTO) {
        ContractModel contract = mapDtoToModel(contractDTO);
        calculateDynamicFields(contract); // Рассчитываем поля, которые не редактируются
        ContractModel savedContract = contractRepository.save(contract);
        return mapModelToDto(savedContract); // Возвращаем как DTO
    }

    // Обновление контракта
    @Transactional
    public ContractDTO updateContract(Long id, ContractDTO contractDTO) {
        ContractModel existingContract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        updateModelFromDto(existingContract, contractDTO);
        calculateDynamicFields(existingContract); // Пересчитываем динамические поля при обновлении
        ContractModel updatedContract = contractRepository.save(existingContract);
        return mapModelToDto(updatedContract); // Возвращаем как DTO
    }

    // Удаление контракта
    @Transactional
    public void deleteContract(Long id) {
        if (contractRepository.existsById(id)) {
            contractRepository.deleteById(id);
        } else {
            throw new RuntimeException("Contract not found");
        }
    }

    // Приватные методы для маппинга DTO <-> Model
    private ContractModel mapDtoToModel(ContractDTO contractDTO) {
        ContractModel contract = new ContractModel();
        contract.setName(contractDTO.getName());
        contract.setContractNumber(contractDTO.getContractNumber());
        contract.setContractDate(contractDTO.getContractDate());
        contract.setStatus(contractDTO.getStatus());
        contract.setType(contractDTO.getType());
        contract.setContractor(contractDTO.getContractor());
        contract.setStartDate(contractDTO.getStartDate());
        contract.setEndDate(contractDTO.getEndDate());
        contract.setPlannedCostWithoutVAT(contractDTO.getPlannedCostWithoutVAT());
        contract.setPlannedVAT(contractDTO.getPlannedVAT());
        contract.setActualCostWithoutVAT(contractDTO.getActualCostWithoutVAT());
        contract.setActualVAT(contractDTO.getActualVAT());
        contract.setWarrantyReserve(contractDTO.getWarrantyReserve());
        contract.setPlannedAdvancePercent(contractDTO.getPlannedAdvancePercent());
        contract.setActualAdvance(contractDTO.getActualAdvance());
        return contract;
    }

    private void updateModelFromDto(ContractModel contract, ContractDTO contractDTO) {
        contract.setName(contractDTO.getName());
        contract.setContractNumber(contractDTO.getContractNumber());
        contract.setContractDate(contractDTO.getContractDate());
        contract.setStatus(contractDTO.getStatus());
        contract.setType(contractDTO.getType());
        contract.setContractor(contractDTO.getContractor());
        contract.setStartDate(contractDTO.getStartDate());
        contract.setEndDate(contractDTO.getEndDate());
        contract.setPlannedCostWithoutVAT(contractDTO.getPlannedCostWithoutVAT());
        contract.setPlannedVAT(contractDTO.getPlannedVAT());
        contract.setActualCostWithoutVAT(contractDTO.getActualCostWithoutVAT());
        contract.setActualVAT(contractDTO.getActualVAT());
        contract.setWarrantyReserve(contractDTO.getWarrantyReserve());
        contract.setPlannedAdvancePercent(contractDTO.getPlannedAdvancePercent());
        contract.setActualAdvance(contractDTO.getActualAdvance());
    }

    private ContractDTO mapModelToDto(ContractModel contract) {
        ContractDTO contractDTO = new ContractDTO();
        contractDTO.setId(contract.getId());
        contractDTO.setName(contract.getName());
        contractDTO.setContractNumber(contract.getContractNumber());
        contractDTO.setContractDate(contract.getContractDate());
        contractDTO.setStatus(contract.getStatus());
        contractDTO.setType(contract.getType());
        contractDTO.setContractor(contract.getContractor());
        contractDTO.setStartDate(contract.getStartDate());
        contractDTO.setEndDate(contract.getEndDate());
        contractDTO.setPlannedCostWithoutVAT(contract.getPlannedCostWithoutVAT());
        contractDTO.setPlannedVAT(contract.getPlannedVAT());
        contractDTO.setActualCostWithoutVAT(contract.getActualCostWithoutVAT());
        contractDTO.setActualVAT(contract.getActualVAT());
        contractDTO.setWarrantyReserve(contract.getWarrantyReserve());
        contractDTO.setPlannedAdvancePercent(contract.getPlannedAdvancePercent());
        contractDTO.setActualAdvance(contract.getActualAdvance());
        // + расчётные поля, если нужно
        return contractDTO;
    }

    // Метод для расчета динамических полей
    private void calculateDynamicFields(ContractModel contract) {
        contract.setPlannedCost(contract.getPlannedCostWithoutVAT().add(contract.getPlannedVAT())); // Рассчитываем плановую стоимость
        contract.setPlannedAdvance(contract.getPlannedCost().multiply(contract.getPlannedAdvancePercent().divide(BigDecimal.valueOf(100)))); // Рассчитываем плановый аванс
        contract.setActualCost(contract.getActualCostWithoutVAT().add(contract.getActualVAT())); // Рассчитываем фактическую стоимость
    }
}