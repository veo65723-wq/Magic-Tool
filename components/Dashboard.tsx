import React, { useState } from 'react';
import type { User } from 'firebase/auth';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardHomePage from './DashboardHomePage';
import MarketAnalysisPage from './MarketAnalysisPage';
import CompetitorAnalysisPage from './CompetitorAnalysisPage';
import KeywordGeneratorPage from './KeywordGeneratorPage';
import ContentCoPilotPage from './ContentCoPilotPage';
import VisualAnalyzerPage from './VisualAnalyzerPage';
import SmartMonitorPage from './SmartMonitorPage';
import ReportsPage from './ReportsPage';
import SettingsPage from './SettingsPage';
import AccountSettingsPage from './AccountSettingsPage';
import UpgradePage from './UpgradePage';
import ContentAnalysisPage from './ContentAnalysisPage';
import MagicToolPage from './MagicToolPage'; // Import MagicToolPage

export type Page = 
  | 'dashboard' 
  | 'market-analysis' 
  | 'competitor-analysis' 
  | 'keyword-generator' 
  | 'content-copilot' 
  | 'visual-analyzer'
  | 'smart-monitor'
  | 'reports' 
  | 'settings' 
  | 'account'
  | 'upgrade'
  | 'content-analysis'
  | 'magic-tool'; // Add magic-tool page

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHomePage />;
      case 'market-analysis':
        return <MarketAnalysisPage />;
      case 'competitor-analysis':
        return <CompetitorAnalysisPage />;
      case 'keyword-generator':
        return <KeywordGeneratorPage />;
      case 'content-copilot':
        return <ContentCoPilotPage />;
      case 'content-analysis':
        return <ContentAnalysisPage />;
      case 'visual-analyzer':
        return <VisualAnalyzerPage />;
      case 'smart-monitor':
        return <SmartMonitorPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage user={user} />;
      case 'account':
        return <AccountSettingsPage user={user} />;
      case 'upgrade':
        return <UpgradePage />;
      case 'magic-tool': // Add case for magic-tool
        return <MagicToolPage />;
      default:
        return <DashboardHomePage />;
    }
  };

  return (
    <div 
      className="flex h-screen bg-cover bg-center bg-no-repeat" 
      style={{ backgroundImage: 'url(https://picsum.photos/seed/dashboard/1920/1080)' }}
    >
      <div className="absolute inset-0 bg-slate-900 bg-opacity-80 backdrop-blur-xl"></div>
      
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;