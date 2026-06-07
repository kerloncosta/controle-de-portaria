import { Outlet, useNavigate } from 'react-router-dom';
import { FiUsers, FiLogOut } from 'react-icons/fi';

export function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-100">
      
      <aside className="w-64 bg-green-950 text-white flex flex-col shadow-xl">
        <div className="p-6 text-center text-xl font-bold border-b border-green-800">
          Portaria
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <button 
            onClick={() => navigate('/dashboard/funcionarios')}
            className="flex items-center gap-3 w-full text-left p-3 rounded hover:bg-green-800 transition-colors"
          >
            <FiUsers size={20} /> Funcionários
          </button>
        </nav>

        <div className="p-4 border-t border-green-800">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full text-left p-3 rounded hover:bg-red-600 transition-colors text-red-400 hover:text-white"
          >
            <FiLogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}