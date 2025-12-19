// src/components/SecurityForm.tsx
import { useState } from 'react';

export const SecurityForm = () => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const passwordsMatch = passwords.new && passwords.new === passwords.confirm;
  const newPasswordIsStrong = passwords.new.length >= 8;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }
    if (!newPasswordIsStrong) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    // In a real app, send to backend
    console.log('Changing password...');
    setError('');
    setSuccess('¡Contraseña actualizada correctamente!');
    setPasswords({ current: '', new: '', confirm: '' });
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div>
        <label htmlFor="current" className="block text-sm font-medium text-gray-300 mb-1">Contraseña Actual</label>
        <input type="password" name="current" id="current" value={passwords.current} onChange={handleChange} required className="form-input" />
      </div>
      
      <div>
        <label htmlFor="new" className="block text-sm font-medium text-gray-300 mb-1">Nueva Contraseña</label>
        <input type="password" name="new" id="new" value={passwords.new} onChange={handleChange} required className="form-input" />
        {passwords.new && !newPasswordIsStrong && <p className="text-xs text-yellow-400 mt-1">Debe tener al menos 8 caracteres.</p>}
      </div>
      
      <div>
        <label htmlFor="confirm" className="block text-sm font-medium text-gray-300 mb-1">Confirmar Nueva Contraseña</label>
        <input type="password" name="confirm" id="confirm" value={passwords.confirm} onChange={handleChange} required className="form-input" />
        {passwords.confirm && !passwordsMatch && <p className="text-xs text-red-400 mt-1">Las contraseñas no coinciden.</p>}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      
      <div className="flex items-center gap-4">
        <button type="submit" className="btn-primary" disabled={!passwordsMatch || !newPasswordIsStrong}>
          Cambiar Contraseña
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
