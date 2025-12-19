// src/components/HistoryDetailModal.tsx
import { PurchaseHistoryItem } from '../types';
import { X, FileText } from 'lucide-react';

interface HistoryDetailModalProps {
  item: PurchaseHistoryItem | null;
  onClose: () => void;
}

export const HistoryDetailModal = ({ item, onClose }: HistoryDetailModalProps) => {
  if (!item) return null;

  // A simple breakdown calculation for demonstration
  const entriesSubtotal = item.total * 0.7; // Assume 70% of total are tickets
  const confectionerySubtotal = item.total * 0.3; // Assume 30% are confectionery

  return (
    <div
      // This is the modal backdrop
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center transition-opacity"
    >
      <div
        // This is the modal content
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4 p-6 relative animate-fade-in-up"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Detalle de Compra</h2>
        <p className="text-sm text-gray-400 mb-6">ID de Factura: {item.invoiceId}</p>

        <div className="space-y-4 text-gray-300">
          <div className="border-b border-gray-700 pb-4">
            <p className="font-bold text-lg text-white">{item.details?.movie || 'N/A'}</p>
            {(item.details?.confectionery?.length ?? 0) > 0 && (
              <p className="text-sm text-gray-400 mt-1">{item.details?.confectionery?.join(', ')}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">{item.location} - {new Date(item.date).toLocaleDateString()}</p>
          </div>

          <div className="flex justify-between items-center">
            <span>Subtotal Entradas</span>
            <span className="font-medium">S/ {entriesSubtotal.toFixed(2)}</span>
          </div>

          {confectionerySubtotal > 0 && (
            <div className="flex justify-between items-center">
              <span>Subtotal Confitería</span>
              <span className="font-medium">S/ {confectionerySubtotal.toFixed(2)}</span>
            </div>
          )}

          <div className="border-t border-gray-700 pt-4 flex justify-between items-center text-white">
            <span className="text-xl font-bold">Total General</span>
            <span className="text-xl font-bold">S/ {(item.total ?? 0).toFixed(2)}</span>
          </div>
        </div>

        <button className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors font-semibold">
          <FileText className="w-5 h-5" />
          Ver Factura Electrónica
        </button>
      </div>
    </div>
  );
};
