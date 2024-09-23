package Money.Controller;

import Money.Model.PnL;
import Money.Repository.PnLRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/pnl")
@RequiredArgsConstructor
public class PnLController {
    private final PnLRepository pnlRepository;

    @GetMapping
    public List<PnL> getAllPnL() {
        return pnlRepository.findAll();
    }

    @GetMapping("/{id}/children")
    public ResponseEntity<List<PnL>> getSubArticles(@PathVariable Long id) {
        return pnlRepository.findById(id)
                .map(pnl -> ResponseEntity.ok(pnl.getSubPnL()))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public PnL createPnL(@RequestBody PnL pnl) {
        return pnlRepository.save(pnl);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PnL> updatePnL(@PathVariable Long id, @RequestBody PnL updatedPnL) {
        return pnlRepository.findById(id)
                .map(pnl -> {
                    pnl.setName(updatedPnL.getName());
                    pnl.setParentPnL(updatedPnL.getParentPnL());
                    pnl.setDirection(updatedPnL.getDirection());
                    pnlRepository.save(pnl);
                    return ResponseEntity.ok(pnl);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletePnL(@PathVariable Long id) {
        return pnlRepository.findById(id)
                .map(pnl -> {
                    pnlRepository.delete(pnl);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
