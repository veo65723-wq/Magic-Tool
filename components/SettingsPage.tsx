import React, { useState } from 'react';
import Card from './Card';
import { UserIcon, EmailIcon, LockIcon } from './icons';
import type { User } from 'firebase/auth';
import { useTranslations } from '../hooks/useTranslations';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsPageProps {
  user: User;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user }) => {
  const { t } = useTranslations();
  const { language, setLanguage } = useLanguage();
  const [fullName, setFullName] = useState(user.displayName || '');
  const [email, setEmail] = useState(user.email || '');

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white">{t('settingsTitle')}</h1>

      <Card title={t('profileCardTitle')}>
        <div className="flex items-center space-x-6 space-x-reverse">
          <img
            src={user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user.displayName || user.email}`}
            alt="User Avatar"
            className="w-20 h-20 rounded-full border-2 border-blue-400 bg-slate-700"
          />
          <div>
            <h2 className="text-2xl font-bold text-white">{user.displayName}</h2>
            <p className="text-gray-400">{user.email}</p>
            <button className="mt-2 text-sm text-blue-400 hover:underline">{t('changeAvatar')}</button>
          </div>
        </div>
      </Card>

      <Card title={t('accountManagementCardTitle')}>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-300">{t('fullNameLabel')}</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-400">
                    <UserIcon className="w-5 h-5" />
                </div>
                <input type="text" id="fullName" className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 rounded-lg p-3 ps-12 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300" value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">{t('emailLabel')}</label>
             <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-400">
                    <EmailIcon className="w-5 h-5" />
                </div>
                <input type="email" id="email" className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 rounded-lg p-3 ps-12 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
              {t('saveChangesButton')}
            </button>
          </div>
        </form>
      </Card>

      <Card title={t('languageCardTitle')}>
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={() => setLanguage('ar')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              language === 'ar'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700/50 hover:bg-slate-600 text-gray-300'
            }`}
          >
            {t('languageArabic')}
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${
              language === 'en'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700/50 hover:bg-slate-600 text-gray-300'
            }`}
          >
            {t('languageEnglish')}
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-400">
          {t('languageChangeDisclaimer')}
        </p>
      </Card>
      
      <Card title={t('changePasswordCardTitle')}>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
           <div>
            <label htmlFor="currentPassword" className="block mb-2 text-sm font-medium text-gray-300">{t('currentPasswordLabel')}</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-400">
                    <LockIcon className="w-5 h-5" />
                </div>
                <input type="password" id="currentPassword" placeholder="••••••••" className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 rounded-lg p-3 ps-12 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300" />
            </div>
          </div>
          <div>
            <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-300">{t('newPasswordLabel')}</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-400">
                    <LockIcon className="w-5 h-5" />
                </div>
                <input type="password" id="newPassword" placeholder="••••••••" className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 rounded-lg p-3 ps-12 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300" />
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
              {t('updatePasswordButton')}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SettingsPage;