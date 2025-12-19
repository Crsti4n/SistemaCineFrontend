import { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Shield, Loader2, Phone, Image } from 'lucide-react';
import type { AdminUsuarioCompleto, CreateAdminUserRequest } from '../types';

interface SuperUserFormProps {
    onSubmit: (userData: Partial<CreateAdminUserRequest>) => void;
    initialData: AdminUsuarioCompleto | null;
    onClose: () => void;
}

// Roles permitidos para SuperUsuario (solo Admin y Empleado)
const ALLOWED_ROLES = [
    { id: 1, nombre: 'Admin' },
    { id: 3, nombre: 'Empleado' },
];

export const SuperUserForm = ({ onSubmit, initialData, onClose }: SuperUserFormProps) => {
    const [formData, setFormData] = useState({
        nombre: initialData?.nombre || '',
        apellido: initialData?.apellido || '',
        email: initialData?.email || '',
        password: '',
        celular: initialData?.celular || '',
        avatarUrl: initialData?.avatarUrl || '',
        rolId: initialData?.rolId || 1,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                nombre: initialData.nombre,
                apellido: initialData.apellido,
                email: initialData.email,
                password: '',
                celular: initialData.celular || '',
                avatarUrl: initialData.avatarUrl || '',
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

        // Validar que el rol sea Admin o Empleado
        if (formData.rolId !== 1 && formData.rolId !== 3) {
            setError('Solo puedes crear usuarios Admin o Empleado');
            return;
        }

        try {
            setLoading(true);

            // Preparar datos para enviar
            const dataToSubmit: Partial<CreateAdminUserRequest> = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                celular: formData.celular || null,
                avatarUrl: formData.avatarUrl || null,
                rolId: formData.rolId,
            };

            // Solo incluir password si no está vacío
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
            <div className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {initialData ? 'Editar Usuario' : 'Nuevo Usuario'}
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">Panel de SuperUsuario</p>
                    </div>
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

                    {/* Nombre y Apellido en fila */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                    placeholder="Juan"
                                />
                            </div>
                        </div>

                        {/* Apellido */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Apellido <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                    placeholder="Pérez"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email <span className="text-red-500">*</span>
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
                                placeholder="usuario@cineunas.com"
                            />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Contraseña {initialData && <span className="text-gray-500">(dejar en blanco para no cambiar)</span>}
                            {!initialData && <span className="text-red-500">*</span>}
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

                    {/* Celular y Rol en fila */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Celular (opcional) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Celular <span className="text-gray-500">(opcional)</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="tel"
                                    name="celular"
                                    value={formData.celular}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                    placeholder="+51 999 999 999"
                                />
                            </div>
                        </div>

                        {/* Rol */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Rol del Usuario <span className="text-red-500">*</span>
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
                                    {ALLOWED_ROLES.map((rol) => (
                                        <option key={rol.id} value={rol.id}>
                                            {rol.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Avatar URL (opcional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            URL del Avatar <span className="text-gray-500">(opcional)</span>
                        </label>
                        <div className="relative">
                            <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="url"
                                name="avatarUrl"
                                value={formData.avatarUrl}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
                                placeholder="https://ejemplo.com/avatar.jpg"
                            />
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-4">
                        <p className="text-blue-400 text-sm">
                            <strong>Nota:</strong> Como SuperUsuario, solo puedes crear y gestionar usuarios con rol <strong>Admin</strong> o <strong>Empleado</strong>.
                        </p>
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
                            className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>{initialData ? 'Actualizar Usuario' : 'Crear Usuario'}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
