import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { MovieDetail } from './pages/MovieDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { EmployeeSalePage } from './pages/EmployeeSalePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import MisEntradasPage from './pages/MisEntradasPage';
import HistorialPage from './pages/HistorialPage';
import ConfiguracionPage from './pages/ConfiguracionPage';
import { ConfirmationPage } from './pages/ConfirmationPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="pelicula/:id" element={<MovieDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="confirmation" element={<ConfirmationPage />} />
            <Route path="registro" element={<Register />} />

            {/* Rutas de Perfil Protegidas */}
            <Route
              path="mis-entradas"
              element={
                <ProtectedRoute>
                  <MisEntradasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="historial"
              element={
                <ProtectedRoute>
                  <HistorialPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="configuracion"
              element={
                <ProtectedRoute>
                  <ConfiguracionPage />
                </ProtectedRoute>
              }
            />

            {/* Rutas de Roles Específicos */}
            <Route
              path="superadmin"
              element={
                <ProtectedRoute requireSuperUsuario>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="employee-sale"
              element={
                <ProtectedRoute requireEmployee>
                  <EmployeeSalePage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
