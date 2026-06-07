import { useEffect, useState, useRef, FormEvent } from 'react'; 
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import { api } from '../../services/api';

interface Manufacturer {
  id: number;
  name: string;
}

interface VehicleModel {
  id: number;
  name: string;
  manufacturer_id: number;
  manufacturer?: Manufacturer;
}

export function VehicleModels() {
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const manufacturerRef = useRef<HTMLSelectElement | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [modelsResponse, manufacturersResponse] = await Promise.all([
        api.get('/vehicle-model/list'),
        api.get('/manufacturer/list')
      ]);

      setModels(modelsResponse.data);
      setManufacturers(manufacturersResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async function handleCreateOrUpdate(event: FormEvent) {
    event.preventDefault();
    
    const name = nameRef.current?.value;
    const manufacturer_id = manufacturerRef.current?.value;

    if (!name || !manufacturer_id) {
      alert("O nome do modelo e o fabricante são obrigatórios.");
      return;
    }

    const payload = {
      name,
      manufacturer_id: Number(manufacturer_id)
    };

    try {
      if (editingId) {
        await api.put(`/vehicle-model/update/${editingId}`, payload);
        alert("Modelo atualizado com sucesso!");
      } else {
        await api.post('/vehicle-model/add', payload);
      }

      loadData();
      handleCancel();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      alert(error.response?.data?.error || "Erro ao salvar o modelo.");
    }
  }

  function handleCancel() {
    if (nameRef.current) nameRef.current.value = '';
    if (manufacturerRef.current) manufacturerRef.current.value = '';
    setEditingId(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja deletar este modelo?")) return;
    
    try {
      await api.delete(`/vehicle-model/delete/${id}`);
      loadData();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Não foi possível deletar o modelo.");
    }
  }

  function handleEditClick(model: VehicleModel) {
    setEditingId(model.id);
    if (nameRef.current) nameRef.current.value = model.name;
    if (manufacturerRef.current) manufacturerRef.current.value = String(model.manufacturer_id);
  }

  return (
    <div className="w-full flex justify-center px-4">
      <main className="my-10 w-full md:max-w-3xl">
        
        <h1 className="text-3xl font-bold text-green-950 uppercase tracking-widest mb-6">
          Modelos de Veículos
        </h1>

        <form 
          className="flex flex-col bg-white p-5 rounded-xl shadow-sm border border-gray-100 gap-4" 
          onSubmit={handleCreateOrUpdate} 
          onReset={handleCancel}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">
                Nome do Modelo:
              </label>
              <input 
                type="text"  
                placeholder="Ex: FH 540, Constellation..."  
                className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors text-gray-700 bg-gray-50 text-sm"
                ref={nameRef}  
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">
                Fabricante (Marca):
              </label>
              <select 
                className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors text-gray-700 bg-gray-50 text-sm"
                ref={manufacturerRef}
                defaultValue=""
              >
                <option value="" disabled>Selecione um fabricante...</option>
                {manufacturers.map(brand => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className={`flex-1 py-3 rounded-lg text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-sm ${
                editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-700 hover:bg-green-800'
              }`}
            >
              {editingId ? "Atualizar Modelo" : "Cadastrar Modelo"}
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
          {models.map((model) => (
            <article 
              key={model.id}
              className="w-full bg-white p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm border border-gray-100 hover:shadow-md transition-all gap-4 sm:gap-0"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 md:gap-12 w-full sm:w-auto">
                
                <div className="flex flex-col gap-0.5 w-full sm:w-40 md:w-56">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Modelo</span>
                  <p className="text-gray-800 font-semibold text-base truncate" title={model.name}>{model.name}</p>
                </div>
                
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Marca</span>
                  <span className="px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider w-max text-green-800 bg-green-100">
                    {model.manufacturer?.name || `ID: ${model.manufacturer_id}`}
                  </span>
                </div>

              </div>
              
              <div className="flex gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-transparent border-gray-100 mt-1 sm:mt-0">
                <button 
                  type="button"
                  onClick={() => handleEditClick(model)}
                  className="bg-orange-500 text-white p-2.5 rounded-lg hover:bg-orange-600 transition-colors shadow-sm flex-1 sm:flex-none flex justify-center"
                  title="Editar"
                >
                  <FiEdit2 size={18} />
                </button>

                <button 
                  type="button"
                  onClick={() => handleDelete(model.id)}
                  className="bg-red-500 text-white p-2.5 rounded-lg hover:bg-red-600 transition-colors shadow-sm flex-1 sm:flex-none flex justify-center"
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