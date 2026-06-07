import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-[400px]">
        
        <div className="text-center mb-8 mt-2">
          <h1 className="text-2xl font-bold text-green-950 uppercase tracking-widest mb-2">
            Controle de<br />Portaria
          </h1>
          <p className="text-xs text-green-600 uppercase font-bold tracking-wider">
            Acesse sua conta para continuar
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">
              Usuário (CPF)
            </label>
            <input 
              type="text" 
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors text-gray-700 bg-gray-50 text-sm"
              placeholder="Digite seu usuário"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-green-900 uppercase tracking-wider">
              Senha
            </label>
            <input 
              type="password" 
              className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors text-gray-700 bg-gray-50 text-sm"
              placeholder="******"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-700 text-white font-bold text-sm uppercase tracking-wider py-3 px-4 rounded-lg hover:bg-green-800 transition-colors mt-4 shadow-sm"
          >
            Acessar Sistema
          </button>

          <div className="text-center mt-2 mb-1">
            <button 
              type="button"
              className="text-[13px] font-bold text-green-600 hover:text-green-800 transition-colors tracking-wide"
            >
              Esqueci minha senha
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}