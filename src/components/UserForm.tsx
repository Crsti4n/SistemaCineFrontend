import { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Shield, Loader2 } from 'lucide-react';
import type { UsuarioCompleto, CreateUserRequest } from '../types';

interface UserFormProps {
    onSubmit: (userData: Partial<CreateUserRequest>) => void;
    initialData: UsuarioCompleto | null;
    onClose: () => void;
}

// Roles disponibles (hardcoded según backend)
const ROLES = [
    { id: 1, nombre: 'Admin' },
    { id: 2, nombre: 'Cliente' },
    { id: 3, nombre: 'Empleado' },
    { id: 4, nombre: 'SuperUsuario' },
];

export const UserForm = ({ onSubmit, initialData, onClose }: UserFormProps) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: initialData?.email || '',
        password: '',
        rolId: initialData?.rolId || 3,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            // Dividir nombreCompleto en nombre y apellido
            const [nombre, ...apellidoArray] = (initialData.nombreCompleto || '').split(' ');
            const apellido = apellidoArray.join(' ') || '';

            setFormData({
                nombre,
                apellido,
                email: initialData.email,
                password: '',
                rolId: initialData.rolId,
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (!formData.nombre.trim()) {
            setError('El nombre es requerido');
            return;
        }

        if (!formData.apellido.trim()) {
            setError('El apellido es requerido');
            return;
        }

        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Email inválido');
            return;
        }

        // Si es creación, password es obligatorio
        if (!initialData && !formData.password) {
            setError('La contraseña es requerida');
            return;
        }

        // Si hay password, validar longitud
        if (formData.password && formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            setLoading(true);

            // Si es edición y no hay password, no enviarlo
            const dataToSubmit: Partial<CreateUserRequest> = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                rolId: formData.rolId,
            };

            if (formData.password) {
                dataToSubmit.password = formData.password;
            }

            await onSubmit(dataToSubmit);
            onClose();
        } catch (err) {
            setError('Error al guardar el usuario');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <h2 className="text-2xl font-bold text-white">
                        {initialData ? 'Editar Usuario' : 'Nuevo Usuario'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Nombre
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                                maxLength={50}
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                placeholder="Juan"
                            />
                        </div>
                    </div>

                    {/* Apellido */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Apellido
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                required
                                maxLength={50}
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                placeholder="Pérez"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                placeholder="usuario@example.com"
                            />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Contraseña {initialData && <span className="text-gray-500">(dejar en blanco para no cambiar)</span>}
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required={!initialData}
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Rol */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Rol del Usuario
                        </label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                name="rolId"
                                value={formData.rolId}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer"
                            >
                                {ROLES.map((rol) => (
                                    <option key={rol.id} value={rol.id}>
                                        {rol.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>{initialData ? 'Actualizar' : 'Crear Usuario'}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
