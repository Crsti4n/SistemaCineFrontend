// src/components/ProfileForm.tsx
import { useState, useEffect } from 'react';
import type { UserProfile } from '../types';
import { Edit2 } from 'lucide-react';

interface ProfileFormProps {
  initialData: UserProfile;
}

export const ProfileForm = ({ initialData }: ProfileFormProps) => {
  const [profile, setProfile] = useState<UserProfile>(initialData);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value } as UserProfile));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to the backend
    console.log('Saving profile:', profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <img 
            src={profile.posterUrl || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=3b82f6&color=fff`} 
            alt="Avatar" 
            className="w-24 h-24 rounded-full object-cover"
          />
          <button type="button" className="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full hover:bg-gray-600">
            <Edit2 className="w-4 h-4 text-white" />
          </button>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Tu Avatar</h3>
          <p className="text-sm text-gray-400">Haz clic en el lápiz para cambiarlo.</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
          <input type="text" name="firstName" id="firstName" value={profile.firstName} onChange={handleChange} className="form-input" />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">Apellido</label>
          <input type="text" name="lastName" id="lastName" value={profile.lastName} onChange={handleChange} className="form-input" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Celular</label>
          <input type="tel" name="phone" id="phone" value={profile.phone} onChange={handleChange} className="form-input" />
        </div>
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-300 mb-1">Fecha de Nacimiento</label>
          <input type="date" name="birthDate" id="birthDate" value={profile.birthDate} onChange={handleChange} className="form-input" />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input type="email" name="email" id="email" value={profile.email} disabled className="form-input bg-gray-700/50 cursor-not-allowed" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button type="submit" className="btn-primary">
          Guardar Cambios
        </button>
        {saved && <span className="text-green-400 text-sm">¡Perfil guardado correctamente!</span>}
      </div>
    </form>
  );
};
