import React from 'react';
import Card from './Card';
import { CheckCircleIcon, SparklesIcon, ArrowRightIcon } from './icons';
import { useTranslations } from '../hooks/useTranslations';
import { useUserSubscription } from '../contexts/UserSubscriptionContext';

const UpgradePage: React.FC = () => {
    const { t } = useTranslations();
    const { upgradeUser } = useUserSubscription();

    const handleUpgrade = async () => {
        try {
            await upgradeUser();
            // Optional: Show a success message
            alert('Successfully upgraded to Pro!');
        } catch (error) {
            console.error("Failed to upgrade:", error);
            alert('Failed to upgrade. Please try again.');
        }
    };
    
    return (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto text-center">
            <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white flex items-center justify-center gap-4">
                    <SparklesIcon className="w-10 h-10 text-purple-400" />
                    <span>{t('upgradeToPro')}</span>
                </h1>
                <p className="mt-4 text-lg text-gray-400">Unlock your full potential with our Pro plan. Get unlimited access to all features.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <Card className="border-slate-700">
                    <h3 className="text-2xl font-bold text-white">Free Plan</h3>
                    <p className="text-gray-400 mt-2 mb-6">For individuals starting out</p>
                    <p className="text-4xl font-bold text-white mb-6">$0 <span className="text-lg font-normal text-gray-400">/ month</span></p>
                    <ul className="space-y-3 text-gray-300">
                        <li className="flex items-start gap-3"><CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" /><span>Market & Competitor Analysis</span></li>
                        <li className="flex items-start gap-3"><CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" /><span>3 Keyword searches / day</span></li>
                        <li className="flex items-start gap-3"><CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" /><span>2 Content analyses / day</span></li>
                    </ul>
                </Card>

                <Card className="border-purple-500 ring-2 ring-purple-500">
                     <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-white">Pro Plan</h3>
                        <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">BEST VALUE</span>
                    </div>
                    <p className="text-gray-400 mt-2 mb-6">For power users and teams</p>
                    <p className="text-4xl font-bold text-white mb-6">$29 <span className="text-lg font-normal text-gray-400">/ month</span></p>
                    <ul className="space-y-3 text-gray-300 mb-8">
                        <li className="flex items-start gap-3"><CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" /><span>Everything in Free, plus:</span></li>
                        <li className="flex items-start gap-3 font-semibold text-purple-300"><SparklesIcon className="w-5 h-5 text-purple-300 flex-shrink-0 mt-1" /><span>Content Co-Pilot</span></li>
                        <li className="flex items-start gap-3 font-semibold text-purple-300"><SparklesIcon className="w-5 h-5 text-purple-300 flex-shrink-0 mt-1" /><span>Visual Analyzer</span></li>
                        <li className="flex items-start gap-3 font-semibold text-purple-300"><SparklesIcon className="w-5 h-5 text-purple-300 flex-shrink-0 mt-1" /><span>Smart Monitor</span></li>
                        <li className="flex items-start gap-3"><CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" /><span>Unlimited Usage</span></li>
                        <li className="flex items-start gap-3"><CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" /><span>Priority Support</span></li>
                    </ul>
                    <button 
                        onClick={handleUpgrade}
                        className="w-full group bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <span>Upgrade Now</span>
                        <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </button>
                </Card>
            </div>
        </div>
    );
};

export default UpgradePage;