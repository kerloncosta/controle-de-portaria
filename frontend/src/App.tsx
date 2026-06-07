import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Employees } from './pages/Employees';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          
          <Route index element={
            <div className="p-8">
              <h1 className="text-2xl font-bold text-gray-800">Bem-vindo ao Sistema!</h1>
              <p className="text-gray-600 mt-2">Selecione uma opção no menu lateral para começar.</p>
            </div>
          } />
          
          <Route path="funcionarios" element={<Employees />} />

        </Route>

        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;