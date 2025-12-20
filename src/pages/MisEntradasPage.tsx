import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TicketCard } from '../components/TicketCard';
import { profileService } from '../api/services';
import type { ActiveTicket } from '../types';
import { Popcorn, AlertTriangle } from 'lucide-react';

const MisEntradasPage = () => {
  const [tickets, setTickets] = useState<ActiveTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const data = await profileService.getActiveTickets();
        setTickets(data);
      } catch (err) {
        // Si el endpoint no está listo, mostrar como sin entradas
        console.log('Endpoint de entradas no disponible:', err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const EmptyState = () => (
    <div className="text-center py-16 px-6 bg-gray-900 rounded-lg flex flex-col items-center">
      <Popcorn className="w-24 h-24 text-blue-500 mb-6" strokeWidth={1} />
      <h2 className="text-2xl font-bold text-white mb-2">No tienes funciones pendientes</h2>
      <p className="text-gray-400 mb-8">Parece que no hay entradas activas. ¿Qué tal una nueva película?</p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
      >
        Ir a Cartelera
      </Link>
    </div>
  );


  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-white mb-4">Mis Entradas</h1>
        <p className="text-gray-400">Cargando tus entradas...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Mis Entradas</h1>
      {tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default MisEntradasPage;
