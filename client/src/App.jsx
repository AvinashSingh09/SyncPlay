// Main App component with routing

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import { ToastProvider } from './components/shared/Toast';
import { PlayerPage } from './pages/PlayerPage';
import { ControllerPage } from './pages/ControllerPage';
import { AdminPage } from './pages/AdminPage';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <PlayerProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<PlayerPage />} />
            <Route path="/controller" element={<ControllerPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </ToastProvider>
      </PlayerProvider>
    </BrowserRouter>
  );
}

export default App;
