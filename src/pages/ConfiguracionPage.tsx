import { Tabs } from '../components/Tabs';
import { ProfileForm } from '../components/ProfileForm';
import { SecurityForm } from '../components/SecurityForm';
import { PreferencesForm } from '../components/PreferencesForm';

const ConfiguracionPage = () => {
  const settingsTabs = [
    {
      label: 'Mi Perfil',
      content: <ProfileForm initialData={null} />,
    },
    {
      label: 'Seguridad',
      content: <SecurityForm />,
    },
    {
      label: 'Preferencias',
      content: <PreferencesForm initialData={{ receivePremiereEmails: false, receiveOfferAlerts: false, favoriteGenres: [] }} />,
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-2">Configuración</h1>
      <p className="text-gray-400 mb-8">Gestiona tus datos personales, seguridad y preferencias de notificación.</p>
      <Tabs tabs={settingsTabs} />
    </div>
  );
};

export default ConfiguracionPage;
