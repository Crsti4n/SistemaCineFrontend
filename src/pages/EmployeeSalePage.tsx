import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { metodoPagoService, comprasService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import type { MetodoPago, CompraRequest, Funcion } from '../types';
import { CreditCard, Loader2, User } from 'lucide-react';
import { Toast } from '../components/Toast';

export const EmployeeSalePage = () => {
    const { user, isAuthenticated, isEmployee } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { funcion } = location.state as { funcion: Funcion };

    const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedMetodoPagoId, setSelectedMetodoPagoId] = useState<number | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [customerId, setCustomerId] = useState<string>(''); // Para que el empleado ingrese el ID del cliente

    const totalCompra = funcion ? funcion.precio : 0;

    useEffect(() => {
        // Redirigir si no está autenticado o no es un empleado
        if (!isAuthenticated || !isEmployee) {
            navigate('/login'); // O a una página de error/inicio
            return;
        }

        if (!funcion) {
            setError('No se ha seleccionado ninguna función para la compra.');
            setLoading(false);
            return;
        }

        const loadMetodosPago = async () => {
            try {
                setLoading(true);
                const data = await metodoPagoService.getAll();
                setMetodosPago(data); // El empleado puede ver todos los métodos de pago
                if (data.length > 0) {
                    setSelectedMetodoPagoId(data[0].id);
                }
            } catch (err) {
                setError('Error al cargar los métodos de pago disponibles.');
                console.error('Error loading payment methods:', err);
            } finally {
                setLoading(false);
            }
        };

        loadMetodosPago();
    }, [funcion, isAuthenticated, isEmployee, navigate]);

    const handlePayment = async () => {
        if (selectedMetodoPagoId === null) {
            setError('Por favor, selecciona un método de pago antes de continuar.');
            return;
        }
        if (!funcion) {
            setError('Datos de la función incompletos. Por favor, vuelve a intentarlo.');
            return;
        }
        if (!customerId.trim()) {
            setError('Por favor, ingresa el ID del cliente.');
            return;
        }

        setIsProcessingPayment(true);
        setError('');
        setSuccess('');

        try {
            // En un escenario real, aquí deberías validar que customerId existe en tu base de datos
            // y obtener sus datos para la compra. Por ahora, asumimos que es un ID válido.
            const customerIdNum = parseInt(customerId, 10);
            if (isNaN(customerIdNum)) {
                setError('El ID del cliente debe ser un número válido.');
                setIsProcessingPayment(false);
                return;
            }

            const purchaseData = {
                usuarioId: customerIdNum, // El empleado compra para este cliente
                metodoPagoId: selectedMetodoPagoId,
                total: funcion.precio,
                detallesCompra: [
                    {
                        funcionId: funcion.id,
                        cantidad: 1,
                        precioUnitario: funcion.precio,
                    },
                ],
            };

            const nuevaCompra = await comprasService.createEmployeePurchase(purchaseData);

            setSuccess(`¡Venta realizada con éxito para el cliente ID ${customerId}! ID de compra: ${nuevaCompra.id}`);
            // Redirigir o limpiar el formulario para una nueva venta
            navigate('/admin'); // O a una página de confirmación de venta
        } catch (err) {
            setError('Error al procesar la venta. Inténtalo de nuevo.');
            console.error('Error processing employee sale:', err);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="ml-3 text-lg">Cargando opciones de venta...</p>
            </div>
        );
    }

    if (!funcion) {
        return <div className="text-center text-red-500 py-10">No se ha proporcionado información de la función para la venta.</div>;
    }

    return (
        <div className="container mx-auto p-8 bg-gray-900 text-white rounded-lg shadow-xl max-w-2xl mt-10">
            {error && <Toast message={error} type="error" onClose={() => setError('')} />}
            {success && <Toast message={success} type="success" onClose={() => setSuccess('')} />}

            <h1 className="text-3xl font-bold mb-6 text-center text-white">Venta para Cliente (Empleado)</h1>

            {/* Resumen de la Compra */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Detalles de la Función</h2>
                <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-3">
                    <p className="text-gray-300">Película:</p>
                    <p className="text-white font-medium">{funcion.pelicula?.titulo || 'N/A'}</p>
                </div>
                <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-3">
                    <p className="text-gray-300">Fecha y Hora:</p>
                    <p className="text-white font-medium">{new Date(funcion.fechaHora).toLocaleString('es-ES')}</p>
                </div>
                <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-3">
                    <p className="text-gray-300">Sala:</p>
                    <p className="text-white font-medium">{funcion.sala.nombre}</p>
                </div>
                <div className="flex justify-between items-center pb-3 mb-3">
                    <p className="text-gray-300">Total a pagar:</p>
                    <p className="text-green-400 font-bold text-3xl">S/ {funcion.precio.toFixed(2)}</p>
                </div>
            </div>

            {/* Entrada para ID de Cliente */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <User className="w-6 h-6 text-blue-400" />
                    Información del Cliente
                </h2>
                <div>
                    <label htmlFor="customerId" className="block text-sm font-medium text-gray-300 mb-1">
                        ID del Cliente
                    </label>
                    <input
                        type="text"
                        id="customerId"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ingrese el ID del cliente"
                        required
                    />
                </div>
            </div>

            {/* Selección de Método de Pago */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                    Selecciona el Método de Pago
                </h2>
                {metodosPago.length === 0 ? (
                    <p className="text-gray-400 text-lg">No hay métodos de pago disponibles en este momento.</p>
                ) : (
                    <div className="space-y-4">
                        {metodosPago.map((metodo) => (
                            <label
                                key={metodo.id}
                                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${selectedMetodoPagoId === metodo.id
                                    ? 'border-blue-500 bg-blue-900/20 shadow-md'
                                    : 'border-gray-600 bg-gray-700/30 hover:bg-gray-700/50'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={metodo.id}
                                    checked={selectedMetodoPagoId === metodo.id}
                                    onChange={() => setSelectedMetodoPagoId(metodo.id)}
                                    className="form-radio h-5 w-5 text-blue-600 bg-gray-900 border-gray-500 focus:ring-blue-500"
                                />
                                <span className="ml-3 text-lg font-medium text-white">{metodo.nombre}</span>
                                {metodo.tipo === 'Presencial' && (
                                    <span className="ml-2 px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-semibold rounded-full">
                                        Presencial
                                    </span>
                                )}
                            </label>
                        ))}
                    </div>
                )}

                {error && <p className="bg-red-900/30 text-red-300 p-3 rounded-lg mt-6 text-sm">{error}</p>}

                <button
                    onClick={handlePayment}
                    disabled={selectedMetodoPagoId === null || isProcessingPayment || !customerId.trim()}
                    className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                >
                    {isProcessingPayment && <Loader2 className="w-5 h-5 animate-spin" />}
                    {isProcessingPayment ? 'Procesando Venta...' : `Realizar Venta S/ ${funcion.precio.toFixed(2)}`}
                </button>
            </div>
        </div>
    );
};