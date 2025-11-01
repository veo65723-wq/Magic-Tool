import React from 'react';
import Card from './Card';
import type { User } from 'firebase/auth';
import { useTranslations } from '../hooks/useTranslations';
import { useUserSubscription } from '../contexts/UserSubscriptionContext';

interface AccountSettingsPageProps {
  user: User;
}

const AccountSettingsPage: React.FC<AccountSettingsPageProps> = ({ user }) => {
  const { t } = useTranslations();
  const { isPro, plan } = useUserSubscription();

  const planName = plan === 'pro' ? t('proPlan') : t('freePlan');

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white">{t('accountSettingsTitle')}</h1>

      <Card title={t('subscriptionPlanTitle')}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div className="mb-4 sm:mb-0">
                <p className="text-gray-400 text-sm">{t('currentPlan')}</p>
                <h3 className={`text-xl font-bold ${isPro ? 'text-purple-300' : 'text-white'}`}>{planName}</h3>
                {isPro && <p className="text-gray-400 text-sm">{t('renewalDate')}</p>}
            </div>
            {isPro ? (
                 <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
                    {t('manageSubscription')}
                </button>
            ) : (
                <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-transform hover:scale-105">
                    {t('upgradeNowButton')}
                </button>
            )}
        </div>
      </Card>

      <Card title={t('billingInfoTitle')}>
         <p className="text-gray-400 mb-4">{t('invoicesSentTo', { email: user.email })}</p>
         <button className="text-blue-400 hover:underline">{t('viewBillingHistory')}</button>
      </Card>
      
      <Card title={t('dangerZoneTitle')}>
        <div className="p-4 border border-red-500/50 bg-red-500/10 rounded-lg">
            <h4 className="font-bold text-red-300">{t('deleteAccountTitle')}</h4>
            <p className="text-red-400 mt-1 mb-4">{t('deleteAccountWarning')}</p>
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                {t('deleteMyAccountButton')}
            </button>
        </div>
      </Card>
    </div>
  );
};

export default AccountSettingsPage;