package Money.Controller;

import Money.DTO.PnLDTO;
import Money.Model.PnL;
import Money.Service.PnLService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/pnl")
@RequiredArgsConstructor
public class PnLController {

    private final PnLService pnlService;

    // Получение всех статей с parentId
    @GetMapping
    public ResponseEntity<List<PnLDTO>> getAllPnL() {
        List<PnLDTO> pnlList = pnlService.getAllPnLs();
        return ResponseEntity.ok(pnlList);
    }

    // Получение потомков статьи по ID
    @GetMapping("/{id}/children")
    public ResponseEntity<List<PnLDTO>> getSubArticles(@PathVariable Long id) {
        PnL pnl = pnlService.getPnLById(id);
        List<PnLDTO> subPnLDTOs = pnl.getSubPnL().stream()
                .map(subPnL -> new PnLDTO(subPnL.getId(), subPnL.getName(), subPnL.getDirection(),
                        subPnL.getParentPnL() != null ? subPnL.getParentPnL().getId() : null))
                .toList();
        return ResponseEntity.ok(subPnLDTOs);
    }

    // Создание новой статьи
    @PostMapping
    public ResponseEntity<PnLDTO> createPnL(@RequestBody PnLDTO pnlDto) {
        PnL createdPnL = pnlService.createPnL(pnlDto);
        PnLDTO createdPnLDTO = new PnLDTO(
                createdPnL.getId(),
                createdPnL.getName(),
                createdPnL.getDirection(),
                createdPnL.getParentPnL() != null ? createdPnL.getParentPnL().getId() : null
        );
        return ResponseEntity.ok(createdPnLDTO);
    }

    // Обновление статьи
    @PutMapping("/{id}")
    public ResponseEntity<PnLDTO> updatePnL(@PathVariable Long id, @RequestBody PnLDTO updatedPnLDto) {
        PnL updatedPnL = pnlService.updatePnL(id, updatedPnLDto);
        PnLDTO updatedPnLDTO = new PnLDTO(
                updatedPnL.getId(),
                updatedPnL.getName(),
                updatedPnL.getDirection(),
                updatedPnL.getParentPnL() != null ? updatedPnL.getParentPnL().getId() : null
        );
        return ResponseEntity.ok(updatedPnLDTO);
    }

    // Удаление статьи
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePnL(@PathVariable Long id) {
        pnlService.deletePnL(id);
        return ResponseEntity.ok().build();
    }
}
