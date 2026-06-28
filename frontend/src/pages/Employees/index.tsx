import { useEffect, useState, useRef, FormEvent } from 'react'
import { FiTrash2, FiEdit2, FiSearch} from 'react-icons/fi';
import { api } from '../../services/api';
import { validateCpfFormat, validatePassword} from '../../Utils/validators';
import { maskCpf } from '../../Utils/masks';

interface EmployeeProps {
  id: string;
  name: string;
  cpf: string;
  role: number;
}

export function Employees() {
  const [employees, setEmployees] = useState<EmployeeProps[]>([])
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const nameRef = useRef<HTMLInputElement | null>(null)
  const cpfRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const roleRef = useRef<HTMLSelectElement | null>(null)

  useEffect(() => {
    loadEmployees();
  }, [])

  async function loadEmployees(page = 1, search = "") {
    try{
      const response = await api.get(`/employee/list?page=${page}&limit=10&search=${search}`)
      setEmployees(response.data.data)
      setCurrentPage(response.data.page);
    }catch (error) {
      console.error("Erro ao carregar Funcionarios:", error);
    }
  }

  async function handleCreateEmployee(event: FormEvent) {
    event.preventDefault();

    const name = nameRef.current?.value;
    const rawCpf = cpfRef.current?.value;
    const password = passwordRef.current?.value;
    const role = roleRef.current?.value;

    const cpf = rawCpf ? rawCpf.replace(/\D/g, '') : '';
    
    if (!name || !cpf) {
      alert("Nome e CPF são obrigatórios.");
      return;
    }

    if (!validateCpfFormat(cpf)) {
      alert("Por favor, digite um CPF válido.");
      return;
    }

    if (!editingId && !password) {
      alert("A senha é obrigatória para cadastrar um novo funcionário.");
      return;
    }

    if (password && !validatePassword(password)) {
      alert("A senha deve ter no mínimo 6 caracteres, 1 número e 1 letra maiúscula.");
      return;
    }
    
    try {
      const payload: any =  {
        name: name,
        cpf: cpf,
        role: parseInt(role || '1'),
      };

      if (password) {
        payload.password = password;
      }

      if(editingId) {
        await api.put(`/employee/update/${editingId}`, payload);
        alert("Funcionário atualizado com sucesso.");
      } else {
        await api.post('/employee/add', payload);
        alert("Funcionário cadastrado com sucesso!");
      }

      loadEmployees();
      handleCancel(); 

    } catch (error: any) {
      console.error("Erro ao cadastrar funcionário:", error);

      if(error.response && error.response.data && error.response.data.error){
        alert(error.response.data.error);
      } else {
        alert("Não foi possível cadastrar. Verifique a conexão ou os dados.");
      }
    }
  }

  function handleCancel() {
    nameRef.current!.value = '';
    cpfRef.current!.value = '';
    passwordRef.current!.value = '';
    roleRef.current!.value = '1';
    setEditingId(null);
  }

  async function handleDeleteEmployee(id: string) {
    try {
      await api.delete(`/employee/delete/${id}`);
      loadEmployees();
    } catch(error) {
      console.error("Erro ao deletar funcionário:", error);
      alert("Não foi possível deletar. Verifique a conexão ou os dados.");
    }
  }

  function handleEditEmployeeClick(employee: any) {
    setEditingId(employee.id);

    if(nameRef.current) nameRef.current.value = employee.name;
    if(cpfRef.current) cpfRef.current.value = employee.cpf;
    if(passwordRef.current) passwordRef.current.value = '';
    if(roleRef.current) roleRef.current.value = employee.role.toString();
  }

  async function handleFindByCpf() {
    const cpfTyped = cpfRef.current?.value;
    const CleanCpf = cpfTyped ? cpfTyped.replace(/\D/g, '') : '';

    if(!CleanCpf){
      alert("Digite um CPF para buscar.");
      return;
    }

    if (!validateCpfFormat(CleanCpf)) {
      alert("Por favor, digite um CPF válido.");
      return;
    }

    try {
      const response = await api.get(`/employee/find-by-cpf/${CleanCpf}`);
      const employee = response.data;
      
      if(nameRef.current) nameRef.current.value = employee.name;
      if(passwordRef.current) passwordRef.current.value = '';
      if(roleRef.current) roleRef.current.value = employee.role.toString();

      setEditingId(employee.id);

    } catch(error: any) {
      console.error("Erro ao buscar:", error);

      if (error.response && error.response.data && error.response.data.error) {
        alert("CPF não encontrado no sistema.");
      } else {
        alert("Erro na conexão ao buscar o CPF.");
      }
      setEditingId(null);
    }
  }

  return (
    <div className="w-full flex justify-center px-4">
      <main className="my-10 w-full md:max-w-3xl">
        
        <h1 className="text-3xl font-bold text-green-950 uppercase tracking-widest mb-6">
          Funcionários
        </h1>

        <form 
          className="flex flex-col bg-white p-5 rounded-xl shadow-sm border border-gray-100 gap-4" 
          onSubmit={handleCreateEmployee} 
          onReset={handleCancel}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">Nome:</label>
            <input 
              type="text"  
              placeholder="Digite o nome completo..."  
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors text-gray-700 bg-gray-50 text-sm"
              ref={nameRef}  
            />
          </div>

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
              >
                <FiSearch size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">Permissões:</label>
              <select 
                className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors text-gray-700 bg-gray-50 text-sm" 
                ref={roleRef}
              >
                <option value="1">Operador</option>
                <option value="2">Administrador</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">Senha:</label>
              <input 
                type="password"  
                placeholder="******"  
                className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors text-gray-700 bg-gray-50 text-sm"  
                ref={passwordRef}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="submit"
              className={`flex-1 py-3 rounded-lg text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-sm ${
                editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-700 hover:bg-green-800'
              }`}
            >
              {editingId ? "Atualizar" : "Cadastrar"}
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
          {employees.map((employee) => (
            <article 
              key={employee.id}
              className="w-full bg-white p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-sm border border-gray-100 hover:shadow-md transition-all gap-4 sm:gap-0"
            >
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 md:gap-12 w-full sm:w-auto">
                
                <div className="flex flex-col gap-0.5 w-full sm:w-40 md:w-48">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nome</span>
                  <p className="text-gray-800 font-semibold text-base truncate" title={employee.name}>{employee.name}</p>
                </div>
                
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">CPF</span>
                  <p className="text-gray-800 font-semibold text-base">{maskCpf(employee.cpf)}</p>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Cargo</span>
                  <span className={`px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider w-max ${
                    employee.role == 1 ? 'text-blue-800 bg-blue-100'  : 'text-green-800 bg-green-100' }`}>
                    {employee.role == 1 ? 'Operador' : 'Admin'}
                  </span>
                </div>

              </div>
              
              <div className="flex gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-transparent border-gray-100 mt-1 sm:mt-0">
                <button 
                  type="button"
                  className="bg-orange-500 text-white p-2.5 rounded-lg hover:bg-orange-600 transition-colors shadow-sm flex-1 sm:flex-none flex justify-center"
                  onClick={() => handleEditEmployeeClick(employee)}
                  title="Editar"
                >
                  <FiEdit2 size={18} />
                </button>

                <button 
                  type="button"
                  className="bg-red-500 text-white p-2.5 rounded-lg hover:bg-red-600 transition-colors shadow-sm flex-1 sm:flex-none flex justify-center"
                  onClick={() => handleDeleteEmployee(employee.id)}
                  title="Excluir"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </section>

        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage <= 1}
            onClick={() => loadEmployees(currentPage - 1)}
            className={`px-4 py-2 rounded-lg transition-all font-semibold ${
              currentPage <= 1
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-green-700 text-white hover:bg-green-800 shadow-sm"
            }`}
          >
            Anterior
          </button>

          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
            Página {currentPage}
          </span>

          <button
            disabled={employees.length < 10}
            onClick={() => loadEmployees(currentPage + 1)}
            className={`px-4 py-2 rounded-lg transition-all font-semibold ${
              employees.length < 10
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-green-700 text-white hover:bg-green-800 shadow-sm"
            }`}
          >
            Próximo
          </button>
        </div>
      </main>
    </div>
  );
}