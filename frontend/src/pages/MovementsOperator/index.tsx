import { useEffect, useState, useRef, FormEvent } from 'react';
import { FiCircle, FiCheckCircle, FiAlertCircle, FiTruck, FiUser, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

interface MovementProps {
  id: string;
  invoice_number?: string | null;
  cargo_description?: string | null;
  entry_time: string;
  exit_time?: string | null;
  driver: { name: string; cpf: string; cnh?: string };
  vehicle: { plate: string; color: string };
  driver_id: string;
  vehicle_id: string;
}

interface VehicleProps { id: string; plate: string; color: string }
interface DriverProps { id: string; name: string }
interface ModelProps { id: number; name: string; manufacturer?: { name: string } }

export function MovementsOperator() {
  const navigate = useNavigate();
  const [movements, setMovements] = useState<MovementProps[]>([]);
  const [vehicles, setVehicles] = useState<VehicleProps[]>([]);
  const [drivers, setDrivers] = useState<DriverProps[]>([]);
  const [models, setModels] = useState<ModelProps[]>([]);
  
  const [isNewDriver, setIsNewDriver] = useState(false);
  const [isNewVehicle, setIsNewVehicle] = useState(false);

  const invoiceRef = useRef<HTMLInputElement | null>(null);
  const cargoRef = useRef<HTMLInputElement | null>(null);
  const driverSelectRef = useRef<HTMLSelectElement | null>(null);
  const vehicleSelectRef = useRef<HTMLSelectElement | null>(null);

  const newDriverNameRef = useRef<HTMLInputElement | null>(null);
  const newDriverCpfRef = useRef<HTMLInputElement | null>(null);
  const newDriverCnhRef = useRef<HTMLInputElement | null>(null);
  const newDriverCnhExpRef = useRef<HTMLInputElement | null>(null);

  const newVehiclePlateRef = useRef<HTMLInputElement | null>(null);
  const newVehicleColorRef = useRef<HTMLInputElement | null>(null);
  const newVehicleModelRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => { loadAllData(); }, []);

  async function loadAllData() {
    try {
      const [movementsRes, vehiclesRes, driversRes, modelsRes] = await Promise.all([
        api.get('/movement/list'),
        api.get('/vehicle/list'),
        api.get('/driver/list?page=1&limit=100'),
        api.get('/vehicle-model/list')
      ]);
      setMovements(movementsRes.data);
      setVehicles(vehiclesRes.data);
      setDrivers(driversRes.data.data);
      setModels(modelsRes.data);
    } catch (error) { console.error("Erro ao carregar dados:", error); }
  }

  async function handleRegisterEntry(event: FormEvent) {
    event.preventDefault();
    const payload: any = {
      invoice_number: invoiceRef.current?.value || undefined,
      cargo_description: cargoRef.current?.value || undefined,
    };

    if (isNewDriver) {
      payload.new_driver = {
        name: newDriverNameRef.current?.value,
        cpf: newDriverCpfRef.current?.value.replace(/\D/g, ''),
        cnh: newDriverCnhRef.current?.value.replace(/\D/g, ''),
        cnh_expiration: newDriverCnhExpRef.current?.value,
      };
    } else {
      payload.driver_id = driverSelectRef.current?.value || undefined;
    }

    if (isNewVehicle) {
      payload.new_vehicle = {
        plate: newVehiclePlateRef.current?.value?.toUpperCase().replace(/[^A-Z0-9]/g, ''),
        color: newVehicleColorRef.current?.value,
        model_id: Number(newVehicleModelRef.current?.value),
      };
    } else {
      payload.vehicle_id = vehicleSelectRef.current?.value || undefined;
    }

    try {
      await api.post('/movement/add', payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert("Entrada registrada com sucesso!");
      setIsNewDriver(false);
      setIsNewVehicle(false);
      loadAllData();
      (event.target as HTMLFormElement).reset();
    } catch (error: any) { alert(error.response?.data?.error || "Falha ao registrar."); }
  }

  async function handleRegisterExit(id: string) {
    if (!window.confirm("Confirmar a saída deste veículo?")) return;
    try {
      await api.put(`/movement/update/${id}`, { set_current_exit_time: true });
      loadAllData();
    } catch (error: any) { alert("Erro ao registrar saída."); }
  }

  const vehiclesInYard = movements.filter(m => !m.exit_time);
  const historical = movements.filter(m => m.exit_time);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-16 bg-green-950 flex flex-col items-center py-6">
        <button onClick={() => { localStorage.clear(); navigate('/'); }} className="text-white hover:text-red-400 transition-colors mt-auto" title="Sair do sistema">
          <FiLogOut size={24} />
        </button>
      </aside>

      <main className="flex-1 p-8 md:p-10 flex justify-center">
        <div className="w-full max-w-4xl grid gap-8">
          <h1 className="text-3xl font-bold text-green-950 uppercase tracking-widest">Controle de Portaria</h1>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-green-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FiCircle size={22} className="text-green-700" /> Registrar Nova Entrada
            </h2>
            <form onSubmit={handleRegisterEntry} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Número da Nota Fiscal (Opcional)" className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50" ref={invoiceRef} />
                <input type="text" placeholder="Descrição da Carga" className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50" ref={cargoRef} />
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5"><FiUser className="text-green-700" /> Condutor / Motorista</label>
                  <label className="flex items-center gap-1.5 text-xs text-green-800 font-semibold cursor-pointer">
                    <input type="checkbox" checked={isNewDriver} onChange={(e) => setIsNewDriver(e.target.checked)} /> Novo Motorista?
                  </label>
                </div>
                {!isNewDriver ? 
                  <select className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50" ref={driverSelectRef}>
                    <option value="">Selecione um motorista já cadastrado...</option>
                    {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select> :
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-green-50/50 rounded-lg border border-green-100">
                    <input type="text" placeholder="Nome Completo" className="p-2 border rounded text-sm" ref={newDriverNameRef} required />
                    <input type="text" placeholder="CPF (Apenas números)" className="p-2 border rounded text-sm" ref={newDriverCpfRef} required />
                    <input type="text" placeholder="CNH" className="p-2 border rounded text-sm" ref={newDriverCnhRef} required />
                    <input type="date" className="p-2 border rounded text-sm" ref={newDriverCnhExpRef} required />
                  </div>
                }
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5"><FiTruck className="text-green-700" /> Veículo de Acesso</label>
                  <label className="flex items-center gap-1.5 text-xs text-green-800 font-semibold cursor-pointer">
                    <input type="checkbox" checked={isNewVehicle} onChange={(e) => setIsNewVehicle(e.target.checked)} /> Novo Veículo?
                  </label>
                </div>
                {!isNewVehicle ? 
                  <select className="w-full p-3 border border-gray-300 rounded-lg text-sm bg-gray-50" ref={vehicleSelectRef}>
                    <option value="">Selecione um veículo pela Placa...</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.plate} ({v.color})</option>)}
                  </select> :
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-green-50/50 rounded-lg border border-green-100">
                    <input type="text" placeholder="PLACA (EX: ABC1D23)" className="p-2 border rounded text-sm uppercase" ref={newVehiclePlateRef} required />
                    <input type="text" placeholder="Cor" className="p-2 border rounded text-sm" ref={newVehicleColorRef} required />
                    <select className="p-2 border rounded text-sm" ref={newVehicleModelRef} required>
                        <option value="">Selecione o Modelo...</option>
                        {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                }
              </div>
              <button type="submit" className="w-full py-3 bg-green-700 text-white font-bold text-sm uppercase tracking-wider rounded-lg shadow-sm mt-2 transition-colors">Liberar Entrada</button>
            </form>
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-950 uppercase mb-4 flex items-center gap-2">
              <FiAlertCircle size={22} className="text-orange-500" /> Veículos no Pátio Atualmente ({vehiclesInYard.length})
            </h2>
            {vehiclesInYard.length === 0 ? (
                <p className="text-sm text-gray-500 italic bg-white p-4 rounded-xl border border-dashed border-gray-300">Nenhum veículo dentro da empresa no momento.</p>
            ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {vehiclesInYard.map(m => (
                    <div key={m.id} className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-lg font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded tracking-wide">{m.vehicle.plate}</span>
                        </div>
                        <p className="text-sm text-gray-700 font-semibold mb-1">
                          <span className="text-gray-400 font-normal">Motorista:</span> {m.driver.name}
                        </p>
                      </div>
                      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                        <span className="text-[11px] text-gray-400">Entrada: {new Date(m.entry_time).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                        <button onClick={() => handleRegisterExit(m.id)} className="bg-orange-500 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-colors">Registrar Saída</button>
                      </div>
                    </div>
                  ))}
                </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-bold text-green-950 uppercase tracking-wider mb-4"><FiCheckCircle size={22} className="text-green-600 inline" /> Histórico Recente de Acessos</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <tr><th className="p-4">PLACA</th><th className="p-4">MOTORISTA</th><th className="p-4">CARGA</th><th className="p-4">ENTRADA</th><th className="p-4">SAÍDA</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {historical.slice(0, 10).map(m => (
                        <tr key={m.id} className="hover:bg-gray-50">
                            <td className="p-4 font-bold text-gray-800">{m.vehicle.plate}</td>
                            <td className="p-4">{m.driver.name}</td>
                            <td className="p-4 italic">{m.cargo_description || '-'}</td>
                            <td className="p-4">{new Date(m.entry_time).toLocaleString('pt-BR')}</td>
                            <td className="p-4">{m.exit_time ? new Date(m.exit_time).toLocaleString('pt-BR') : '-'}</td>
                        </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}