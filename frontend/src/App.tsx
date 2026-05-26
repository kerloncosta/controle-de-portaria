import { FiTrash2, FiEdit2} from 'react-icons/fi';

export default function App() {
  return (
    <div className="w-full min-h-screen bg-green-950 flex justify-center px-4">
  <main className="my-10 w-full md:max-w-2xl">
    <h1 className="text-4xl font-medium text-white">Funcionários</h1>

    <form className="flex flex-col my-6 gap-6">
      
      <div className="flex flex-col gap-1">
        <label className="font-medium text-white">Nome:</label>
        <input 
          type="text"  
          placeholder="Digite o nome completo..."  
          className="w-full p-2 rounded-md bg-white text-gray-900 outline-none"  
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium text-white">CPF:</label>
        <input 
          type="text"  
          placeholder="000.000.000-00"  
          className="w-full p-2 rounded-md bg-white text-gray-900 outline-none"  
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        
        <div className="flex flex-col gap-1">
          <label className="font-medium text-white">Permissões:</label>
          <select className="w-full p-2 rounded-md bg-white text-gray-900 outline-none">
            <option value="1">Padrão</option>
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
          />

          <input
          type="reset"
          value="Cancelar"
          className="cursor-pointer w-full p-2 rounded-md bg-red-600 mt-5"
          />

        </div>
      </div>
    </form>

    <section>
          <article className="w-full bg-white p-4 rounded-md flex flex-row justify-between items-center shadow-sm">
            
            <div className="flex flex-row gap-8 md:gap-16">
              <div className="flex flex-col gap-1 w-35 md:w-55">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Nome</span>
        <p className="text-gray-900 font-semibold truncate">Kerlon Henrique da costa</p>
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">CPF</span>
        <p className="text-gray-900 font-semibold">123.456.789-00</p>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Cargo</span>
        <span className="text-green-700 bg-green-100 px-2 py-0.5 rounded text-sm font-medium w-max">
          Admin
        </span>
      </div>

    </div>
        <button className="bg-red-500 text-white px-2 py-1.5 rounded-md hover:bg-red-600 transition-colors font-medium text-sm"><FiTrash2 /></button>
        <button className="bg-orange-500 text-white px-2 py-1.5 rounded-md hover:bg-orange-600 transition-colors font-medium text-sm"><FiEdit2 /></button>
      
      </article>
      </section>

  </main>
</div>
  );
}