import React from 'react';
import Card from './Card';
import { CloseIcon, CheckCircleIcon, SparklesIcon } from './icons';
import { useTranslations } from '../hooks/useTranslations';
import { Page } from './Dashboard';
import { useUserSubscription } from '../contexts/UserSubscriptionContext';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick?: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onUpgradeClick }) => {
  const { t } = useTranslations();
  
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <Card className="border-purple-500/30">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-purple-400" />
                <span>{t('upgradeModalTitle')}</span>
             </h2>
             <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-700">
                <CloseIcon className="w-5 h-5 text-gray-400" />
             </button>
          </div>
          <p className="text-gray-400 mb-6">{t('upgradeModalDescription')}</p>
          <ul className="space-y-3 mb-8 text-gray-300">
            <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-400" /><span>{t('sidebarContentCoPilot')}</span></li>
            <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-400" /><span>{t('sidebarVisualAnalyzer')}</span></li>
            <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-400" /><span>{t('sidebarSmartMonitor')}</span></li>
            <li className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-green-400" /><span>Unlimited Usage</span></li>
          </ul>
          <button 
            onClick={onUpgradeClick}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-transform hover:scale-105">
            {t('upgradeToPro')}
          </button>
        </Card>
      </div>
    </div>
  );
};

export default UpgradeModal;