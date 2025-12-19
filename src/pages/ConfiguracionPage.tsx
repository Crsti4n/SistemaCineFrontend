import { useState, useEffect } from 'react';
import { Tabs } from '../components/Tabs';
import { ProfileForm } from '../components/ProfileForm';
import { SecurityForm } from '../components/SecurityForm';
import { PreferencesForm } from '../components/PreferencesForm';
import { profileService } from '../api/services';
import type { UserProfile } from '../types';
import { Loader2, AlertTriangle } from 'lucide-react';

const ConfiguracionPage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await profileService.getProfile();
        setProfile(data);
      } catch (err) {
        setError('No se pudo cargar tu perfil. Por favor, intenta de nuevo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center gap-3 py-10">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-gray-400">Cargando tu perfil...</span>
        </div>
      );
    }
    
    if (error || !profile) {
      return (
        <div className="text-center py-16 px-6 bg-red-900/20 border border-red-500/30 rounded-lg flex flex-col items-center">
          <AlertTriangle className="w-20 h-20 text-red-500 mb-6" strokeWidth={1} />
          <h2 className="text-2xl font-bold text-white mb-2">¡Ups! Algo salió mal</h2>
          <p className="text-red-300">{error || 'No se encontró el perfil.'}</p>
        </div>
      );
    }

    const settingsTabs = [
      {
        label: 'Mi Perfil',
        content: <ProfileForm initialData={profile} />,
      },
      {
        label: 'Seguridad',
        content: <SecurityForm />,
      },
      {
        label: 'Preferencias',
        content: <PreferencesForm initialData={profile.preferences} />,
      },
    ];
    
    return <Tabs tabs={settingsTabs} />;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Configuración</h1>
      <p className="text-gray-400 mb-8">Gestiona tus datos personales, seguridad y preferencias de notificación.</p>
      {renderContent()}
    </div>
  );
};

export default ConfiguracionPage;
