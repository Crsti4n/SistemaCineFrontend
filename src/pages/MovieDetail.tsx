import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Calendar, MapPin, DollarSign, Loader2 } from 'lucide-react'; // Removed User from types, as it's not directly used here
import { peliculasService, funcionesService, comprasService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';
import type { Pelicula, Funcion } from '../types';

export const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated, isEmployee } = useAuth(); // Added isEmployee

  const [pelicula, setPelicula] = useState<Pelicula | null>(null);
  const [funciones, setFunciones] = useState<Funcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFuncion, setSelectedFuncion] = useState<Funcion | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [peliculaData, funcionesData] = await Promise.all([
        peliculasService.getById(Number(id)),
        funcionesService.getByPelicula(Number(id)),
      ]);
      setPelicula(peliculaData);
      setFunciones(funcionesData);
    } catch (err) {
      setToast({ message: 'Error al cargar los datos', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = (funcion: Funcion) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // NEW: Redirect employees to employee sale page
    if (isEmployee) {
      navigate('/employee-sale', { state: { funcion } });
      return;
    }
    // NEW: Redirect clients to checkout page
    navigate('/checkout', { state: { funcion } });
  };

  const handleConfirmPurchase = async () => {
    if (!selectedFuncion || !user) return;

    try {
      setPurchasing(true);
      const compra = await comprasService.create({
        usuarioId: user.id, // Use actual user ID
        metodoPagoId: 1,
        total: selectedFuncion.precio,
      });

      await comprasService.createDetalle({
        compraId: compra.id,
        funcionId: selectedFuncion.id,
        cantidad: 1,
        precioUnitario: selectedFuncion.precio,
      });

      setToast({ message: 'Compra realizada con éxito', type: 'success' });
      setShowConfirm(false);
      setSelectedFuncion(null);
    } catch (err) {
      setToast({ message: 'Error al procesar la compra', type: 'error' });
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!pelicula) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">Película no encontrada</p>
      </div>
    );
  }

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1">
          <img
            src={pelicula.imagenUrl}
            alt={pelicula.titulo}
            className="w-full rounded-lg shadow-2xl"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x600?text=Sin+Imagen';
            }}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-bold text-white">{pelicula.titulo}</h1>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold">
              {pelicula.clasificacion.nombre}
            </span>
          </div>

          <div className="flex items-center gap-6 mb-6 text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{pelicula.duracionMinutos} minutos</span>
            </div>
            <span className="bg-gray-800 px-3 py-1 rounded text-white">
              {pelicula.genero.nombre}
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-3">Sinopsis</h2>
            <p className="text-gray-300 leading-relaxed">{pelicula.sinopsis}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Funciones Disponibles</h2>
            {funciones.length === 0 ? (
              <p className="text-gray-400">No hay funciones disponibles</p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {funciones.map((funcion) => (
                  <div
                    key={funcion.id}
                    className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-blue-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-white">
                          <Calendar className="w-5 h-5 text-blue-500" />
                          <span className="font-medium">
                            {new Date(funcion.fechaHora).toLocaleDateString('es-ES', {
                              weekday: 'short',
                              day: '2-digit',
                              month: 'short',
                            })}
                          </span>
                          <span className="text-gray-400">
                            {new Date(funcion.fechaHora).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                          <MapPin className="w-5 h-5 text-blue-500" />
                          <span>{funcion.sala.nombre}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                          <DollarSign className="w-5 h-5 text-green-500" />
                          <span className="font-bold text-lg">S/ {funcion.precio.toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBuyClick(funcion)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Comprar Entrada
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showConfirm && selectedFuncion && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-white mb-4">Confirmar Compra</h3>
            <div className="space-y-3 mb-6 text-gray-300">
              <p>
                <span className="font-semibold text-white">Película:</span> {pelicula.titulo}
              </p>
              <p>
                <span className="font-semibold text-white">Fecha:</span>{' '}
                {new Date(selectedFuncion.fechaHora).toLocaleString('es-ES')}
              </p>
              <p>
                <span className="font-semibold text-white">Sala:</span> {selectedFuncion.sala.nombre}
              </p>
              <p>
                <span className="font-semibold text-white">Total:</span> S/{' '}
                {selectedFuncion.precio.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={purchasing}
                className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPurchase}
                disabled={purchasing}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {purchasing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'Confirmar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
