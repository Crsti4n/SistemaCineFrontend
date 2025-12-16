import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Pelicula, Genero, Clasificacion } from '../types';

interface MovieFormProps {
    onSubmit: (data: any) => Promise<void>;
    initialData: Pelicula | null;
    onClose: () => void;
    generos: Genero[];
    clasificaciones: Clasificacion[];
}

export const MovieForm = ({ onSubmit, initialData, onClose, generos, clasificaciones }: MovieFormProps) => {
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        imagenUrl: '',
        generoId: '',
        clasificacionId: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                titulo: initialData.titulo,
                descripcion: initialData.descripcion || '',
                imagenUrl: initialData.imagenUrl,
                generoId: initialData.genero?.id?.toString() || '',
                clasificacionId: initialData.clasificacion?.id?.toString() || ''
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({
            ...formData,
            generoId: Number(formData.generoId),
            clasificacionId: Number(formData.clasificacionId)
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">
                        {initialData ? 'Editar Película' : 'Nueva Película'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.titulo}
                            onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
                        <textarea
                            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            value={formData.descripcion}
                            onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">URL de Imagen</label>
                        <input
                            type="url"
                            required
                            className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.imagenUrl}
                            onChange={e => setFormData({ ...formData, imagenUrl: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Género</label>
                            <select
                                required
                                className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.generoId}
                                onChange={e => setFormData({ ...formData, generoId: e.target.value })}
                            >
                                <option value="">Seleccionar</option>
                                {generos.map(g => (
                                    <option key={g.id} value={g.id}>{g.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Clasificación</label>
                            <select
                                required
                                className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.clasificacionId}
                                onChange={e => setFormData({ ...formData, clasificacionId: e.target.value })}
                            >
                                <option value="">Seleccionar</option>
                                {clasificaciones.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                        </div>
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