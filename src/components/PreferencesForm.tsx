// src/components/PreferencesForm.tsx
import { useState, useEffect } from 'react';
import { allMovieGenres } from '../data/mocks';
import type { UserPreferences } from '../types';

// A reusable Switch component for the toggles
const Switch = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (checked: boolean) => void }) => (
  <label className="flex items-center justify-between cursor-pointer bg-gray-800 p-4 rounded-lg">
    <span className="text-white font-medium">{label}</span>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className={`block w-14 h-8 rounded-full transition ${checked ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
    </div>
  </label>
);

interface PreferencesFormProps {
  initialData: UserPreferences;
}

export const PreferencesForm = ({ initialData }: PreferencesFormProps) => {
  const [prefs, setPrefs] = useState<UserPreferences>(initialData);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPrefs(initialData);
  }, [initialData]);
  
  const handleToggleChange = (key: keyof Pick<UserPreferences, 'receivePremiereEmails' | 'receiveOfferAlerts'>, value: boolean) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
  };

  const handleGenreClick = (genre: string) => {
    setPrefs(prev => {
      const newGenres = prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter(g => g !== genre)
        : [...prev.favoriteGenres, genre];
      return { ...prev, favoriteGenres: newGenres };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving preferences:', prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-lg">
      {/* Notifications Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Notificaciones</h3>
        <div className="space-y-4">
          <Switch 
            label="Recibir correos de estrenos" 
            checked={prefs.receivePremiereEmails}
            onChange={(value) => handleToggleChange('receivePremiereEmails', value)}
          />
          <Switch 
            label="Alertas de ofertas en confitería" 
            checked={prefs.receiveOfferAlerts}
            onChange={(value) => handleToggleChange('receiveOfferAlerts', value)}
          />
        </div>
      </div>
      
      {/* Favorite Genres Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Mis Géneros Favoritos</h3>
        <p className="text-sm text-gray-400 mb-4">Selecciona tus géneros para recibir recomendaciones personalizadas.</p>
        <div className="flex flex-wrap gap-3">
          {allMovieGenres.map(genre => {
            const isSelected = prefs.favoriteGenres.includes(genre);
            return (
              <button
                type="button"
                key={genre}
                onClick={() => handleGenreClick(genre)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                  isSelected 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 border-t border-gray-700 pt-6">
        <button type="submit" className="btn-primary">
          Guardar Preferencias
        </button>
        {saved && <span className="text-green-400 text-sm">¡Preferencias guardadas!</span>}
      </div>
    </form>
  );
};
