import { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { LayoutDashboard, Calendar, User, DollarSign, CreditCard, Loader2, Film, Plus, Pencil, Trash2, Search } from 'lucide-react'; // Added Film, Plus, Pencil, Trash2 icons
import { comprasService, peliculasService, generosService, clasificacionesService, metodoPagoService } from '../api/services'; // Added peliculasService, generosService, clasificacionesService, metodoPagoService
import { Toast } from '../components/Toast';
import { MovieForm } from '../components/MovieForm'; // Added MovieForm
import { MetodoPagoForm } from '../components/MetodoPagoForm'; // Added MetodoPagoForm
import type { Compra, Pelicula, Genero, Clasificacion, MetodoPago } from '../types'; // Added Pelicula, Genero, Clasificacion, MetodoPago types

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'ventas' | 'peliculas' | 'metodosPago'>('ventas'); // State for active tab
  const [compras, setCompras] = useState<Compra[]>([]); // State for purchases
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]); // State for movies
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]); // State for payment methods
  const [generos, setGeneros] = useState<Genero[]>([]); // State for genres
  const [clasificaciones, setClasificaciones] = useState<Clasificacion[]>([]); // State for classifications

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Movie Form states
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Pelicula | null>(null);

  // MetodoPago Form states
  const [showMetodoPagoForm, setShowMetodoPagoForm] = useState(false);
  const [selectedMetodoPago, setSelectedMetodoPago] = useState<MetodoPago | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      if (activeTab === 'ventas') {
        const data = await comprasService.getAll();
        setCompras(data.sort((a, b) =>
          new Date(b.fechaCompra).getTime() - new Date(a.fechaCompra).getTime()
        ));
      } else if (activeTab === 'peliculas') {
        const [peliculasData, generosData, clasificacionesData] = await Promise.all([
          peliculasService.getAll(),
          generosService.getAll(),
          clasificacionesService.getAll(),
        ]);
        setPeliculas(peliculasData);
        setGeneros(generosData);
        setClasificaciones(clasificacionesData);
      } else if (activeTab === 'metodosPago') {
        const metodosData = await metodoPagoService.getAll();
        setMetodosPago(metodosData);
      }
    } catch (err) {
      setError(`Error al cargar los datos de ${activeTab}`);
      console.error(`Error loading ${activeTab} data:`, err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]); // Dependency array for useCallback

  useEffect(() => {
    loadData();
  }, [loadData]); // Now useEffect depends on the memoized loadData

  const totalVentas = compras.reduce((sum, compra) => sum + compra.total, 0);

  // Movie Form handlers
  const openNewMovieModal = () => {
    setSelectedMovie(null);
    setShowMovieForm(true);
  };

  const openEditMovieModal = (movie: Pelicula) => {
    setSelectedMovie(movie);
    setShowMovieForm(true);
  };

  const handleMovieSubmit = async (movieData: Partial<Pelicula>) => {
    try {
      if (selectedMovie) {
        // Update existing movie
        await peliculasService.update(selectedMovie.id, movieData as any); // Cast to any due to Omit type
        setToast({ message: 'Película actualizada con éxito', type: 'success' });
      } else {
        // Create new movie
        await peliculasService.create(movieData as any); // Cast to any due to Omit type
        setToast({ message: 'Película creada con éxito', type: 'success' });
      }
      setShowMovieForm(false);
      await loadData(); // Call the memoized loadData
    } catch (err) {
      setToast({ message: 'Error al guardar la película', type: 'error' });
      console.error('Error saving movie:', err);
    }
  };

  const handleDeletePelicula = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta película?')) {
      try {
        await peliculasService.delete(id);
        setToast({ message: 'Película eliminada con éxito', type: 'success' });
        await loadData(); // Call the memoized loadData
      } catch (err) {
        setToast({ message: 'Error al eliminar la película', type: 'error' });
        console.error('Error deleting movie:', err);
      }
    }
  };

  // MetodoPago Form handlers
  const openNewMetodoPagoModal = () => {
    setSelectedMetodoPago(null);
    setShowMetodoPagoForm(true);
  };

  const openEditMetodoPagoModal = (metodo: MetodoPago) => {
    setSelectedMetodoPago(metodo);
    setShowMetodoPagoForm(true);
  };

  const handleMetodoPagoSubmit = async (metodoData: Partial<MetodoPago>) => {
    try {
      if (selectedMetodoPago) {
        await metodoPagoService.update(selectedMetodoPago.id, metodoData as any);
        setToast({ message: 'Método de pago actualizado con éxito', type: 'success' });
      } else {
        await metodoPagoService.create(metodoData as any);
        setToast({ message: 'Método de pago creado con éxito', type: 'success' });
      }
      setShowMetodoPagoForm(false);
      await loadData(); // Call the memoized loadData
    } catch (err) {
      setToast({ message: 'Error al guardar el método de pago', type: 'error' });
      console.error('Error saving payment method:', err);
    }
  };

  const handleDeleteMetodoPago = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este método de pago?')) {
      try {
        await metodoPagoService.delete(id);
        setToast({ message: 'Método de pago eliminado con éxito', type: 'success' });
        await loadData(); // Call the memoized loadData
      } catch (err) {
        setToast({ message: 'Error al eliminar el método de pago', type: 'error' });
        console.error('Error deleting payment method:', err);
      }
    }
  };

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredMovies = peliculas.filter(movie =>
    movie.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <LayoutDashboard className="w-8 h-8 text-blue-500" />
          <h1 className="text-4xl font-bold text-white">Panel de Administración</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm font-medium mb-1">Total Ventas</p>
                <p className="text-3xl font-bold text-white">
                  S/ {totalVentas.toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-500 bg-opacity-30 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm font-medium mb-1">Total Transacciones</p>
                <p className="text-3xl font-bold text-white">{compras.length}</p>
              </div>
              <div className="bg-green-500 bg-opacity-30 p-3 rounded-full">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm font-medium mb-1">Promedio por Venta</p>
                <p className="text-3xl font-bold text-white">
                  S/ {compras.length > 0 ? (totalVentas / compras.length).toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="bg-purple-500 bg-opacity-30 p-3 rounded-full">
                <Calendar className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('ventas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'ventas'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
        >
          <DollarSign className="w-4 h-4" />
          Ventas
        </button>
        <button
          onClick={() => setActiveTab('peliculas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'peliculas'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
        >
          <Film className="w-4 h-4" />
          Películas
        </button>
        <button
          onClick={() => setActiveTab('metodosPago')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === 'metodosPago'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
        >
          <CreditCard className="w-4 h-4" />
          Métodos de Pago
        </button>
      </div>

      <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-white">
            {activeTab === 'ventas' && 'Historial de Ventas'}
            {activeTab === 'peliculas' && 'Gestión de Películas'}
            {activeTab === 'metodosPago' && 'Métodos de Pago'}
          </h2>

          {activeTab === 'peliculas' && (
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar película..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={openNewMovieModal}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Nueva Película
              </button>
            </div>
          )}

          {activeTab === 'metodosPago' && (
            <button
              onClick={openNewMetodoPagoModal}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Método
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === 'ventas' && (
              compras.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No hay ventas registradas</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Usuario
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Método de Pago
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {compras.map((compra) => (
                        <tr key={compra.id} className="hover:bg-gray-800 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-300 font-medium">#{compra.id}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-gray-300">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              {new Date(compra.fechaCompra).toLocaleString('es-ES', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-gray-300">
                              <User className="w-4 h-4 text-blue-500" />
                              {compra.usuario.nombreCompleto}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-green-500" />
                              <span className="text-gray-300">{compra.metodoPago.nombre}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-green-400 font-bold text-lg">
                              S/ {compra.total.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}

            {activeTab === 'peliculas' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Imagen</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Título</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Género</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Clasificación</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredMovies.map((movie) => (
                      <tr key={movie.id} className="hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={movie.imagenUrl}
                            alt={movie.titulo}
                            className="w-12 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-white font-medium">{movie.titulo}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-300">{movie.genero.nombre}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                            {movie.clasificacion.nombre}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openEditMovieModal(movie)}
                              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                              title="Editar"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePelicula(movie.id)}
                              className="p-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredMovies.length === 0 && (
                  <div className="text-center py-10 text-gray-400">
                    No se encontraron películas
                  </div>
                )}
              </div>
            )}

            {activeTab === 'metodosPago' && (
              <div className="text-center py-20 text-gray-400">
                <p>Seleccione una opción para gestionar</p>
              </div>
            )}
          </>
        )}
      </div>

      {showMovieForm && (
        <MovieForm
          onSubmit={handleMovieSubmit}
          initialData={selectedMovie}
          onClose={() => setShowMovieForm(false)}
          generos={generos}
          clasificaciones={clasificaciones}
        />
      )}

      {showMetodoPagoForm && (
        <MetodoPagoForm
          onSubmit={handleMetodoPagoSubmit}
          initialData={selectedMetodoPago}
          onClose={() => setShowMetodoPagoForm(false)}
        />
      )}
    </div>
  );
};
