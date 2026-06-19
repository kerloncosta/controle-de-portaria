import { useEffect, useState, useRef, FormEvent } from 'react';
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import { api } from '../../services/api';

interface VehicleProps {
  id: string;
  plate: string;
  color: string;
  model_id: number;
  driver_id: string;
  model?: {
    name: string;
    manufacturer?: { name: string };
  };
  driver?: { name: string };
}

interface VehicleModelProps {
  id: number;
  name: string;
  manufacturer?: { name: string };
}

interface DriverProps {
  id: string;
  name: string;
}

export function Vehicles() {
  const [vehicles, setVehicles] = useState<VehicleProps[]>([]);
  const [models, setModels] = useState<VehicleModelProps[]>([]);
  const [drivers, setDrivers] = useState<DriverProps[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const plateRef = useRef<HTMLInputElement | null>(null);
  const colorRef = useRef<HTMLInputElement | null>(null);
  const modelRef = useRef<HTMLSelectElement | null>(null);
  const driverRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      const [vehiclesRes, modelsRes, driversRes] = await Promise.all([
        api.get('/vehicle/list'),
        api.get('/vehicle-model/list'),
        api.get('/driver/list?page=1&limit=100')
      ]);

      setVehicles(vehiclesRes.data);
      setModels(modelsRes.data);
      setDrivers(driversRes.data.data);
    } catch (error) {
      console.error("Erro ao carregar dados iniciais:", error);
    }
  }

  function handlePlateInput(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.toUpperCase();
    value = value.replace(/[^A-Z0-9]/g, '');
    if (value.length > 7) value = value.slice(0, 7);
    e.target.value = value;
  }

  async function handleCreateVehicle(event: FormEvent) {
    event.preventDefault();

    const plate = plateRef.current?.value;
    const color = colorRef.current?.value;
    const model_id = modelRef.current?.value;
    const driver_id = driverRef.current?.value;

    if ( !editingId && (!plate || !color || !model_id || !driver_id)) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    const payload = {
      plate: plate || undefined,
      color: color || undefined,
      model_id: model_id ? Number(model_id) : undefined,
      driver_id: driver_id || undefined
    };

    try {
      if (editingId) {
        await api.put(`/vehicle/update/${editingId}`, payload);
        alert("Veículo atualizado com sucesso.");
      } else {
        const response = await api.post('/vehicle/add', payload);
        setVehicles(allVehicles => [...allVehicles, response.data]);
        alert("Veículo cadastrado com sucesso!");
      }

      loadInitialData();
      handleCancel();
    } catch (error: any) {
      console.error("Erro ao salvar veículo:", error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("Não foi possível salvar o veículo.");
      }
    }
  }

  function handleCancel() {
    if (plateRef.current) plateRef.current.value = '';
    if (colorRef.current) colorRef.current.value = '';
    if (modelRef.current) modelRef.current.value = '';
    if (driverRef.current) driverRef.current.value = '';
    setEditingId(null);
  }

  async function handleDeleteVehicle(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir este veículo?")) return;

    try {
      await api.delete(`/vehicle/delete/${id}`);
      alert("Veículo excluído com sucesso.");
      loadInitialData();
    } catch (error: any) {
      console.error("Erro ao deletar veículo:", error);
      
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("Não foi possível deletar o veículo.");
      }
    }
  }

  function handleEditVehicleClick(vehicle: VehicleProps) {
    setEditingId(vehicle.id);

    if (plateRef.current) plateRef.current.value = vehicle.plate;
    if (colorRef.current) colorRef.current.value = vehicle.color;
    if (modelRef.current) modelRef.current.value = String(vehicle.model_id);
    if (driverRef.current) driverRef.current.value = vehicle.driver_id;
  }

  return (
    <div className="w-full flex justify-center px-4">
      <main className="my-10 w-full md:max-w-3xl">
        
        <h1 className="text-3xl font-bold text-green-950 uppercase tracking-widest mb-6">
          Veículos
        </h1>

        <form 
          className="flex flex-col bg-white p-5 rounded-xl shadow-sm border border-gray-100 gap-4" 
          onSubmit={handleCreateVehicle} 
          onReset={handleCancel}
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">Placa:</label>
              <input 
                type="text"  
                placeholder="ABC1D23"  
                className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors text-gray-700 bg-gray-50 text-sm"
                ref={plateRef}
                onChange={handlePlateInput}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">Cor:</label>
              <input 
                type="text"  
                placeholder="Ex: Branco, Azul..."  
                className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors text-gray-700 bg-gray-50 text-sm"
                ref={colorRef}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">Modelo do Veículo:</label>
            <select 
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors text-gray-700 bg-gray-50 text-sm h-[46px]"
              ref={modelRef}
            >
              <option value="">Selecione o modelo do veículo...</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.manufacturer?.name} - {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">Motorista Padrão:</label>
            <select 
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors text-gray-700 bg-gray-50 text-sm h-[46px]"
              ref={driverRef}
            >
              <option value="">Selecione o motorista responsável...</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className={`flex-1 py-3 rounded-lg text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-sm ${
                editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-700 hover:bg-green-800'
              }`}
            >
              {editingId ? "Atualizar Veículo" : "Cadastrar Veículo"}
            </button>
            
            <button
              type="reset"
              className="flex-1 py-3 rounded-lg text-white font-bold text-sm uppercase tracking-wider bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
            >
              Cancelar
            </button>
          </div>
        </form>


        <section className="flex flex-col gap-3 mt-6">
          {vehicles.filter((v) => v.id !== editingId).map((vehicle) => (
            <article 
              key={vehicle.id}
              className="w-full bg-white p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm border border-gray-100 hover:shadow-md transition-all gap-4 sm:gap-0"
            >
              <div className="grid grid-cols-2 sm:flex sm:flex-row gap-4 sm:gap-6 md:gap-8 w-full sm:w-auto">
                
                <div className="flex flex-col gap-0.5 w-24">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Placa</span>
                  <p className="text-gray-800 font-bold text-base tracking-wider bg-gray-100 px-2 py-0.5 rounded text-center border border-gray-200">
                    {vehicle.plate}
                  </p>
                </div>
                
                <div className="flex flex-col gap-0.5 w-32">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Veículo</span>
                  <p className="text-gray-800 font-semibold text-sm truncate">
                    {vehicle.model?.manufacturer?.name} - {vehicle.model?.name}
                  </p>
                </div>

                <div className="flex flex-col gap-0.5 w-20">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Cor</span>
                  <p className="text-gray-800 font-semibold text-sm">{vehicle.color}</p>
                </div>

                <div className="flex flex-col gap-0.5 w-40 md:w-48">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Motorista</span>
                  <p className="text-gray-800 font-semibold text-sm truncate" title={vehicle.driver?.name}>
                    {vehicle.driver?.name || "Não vinculado"}
                  </p>
                </div>

              </div>
              
              <div className="flex gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-transparent border-gray-100 mt-1 sm:mt-0">
                <button 
                  type="button"
                  className="bg-orange-500 text-white p-2.5 rounded-lg hover:bg-orange-600 transition-colors shadow-sm flex-1 sm:flex-none flex justify-center"
                  onClick={() => handleEditVehicleClick(vehicle)}
                  title="Editar"
                >
                  <FiEdit2 size={18} />
                </button>

                <button 
                  type="button"
                  className="bg-red-500 text-white p-2.5 rounded-lg hover:bg-red-600 transition-colors shadow-sm flex-1 sm:flex-none flex justify-center"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  title="Excluir"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </section>

      </main>
    </div>
  );
}