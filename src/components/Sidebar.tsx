import { NavLink } from 'react-router-dom';
import { Home, Ticket, History, Settings, X, LayoutDashboard, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import useAuth

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const activeLinkStyle = {
  backgroundColor: '#1e3a8a',
  color: 'white',
};

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { isAuthenticated, isAdmin, isEmployee, isSuperUsuario } = useAuth(); // Get auth context

  // Cliente es el usuario que NO es Admin, Empleado ni SuperUsuario
  const isCliente = isAuthenticated && !isAdmin && !isEmployee && !isSuperUsuario;

  // Base navigation items
  const baseNavItems = [
    { to: '/', text: 'Inicio / Cartelera', icon: <Home className="w-5 h-5" />, show: true },
    { to: '/mis-entradas', text: 'Mis Entradas', icon: <Ticket className="w-5 h-5" />, show: isCliente }, // Solo Cliente
    { to: '/historial', text: 'Historial de Compras', icon: <History className="w-5 h-5" />, show: isCliente }, // Solo Cliente
    { to: '/configuracion', text: 'Configuración', icon: <Settings className="w-5 h-5" />, show: isAuthenticated },
    { to: '/admin', text: 'Panel Admin', icon: <LayoutDashboard className="w-5 h-5" />, show: isAdmin },
    { to: '/employee-sale', text: 'Panel Empleado', icon: <Briefcase className="w-5 h-5" />, show: isEmployee },
  ];

  const navItems = baseNavItems.filter(item => item.show);

  return (
    <>
      {/* Overlay for mobile view */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-gray-300 w-64 transform transition-transform duration-300 ease-in-out z-40 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Menú</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white md:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-4">
          <ul>
            {navItems.map((item) => (
              <li key={item.to} className="px-2">
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setIsOpen(false)}
                  style={({ isActive }) => (isActive ? activeLinkStyle : {})}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-200"
                >
                  {item.icon}
                  <span className="font-medium">{item.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};
