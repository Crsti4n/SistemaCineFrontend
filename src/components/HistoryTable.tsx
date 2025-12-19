// src/components/HistoryTable.tsx
import { PurchaseHistoryItem } from '../data/mocks';
import { Eye } from 'lucide-react';

interface HistoryTableProps {
  items: PurchaseHistoryItem[];
  onSelectItem: (item: PurchaseHistoryItem) => void;
}

export const HistoryTable = ({ items, onSelectItem }: HistoryTableProps) => {
  const getStatusClass = (status: 'Pagado' | 'Reembolsado') => {
    switch (status) {
      case 'Pagado':
        return 'bg-green-500/20 text-green-300';
      case 'Reembolsado':
        return 'bg-yellow-500/20 text-yellow-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="hidden md:block bg-gray-900 rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-800">
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Detalle</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sede</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-800/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(item.date).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                <p className="font-semibold">{item.details.movie}</p>
                {item.details.confectionery.length > 0 && (
                  <p className="text-xs text-gray-400">{item.details.confectionery.join(', ')}</p>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{item.location}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">S/ {item.total.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(item.status)}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => onSelectItem(item)} className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
