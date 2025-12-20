import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { metodoPagoService, comprasService, reservasService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { getOrCreateSessionId } from '../utils/session';
import type { MetodoPago, Funcion, Butaca, ReservaResponse } from '../types';
import { CreditCard, Loader2, Ticket, AlertTriangle } from 'lucide-react';
import { SeatSelector } from '../components/SeatSelector';
import { CountdownTimer } from '../components/CountdownTimer';

export const CheckoutPage = () => {
    const { user, isAuthenticated, isEmployee } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { funcion: Funcion } | null;
    const funcion = state?.funcion;

    const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMetodoPagoId, setSelectedMetodoPagoId] = useState<number | null>(null);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Estados para selección de asientos
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [selectedSeats, setSelectedSeats] = useState<Butaca[]>([]);
    const [currentStep, setCurrentStep] = useState<'quantity' | 'seats' | 'payment'>('quantity');

    // Estados para sistema de reservas
    const [reserva, setReserva] = useState<ReservaResponse | null>(null);
    const [isBlocking, setIsBlocking] = useState(false);

    const getUserId = () => {
        if (user?.id) return user.id;
        if (user?.token) {
            try {
                const payload = JSON.parse(atob(user.token.split('.')[1]));
                return payload.nameid ? Number(payload.nameid) : undefined;
            } catch (e) {
                console.error("Error al decodificar token", e);
            }
        }
        return undefined;
    };

    const userId = getUserId();

    useEffect(() => {
        if (!isAuthenticated || isEmployee) {
            navigate('/login');
            return;
        }

        const loadMetodosPago = async () => {
            try {
                setLoading(true);
                const allMetodos = await metodoPagoService.getAll();
                const onlineMetodos = allMetodos.filter(metodo => metodo.tipo === 'Online');
                setMetodosPago(onlineMetodos);
                if (onlineMetodos.length > 0) {
                    setSelectedMetodoPagoId(onlineMetodos[0].id);
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

    const handleContinueToSeats = () => {
        if (ticketQuantity < 1 || ticketQuantity > 10) {
            setError('Por favor, selecciona entre 1 y 10 entradas.');
            return;
        }
        setError('');
        setCurrentStep('seats');
    };

    const handleContinueToPayment = async () => {
        if (selectedSeats.length !== ticketQuantity) {
            setError(`Debes seleccionar ${ticketQuantity} asiento(s)`);
            return;
        }

        if (!funcion) {
            setError('No se encontró información de la función');
            return;
        }

        try {
            setIsBlocking(true);
            setError('');

            // Bloquear asientos
            const butacaIds = selectedSeats.map(s => s.id);
            const sessionId = getOrCreateSessionId();

            const reservaResponse = await reservasService.bloquear({
                funcionId: funcion.id,
                butacaIds,
                usuarioId: userId,
                sessionId,
            });

            console.log('✅ Asientos bloqueados:', reservaResponse);
            setReserva(reservaResponse);
            setCurrentStep('payment');
        } catch (err: any) {
            console.error('❌ Error al bloquear asientos:', err);
            const errorMsg = err.response?.data?.mensaje || 'Error al bloquear los asientos. Por favor, intenta de nuevo.';
            setError(errorMsg);
        } finally {
            setIsBlocking(false);
        }
    };

    const handleReservaExpired = () => {
        setError('Tu reserva ha expirado. Por favor, selecciona tus asientos nuevamente.');
        setReserva(null);
        setCurrentStep('seats');
    };

    const handlePayment = async () => {
        if (selectedMetodoPagoId === null) {
            setError('Por favor, selecciona un método de pago antes de continuar.');
            return;
        }

        if (selectedSeats.length === 0) {
            setError('Error: No has seleccionado ningún asiento.');
            return;
        }

        if (!funcion) {
            setError('Error: No se encontró la información de la función.');
            return;
        }

        setIsProcessingPayment(true);
        setError('');

        try {
            const butacaIds = selectedSeats.map(s => s.id);

            // NUEVO FORMATO según backend
            const compraData = {
                metodoPagoId: selectedMetodoPagoId,
                reservaId: reserva?.reservaId, // Incluir reservaId si existe
                detalles: [
                    {
                        funcionId: funcion.id,
                        cantidad: selectedSeats.length,
                        precioUnitario: funcion.precio,
                        butacaIds,
                    },
                ],
            };

            console.log('📤 Enviando compra:', compraData);
            const nuevaCompra = await comprasService.create(compraData);
            console.log('✅ Compra creada:', nuevaCompra);

            navigate('/confirmation', {
                state: {
                    compraId: nuevaCompra.id,
                    asientos: selectedSeats.map(s => s.identificador).join(', '),
                    total: funcion.precio * selectedSeats.length,
                },
            });
        } catch (err: any) {
            console.error('❌ Error al procesar pago:', err);
            const errorMsg = err.response?.data?.mensaje || 'Error al procesar el pago. Inténtalo de nuevo.';
            setError(errorMsg);
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

    if (!funcion) {
        return <div className="text-center text-red-500 py-10">No se ha proporcionado información de la función para la compra.</div>;
    }

    return (
        <div className="container mx-auto p-8 bg-gray-900 text-white rounded-lg shadow-xl max-w-4xl mt-10">
            <h1 className="text-3xl font-bold mb-6 text-center">Finalizar Compra</h1>

            {/* Indicador de pasos */}
            <div className="flex justify-center items-center gap-4 mb-8">
                <div className={`flex items-center gap-2 ${currentStep === 'quantity' ? 'text-blue-400' : 'text-gray-500'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'quantity' ? 'bg-blue-600' : 'bg-gray-700'}`}>1</div>
                    <span className="hidden sm:inline">Cantidad</span>
                </div>
                <div className="h-0.5 w-12 bg-gray-700"></div>
                <div className={`flex items-center gap-2 ${currentStep === 'seats' ? 'text-blue-400' : 'text-gray-500'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'seats' ? 'bg-blue-600' : 'bg-gray-700'}`}>2</div>
                    <span className="hidden sm:inline">Asientos</span>
                </div>
                <div className="h-0.5 w-12 bg-gray-700"></div>
                <div className={`flex items-center gap-2 ${currentStep === 'payment' ? 'text-blue-400' : 'text-gray-500'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'payment' ? 'bg-blue-600' : 'bg-gray-700'}`}>3</div>
                    <span className="hidden sm:inline">Pago</span>
                </div>
            </div>

            {/* Resumen fijo */}
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6">
                <h2 className="text-2xl font-semibold mb-4">Resumen</h2>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-300">Película:</span>
                        <span className="text-white font-medium">{funcion.pelicula?.titulo || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">Fecha y Hora:</span>
                        <span className="text-white font-medium">{new Date(funcion.fechaHora).toLocaleString('es-ES')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">Sala:</span>
                        <span className="text-white font-medium">{funcion.sala.nombre}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-300">Entradas:</span>
                        <span className="text-white font-medium">{ticketQuantity}</span>
                    </div>
                    {selectedSeats.length > 0 && (
                        <div className="flex justify-between">
                            <span className="text-gray-300">Asientos:</span>
                            <span className="text-white font-medium">{selectedSeats.map(s => s.identificador).join(', ')}</span>
                        </div>
                    )}
                    <div className="flex justify-between pt-3 border-t border-gray-700">
                        <span className="text-gray-300">Total:</span>
                        <span className="text-green-400 font-bold text-2xl">S/ {(funcion.precio * ticketQuantity).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Paso 1: Cantidad de entradas */}
            {currentStep === 'quantity' && (
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                        <Ticket className="w-6 h-6 text-blue-400" />
                        ¿Cuántas entradas deseas?
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Cantidad de entradas (1-10)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={ticketQuantity}
                                onChange={(e) => setTicketQuantity(Number(e.target.value))}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        {error && <p className="text-red-300 text-sm">{error}</p>}
                        <button
                            onClick={handleContinueToSeats}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-lg transition-all"
                        >
                            Continuar a Selección de Asientos
                        </button>
                    </div>
                </div>
            )}

            {/* Paso 2: Selección de asientos */}
            {currentStep === 'seats' && (
                <div className="space-y-4">
                    <SeatSelector
                        funcionId={funcion.id}
                        salaId={funcion.salaId}
                        maxSeats={ticketQuantity}
                        selectedSeats={selectedSeats}
                        onSeatsChange={setSelectedSeats}
                    />
                    {error && <p className="bg-red-900/30 text-red-300 p-3 rounded-lg">{error}</p>}
                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                setCurrentStep('quantity');
                                setSelectedSeats([]);
                            }}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-all"
                        >
                            Volver
                        </button>
                        <button
                            onClick={handleContinueToPayment}
                            disabled={selectedSeats.length !== ticketQuantity || isBlocking}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isBlocking && <Loader2 className="w-5 h-5 animate-spin" />}
                            {isBlocking ? 'Bloqueando asientos...' : 'Continuar al Pago'}
                        </button>
                    </div>
                </div>
            )}

            {/* Paso 3: Pago */}
            {currentStep === 'payment' && (
                <div className="space-y-6">
                    {/* Temporizador de reserva */}
                    {reserva && (
                        <CountdownTimer
                            expiraEn={reserva.expiraEn}
                            onExpire={handleReservaExpired}
                        />
                    )}

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
                                            className="form-radio h-5 w-5 text-blue-600"
                                        />
                                        <span className="ml-3 text-lg font-medium text-white">{metodo.nombre}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {error && <p className="bg-red-900/30 text-red-300 p-3 rounded-lg mt-6 text-sm">{error}</p>}

                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => {
                                    setCurrentStep('seats');
                                    setReserva(null);
                                }}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold transition-all"
                            >
                                Volver
                            </button>
                            <button
                                onClick={handlePayment}
                                disabled={selectedMetodoPagoId === null || isProcessingPayment}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessingPayment && <Loader2 className="w-5 h-5 animate-spin" />}
                                {isProcessingPayment ? 'Procesando...' : `Pagar S/ ${(funcion.precio * ticketQuantity).toFixed(2)}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
