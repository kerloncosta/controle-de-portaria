import { useEffect, useState, useRef, FormEvent } from 'react'; 
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import { api } from '../../services/api';

interface Manufacturer {
  id: number;
  name: string;
}

export function Manufacturers() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const nameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadManufacturers();
  }, []);

  async function loadManufacturers() {
    try {
      const response = await api.get('/manufacturer/list');
      setManufacturers(response.data);
    } catch (error) {
      console.error("Erro ao carregar fabricantes:", error);
    }
  }

  async function handleCreateOrUpdate(event: FormEvent) {
    event.preventDefault();
    const name = nameRef.current?.value;

    if (!name || name.trim() === '') {
      alert("O nome da marca é obrigatório.");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/manufacturer/update/${editingId}`, { name });
        alert("Marca atualizada com sucesso!");
      } else {
        await api.post('/manufacturer/add', { name });
      }

      loadManufacturers();
      handleCancel();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar o fabricante.");
    }
  }

  function handleCancel() {
    if (nameRef.current) nameRef.current.value = '';
    setEditingId(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Tem certeza que deseja deletar este fabricante?")) return;
    
    try {
      await api.delete(`/manufacturer/delete/${id}`);
      loadManufacturers();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Não foi possível deletar. Este fabricante pode estar vinculado a um modelo.");
    }
  }

  function handleEditClick(manufacturer: Manufacturer) {
    setEditingId(manufacturer.id);
    if (nameRef.current) nameRef.current.value = manufacturer.name;
  }

  return (
    <div className="w-full flex justify-center px-4">
      <main className="my-10 w-full md:max-w-3xl">
        
        <h1 className="text-3xl font-bold text-green-950 uppercase tracking-widest mb-6">
          Fabricantes
        </h1>

        <form 
          className="flex flex-col bg-white p-5 rounded-xl shadow-sm border border-gray-100 gap-4" 
          onSubmit={handleCreateOrUpdate} 
          onReset={handleCancel}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">
              Nome do Fabricante:
            </label>
            <input 
              type="text"  
              placeholder="Ex: Volvo, Scania..."  
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors text-gray-700 bg-gray-50 text-sm"
              ref={nameRef}
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className={`flex-1 py-3 rounded-lg text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-sm ${
                editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-700 hover:bg-green-800'
              }`}
            >
              {editingId ? "Atualizar Marca" : "Cadastrar Marca"}
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
          {manufacturers.map((manufacturer) => (
            <article 
              key={manufacturer.id}
              className="w-full bg-white p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm border border-gray-100 hover:shadow-md transition-all gap-4 sm:gap-0"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 md:gap-12 w-full sm:w-auto">
                <div className="flex flex-col gap-0.5 w-full sm:w-40 md:w-56">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    ID: {manufacturer.id}
                  </span>
                  <p className="text-gray-800 font-semibold text-base truncate" title={manufacturer.name}>{manufacturer.name}</p>
                </div>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-transparent border-gray-100 mt-1 sm:mt-0">
                <button 
                  type="button" 
                  onClick={() => handleEditClick(manufacturer)}
                  className="bg-orange-500 text-white p-2.5 rounded-lg hover:bg-orange-600 transition-colors shadow-sm flex-1 sm:flex-none flex justify-center"
                  title="Editar"
                >
                  <FiEdit2 size={18} />
                </button>
                <button 
                  type="button" 
                  onClick={() => handleDelete(manufacturer.id)}
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