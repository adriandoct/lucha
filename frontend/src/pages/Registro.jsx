import { useState } from 'react';
import { UserPlus, Mail, Shield, CheckCircle, Lock, Camera } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    rol: 'estudiante',
    foto: null
  });
  const [mensaje, setMensaje] = useState('');
  
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.correo,
        password: formData.contrasena,
        options: {
          data: {
            nombre: formData.nombre,
            rol: formData.rol
          }
        }
      });

      if (error) {
        setMensaje(`Error al registrar: ${error.message}`);
      } else {
        setMensaje('¡Usuario registrado exitosamente en el sistema!');
        setFormData({ nombre: '', correo: '', contrasena: '', rol: 'estudiante', foto: null });
      }
    } catch (error) {
      setMensaje('Error inesperado al conectar con Supabase.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-black uppercase italic mb-8">
        Registro de <span className="text-red-600">Usuarios</span>
      </h1>
      
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <p className="text-gray-400 mb-8">
          Panel de administrador para dar de alta a nuevos estudiantes y maestros en la academia de Lucha Libre.
        </p>

        {mensaje && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-800 rounded-xl flex items-center text-green-400">
            <CheckCircle className="mr-3" size={20} />
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nombre Completo (o Nombre de Luchador)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserPlus size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                required
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="Ej. El Santo Jr."
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Correo Electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-500" />
              </div>
              <input
                type="email"
                required
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="luchador@arena.com"
                value={formData.correo}
                onChange={(e) => setFormData({...formData, correo: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input
                type="password"
                required
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                placeholder="Mínimo 8 caracteres"
                value={formData.contrasena}
                onChange={(e) => setFormData({...formData, contrasena: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Rol en la Academia</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield size={18} className="text-gray-500" />
              </div>
              <select
                className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors appearance-none"
                value={formData.rol}
                onChange={(e) => setFormData({...formData, rol: e.target.value})}
              >
                <option value="estudiante">Estudiante / Aprendiz</option>
                <option value="maestro">Maestro / Entrenador</option>
                <option value="padre">Padre de Familia</option>
              </select>
            </div>
          </div>

          {formData.rol === 'estudiante' && (
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Foto del Estudiante (Opcional)</label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
                  {formData.foto ? (
                    <img src={formData.foto} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={24} className="text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-900/30 file:text-red-500 hover:file:bg-red-900/50 transition-colors cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transform hover:-translate-y-1"
            >
              Registrar Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
