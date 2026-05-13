import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import LandingHome from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Asistencia from './pages/Asistencia';
import Pagos from './pages/Pagos';
import Horarios from './pages/Horarios';
import Registro from './pages/Registro';
import Usuarios from './pages/Usuarios';
import { Home, Users, Calendar, DollarSign, LogOut, UserPlus, List } from 'lucide-react';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <nav className="w-full md:w-64 bg-gray-900 border-r border-gray-800 flex flex-col p-4 space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center font-bold text-xl shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            LL
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase italic">Lucha<span className="text-red-600">Libre</span></h1>
        </div>
        
        <div className="flex-1 space-y-2">
          <Link to="/dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <Home size={20} className="text-red-500" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/asistencia" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <Users size={20} className="text-red-500" />
            <span className="font-medium">Asistencia QR</span>
          </Link>
          <Link to="/horarios" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <Calendar size={20} className="text-red-500" />
            <span className="font-medium">Horarios</span>
          </Link>
          <Link to="/pagos" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors">
            <DollarSign size={20} className="text-red-500" />
            <span className="font-medium">Pagos</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <Link to="/admin/usuarios" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300">
            <List size={20} className="text-red-500" />
            <span className="font-medium">Admin: Usuarios</span>
          </Link>
          <Link to="/admin/registro" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-gray-300">
            <UserPlus size={20} className="text-red-500" />
            <span className="font-medium">Admin: Registro</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <Link to="/" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-all">
            <LogOut size={20} />
            <span className="font-medium">Ir al Sitio Web</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-950 p-6 md:p-10 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingHome />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected / Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/asistencia" element={<Asistencia />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/horarios" element={<Horarios />} />
          <Route path="/admin/usuarios" element={<Usuarios />} />
          <Route path="/admin/registro" element={<Registro />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
