import { useEffect, useState, useRef, FormEvent } from 'react';
import { FiTrash2, FiEdit, FiX, FiCircle, FiCheckCircle, FiAlertCircle, FiFileText, FiTruck, FiUser } from 'react-icons/fi';
import { api } from '../../services/api';

interface MovementProps {
  id: string;
  invoice_number?: string | null;
  cargo_description?: string | null;
  entry_time: string;
  exit_time?: string | null;
  driver: { name: string; cpf: string; cnh?: string };
  vehicle: { plate: string; color: string };
  employee?: { name: string };
  driver_id: string;
  vehicle_id: string;
}

interface VehicleProps { id: string; plate: string; color: string }
interface DriverProps { id: string; name: string }
interface ModelProps { id: number; name: string; manufacturer?: { name: string } }

export function Movements() {
  const [movements, setMovements] = useState<MovementProps[]>([]);
  const [vehicles, setVehicles] = useState<VehicleProps[]>([]);
  const [drivers, setDrivers] = useState<DriverProps[]>([]);
  const [models, setModels] = useState<ModelProps[]>([]);

  const [isNewDriver, setIsNewDriver] = useState(false);
  const [isNewVehicle, setIsNewVehicle] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState<MovementProps | null>(null);
  const [editInvoice, setEditInvoice] = useState('');
  const [editCargo, setEditCargo] = useState('');
  const [editDriverId, setEditDriverId] = useState('');
  const [editVehicleId, setEditVehicleId] = useState('');

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

  useEffect(() => {
    loadAllData();
  }, []);

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
    } catch (error) {
      console.error("Erro ao carregar dados da portaria:", error);
    }
  }

  async function handleRegisterEntry(event: FormEvent) {
    event.preventDefault();

    const invoice = invoiceRef.current?.value;
    const cargo = cargoRef.current?.value;

    const newDriverName = newDriverNameRef.current?.value;
    const newDriverCpf = newDriverCpfRef.current?.value.replace(/\D/g, ''); 
    const newDriverCnh = newDriverCnhRef.current?.value.replace(/\D/g, '');
    const newDriverCnhExp = newDriverCnhExpRef.current?.value;

    const newVehiclePlate = newVehiclePlateRef.current?.value?.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const newVehicleColor = newVehicleColorRef.current?.value;
    const newVehicleModel = newVehicleModelRef.current?.value;

    const payload: any = {
      invoice_number: invoice || undefined,
      cargo_description: cargo || undefined,
    };

    if (isNewDriver) {
      payload.new_driver = {
        name: newDriverName,
        cpf: newDriverCpf,
        cnh: newDriverCnh,
        cnh_expiration: newDriverCnhExp,
      };
    } else {
      payload.driver_id = driverSelectRef.current?.value || undefined;
    }

    if (isNewVehicle) {
      payload.new_vehicle = {
        plate: newVehiclePlate,
        color: newVehicleColor,
        model_id: Number(newVehicleModel),
      };
    } else {
      payload.vehicle_id = vehicleSelectRef.current?.value || undefined;
    }

    try {
      await api.post('/movement/add', payload,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      alert("Entrada autorizada e registrada com sucesso!");
      
      setIsNewDriver(false);
      setIsNewVehicle(false);
      loadAllData();
      if (event.target) (event.target as HTMLFormElement).reset();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "Falha ao registrar entrada.");
    }
  }

  async function handleRegisterExit(movementId: string) {
    if (!window.confirm("Confirmar a saída deste veículo e liberação da cancela?")) return;

    try {
      await api.put(`/movement/update/${movementId}`, {
        set_current_exit_time: true
      });
      
      alert("Saída registrada!");
      loadAllData();
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao registrar saída.");
    }
  }

  async function handleDeleteMovement(id: string) {
    if (!window.confirm("ATENÇÃO: Deseja realmente excluir permanentemente este registro de movimentação?")) return;
    try {
      await api.delete(`/movement/delete/${id}`);
      alert("Registro removido com sucesso!");
      loadAllData();
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao deletar registro.");
    }
  }

  function openEditModal(movement: MovementProps) {
    setEditingMovement(movement);
    setEditInvoice(movement.invoice_number || '');
    setEditCargo(movement.cargo_description || '');
    setEditDriverId(movement.driver_id);
    setEditVehicleId(movement.vehicle_id);
    setIsEditModalOpen(true);
  }

  async function handleSaveEdit(event: FormEvent) {
    event.preventDefault();
    if (!editingMovement) return;

    try {
      await api.put(`/movement/update/${editingMovement.id}`, {
        invoice_number: editInvoice || null,
        cargo_description: editCargo || null,
        driver_id: editDriverId,
        vehicle_id: editVehicleId
      });

      alert("Movimentação atualizada com sucesso!");
      setIsEditModalOpen(false);
      loadAllData();
    } catch (error: any) {
      alert(error.response?.data?.error || "Erro ao salvar alterações.");
    }
  }



  const vehiclesInYard = movements.filter(m => !m.exit_time);
  const historicalMovements = movements.filter(m => m.exit_time);

  return (
    <div className="w-full flex justify-center px-4">
      <main className="my-10 w-full md:max-w-4xl grid grid-cols-1 gap-8">
        
        <h1 className="text-3xl font-bold text-green-950 uppercase tracking-widest">
          Controle de Portaria
        </h1>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-green-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FiCircle size={22} className="text-green-700" /> Registrar Nova Entrada
          </h2>

          <form onSubmit={handleRegisterEntry} className="flex flex-col gap-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">Número da Nota Fiscal (Opcional):</label>
                <input type="text" placeholder="Ex: 0001234" className="w-full p-3 border border-green-300 rounded-lg text-sm bg-gray-50" ref={invoiceRef} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">Descrição do Carregamento / Motivo:</label>
                <input type="text" placeholder="Ex: Carga de adubo / Manutenção externa" className="w-full p-3 border border-green-300 rounded-lg text-sm bg-gray-50" ref={cargoRef} />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FiUser className="text-green-700" /> Condutor / Motorista
                </label>
                <label className="flex items-center gap-1.5 text-xs text-green-800 font-semibold cursor-pointer">
                  <input type="checkbox" checked={isNewDriver} onChange={(e) => setIsNewDriver(e.target.checked)} className="rounded text-green-700 accent-green-700" />
                  Novo Motorista?
                </label>
              </div>

              {!isNewDriver ? (
                <select className="w-full p-3 border border-green-300 rounded-lg text-sm bg-gray-50 h-[46px]" ref={driverSelectRef}>
                  <option value="">Selecione um motorista já cadastrado...</option>
                  {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-green-50/50 rounded-lg border border-green-100 animate-fadeIn">
                  <input type="text" placeholder="Nome Completo" className="p-2.5 border border-green-300 rounded-lg text-sm bg-white" ref={newDriverNameRef} required />
                  <input type="text" placeholder="CPF (Apenas números)" className="p-2.5 border border-green-300 rounded-lg text-sm bg-white" ref={newDriverCpfRef} required />
                  <input type="text" placeholder="CNH" className="p-2.5 border border-green-300 rounded-lg text-sm bg-white" ref={newDriverCnhRef} required />
                  <input type="date" className="p-2.5 border border-green-300 rounded-lg text-sm bg-white text-gray-600" ref={newDriverCnhExpRef} required title="Vencimento da CNH" />
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FiTruck className="text-green-700" /> Veículo de Acesso
                </label>
                <label className="flex items-center gap-1.5 text-xs text-green-800 font-semibold cursor-pointer">
                  <input type="checkbox" checked={isNewVehicle} onChange={(e) => setIsNewVehicle(e.target.checked)} className="rounded text-green-700 accent-green-700" />
                  Novo Veículo?
                </label>
              </div>

              {!isNewVehicle ? (
                <select className="w-full p-3 border border-green-300 rounded-lg text-sm bg-gray-50 h-[46px]" ref={vehicleSelectRef}>
                  <option value="">Selecione um veículo pela Placa...</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.plate} ({v.color})</option>)}
                </select>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-green-50/50 rounded-lg border border-green-100 animate-fadeIn">
                  <input type="text" placeholder="Placa (Ex: ABC1D23)" className="p-2.5 border border-green-300 rounded-lg text-sm bg-white uppercase" ref={newVehiclePlateRef} required />
                  <input type="text" placeholder="Cor" className="p-2.5 border border-green-300 rounded-lg text-sm bg-white" ref={newVehicleColorRef} required />
                  <select className="p-2.5 border border-green-300 rounded-lg text-sm bg-white h-[42px]" ref={newVehicleModelRef} required>
                    <option value="">Selecione o Modelo...</option>
                    {models.map(m => <option key={m.id} value={m.id}>{m.manufacturer?.name} - {m.name}</option>)}
                  </select>
                </div>
              )}
            </div>

            <button type="submit" className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-bold text-sm uppercase tracking-wider rounded-lg shadow-sm mt-2 transition-colors">
              Liberar Entrada
            </button>
          </form>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-green-950 uppercase tracking-wider flex items-center gap-2">
            <FiAlertCircle size={22} className="text-orange-500" /> Veículos no Pátio Atualmente ({vehiclesInYard.length})
          </h2>
          
          {vehiclesInYard.length === 0 ? (
            <p className="text-sm text-gray-500 italic bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">Nenhum veículo dentro da empresa no momento.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vehiclesInYard.map(m => (
                <div key={m.id} className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm flex flex-col justify-between gap-4 hover:border-orange-300 transition-all">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-lg font-bold text-gray-800 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded tracking-wide">{m.vehicle?.plate}</span>
                        <div className="flex gap-1">
                          <button onClick={() => openEditModal(m)} className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="Editar informações"><FiEdit size={16} /></button>
                          <button onClick={() => handleDeleteMovement(m.id)} className="p-1.5 text-gray-400 hover:text-red-600 transition-colors" title="Excluir entrada"><FiTrash2 size={16} /></button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 font-semibold mb-1"><span className="text-gray-400 font-normal">Motorista:</span> {m.driver?.name}</p>
                    {m.cargo_description && <p className="text-xs text-gray-500 italic flex items-center gap-1 mt-1"><FiFileText /> {m.cargo_description}</p>}
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">Entrada: {new Date(m.entry_time).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</span>
                    <button onClick={() => handleRegisterExit(m.id)} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors shadow-sm">
                      Registrar Saída
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-green-950 uppercase tracking-wider flex items-center gap-2">
            <FiCheckCircle size={22} className="text-green-600" /> Histórico Recente de Acessos
          </h2>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left text-sm text-gray-600 border-collapse">
              <thead className="bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <tr>
                  <th className="p-4">Placa</th>
                  <th className="p-4">Motorista</th>
                  <th className="p-4">Entrada</th>
                  <th className="p-4">Saída</th>
                  <th className='p-4'>Operador</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {historicalMovements.slice(0, 10).map(m => (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-800 tracking-wide">{m.vehicle?.plate}</td>
                    <td className="p-4 text-gray-700 text-xs">{m.driver?.name}</td>
                    <td className="p-4 text-xs text-gray-500">{new Date(m.entry_time).toLocaleString('pt-BR')}</td>
                    <td className="p-4 text-xs text-gray-500">{m.exit_time ? new Date(m.exit_time).toLocaleString('pt-BR') : '-'}</td>
                    <td className="p-4 text-xs text-gray-400 italic">{m.employee?.name || 'Sistema'}</td>
                    <td className="p-4 flex items-center justify-center gap-3">
                      <button onClick={() => openEditModal(m)} className="text-gray-400 hover:text-blue-600 transition-colors" title="Editar registro"><FiEdit size={15} /></button>
                      <button onClick={() => handleDeleteMovement(m.id)} className="text-gray-400 hover:text-red-600 transition-colors" title="Excluir histórico"><FiTrash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </main>
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 border border-gray-100 animate-scaleUp">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
              <h3 className="text-md font-bold text-green-950 uppercase tracking-wider flex items-center gap-2">
                <FiEdit className="text-green-700" /> Editar Registro de Movimentação
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Número da Nota Fiscal:</label>
                <input type="text" value={editInvoice} onChange={(e) => setEditInvoice(e.target.value)} className="p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Descrição do Carregamento:</label>
                <input type="text" value={editCargo} onChange={(e) => setEditCargo(e.target.value)} className="p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Alterar Condutor / Motorista:</label>
                <select value={editDriverId} onChange={(e) => setEditDriverId(e.target.value)} className="p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 h-[42px]" required>
                  {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Alterar Veículo:</label>
                <select value={editVehicleId} onChange={(e) => setEditVehicleId(e.target.value)} className="p-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50 h-[42px]" required>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.plate} ({v.color})</option>)}
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-2 border-t border-gray-100 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-green-700 rounded-lg hover:bg-green-800 transition-colors shadow-sm">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}