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
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-gray-800">Modelos de Veículos</h1>

        <form className="flex flex-col my-6 gap-4" onSubmit={handleCreateOrUpdate} onReset={handleCancel}>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Nome do Modelo:</label>
              <input 
                type="text"  
                placeholder="Ex: FH 540, Constellation..."  
                className="w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-green-600 bg-white"
                ref={nameRef}  
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Fabricante (Marca):</label>
              <select 
                className="w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-green-600 bg-white"
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

          <div className="flex gap-4 mt-2">
            <input
              type="submit"
              value={editingId ? "Atualizar Modelo" : "Cadastrar Modelo"}
              className={`cursor-pointer flex-1 p-2 rounded-md text-white font-bold transition-colors ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
            />
            {editingId && (
              <input
                type="reset"
                value="Cancelar"
                className="cursor-pointer flex-1 p-2 rounded-md text-white font-bold bg-red-600 hover:bg-red-700 transition-colors"
              />
            )}
          </div>
        </form>

        <section className="flex flex-col gap-4 mt-6">
          {models.map((model) => (
            <article 
              key={model.id}
              className="w-full bg-white p-4 rounded-md flex flex-row justify-between items-center shadow-sm border border-gray-100 hover:scale-[1.01] transition-all"
            >
              <div className="flex flex-row gap-8 md:gap-16">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Modelo</span>
                  <p className="text-gray-900 font-semibold">{model.name}</p>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Marca</span>
                  <span className="px-2 py-0.5 rounded text-xs font-medium w-max text-emerald-700 bg-emerald-100">
                    {model.manufacturer?.name || `ID: ${model.manufacturer_id}`}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => handleEditClick(model)}
                  className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition-colors"
                ><FiEdit2 size={18} /></button>

                <button 
                  type="button"
                  onClick={() => handleDelete(model.id)}
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
                ><FiTrash2 size={18} /></button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}