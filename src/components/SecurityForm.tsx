import { useState } from 'react';
import { profileService } from '../api/services';
import type { UpdatePasswordRequest } from '../types';
import { Loader2 } from 'lucide-react';

export const SecurityForm = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const passwordsMatch = passwords.newPassword && passwords.newPassword === passwords.confirmPassword;
  const newPasswordIsStrong = passwords.newPassword.length >= 8;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }
    if (!newPasswordIsStrong) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      const request: UpdatePasswordRequest = {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword,
      };
      await profileService.updatePassword(request);
      setSuccess('¡Contraseña actualizada correctamente!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cambiar la contraseña.');
      console.error('Failed to change password:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">Contraseña Actual</label>
        <input type="password" name="currentPassword" id="currentPassword" value={passwords.currentPassword} onChange={handleChange} required className="form-input" />
      </div>
      
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">Nueva Contraseña</label>
        <input type="password" name="newPassword" id="newPassword" value={passwords.newPassword} onChange={handleChange} required className="form-input" />
        {passwords.newPassword && !newPasswordIsStrong && <p className="text-xs text-yellow-400 mt-1">Debe tener al menos 8 caracteres.</p>}
      </div>
      
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirmar Nueva Contraseña</label>
        <input type="password" name="confirmPassword" id="confirmPassword" value={passwords.confirmPassword} onChange={handleChange} required className="form-input" />
        {passwords.confirmPassword && !passwordsMatch && <p className="text-xs text-red-400 mt-1">Las contraseñas no coinciden.</p>}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      
      <div className="flex items-center gap-4">
        <button type="submit" className="btn-primary w-40" disabled={!passwordsMatch || !newPasswordIsStrong || isSubmitting}>
           {isSubmitting ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : 'Cambiar Contraseña'}
        </button>
        {success && <span className="text-green-400 text-sm">{success}</span>}
      </div>

      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-lg font-semibold text-white">Sesiones Activas</h3>
        <p className="text-sm text-gray-400 mt-1 mb-4">Como medida de seguridad, puedes cerrar sesión en todos los demás dispositivos.</p>
        <button type="button" className="btn-secondary">
          Cerrar sesión en otros dispositivos
        </button>
      </div>
    </form>
  );
};
