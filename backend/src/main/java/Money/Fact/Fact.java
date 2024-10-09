package Money.Fact;

import Money.Object.ObjectEntity;
import Money.Model.PnL;
import Money.Model.Unit;
import Money.Contract.ContractModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name="Fact")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Fact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name; //наименование

    @Column(nullable = false)
    private String factNumber;

    @Column(nullable = false)
    private LocalDate date; //дата

    @Column(nullable = false)
    private BigDecimal cost; //стоимость

    @Column(nullable = false)
    private BigDecimal amount; //количество

    @ManyToOne
    @JoinColumn(name = "unit_id", nullable = false)
    private Unit unit; //единица измерение

    @ManyToOne
    @JoinColumn(name = "object_id", nullable = false)
    private ObjectEntity object; //объект

    @ManyToOne
    @JoinColumn(name = "contract_id", nullable = false)
    private ContractModel contract; //договор

    @ManyToOne
    @JoinColumn(name = "pnl_id", nullable = false)
    private PnL pnl;

    private String basis; // основание

    private String description; //описание

}