import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FactPage from './pages/FactPage';
import FactForm from './pages/FactForm';
import ObjectPage from './pages/ObjectPage';
import ObjectForm from './pages/ObjectForm'

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Добавьте маршрут для корневого пути */}
        <Route path="/" element={<Navigate to="/objects" />} />
        <Route path="/facts" element={<FactPage />} />
        <Route path="/fact-form" element={<FactForm />} />
        <Route path="/objects" element={<ObjectPage />} />
      </Routes>
    </Router>
  );
};

export default App;

