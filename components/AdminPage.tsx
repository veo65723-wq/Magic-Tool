import React, { useState } from 'react';
import Card from './Card';
import { useUserSubscription } from '../contexts/UserSubscriptionContext';
import { useFeatures } from '../contexts/FeaturesContext';
import { useTranslations } from '../hooks/useTranslations';
import { ShieldCheckIcon, SpinnerIcon } from './icons';
import { db } from '../firebase';
import { doc, updateDoc, addDoc, collection } from 'firebase/firestore';

const ToggleSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean; }> = ({ checked, onChange, disabled }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" disabled={disabled} />
    <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
  </label>
);

const AdminPage: React.FC = () => {
  const { t } = useTranslations();
  const { isAdmin, isLoading: userLoading } = useUserSubscription();
  const { features, loading: featuresLoading } = useFeatures();
  const [newFeatureName, setNewFeatureName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleToggleFeature = async (id: string, currentStatus: boolean) => {
    const featureRef = doc(db, 'features', id);
    try {
      await updateDoc(featureRef, { enabled: !currentStatus });
    } catch (error) {
      console.error("Error updating feature:", error);
    }
  };

  const handleAddFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureName.trim()) return;
    setIsAdding(true);
    try {
      await addDoc(collection(db, 'features'), {
        name: newFeatureName.trim(),
        enabled: true
      });
      setNewFeatureName('');
    } catch (error) {
      console.error("Error adding feature:", error);
    } finally {
      setIsAdding(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <SpinnerIcon className="w-10 h-10 text-blue-400" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Card className="text-center py-16">
        <ShieldCheckIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">{t('accessDenied')}</h2>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white flex items-center gap-3">
        <ShieldCheckIcon className="w-8 h-8 text-blue-400" />
        <span>{t('adminPanelTitle')}</span>
      </h1>

      <Card title={t('manageFeatures')}>
        {featuresLoading ? (
          <SpinnerIcon className="w-8 h-8 text-blue-400 mx-auto" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3">{t('featureName')}</th>
                  <th scope="col" className="px-6 py-3">{t('status')}</th>
                  <th scope="col" className="px-6 py-3 text-center">Enable/Disable</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr key={feature.id} className="border-b border-slate-700 hover:bg-slate-700/40">
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{feature.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${feature.enabled ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {feature.enabled ? t('enabled') : t('disabled')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <ToggleSwitch checked={feature.enabled} onChange={() => handleToggleFeature(feature.id, feature.enabled)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title={t('addNewFeature')}>
        <form onSubmit={handleAddFeature} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newFeatureName}
            onChange={(e) => setNewFeatureName(e.target.value)}
            placeholder={t('newFeatureNamePlaceholder')}
            className="flex-grow bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300"
            disabled={isAdding}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg transition duration-300 flex items-center justify-center disabled:bg-slate-600"
            disabled={isAdding || !newFeatureName.trim()}
          >
            {isAdding ? <SpinnerIcon className="w-5 h-5" /> : t('addFeatureButton')}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default AdminPage;
