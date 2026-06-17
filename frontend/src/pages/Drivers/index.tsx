import { useEffect, useState, useRef, FormEvent } from 'react';
import { FiTrash2, FiEdit2, FiSearch } from 'react-icons/fi';
import { api } from '../../services/api';
import { validateCpfFormat, validateCnhFormat } from '../../Utils/validators';
import { maskCpf } from '../../Utils/masks'; 

interface DriverProps {
  id: string;
  name: string;
  cpf: string;
  cnh: string;
  cnh_expiration: string;
}

export function Drivers() {
  const [drivers, setDrivers] = useState<DriverProps[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const cpfRef = useRef<HTMLInputElement | null>(null);
  const cnhRef = useRef<HTMLInputElement | null>(null);
  const cnhExpRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    loadDrivers();
  }, []);

  async function loadDrivers() {
    try {
      const response = await api.get('/driver/list');
      setDrivers(response.data);
    } catch (error) {
      console.error("Erro ao carregar motoristas:", error);
    }
  }

  async function handleCreateDriver(event: FormEvent) {
    event.preventDefault();

    const name = nameRef.current?.value;
    const rawCpf = cpfRef.current?.value;
    const rawCnh = cnhRef.current?.value;
    const cnh_expiration = cnhExpRef.current?.value;

    const cpf = rawCpf ? rawCpf.replace(/\D/g, '') : '';
    const cnh = rawCnh ? rawCnh.replace(/\D/g, '') : '';
    
    if (!name || !cpf || !cnh || !cnh_expiration) {
      alert("Todos os campos são obrigatórios.");
      return;
    }

    if (!validateCpfFormat(cpf)) {
      alert("Por favor, digite um CPF válido.");
      return;
    }

    if (!validateCnhFormat(cnh)) {
      alert("Por favor, digite uma CNH válida.");
      return;
    }
    
    try {
      const payload = {
        name,
        cpf,
        cnh,
        cnh_expiration: new Date(cnh_expiration).toISOString(), // Formata para o Back-end
      };

      if (editingId) {
        await api.put(`/driver/update/${editingId}`, payload);
        alert("Motorista atualizado com sucesso.");
      } else {
        const response = await api.post('/driver/add', payload);
        setDrivers(allDrivers => [...allDrivers, response.data]);
        alert("Motorista cadastrado com sucesso!");
      }
  
      loadDrivers();
      handleCancel(); 

    } catch (error: any) {
      console.error("Erro ao salvar motorista:", error);
      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("Não foi possível salvar. Verifique a conexão ou os dados.");
      }
    }
  }

  function handleCancel() {
    if (nameRef.current) nameRef.current.value = '';
    if (cpfRef.current) cpfRef.current.value = '';
    if (cnhRef.current) cnhRef.current.value = '';
    if (cnhExpRef.current) cnhExpRef.current.value = '';
    setEditingId(null);
  }

  async function handleDeleteDriver(id: string) {
    if (!window.confirm("Tem certeza que deseja excluir este motorista?")) return;

    try {
      await api.delete(`/driver/delete/${id}`);
      loadDrivers();
    } catch (error) {
      console.error("Erro ao deletar motorista:", error);
      alert("Não foi possível deletar. Verifique a conexão.");
    }
  }

  function handleEditDriverClick(driver: DriverProps) {
    setEditingId(driver.id);

    if (nameRef.current) nameRef.current.value = driver.name;
    if (cpfRef.current) cpfRef.current.value = maskCpf(driver.cpf);
    if (cnhRef.current) cnhRef.current.value = driver.cnh;
    
    // O input do tipo 'date' espera o formato YYYY-MM-DD
    if (cnhExpRef.current && driver.cnh_expiration) {
      const formattedDate = new Date(driver.cnh_expiration).toISOString().split('T')[0];
      cnhExpRef.current.value = formattedDate;
    }
  }

  async function handleFindByCpf() {
    const cpfTyped = cpfRef.current?.value;
    const cleanCpf = cpfTyped ? cpfTyped.replace(/\D/g, '') : '';

    if (!cleanCpf || !validateCpfFormat(cleanCpf)) {
      alert("Digite um CPF válido para buscar.");
      return;
    }

    try {
      const response = await api.get(`/driver/find-by-cpf/${cleanCpf}`);
      handleEditDriverClick(response.data);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        alert("CPF não encontrado no sistema.");
      } else {
        alert("Erro na conexão ao buscar o CPF.");
      }
      setEditingId(null);
    }
  }

  // Função simples para formatar a data na listagem visual
  const formatDateBR = (isoDate: string) => {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <div className="w-full flex justify-center px-4">
      <main className="my-10 w-full md:max-w-3xl">
        
        <h1 className="text-3xl font-bold text-green-950 uppercase tracking-widest mb-6">
          Motoristas
        </h1>

        <form 
          className="flex flex-col bg-white p-5 rounded-xl shadow-sm border border-gray-100 gap-4" 
          onSubmit={handleCreateDriver} 
          onReset={handleCancel}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">Nome Completo:</label>
            <input 
              type="text"  
              placeholder="Digite o nome do motorista..."  
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors text-gray-700 bg-gray-50 text-sm"
              ref={nameRef}  
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">CPF:</label>
              <div className="flex gap-2">
                <input 
                  type="text"  
                  placeholder="000.000.000-00"  
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors text-gray-700 bg-gray-50 text-sm"
                  ref={cpfRef} 
                  onChange={(e) => { e.target.value = maskCpf(e.target.value) }}
                />
                <button 
                  type="button"
                  onClick={handleFindByCpf}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg font-bold transition-colors shadow-md flex items-center justify-center"
                  title="Buscar por CPF"
                >
                  <FiSearch size={18} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">Número da CNH:</label>
              <input 
                type="text"  
                placeholder="Apenas números"  
                maxLength={11}
                className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors text-gray-700 bg-gray-50 text-sm"  
                ref={cnhRef}
                onChange={(e) => { e.target.value = e.target.value.replace(/\D/g, '') }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full md:w-1/2 md:pr-2">
            <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">Validade da CNH:</label>
            <input 
              type="date"  
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors text-gray-700 bg-gray-50 text-sm"  
              ref={cnhExpRef}
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className={`flex-1 py-3 rounded-lg text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-sm ${
                editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-700 hover:bg-green-800'
              }`}
            >
              {editingId ? "Atualizar Motorista" : "Cadastrar Motorista"}
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
          {drivers.filter((driver) => driver.id !== editingId).map((driver) => (
            <article 
              key={driver.id}
              className="w-full bg-white p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm border border-gray-100 hover:shadow-md transition-all gap-4 sm:gap-0"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 md:gap-8 w-full sm:w-auto">
                
                <div className="flex flex-col gap-0.5 w-full sm:w-40 md:w-48">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nome</span>
                  <p className="text-gray-800 font-semibold text-base truncate" title={driver.name}>{driver.name}</p>
                </div>
                
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">CPF</span>
                  <p className="text-gray-800 font-semibold text-base">{maskCpf(driver.cpf)}</p>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">CNH</span>
                  <p className="text-gray-800 font-semibold text-base">{driver.cnh}</p>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Validade</span>
                  <span className="text-blue-800 bg-blue-100 px-2 py-1 rounded-md text-[11px] font-bold tracking-wider w-max">
                    {formatDateBR(driver.cnh_expiration)}
                  </span>
                </div>

              </div>
              
              <div className="flex gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-transparent border-gray-100 mt-1 sm:mt-0">
                <button 
                  type="button"
                  className="bg-orange-500 text-white p-2.5 rounded-lg hover:bg-orange-600 transition-colors shadow-sm flex-1 sm:flex-none flex justify-center"
                  onClick={() => handleEditDriverClick(driver)}
                  title="Editar"
                >
                  <FiEdit2 size={18} />
                </button>

                <button 
                  type="button"
                  className="bg-red-500 text-white p-2.5 rounded-lg hover:bg-red-600 transition-colors shadow-sm flex-1 sm:flex-none flex justify-center"
                  onClick={() => handleDeleteDriver(driver.id)}
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