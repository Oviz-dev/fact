import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FactPage from './fact/pages/FactPage';
import ObjectPage from './object/pages/ObjectPage';
import UnitPage from './unit/pages/UnitPage';
import PnLPage from './pnl/pages/PnLPage';
import References from './pages/references';
import Main from './pages/Main';
import ContractPage from './contract/pages/ContractPage';
import ApprovalPage from './ApprovalWorkflow/pages/ApprovalPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/facts" element={<FactPage />} />
        <Route path="/objects" element={<ObjectPage />} />
        <Route path="/references/units" element={<UnitPage />} />
        <Route path="/references/pnl" element={<PnLPage />} />
        <Route path="/contracts"  element={<ContractPage/>} />
        <Route path="/references"  element={<References/>} />
        <Route path="/approval"  element={<ApprovalPage/>} />
      </Routes>
    </Router>
  );
};

export default App;

