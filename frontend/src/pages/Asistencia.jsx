import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scanner } from '@yudiel/react-qr-scanner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Scan, QrCode, LayoutDashboard, Users, CheckCircle, Clock, AlertTriangle, FileText, Download, Check } from 'lucide-react';

export default function Asistencia() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'scanner' | 'mi-qr'
  const [scanResult, setScanResult] = useState(null);
  
  // Fake User Role state (in a real app, this comes from Supabase Auth)
  const [role, setRole] = useState('admin'); // admin | docente | alumno

  // Dummy Data for charts
  const attendanceData = [
    { day: 'Lun', presentes: 120, faltas: 10 },
    { day: 'Mar', presentes: 115, faltas: 15 },
    { day: 'Mié', presentes: 125, faltas: 5 },
    { day: 'Jue', presentes: 110, faltas: 20 },
    { day: 'Vie', presentes: 130, faltas: 0 },
    { day: 'Sáb', presentes: 90, faltas: 40 },
  ];

  const handleScan = (result) => {
    if (result && result.length > 0) {
      setScanResult(result[0].rawValue);
      // Play sound
      const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3');
      audio.play().catch(() => {});
      
      setTimeout(() => {
        setScanResult(null);
      }, 3000);
    }
  };

  const renderDashboard = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-[40px] group-hover:bg-blue-600/20 transition-all"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 font-medium text-sm">Total Usuarios</p>
              <h3 className="text-4xl font-black text-white mt-2">1,248</h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><Users size={24} /></div>
          </div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/10 rounded-full blur-[40px] group-hover:bg-green-600/20 transition-all"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 font-medium text-sm">Presentes Hoy</p>
              <h3 className="text-4xl font-black text-white mt-2">892</h3>
            </div>
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><CheckCircle size={24} /></div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/10 rounded-full blur-[40px] group-hover:bg-yellow-600/20 transition-all"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 font-medium text-sm">Retardos</p>
              <h3 className="text-4xl font-black text-white mt-2">45</h3>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500"><Clock size={24} /></div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-[40px] group-hover:bg-red-600/20 transition-all"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 font-medium text-sm">Faltas</p>
              <h3 className="text-4xl font-black text-white mt-2">12</h3>
            </div>
            <div className="p-3 bg-red-500/10 rounded-xl text-red-500"><AlertTriangle size={24} /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Tendencia de Asistencia</h3>
            <button className="text-blue-500 hover:text-blue-400 text-sm font-medium flex items-center">
              <Download size={16} className="mr-1" /> Exportar
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="colorPresentes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#4b5563" />
                <YAxis stroke="#4b5563" />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }} />
                <Area type="monotone" dataKey="presentes" stroke="#10b981" fillOpacity={1} fill="url(#colorPresentes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6">Últimos Registros en Vivo</h3>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="flex items-center justify-between bg-black/50 p-4 rounded-xl border border-gray-800"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    US
                  </div>
                  <div>
                    <div className="text-white font-medium">Usuario {1024 - i}</div>
                    <div className="text-xs text-gray-500">Grupo Avanzado</div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-green-500 text-sm font-bold flex items-center">
                    <Check size={14} className="mr-1" /> Entrada
                  </span>
                  <span className="text-xs text-gray-500">{new Date(Date.now() - i * 60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderScanner = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
        
        <h2 className="text-3xl font-black text-white mb-2 relative z-10">Escanear QR de Asistencia</h2>
        <p className="text-gray-400 mb-8 relative z-10">Apunta la cámara al código QR del alumno o empleado para registrar su entrada.</p>

        <div className="relative z-10 bg-black p-2 rounded-2xl overflow-hidden border-2 border-gray-800 shadow-[0_0_30px_rgba(16,185,129,0.15)] mb-8">
          <Scanner 
            onScan={handleScan}
            components={{
              audio: false,
              video: true,
            }}
            styles={{
              container: { width: '100%', borderRadius: '1rem', overflow: 'hidden' }
            }}
          />
          
          <AnimatePresence>
            {scanResult && (
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="absolute inset-0 bg-green-500/90 backdrop-blur flex flex-col items-center justify-center text-white p-6"
              >
                <CheckCircle size={80} className="mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                <h3 className="text-2xl font-black uppercase mb-2">¡Asistencia Registrada!</h3>
                <p className="text-lg opacity-90">{scanResult}</p>
                <p className="text-sm mt-4 opacity-75">{new Date().toLocaleTimeString()}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-colors relative z-10">
          Modo Manual (Sin Cámara)
        </button>
      </div>
    </motion.div>
  );

  const renderMiQR = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-8 rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.15)] relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]"></div>
        
        <div className="w-20 h-20 bg-gray-800 rounded-full border-4 border-gray-900 shadow-xl overflow-hidden mb-4 relative z-10">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        
        <h2 className="text-2xl font-black text-white relative z-10">Juan Pérez</h2>
        <p className="text-blue-400 font-medium text-sm mb-8 relative z-10">ID: ALUM-987654</p>

        <div className="bg-white p-4 rounded-2xl shadow-2xl relative z-10 mb-8 transform transition-transform hover:scale-105">
          <QRCodeSVG 
            value={`ALUM-987654-${Date.now()}`} // Simulating dynamic QR
            size={220} 
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"H"}
            includeMargin={false}
          />
        </div>

        <p className="text-sm text-gray-500 mb-6 relative z-10">
          Este código es único e intransferible. Cambia dinámicamente cada minuto por tu seguridad.
        </p>

        <div className="w-full grid grid-cols-2 gap-4 relative z-10">
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
            <p className="text-xs text-gray-400 uppercase mb-1">Asistencias</p>
            <p className="text-xl font-bold text-green-500">95%</p>
          </div>
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800">
            <p className="text-xs text-gray-400 uppercase mb-1">Puntualidad</p>
            <p className="text-xl font-bold text-blue-500">100%</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white uppercase italic flex items-center">
            QR Assist <span className="text-blue-500 ml-2">Pro</span>
          </h1>
          <p className="text-gray-400 mt-2">Sistema Inteligente de Control de Acceso y Asistencia</p>
        </div>
        
        {/* Role Selector (For Demo Purposes) */}
        <div className="bg-gray-900 border border-gray-800 p-2 rounded-lg flex space-x-2">
          <span className="text-xs text-gray-500 uppercase flex items-center px-2">Vista como:</span>
          <select 
            className="bg-black text-white border border-gray-700 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Administrador</option>
            <option value="docente">Docente / Supervisor</option>
            <option value="alumno">Alumno / Usuario</option>
          </select>
        </div>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="flex space-x-2 mb-8 bg-gray-900/50 p-1.5 rounded-xl border border-gray-800/50 w-fit">
        {(role === 'admin') && (
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <LayoutDashboard size={18} /> <span>Panel General</span>
          </button>
        )}
        {(role === 'admin' || role === 'docente') && (
          <button 
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'scanner' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
          >
            <Scan size={18} /> <span>Escanear Entrada</span>
          </button>
        )}
        <button 
          onClick={() => setActiveTab('mi-qr')}
          className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'mi-qr' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
        >
          <QrCode size={18} /> <span>Mi QR Dinámico</span>
        </button>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'scanner' && renderScanner()}
        {activeTab === 'mi-qr' && renderMiQR()}
      </AnimatePresence>
    </div>
  );
}
