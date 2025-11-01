import React from 'react';
import { LogoIcon } from './icons';
import { useTranslations } from '../hooks/useTranslations';

interface LandingHeaderProps {
  onLoginClick: () => void;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({ onLoginClick }) => {
  const { t } = useTranslations();

  const navLinks = [
    { title: t('landingNavFeatures'), href: '#features' },
    { title: t('landingNavPricing'), href: '#pricing' },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-30 py-4 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <LogoIcon className="w-8 h-8 text-blue-400" />
          <h1 className="text-xl font-bold text-white">{t('appName')}</h1>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a key={link.title} href={link.href} className="text-gray-300 hover:text-white transition-colors">
              {link.title}
            </a>
          ))}
        </nav>
        <button
          onClick={onLoginClick}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
        >
          {t('loginButton')}
        </button>
      </div>
    </header>
  );
};

export default LandingHeader;
