import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { MetodoPago } from '../types';

interface MetodoPagoFormProps {
    onSubmit: (data: any) => Promise<void>;
    initialData: MetodoPago | null;
    onClose: () => void;
}

export const MetodoPagoForm = ({ onSubmit, initialData, onClose }: MetodoPagoFormProps) => {
    const [formData, setFormData] = useState({
        nombre: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-sm">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.nombre}
                            onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};