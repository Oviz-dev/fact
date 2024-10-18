package Money.Fact;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/facts")
@RequiredArgsConstructor
public class FactController {
    private final FactRepository factRepository;

    @GetMapping
    public List<Fact> getAllFacts() {
        return factRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fact> getFactById(@PathVariable Long id) {
        return factRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/byContract/{contractId}")
    public List<Fact> getFactsByContractId(@PathVariable Long contractId) {
        return factRepository.findByContractId(contractId);
    }


    @PostMapping
    public Fact createFact(@RequestBody Fact fact) {
        return factRepository.save(fact);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fact> updateFact(@PathVariable Long id, @RequestBody Fact updatedFact) {
        return factRepository.findById(id)
                .map(fact -> {
                    fact.setName(updatedFact.getName());
                    fact.setFactNumber(updatedFact.getFactNumber());
                    fact.setDate(updatedFact.getDate());
                    fact.setCost(updatedFact.getCost());
                    fact.setActualVAT(updatedFact.getActualVAT());
                    fact.setAmount(updatedFact.getAmount());
                    fact.setUnit(updatedFact.getUnit());
                    fact.setObject(updatedFact.getObject());
                    fact.setContract(updatedFact.getContract());
                    fact.setBasis(updatedFact.getBasis());
                    fact.setDescription(updatedFact.getDescription());
                    fact.setPnl(updatedFact.getPnl());
                    fact.setAccepted(updatedFact.isAccepted());
                    factRepository.save(fact);
                    return ResponseEntity.ok(fact);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<Object> updateAcceptance(@PathVariable Long id, @RequestBody boolean isAccepted) {
        return factRepository.findById(id)
                .map(fact -> {
                    fact.setAccepted(isAccepted);
                    factRepository.save(fact);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteFact(@PathVariable Long id) {
        return factRepository.findById(id)
                .map(fact -> {
                    factRepository.delete(fact);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

