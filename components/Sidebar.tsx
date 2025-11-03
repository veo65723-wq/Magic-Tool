import React from 'react';
import { LogoIcon, ChartBarIcon, UsersIcon, SearchIcon, LightBulbIcon, EyeIcon, DocumentTextIcon, CogIcon, ShieldCheckIcon, SparklesIcon, MagicWandIcon } from './icons';
import { auth } from '../firebase';
import { useTranslations } from '../hooks/useTranslations';
import ProBadge from './ProBadge';
import { useUserSubscription } from '../contexts/UserSubscriptionContext';
import type { Page } from './Dashboard';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const { t } = useTranslations();
  const { isPro } = useUserSubscription();

  const handleLogout = () => {
    auth.signOut();
  };
  
  const NavItem = ({ page, icon: Icon, children, pro = false }: { page: Page, icon: React.ElementType, children: React.ReactNode, pro?: boolean }) => (
    <button 
      onClick={() => {
        setCurrentPage(page);
        if (window.innerWidth < 1024) { // Close sidebar on mobile after navigation
          setIsOpen(false);
        }
      }}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
        currentPage === page
          ? 'bg-blue-500/20 text-blue-300'
          : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="flex-1 text-end">{children}</span>
      {pro && !isPro && <ProBadge />}
    </button>
  );

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>
      <aside 
        className={`fixed top-0 bottom-0 z-40 bg-slate-800/80 backdrop-blur-lg border-l border-white/10 w-64 p-4 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center gap-3 px-4 mb-8">
          <LogoIcon className="w-8 h-8 text-blue-400" />
          <h1 className="text-xl font-bold text-white">{t('appName')}</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {/* FIX: Add missing 'children' prop to NavItem components to display link text. */}
          <NavItem page="dashboard" icon={ChartBarIcon}>{t('sidebarDashboard')}</NavItem>
          <NavItem page="market-analysis" icon={SearchIcon}>{t('sidebarMarketAnalysis')}</NavItem>
          <NavItem page="competitor-analysis" icon={UsersIcon}>{t('sidebarCompetitorAnalysis')}</NavItem>
          <NavItem page="audience-persona" icon={UsersIcon} pro>{t('sidebarAudiencePersona')}</NavItem>
          <NavItem page="keyword-generator" icon={LightBulbIcon}>{t('sidebarKeywordGenerator')}</NavItem>
          <NavItem page="content-analysis" icon={DocumentTextIcon}>{t('sidebarContentAnalysis')}</NavItem>
          <NavItem page="magic-tool" icon={MagicWandIcon} pro>{t('sidebarMagicTool')}</NavItem>
          <NavItem page="content-copilot" icon={LightBulbIcon} pro>{t('sidebarContentCoPilot')}</NavItem>
          <NavItem page="visual-analyzer" icon={EyeIcon} pro>{t('sidebarVisualAnalyzer')}</NavItem>
          <NavItem page="smart-monitor" icon={DocumentTextIcon} pro>{t('sidebarSmartMonitor')}</NavItem>
          <NavItem page="reports" icon={DocumentTextIcon}>{t('sidebarReports')}</NavItem>
        </nav>

        <div className="mt-auto">
          {!isPro && (
            <button 
              onClick={() => setCurrentPage('upgrade')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 mb-4 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold transition-transform hover:scale-105"
            >
              <SparklesIcon className="w-5 h-5" />
              <span>{t('upgradeToPro')}</span>
            </button>
          )}
          <div className="space-y-2">
            {/* FIX: Add missing 'children' prop to NavItem components to display link text. */}
            <NavItem page="settings" icon={CogIcon}>{t('sidebarSettings')}</NavItem>
            <NavItem page="account" icon={ShieldCheckIcon}>{t('sidebarAccount')}</NavItem>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-slate-700/50 hover:text-red-400">
               {t('logoutButton')}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;