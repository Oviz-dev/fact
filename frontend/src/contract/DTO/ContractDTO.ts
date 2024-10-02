// ContractDTO.ts

export enum ContractStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    SUSPENDED = 'SUSPENDED'
}

export enum ContractType {
    PIR = 'SUPPLY',
    SMR = 'SMR',
    OTHER = 'CONSTRUCTION'
}

export enum Contractor {
    CONTRACTOR_A = 'CONTRACTOR_A',
    CONTRACTOR_B = 'CONTRACTOR_B',
    CONTRACTOR_C = 'CONTRACTOR_C'
}

export interface ContractDTO {
    id: number;
    name: string;                      // Наименование договора
    contractNumber: string;             // Номер договора
    contractDate: string;               // Дата договора
    status: ContractStatus;             // Статус договора
    type: ContractType;                 // Тип договора
    contractor: Contractor;             // Подрядчик
    startDate?: string;                 // Дата начала договора
    endDate?: string;                   // Дата окончания договора
    plannedCostWithoutVAT: number;      // Плановая стоимость без НДС
    plannedVAT: number;                 // Плановая НДС
    actualCostWithoutVAT: number;       // Фактическая стоимость без НДС
    actualVAT: number;                  // Фактический НДС
    warrantyReserve?: number;           // Гарантийный резерв (%)
    plannedAdvancePercent?: number;     // Плановый аванс (%)
    plannedAdvance?: number;            // Плановый аванс (рассчитывается на бэкенде)
    plannedCost?: number;               // Плановая стоимость (рассчитывается на бэкенде)
    actualCost?: number;                // Фактическая стоимость (рассчитывается на бэкенде)
    actualAdvance?: number;             // Фактический аванс
}
