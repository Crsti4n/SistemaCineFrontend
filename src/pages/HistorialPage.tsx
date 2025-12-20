import { useState, useEffect, useMemo } from 'react';
import { HistoryTable } from '../components/HistoryTable';
import { HistoryCard } from '../components/HistoryCard';
import { HistoryDetailModal } from '../components/HistoryDetailModal';
import { profileService } from '../api/services';
import type { PurchaseHistoryItem } from '../types';
import { Search, Calendar, AlertTriangle } from 'lucide-react';

const HistorialPage = () => {
  const [history, setHistory] = useState<PurchaseHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<PurchaseHistoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await profileService.getPurchaseHistory();
        console.log('📊 Historial recibido del backend:', data);
        console.log('📊 Primera compra (ejemplo):', data[0]);
        setHistory(data);
      } catch (err) {
        // Si el endpoint no está listo, mostrar como historial vacío
        console.error('❌ Error al cargar historial:', err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    return history
      .filter(Boolean) // Remove any null/undefined items from the API response
      .filter(item => {
        // Search term filter
        const lowerCaseSearch = searchTerm.toLowerCase();
        const matchesSearch = (item.details?.movie?.toLowerCase() ?? '').includes(lowerCaseSearch) ||
          (item.location?.toLowerCase() ?? '').includes(lowerCaseSearch);
        return matchesSearch;
      })
      .filter(item => {
        // Date filter
        if (dateFilter === 'all') return true;
        const itemDate = new Date(item.date);
        const now = new Date();
        if (dateFilter === '30days') {
          const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30));
          return itemDate > thirtyDaysAgo;
        }
        if (dateFilter === 'thisYear') {
          return itemDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
  }, [history, searchTerm, dateFilter]);

  const handleSelectItem = (item: PurchaseHistoryItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-400 py-10">Cargando tu historial...</p>;
    }

    if (error) {
      return (
        <div className="text-center py-16 px-6 bg-red-900/20 border border-red-500/30 rounded-lg flex flex-col items-center">
          <AlertTriangle className="w-20 h-20 text-red-500 mb-6" strokeWidth={1} />
          <h2 className="text-2xl font-bold text-white mb-2">¡Ups! Algo salió mal</h2>
          <p className="text-red-300">{error}</p>
        </div>
      );
    }

    if (filteredHistory.length === 0) {
      return <p className="text-center text-gray-400 py-10">No se encontraron resultados para tus filtros.</p>;
    }

    return (
      <>
        <HistoryTable items={filteredHistory} onSelectItem={handleSelectItem} />
        <div className="md:hidden space-y-4">
          {filteredHistory.map((item, index) => (
            <HistoryCard key={item.id ?? index} item={item} onSelectItem={handleSelectItem} />
          ))}
        </div>
      </>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Historial de Compras</h1>
      <p className="text-gray-400 mb-8">Consulta tus transacciones pasadas y accede a tus comprobantes.</p>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por película..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full md:w-auto bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todo</option>
            <option value="30days">Últimos 30 días</option>
            <option value="thisYear">Este año</option>
          </select>
        </div>
      </div>

      {/* Responsive Content */}
      {renderContent()}

      <HistoryDetailModal item={selectedItem} onClose={handleCloseModal} />
    </div>
  );
};

export default HistorialPage;
