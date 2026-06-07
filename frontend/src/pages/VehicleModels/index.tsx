import { FiTrash2, FiEdit2 } from 'react-icons/fi';

export function VehicleModels() {
  return (
    <div className="w-full flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-gray-800">Modelos de Veículos</h1>


        <form className="flex flex-col my-6 gap-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Nome do Modelo:</label>
              <input 
                type="text"  
                placeholder="Ex: FH 540, Constellation..."  
                className="w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-green-600 bg-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-medium text-gray-700">Fabricante (Marca):</label>
              <select 
                className="w-full p-2 rounded-md border border-gray-300 outline-none focus:ring-2 focus:ring-green-600 bg-white"
                defaultValue=""
              >
                <option value="" disabled>Selecione um fabricante...</option>
                <option value="1">Volvo</option>
                <option value="2">Scania</option>
                <option value="3">Volkswagen</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-2">
            <input
              type="submit"
              value="Cadastrar Modelo"
              className="cursor-pointer flex-1 p-2 rounded-md text-white font-bold bg-green-600 hover:bg-green-700 transition-colors"
            />
          </div>
        </form>

        <section className="flex flex-col gap-4 mt-6">
          
          {/* Item 1 */}
          <article className="w-full bg-white p-4 rounded-md flex flex-row justify-between items-center shadow-sm border border-gray-100 hover:scale-[1.01] transition-all">
            <div className="flex flex-row gap-8 md:gap-16">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Modelo</span>
                <p className="text-gray-900 font-semibold">FH 540</p>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Marca</span>
                <span className="px-2 py-0.5 rounded text-xs font-medium w-max text-emerald-700 bg-emerald-100">
                  Volvo
                </span>
              </div>
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
            <div className="flex flex-row gap-8 md:gap-16">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Modelo</span>
                <p className="text-gray-900 font-semibold">Constellation</p>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Marca</span>
                <span className="px-2 py-0.5 rounded text-xs font-medium w-max text-emerald-700 bg-emerald-100">
                  Volkswagen
                </span>
              </div>
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