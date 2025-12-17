import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Checkout = () => {
    const navigate = useNavigate();

    // Log para confirmar que el componente intenta renderizarse
    console.log("--- Rendering Simplified Checkout Page ---");

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft size={20} /> Volver
                </button>
                <h1 className="text-3xl font-bold mb-4">Página de Checkout</h1>
                <div className="bg-gray-800 p-6 rounded-lg">
                    <p>Si ves este mensaje, el componente de Checkout y la ruta están funcionando.</p>
                    <p className="mt-4 text-yellow-400">El problema de la pantalla en blanco estaba en la carga de datos. Ahora podemos restaurar la lógica de pago paso a paso.</p>
                </div>
            </div>
        </div>
    );
};