import { Calendar as CalendarIcon, Clock, User } from 'lucide-react';

export default function Horarios() {
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const classes = [
    { day: 'Lunes', time: '17:00 - 19:00', name: 'Lucha Olímpica', teacher: 'Prof. Atlantis' },
    { day: 'Lunes', time: '19:00 - 21:00', name: 'Técnica Aérea', teacher: 'Prof. Rey Mysterio' },
    { day: 'Martes', time: '18:00 - 20:00', name: 'Lucha a Ras de Lona', teacher: 'Prof. Blue Panther' },
    { day: 'Miércoles', time: '17:00 - 19:00', name: 'Lucha Olímpica', teacher: 'Prof. Atlantis' },
    { day: 'Miércoles', time: '19:00 - 21:00', name: 'Técnica Aérea', teacher: 'Prof. Rey Mysterio' },
    { day: 'Jueves', time: '18:00 - 20:00', name: 'Lucha a Ras de Lona', teacher: 'Prof. Blue Panther' },
    { day: 'Viernes', time: '17:00 - 20:00', name: 'Sparring Libre', teacher: 'Varios Profesores' },
    { day: 'Sábado', time: '10:00 - 13:00', name: 'Exhibición y Práctica', teacher: 'Varios Profesores' },
  ];

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black uppercase italic">Horarios de Clases</h1>
          <p className="text-gray-400 mt-2">Programación semanal de la academia</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {days.map((day) => (
          <div key={day} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-[40px] group-hover:bg-red-600/10 transition-colors pointer-events-none"></div>
            
            <h2 className="text-2xl font-black mb-4 flex items-center">
              <CalendarIcon size={24} className="text-red-500 mr-2" />
              {day}
            </h2>
            
            <div className="space-y-4">
              {classes.filter(c => c.day === day).map((c, idx) => (
                <div key={idx} className="bg-gray-950 rounded-xl p-4 border border-gray-800 hover:border-red-900/50 transition-colors">
                  <div className="font-bold text-white mb-2 text-lg">{c.name}</div>
                  <div className="flex items-center text-sm text-gray-400 mb-1">
                    <Clock size={14} className="mr-2 text-red-500" /> {c.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <User size={14} className="mr-2 text-red-500" /> {c.teacher}
                  </div>
                </div>
              ))}
              
              {classes.filter(c => c.day === day).length === 0 && (
                <div className="text-gray-500 italic text-sm p-4 bg-gray-950/50 rounded-xl border border-gray-800 border-dashed text-center">
                  Sin clases programadas
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
