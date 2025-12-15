import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import type { Pelicula } from '../types';

interface MovieCardProps {
  pelicula: Pelicula;
}

export const MovieCard = ({ pelicula }: MovieCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/pelicula/${pelicula.id}`)}
      className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
        <img
          src={pelicula.imagenUrl}
          alt={pelicula.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x450?text=Sin+Imagen';
          }}
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">
          {pelicula.clasificacion.nombre}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
          {pelicula.titulo}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span className="bg-gray-800 px-2 py-1 rounded">{pelicula.genero.nombre}</span>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{pelicula.duracionMinutos} min</span>
          </div>
        </div>
      </div>
    </div>
  );
};
