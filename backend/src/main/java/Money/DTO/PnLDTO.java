package Money.DTO;

import Money.Model.Direction;
import java.util.List; // Добавляем импорт для списка

public class PnLDTO {
    private Long id;
    private String name;
    private Long parentId;
    private Direction direction;
    private List<PnLDTO> subPnL;  // Добавляем поле для дочерних элементов

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Direction getDirection() {
        return direction;
    }

    public void setDirection(Direction direction) {
        this.direction = direction;
    }

    public List<PnLDTO> getSubPnL() {  // Геттер для subPnL
        return subPnL;
    }

    public void setSubPnL(List<PnLDTO> subPnL) {  // Сеттер для subPnL
        this.subPnL = subPnL;
    }

    public PnLDTO(Long id, String name, Direction direction, Long parentId) {
        this.id = id;
        this.name = name;
        this.direction = direction;
        this.parentId = parentId;
    }
}