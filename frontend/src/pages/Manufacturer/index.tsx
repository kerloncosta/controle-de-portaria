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
      alert("Não foi possível deletar. Este fabricante pode estar vinculada a um modelo.");
    }
  }

  function handleEditClick(manufacturer: Manufacturer) {
    setEditingId(manufacturer.id);
    if (nameRef.current) nameRef.current.value = manufacturer.name;
  }

  return (
    <div className="w-full flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-gray-800">Fabricantes</h1>

        <form className="flex flex-col my-6 gap-4" onSubmit={handleCreateOrUpdate} onReset={handleCancel}>
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Nome do Fabricante:</label>
            <input 
              type="text"  
              placeholder="Ex: Volvo, Scania..."  
              className="w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-green-600 bg-white"
              ref={nameRef}  
            />
          </div>

          <div className="flex gap-4">
            <input
              type="submit"
              value={editingId ? "Atualizar Fabricante" : "Cadastrar Fabricante"}
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
          {manufacturers.map((manufacturer) => (
            <article 
              key={manufacturer.id}
              className="w-full bg-white p-4 rounded-md flex flex-row justify-between items-center shadow-sm border border-gray-100 hover:scale-[1.01] transition-all"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">ID: {manufacturer.id}</span>
                <p className="text-gray-900 font-semibold">{manufacturer.name}</p>
              </div>
              
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => handleEditClick(manufacturer)}
                  className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition-colors"
                ><FiEdit2 size={18} /></button>

                <button 
                  type="button"
                  onClick={() => handleDelete(manufacturer.id)}
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