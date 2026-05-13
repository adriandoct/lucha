import { DollarSign, CheckCircle, Clock } from 'lucide-react';

export default function Pagos() {
  const pagos = [
    { id: 1, alumno: 'El Hijo del Santo (Juan Pérez)', monto: '$500', estado: 'pagado', fecha: '2023-10-01' },
    { id: 2, alumno: 'Místico Jr.', monto: '$500', estado: 'pendiente', fecha: '2023-10-05' },
    { id: 3, alumno: 'Blue Demon III', monto: '$500', estado: 'pagado', fecha: '2023-10-02' },
    { id: 4, alumno: 'Rey Fénix', monto: '$500', estado: 'pendiente', fecha: '2023-10-10' },
  ];

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase italic">Control de Pagos</h1>
          <p className="text-gray-400 mt-2">Gestiona las mensualidades de los luchadores</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all transform hover:-translate-y-1">
          + Registrar Pago
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/20 blur-[40px] rounded-full"></div>
          <div className="text-gray-400 font-medium mb-1">Ingresos del Mes</div>
          <div className="text-3xl font-black text-white">$12,500</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/20 blur-[40px] rounded-full"></div>
          <div className="text-gray-400 font-medium mb-1">Pagos Pendientes</div>
          <div className="text-3xl font-black text-white">15</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 blur-[40px] rounded-full"></div>
          <div className="text-gray-400 font-medium mb-1">Tasa de Pago</div>
          <div className="text-3xl font-black text-white">85%</div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-950/50">
              <tr>
                <th className="p-4 font-bold text-gray-400">ID</th>
                <th className="p-4 font-bold text-gray-400">Luchador</th>
                <th className="p-4 font-bold text-gray-400">Monto</th>
                <th className="p-4 font-bold text-gray-400">Fecha</th>
                <th className="p-4 font-bold text-gray-400">Estado</th>
                <th className="p-4 font-bold text-gray-400 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {pagos.map((pago) => (
                <tr key={pago.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="p-4 text-gray-500 font-medium">#{pago.id}</td>
                  <td className="p-4 font-bold text-white">{pago.alumno}</td>
                  <td className="p-4 font-medium text-gray-300">{pago.monto}</td>
                  <td className="p-4 text-gray-400">{pago.fecha}</td>
                  <td className="p-4">
                    {pago.estado === 'pagado' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800">
                        <CheckCircle size={12} className="mr-1" /> Pagado
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-400 border border-yellow-800">
                        <Clock size={12} className="mr-1" /> Pendiente
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors">
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
