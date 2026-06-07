import { FiTrash2, FiEdit2 } from 'react-icons/fi';

export function Manufacturers() {
  return (
    <div className="w-full flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-gray-800">Fabricantes</h1>

        <form className="flex flex-col my-6 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-700">Nome da Marca:</label>
            <input 
              type="text"  
              placeholder="Ex: Volvo, Scania..."  
              className="w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="flex gap-4">
            <input
              type="submit"
              value="Cadastrar Marca"
              className="cursor-pointer flex-1 p-2 rounded-md text-white font-bold bg-green-600 hover:bg-green-700 transition-colors"
            />
          </div>
        </form>

        <section className="flex flex-col gap-4 mt-6">
          
          <article className="w-full bg-white p-4 rounded-md flex flex-row justify-between items-center shadow-sm border border-gray-100 hover:scale-[1.01] transition-all">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">ID: 1</span>
              <p className="text-gray-900 font-semibold">Volvo</p>
            </div>
            
            <div className="flex gap-2">
              <button type="button" className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition-colors">
                <FiEdit2 size={18} />
              </button>
              <button type="button" className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors">
                <FiTrash2 size={18} />
              </button>
            </div>
          </article>

          <article className="w-full bg-white p-4 rounded-md flex flex-row justify-between items-center shadow-sm border border-gray-100 hover:scale-[1.01] transition-all">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">ID: 2</span>
              <p className="text-gray-900 font-semibold">Scania</p>
            </div>
            
            <div className="flex gap-2">
              <button type="button" className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 transition-colors">
                <FiEdit2 size={18} />
              </button>
              <button type="button" className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors">
                <FiTrash2 size={18} />
              </button>
            </div>
          </article>

        </section>
      </main>
    </div>
  );
}