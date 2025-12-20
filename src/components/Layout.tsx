import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar'; // Import Sidebar
import { CineChatWidget } from './CineChatWidget';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State for sidebar visibility

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Pass state setter to Navbar and Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex flex-col flex-1 md:ml-64">
        <Navbar setSidebarOpen={setSidebarOpen} />
        <main className="flex-grow p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Render ChatWidget only for authenticated, non-admin users */}
      {isAuthenticated && !isAdmin && <CineChatWidget key={user?.token || 'chat'} />}
    </div>
  );
};
