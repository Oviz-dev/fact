import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FactPage from './fact/pages/FactPage';
import ObjectPage from './object/pages/ObjectPage';
import UnitPage from './unit/pages/UnitPage';
import PnLPage from './pnl/pages/PnLPage';
import Main from './pages/Main';
import ContractPage from './contract/pages/ContractPage';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Добавьте маршрут для корневого пути */}
        <Route path="/" element={<Main />} />
        <Route path="/facts" element={<FactPage />} />
        <Route path="/objects" element={<ObjectPage />} />
        <Route path="/units" element={<UnitPage />} />
        <Route path="/pnl" element={<PnLPage />} />
        <Route path="/contracts"  element={<ContractPage/>} />
      </Routes>
    </Router>
  );
};

export default App;

