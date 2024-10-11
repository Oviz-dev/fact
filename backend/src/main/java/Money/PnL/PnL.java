package Money.PnL;

import Money.Unit.Direction;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@Table(name="PnL")
@NoArgsConstructor
@AllArgsConstructor
public class PnL {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private Direction direction;

    @ManyToOne
    @JoinColumn(name = "parent_id")
    @JsonIgnore // Added annotation
    private PnL parentPnL;

    @OneToMany(mappedBy = "parentPnL", cascade = CascadeType.ALL)
    private List<PnL> subPnL = new ArrayList<>();
}
