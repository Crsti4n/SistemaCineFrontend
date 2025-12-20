import { Link, useNavigate } from 'react-router-dom';
import { Film, LogOut, User, Menu } from 'lucide-react'; // Simplified imports
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

export const Navbar = ({ setSidebarOpen }: NavbarProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Hamburger and Brand */}
          <div className="flex items-center gap-4">
            {/* Hamburger Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-300 hover:text-white md:hidden" // Hidden on medium and larger screens
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link to="/" className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
              <Film className="w-8 h-8" />
              <span className="text-2xl font-bold hidden sm:inline">CineUNAS</span>
            </Link>
          </div>

          {/* Right side: Auth buttons */}
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors font-medium text-sm sm:text-base"
                >
                  Login
                </Link>
                <Link
                  to="/registro"
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                >
                  Registro
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-white">
                  <User className="w-5 h-5" />
                  <span className="font-medium hidden sm:inline">Hola, {user?.nombre || 'Usuario'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
