// src/components/HistoryCard.tsx
import { PurchaseHistoryItem } from '../data/mocks';

interface HistoryCardProps {
  item: PurchaseHistoryItem;
  onSelectItem: (item: PurchaseHistoryItem) => void;
}

export const HistoryCard = ({ item, onSelectItem }: HistoryCardProps) => {
  return (
    <div 
      onClick={() => onSelectItem(item)}
      className="md:hidden bg-gray-800 rounded-lg p-4 mb-4 flex justify-between items-center cursor-pointer hover:bg-gray-700 transition-colors"
    >
      <div>
        <p className="font-bold text-white text-lg">{item.details.movie}</p>
        <p className="text-sm text-gray-400">{item.location}</p>
        <p className="text-xs text-gray-500 mt-1">{new Date(item.date).toLocaleDateString()}</p>
      </div>
      <div className="text-right">
        <p className="text-xl font-semibold text-white">S/ {item.total.toFixed(2)}</p>
        <button className="text-blue-400 text-sm mt-1">
          Ver detalles
        </button>
      </div>
    </div>
  );
};
