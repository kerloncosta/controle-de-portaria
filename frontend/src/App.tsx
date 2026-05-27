import { useEffect, useState, useRef, FormEvent } from 'react'
import { FiTrash2, FiEdit2} from 'react-icons/fi';
import {api} from './services/api'

interface EmployeeProps {
  id: string;
  name: string;
  cpf: string;
  role: number;
}

export default function App() {

  const [employees, setEmployees] = useState<EmployeeProps[]>([])
  const nameRef = useRef<HTMLInputElement | null>(null)
  const cpfRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const roleRef = useRef<HTMLSelectElement | null>(null)


    useEffect(() => {
      loadEmployees();
    }, [])

    async function loadEmployees() {
        const response = await api.get('/employee/list')
        setEmployees(response.data)
    }

    async function handleCreateEmployee(event: FormEvent) {
      event.preventDefault();

      if(!nameRef.current || !cpfRef.current || !passwordRef.current || !roleRef.current) return;
      
      try {
      
      const response = await api.post('/employee/add', {
        name: nameRef.current.value,
        cpf: cpfRef.current.value,
        password: passwordRef.current.value,
        role: parseInt(roleRef.current.value)
      });

      setEmployees(allEmployees => [...allEmployees, response.data]);

    console.log("Salvo com sucesso:", response.data); 
    loadEmployees();
    handleCancel(); 

    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error);
      alert("Não foi possível cadastrar. Verifique a conexão ou os dados.");
    }
  
    }

    function handleCancel() {
      nameRef.current!.value = '';
      cpfRef.current!.value = '';
      passwordRef.current!.value = '';
      roleRef.current!.value = '1';
    }

    async function handleDeleteEmployee(cpf: string) {
      try{
        await api.delete(`/employee/delete/${cpf}`);
        loadEmployees();
      }catch(error) {
        console.error("Erro ao deletar funcionário:", error);
        alert("Não foi possível deletar. Verifique a conexão ou os dados.");
      }
    }


  return (
    <div className="w-full min-h-screen bg-green-950 flex justify-center px-4">
  <main className="my-10 w-full md:max-w-2xl">
    <h1 className="text-4xl font-medium text-white">Funcionários</h1>

    <form className="flex flex-col my-6 gap-6" onSubmit={handleCreateEmployee} onReset={handleCancel}>
      
      <div className="flex flex-col gap-1">
        <label className="font-medium text-white">Nome:</label>
        <input 
          type="text"  
          placeholder="Digite o nome completo..."  
          className="w-full p-2 rounded-md bg-white text-gray-900 outline-none"
          ref={nameRef}  
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium text-white">CPF:</label>
        <input 
          type="text"  
          placeholder="000.000.000-00"  
          className="w-full p-2 rounded-md bg-white text-gray-900 outline-none"
          ref={cpfRef}  
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        
        <div className="flex flex-col gap-1">
          <label className="font-medium text-white">Permissões:</label>
          <select className="w-full p-2 rounded-md bg-white text-gray-900 outline-none" ref={roleRef}>
            <option value="1">Operador</option>
            <option value="2">Administrador</option>

          </select>

          <input
          type="submit"
          value="cadastrar"
          className="cursor-pointer w-full p-2 rounded-md bg-green-600 mt-5"
          />
          
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-medium text-white">Senha:</label>
          <input 
            type="password"  
            placeholder="******"  
            className="w-full p-2 rounded-md bg-white text-gray-900 outline-none"  
            ref={passwordRef}
          />

          <input
          type="reset"
          value="Cancelar"
          className="cursor-pointer w-full p-2 rounded-md bg-red-600 mt-5"
          />

        </div>
      </div>
    </form>

    <section className="flex flex-col gap-4 mt-6">
        
        {employees.map((employee) => (
  <article 
    key={employee.id}
    className="w-full bg-white p-4 rounded-md flex flex-row justify-between items-center shadow-sm hover:scale-[1.02] transition-all duration-200"
  >
    
    <div className="flex flex-row gap-8 md:gap-16">
      
      <div className="flex flex-col gap-1 w-36 md:w-56">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Nome</span>
        <p className="text-gray-900 font-semibold truncate" title={employee.name}>{employee.name}</p>
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">CPF</span>
        <p className="text-gray-900 font-semibold">{employee.cpf}</p>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Cargo</span>
        <span className={`px-2 py-0.5 rounded text-sm font-medium w-max ${
          employee.role == 1 ? 'text-blue-700 bg-blue-100'  : 'text-green-700 bg-green-100' }`}>
          {employee.role == 1 ? 'Operador' : 'Administrador'}
        </span>
      </div>

    </div>

    
    <div className="flex gap-2">
      <button className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition-colors"
      //onClick={() => handleEditEmployee(employee.cpf)}
      ><FiEdit2 size={18} /></button>

      <button className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors"
      onClick={() => handleDeleteEmployee(employee.cpf)}
      ><FiTrash2 size={18} /></button>
    </div>
  
  </article>
))}

      </section>

  </main>
</div>
  );
}