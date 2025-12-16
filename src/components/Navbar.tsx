import { Link, useNavigate } from 'react-router-dom';
import { Film, LogOut, User, LayoutDashboard, Briefcase } from 'lucide-react'; // Added Briefcase icon
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isEmployee } = useAuth(); // Added isEmployee
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors">
            <Film className="w-8 h-8" />
            <span className="text-2xl font-bold">CineUNAS</span>
          </Link>

          <div className="flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/registro"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Registro
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-white">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Hola, {user?.usuario}</span>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Panel Admin
                  </Link>
                )}

                {/* NEW: Link for Employee Panel */}
                {isEmployee && (
                  <Link
                    to="/employee-sale"
                    className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors font-medium"
                  >
                    <Briefcase className="w-5 h-5" />
                    Panel Empleado
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
