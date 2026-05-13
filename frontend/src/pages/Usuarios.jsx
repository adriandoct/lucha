import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, Users, Mail, Clock } from 'lucide-react';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsuarios(data || []);
    } catch (error) {
      console.error('Error fetching usuarios:', error.message);
    } finally {
      setCargando(false);
    }
  };

  const getRoleColor = (rol) => {
    switch (rol) {
      case 'administrador': return 'bg-red-900/30 text-red-500 border-red-800';
      case 'maestro': return 'bg-blue-900/30 text-blue-500 border-blue-800';
      case 'padre': return 'bg-yellow-900/30 text-yellow-500 border-yellow-800';
      default: return 'bg-green-900/30 text-green-500 border-green-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-black uppercase italic mb-8">
        Directorio de <span className="text-red-600">Usuarios</span>
      </h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="p-6 border-b border-gray-800">
          <p className="text-gray-400">Panel exclusivo para administradores. Aquí puedes ver todos los estudiantes, padres y maestros de la academia.</p>
        </div>

        {cargando ? (
          <div className="p-8 text-center text-gray-500">Cargando luchadores...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-950/50 text-gray-400 text-sm border-b border-gray-800">
                  <th className="p-4 font-medium">Nombre / Luchador</th>
                  <th className="p-4 font-medium">Rol</th>
                  <th className="p-4 font-medium">Correo Electrónico</th>
                  <th className="p-4 font-medium">Fecha de Ingreso</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">No hay usuarios registrados aún.</td>
                  </tr>
                ) : (
                  usuarios.map((u) => (
                    <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                            <Users size={18} className="text-gray-400" />
                          </div>
                          <span className="font-bold text-white">{u.nombre || 'Sin nombre'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getRoleColor(u.rol)}`}>
                          {u.rol}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400 flex items-center space-x-2">
                        <Mail size={16} /> <span>{u.correo}</span>
                      </td>
                      <td className="p-4 text-gray-500 text-sm">
                        <div className="flex items-center space-x-2">
                          <Clock size={16} />
                          <span>{new Date(u.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
