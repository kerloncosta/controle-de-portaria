import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Controle de Portaria</h1>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Usuário</label>
            <input 
              type="text" 
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite seu usuário"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input 
              type="password" 
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors mt-4"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}