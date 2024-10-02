// ContractDTO.ts

export enum ContractStatus { //вынести в справочник,
    DRAFT = 'Черновик',
    ACTIVE = 'Действует',
    COMPLETED = 'Выполнен',
    CANCELLED = 'Отменён',
}

export enum ContractType { //вынести в справочник,
    PIR = 'ПИР',
    SMR = 'СМР',
    OTHER = 'Прочие'
}

export enum Contractor { //вынести в справочник, заявать на типы контрактов
    CONTRACTOR_A = 'Подрядчик по СМР',
    CONTRACTOR_B = 'Подрядчик по ПИР',
    CONTRACTOR_C = 'Подрядчик по прочим'
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
    actualCostWithoutVAT?: number;       // Фактическая стоимость без НДС
    actualVAT?: number;                  // Фактический НДС
    warrantyReserve?: number;           // Гарантийный резерв (%)
    plannedAdvancePercent?: number;     // Плановый аванс (%)
    plannedAdvance?: number;            // Плановый аванс (рассчитывается на бэкенде)
    plannedCost?: number;               // Плановая стоимость (рассчитывается на бэкенде)
    actualCost?: number;                // Фактическая стоимость (рассчитывается на бэкенде)
    actualAdvance?: number;             // Фактический аванс
}
