import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { metodoPagoService, comprasService } from '../api/services'; // Revert: Eliminar authService
import { useAuth } from '../context/AuthContext'; // Importar useAuth
import type { MetodoPago, CompraRequest, Funcion } from '../types'; // Removed User from types, as it's not directly used here
import { CreditCard, Loader2 } from 'lucide-react';
import { Toast } from '../components/Toast'; // Added Toast import

export const CheckoutPage = () => {
    const { user, isAuthenticated, isEmployee } = useAuth(); // Obtener datos del usuario autenticado
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { funcion: Funcion } | null; // Obtener el estado de forma segura
    const funcion = state?.funcion; // Obtener la función si existe, sino será undefined

    const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMetodoPagoId, setSelectedMetodoPagoId] = useState<number | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // --- Datos de la compra ---
    // En una aplicación real, el userId debería obtenerse del contexto de autenticación.
    // El totalCompra se obtiene de la función pasada.

    // Función para extraer el ID del token JWT si no está presente en el objeto user
    const getUserId = () => {
        if (user?.id) return user.id;
        if (user?.token) {
            try {
                const payload = JSON.parse(atob(user.token.split('.')[1]));
                return payload.nameid ? Number(payload.nameid) : undefined;
            } catch (e) { console.error("Error al decodificar token", e); }
        }
        return undefined;
    };
    const userId = getUserId();
    const totalCompra = funcion ? funcion.precio : 0;

    useEffect(() => {
        // Revert: Restaurar lógica original de redirección y carga de métodos de pago
        if (!isAuthenticated || isEmployee) {
            navigate('/login'); // O a una página de error/inicio
            return;
        }

        const loadMetodosPago = async () => {
            try {
                setLoading(true);
                const data = await metodoPagoService.getAll();
                setMetodosPago(data);
                // Seleccionar el primer método por defecto si existe
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

        loadMetodosPago(); // Revert: Cargar métodos de pago
    }, [funcion, isAuthenticated, isEmployee, navigate]); // Revert: Dependencias originales

    const handlePayment = async () => {
        if (selectedMetodoPagoId === null) {
            setError('Por favor, selecciona un método de pago antes de continuar.');
            return;
        }

        // Debug para ver qué está fallando en la consola
        console.log('Intento de pago:', { funcion, user, userId, selectedMetodoPagoId });

        if (!funcion) {
            setError('Error: No se encontró la información de la función.');
            return;
        }

        if (!userId) {
            setError('Error: No se pudo identificar al usuario. Por favor, recarga la página o inicia sesión nuevamente.');
            return;
        }

        setIsProcessingPayment(true);
        setError(''); // Limpiar errores previos

        try {
            // Construir el objeto de solicitud de compra
            const compraData: CompraRequest = {
                usuarioId: userId, // Revert: userId fijo
                metodoPagoId: selectedMetodoPagoId,
                total: funcion.precio,
                // Aquí podrías añadir otros detalles de la compra como una lista de DetalleCompraRequest
                // Por ejemplo: detalles: [{ funcionId: 1, cantidad: 2, precioUnitario: 75.37 }]
            };

            const nuevaCompra = await comprasService.create(compraData);
            // Asumiendo 1 ticket para simplificar, ajustar según la lógica de tu carrito
            await comprasService.createDetalle({
                compraId: nuevaCompra.id,
                funcionId: funcion.id,
                cantidad: 1,
                precioUnitario: funcion.precio,
            });

            alert(`¡Compra realizada con éxito! ID de compra: ${nuevaCompra.id}`);
            // Redirigir al usuario a una página de confirmación o a su historial de compras
            navigate('/confirmation', { state: { compraId: nuevaCompra.id } });
        } catch (err) {
            setError('Error al procesar el pago. Inténtalo de nuevo.');
            console.error('Error processing payment:', err);
        } finally {
            setIsProcessingPayment(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <p className="ml-3 text-lg">Cargando opciones de pago...</p>
            </div>
        );
    }

    // Si no hay función, mostrar un mensaje de error
    if (!funcion) {
        return <div className="text-center text-red-500 py-10">No se ha proporcionado información de la función para la compra.</div>;
    }

    return (
        <div className="container mx-auto p-8 bg-gray-900 text-white rounded-lg shadow-xl max-w-2xl mt-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Finalizar Compra</h1>

            {/* Resumen de la Compra */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Resumen de tu Pedido</h2>
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

            {/* Selección de Método de Pago */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-white">
                    <CreditCard className="w-6 h-6 text-blue-400" />
                    Selecciona tu Método de Pago
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
                            </label>
                        ))}
                    </div>
                )}

                {error && <p className="bg-red-900/30 text-red-300 p-3 rounded-lg mt-6 text-sm">{error}</p>}

                <button
                    onClick={handlePayment}
                    disabled={selectedMetodoPagoId === null || isProcessingPayment}
                    className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                >
                    {isProcessingPayment && <Loader2 className="w-5 h-5 animate-spin" />}
                    {isProcessingPayment ? 'Procesando Pago...' : `Pagar S/ ${funcion.precio.toFixed(2)}`}
                </button>
            </div>
        </div>
    );
};