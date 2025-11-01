import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import { ChevronDownIcon } from './icons';
import { auth } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslations } from '../hooks/useTranslations';
import { useUserSubscription } from '../contexts/UserSubscriptionContext';

interface HeaderProps {
  user: User;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onMenuClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslations();
  const { plan } = useUserSubscription();

  const handleLogout = () => {
    auth.signOut();
  };
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const planName = plan === 'pro' ? t('proPlan') : t('freePlan');

  return (
    <header className="flex-shrink-0 bg-slate-900/50 backdrop-blur-sm border-b border-white/10 p-4 flex justify-between items-center z-20">
      <div>
        <span className={`hidden sm:inline-block px-3 py-1 text-xs font-semibold rounded-full ${plan === 'pro' ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-700 text-gray-300'}`}>
          {planName}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={toggleLanguage} className="text-gray-400 hover:text-white font-semibold text-sm">
          {language === 'en' ? 'العربية' : 'English'}
        </button>
        <div className="relative">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)} 
            className="flex items-center gap-2"
          >
            <img 
              src={user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user.displayName || user.email}`} 
              alt="User" 
              className="w-8 h-8 rounded-full border-2 border-slate-600"
            />
            <span className="hidden sm:inline text-white font-medium text-sm">{user.displayName || 'User'}</span>
            <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && (
            <div 
              className="absolute end-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 z-50 animate-fade-in-fast"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="block px-4 py-2 text-sm text-gray-300 truncate">{user.email}</div>
              <div className="border-t border-slate-700 my-1"></div>
              <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-slate-700">
                {t('logoutButton')}
              </button>
            </div>
          )}
        </div>
        <button onClick={onMenuClick} className="lg:hidden text-gray-300 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
    </header>
  );
};

export default Header;