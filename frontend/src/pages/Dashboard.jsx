import { Users, UserCheck, DollarSign, Activity } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { title: 'Estudiantes Activos', value: '142', icon: <Users size={24} />, color: 'from-blue-600 to-blue-400' },
    { title: 'Asistencia de Hoy', value: '87%', icon: <UserCheck size={24} />, color: 'from-green-600 to-green-400' },
    { title: 'Ingresos del Mes', value: '$4,250', icon: <DollarSign size={24} />, color: 'from-yellow-600 to-yellow-400' },
    { title: 'Clases Hoy', value: '6', icon: <Activity size={24} />, color: 'from-red-600 to-red-400' },
  ];

  return (
    <div>
      <h1 className="text-4xl font-black uppercase italic mb-8">Panel Principal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity`}></div>
            <div className="flex items-center justify-between mb-4">
              <div className="text-gray-400 font-medium">{stat.title}</div>
              <div className={`p-2 rounded-lg bg-gray-800 text-white`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-4xl font-black text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Próximas Clases</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-950 rounded-xl border border-gray-800">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-900/30 text-red-500 rounded-lg flex items-center justify-center font-bold">
                    1{i}:00
                  </div>
                  <div>
                    <div className="font-bold">Técnica Libre</div>
                    <div className="text-sm text-gray-400">Prof. Máscara Sagrada</div>
                  </div>
                </div>
                <div className="text-sm px-3 py-1 bg-green-900/30 text-green-500 rounded-full font-medium">
                  En 2 horas
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Últimas Asistencias</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3 hover:bg-gray-950 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-800">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-600"></div>
                <div className="flex-1">
                  <div className="font-bold">Luchador #{i}</div>
                  <div className="text-sm text-gray-400">Hace {i * 10} minutos</div>
                </div>
                <div className="text-green-500 font-medium text-sm flex items-center">
                  <UserCheck size={16} className="mr-1" /> Presente
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
