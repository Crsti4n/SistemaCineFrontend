import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Film, CreditCard, Ticket, Home } from 'lucide-react';

export const ConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [compraId, setCompraId] = useState<number | null>(null);

    useEffect(() => {
        // Obtener el compraId del state de navegación
        const id = location.state?.compraId;
        if (id) {
            setCompraId(id);
        } else {
            // Si no hay compraId, redirigir al home
            navigate('/');
        }
    }, [location, navigate]);

    if (!compraId) {
        return null;
    }

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="bg-green-600 rounded-full p-6">
                        <CheckCircle className="w-16 h-16 text-white" />
                    </div>
                </div>

                {/* Main Message */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        ¡Compra Exitosa!
                    </h1>
                    <p className="text-xl text-gray-300">
                        Tu pago ha sido procesado correctamente
                    </p>
                </div>

                {/* Confirmation Details */}
                <div className="bg-gray-900 rounded-lg shadow-xl p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-800">
                        <Ticket className="w-6 h-6 text-blue-500" />
                        <div>
                            <p className="text-sm text-gray-400">Número de Compra</p>
                            <p className="text-2xl font-bold text-white">#{compraId}</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-white font-medium">Pago Confirmado</p>
                                <p className="text-sm text-gray-400">
                                    Hemos enviado un correo de confirmación con tus entradas
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Calendar className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-white font-medium">Entradas Digitales</p>
                                <p className="text-sm text-gray-400">
                                    Puedes ver y descargar tus entradas desde tu perfil
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Film className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                            <div>
                                <p className="text-white font-medium">Preparado para la Función</p>
                                <p className="text-sm text-gray-400">
                                    Presenta tu entrada en la sala antes de que inicie la película
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Important Info */}
                    <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
                        <p className="text-sm text-blue-300">
                            <strong>Importante:</strong> Llega al menos 15 minutos antes del inicio de la función.
                            Puedes acceder a tus entradas desde el menú "Mis Entradas" en tu perfil.
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/mis-entradas"
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
                    >
                        <Ticket className="w-5 h-5" />
                        Ver Mis Entradas
                    </Link>
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg transition-colors font-medium"
                    >
                        <Home className="w-5 h-5" />
                        Volver al Inicio
                    </Link>
                </div>

                {/* Additional Info */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-400">
                        ¿Tienes algún problema? <Link to="/configuracion" className="text-blue-500 hover:text-blue-400">Contáctanos</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
