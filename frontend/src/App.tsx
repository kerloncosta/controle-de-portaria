import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

import { Employees } from './pages/Employees';
import { Drivers } from './pages/Drivers';

import { Manufacturers } from './pages/Manufacturer';
import { VehicleModels } from './pages/VehicleModels';
import { Vehicles } from './pages/Vehicles';

import { Movements } from './pages/Movements';

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
          <Route path="motoristas" element={<Drivers />} />

          <Route path="fabricantes" element={<Manufacturers />} />
          <Route path="modelos" element={<VehicleModels />} />
          <Route path="veiculos" element={<Vehicles />} />
          
          <Route path="movimentacoes" element={<Movements />} />
        </Route>

        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;