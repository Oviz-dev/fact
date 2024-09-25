// pages/PnLPage.tsx
import React, { useEffect, useState } from 'react';
import { PnLDTO } from '../types/PnLDTO';
import { fetchPnL, createPnL } from '../services/PnLService';
import PnLForm from './PnLForm';
import PnLTree from './PnLTree';

const PnLPage: React.FC = () => {
  const [pnlList, setPnLList] = useState<PnLDTO[]>([]);

  const loadPnLs = async () => {
    const response = await fetchPnL();
    setPnLList(response);
  };

  useEffect(() => {
    loadPnLs();
  }, []);

  const handleCreatePnL = async (data: PnLDTO) => {
    await createPnL(data);
    await loadPnLs(); // Обновляем список после создания
  };

  return (
    <div>
      <h1>Статьи PnL (Иерархия)</h1>
      <PnLForm onSubmit={handleCreatePnL} refreshPnLs={loadPnLs} pnlList={pnlList}/>
      <PnLTree pnlList={pnlList} refreshPnLs={loadPnLs} />
    </div>
  );
};

export default PnLPage;
