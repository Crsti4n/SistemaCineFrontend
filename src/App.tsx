import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { MovieDetail } from './pages/MovieDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { EmployeeSalePage } from './pages/EmployeeSalePage'; // Added EmployeeSalePage
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="pelicula/:id" element={<MovieDetail />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Register />} />
            <Route
              path="admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            {/* NEW: Route for Employee Sale Page */}
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
