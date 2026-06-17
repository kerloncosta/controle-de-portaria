import { Outlet, useNavigate } from 'react-router-dom';
import { FiUsers, FiLogOut, FiTruck, FiLayers, FiHome } from 'react-icons/fi';

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-200">
      
      <aside className="w-20 hover:w-64 bg-green-950 text-white flex flex-col shadow-xl transition-all duration-300 ease-in-out overflow-hidden group z-10 whitespace-nowrap">
        
        <div className="h-20 flex items-center px-6 border-b border-green-800">
          <div className="min-w-[28px] flex items-center justify-center font-bold text-2xl text-green-500">
            P
          </div>
          <span className="ml-4 text-lg font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Portaria
          </span>
        </div>

        <nav className="p-3 flex flex-col gap-2 mt-2 flex-1">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center px-3 py-2.5 w-full rounded-lg hover:bg-green-800 transition-colors"
            title="Início"
          >
            <div className="min-w-[24px] flex justify-center">
              <FiHome size={20} />
            </div>
            <span className="ml-4 text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Início
            </span>
          </button>

          <button 
            onClick={() => navigate('/dashboard/funcionarios')}
            className="flex items-center px-3 py-2.5 w-full rounded-lg hover:bg-green-800 transition-colors"
            title="Funcionários"
          >
            <div className="min-w-[24px] flex justify-center">
              <FiUsers size={20} />
            </div>
            <span className="ml-4 text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Funcionários
            </span>
          </button>

          <button 
            onClick={() => navigate('/dashboard/fabricantes')}
            className="flex items-center px-3 py-2.5 w-full rounded-lg hover:bg-green-800 transition-colors"
            title="Fabricantes"
          >
            <div className="min-w-[24px] flex justify-center">
              <FiTruck size={20} />
            </div>
            <span className="ml-4 text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Fabricantes
            </span>
          </button>

          <button 
            onClick={() => navigate('/dashboard/modelos')}
            className="flex items-center px-3 py-2.5 w-full rounded-lg hover:bg-green-800 transition-colors"
            title="Modelos"
          >
            <div className="min-w-[24px] flex justify-center">
              <FiLayers size={20} />
            </div>
            <span className="ml-4 text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Modelos
            </span>
          </button>

          <button 
            onClick={() => navigate('/dashboard/motoristas')}
            className="flex items-center px-3 py-2.5 w-full rounded-lg hover:bg-green-800 transition-colors"
            title="Motoristas"
          >
            <div className="min-w-[24px] flex justify-center">
              <FiUsers size={20} /> 
            </div>
            <span className="ml-4 text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Motoristas
            </span>
          </button>
        </nav>

        <div className="p-3 border-t border-green-800 mt-auto">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center px-3 py-2.5 w-full rounded-lg hover:bg-red-600 transition-colors text-red-400 hover:text-white"
            title="Sair do sistema"
          >
            <div className="min-w-[24px] flex justify-center">
              <FiLogOut size={20} />
            </div>
            <span className="ml-4 text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Sair
            </span>
          </button>
        </div>

      </aside>

      <main className="flex-1 overflow-y-auto bg-gray-200">
        <Outlet />
      </main>

    </div>
  );
}