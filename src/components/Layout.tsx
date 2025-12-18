import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { CineChatWidget } from './CineChatWidget';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      {/* Render ChatWidget only for authenticated, non-admin users */}
      {isAuthenticated && !isAdmin && <CineChatWidget key={user?.usuario} />}
    </div>
  );
};
