package Money.Service;

import Money.DTO.PnLDTO;
import Money.Exception.PnLNotFoundException;
import Money.Exception.PnLInUseException;
import Money.Model.PnL;
import Money.Repository.PnLRepository;
import Money.Repository.FactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PnLService {

    private final PnLRepository pnlRepository;
    private final FactRepository factRepository;

    @Autowired
    public PnLService(PnLRepository pnlRepository, FactRepository factRepository) {
        this.pnlRepository = pnlRepository;
        this.factRepository = factRepository;
    }

    // Создание новой статьи
    public PnL createPnL(PnLDTO pnlDto) {
        PnL pnl = mapToEntity(pnlDto);
        return pnlRepository.save(pnl);
    }

    // Обновление статьи
    public PnL updatePnL(Long id, PnLDTO pnlDto) {
        PnL existingPnl = pnlRepository.findById(id)
                .orElseThrow(() -> new PnLNotFoundException("Статья не найдена с id: " + id));

        existingPnl.setName(pnlDto.getName());
        existingPnl.setParentPnL(pnlRepository.findById(pnlDto.getParentId()).orElse(null));

        return pnlRepository.save(existingPnl);
    }

    // Получение всех статей
    public List<PnL> getAllPnLs() {
        return pnlRepository.findAll();
    }

    // Получение статьи по ID
    public PnL getPnLById(Long id) {
        return pnlRepository.findById(id)
                .orElseThrow(() -> new PnLNotFoundException("Статья не найдена с id: " + id));
    }

    // Удаление статьи и всех потомков
    public void deletePnL(Long id) {
        PnL pnl = pnlRepository.findById(id)
                .orElseThrow(() -> new PnLNotFoundException("Статья не найдена с id: " + id));

        // Проверка на использование статьи в Fact
        if (factRepository.existsByPnlId(id)) {
            throw new PnLInUseException("Нельзя удалить статью, так как она используется в факте.");
        }

        // Удаление всех потомков рекурсивно
        deletePnLAndChildren(pnl);

        pnlRepository.deleteById(id);
    }

    // Рекурсивное удаление потомков
    private void deletePnLAndChildren(PnL pnl) {
        List<PnL> children = pnlRepository.findByParentPnL(pnl);
        for (PnL child : children) {
            deletePnLAndChildren(child);  // Рекурсивно удаляем потомков
            pnlRepository.deleteById(child.getId());
        }
    }

    // Преобразование DTO в сущность
    private PnL mapToEntity(PnLDTO pnlDto) {
        PnL pnl = new PnL();
        pnl.setName(pnlDto.getName());
        pnl.setParentPnL(pnlRepository.findById(pnlDto.getParentId()).orElse(null)); // Если есть родитель

        return pnl;
    }
}
