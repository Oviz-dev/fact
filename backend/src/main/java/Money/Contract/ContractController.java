package Money.Contract;

import Money.Fact.FactRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/contracts")
@Slf4j

public class ContractController {

    private final ContractService contractService;
    private final ContractRepository contractRepository;

    @Autowired
    public ContractController(ContractService contractService, FactRepository factRepository, ContractRepository contractRepository) {
        this.contractService = contractService;
        this.contractRepository = contractRepository;
    }

    @PatchMapping("/{id}/fact")
    public ResponseEntity<Object> updateContractFact(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return contractRepository.findById(id)
                .map(contract -> {
                    if (updates.containsKey("actualCostWithoutVAT")) {
                        // Безопасное преобразование из строки или числа в BigDecimal
                        Object value = updates.get("actualCostWithoutVAT");
                        BigDecimal actualCost;

                        if (value instanceof String) {
                            actualCost = new BigDecimal((String) value);
                        } else if (value instanceof Number) {
                            actualCost = new BigDecimal(value.toString());
                        } else {
                            throw new IllegalArgumentException("actualCostWithoutVAT must be a number or string");
                        }

                        contract.setActualCostWithoutVAT(actualCost);
                    }
                    contractRepository.save(contract);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    // Получение всех контрактов
    @GetMapping
    public ResponseEntity<List<ContractDTO>> getAllContracts() {
        List<ContractDTO> contracts = contractService.getAllContracts();
        return new ResponseEntity<>(contracts, HttpStatus.OK);
    }

    // Получение контракта по ID
    @GetMapping("/{id}")
    public ResponseEntity<ContractDTO> getContractById(@PathVariable Long id) {
        Optional<ContractDTO> contract = contractService.getContractById(id);
        return contract.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Создание нового контракта
    @PostMapping
    public ResponseEntity<ContractDTO> createContract(@RequestBody ContractDTO contractDto) {
        log.info("Received contract data: {}", contractDto);
        ContractDTO newContract = contractService.createContract(contractDto);
        return new ResponseEntity<>(newContract, HttpStatus.CREATED);
    }

    // Обновление существующего контракта
    @PutMapping("/{id}")
    public ResponseEntity<ContractDTO> updateContract(@PathVariable Long id, @RequestBody ContractDTO updatedContract) {
        try {
            ContractDTO contract = contractService.updateContract(id, updatedContract);
            return new ResponseEntity<>(contract, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Удаление контракта
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContract(@PathVariable Long id) {
        try {
            contractService.deleteContract(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
