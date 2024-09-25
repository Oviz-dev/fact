import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FactPage from './pages/FactPage';
import ObjectPage from './pages/ObjectPage';
import UnitPage from './pages/UnitPage';
import PnLPage from './pages/PnLPage';
import Main from './pages/Main';

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
      </Routes>
    </Router>
  );
};

export default App;

