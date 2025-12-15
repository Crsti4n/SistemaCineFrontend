import { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, User, DollarSign, CreditCard, Loader2 } from 'lucide-react';
import { comprasService } from '../api/services';
import { Toast } from '../components/Toast';
import type { Compra } from '../types';

export const AdminDashboard = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCompras();
  }, []);

  const loadCompras = async () => {
    try {
      setLoading(true);
      const data = await comprasService.getAll();
      setCompras(data.sort((a, b) =>
        new Date(b.fechaCompra).getTime() - new Date(a.fechaCompra).getTime()
      ));
    } catch (err) {
      setError('Error al cargar el historial de ventas');
    } finally {
      setLoading(false);
    }
  };

  const totalVentas = compras.reduce((sum, compra) => sum + compra.total, 0);

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

      <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Historial de Ventas</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : compras.length === 0 ? (
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
        )}
      </div>
    </div>
  );
};
