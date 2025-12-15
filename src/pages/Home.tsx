import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { peliculasService } from '../api/services';
import { MovieCard } from '../components/MovieCard';
import { Toast } from '../components/Toast';
import type { Pelicula } from '../types';

export const Home = () => {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadPeliculas();
  }, []);

  // Búsqueda en tiempo real con debounce
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      handleSearch();
    }, 300); // Espera 300ms después de que el usuario deje de escribir

    return () => clearTimeout(delaySearch);
  }, [searchText]);

  const loadPeliculas = async () => {
    try {
      setLoading(true);
      const data = await peliculasService.getAll();
      setPeliculas(data);
    } catch (err) {
      setError('Error al cargar las películas');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) {
      loadPeliculas();
      return;
    }

    try {
      setLoading(true);
      const data = await peliculasService.search(searchText);
      setPeliculas(data);
    } catch (err) {
      setError('Error al buscar películas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <Toast message={error} type="error" onClose={() => setError('')} />}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-6">Cartelera</h1>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar películas..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      ) : peliculas.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No se encontraron películas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {peliculas.map((pelicula) => (
            <MovieCard key={pelicula.id} pelicula={pelicula} />
          ))}
        </div>
      )}
    </div>
  );
};
