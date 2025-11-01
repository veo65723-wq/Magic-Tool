import React, { useState, useEffect } from 'react';
import Card from './Card';
import type { Report } from '../types';
import ReportDetailModal from './ReportDetailModal';
import ConfirmationModal from './ConfirmationModal';
import { useTranslations } from '../hooks/useTranslations';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { SpinnerIcon, DocumentTextIcon } from './icons';

const ReportsPage: React.FC = () => {
  const { t } = useTranslations();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const reportsCollection = collection(db, 'reports');
    const q = query(
      reportsCollection,
      where('userId', '==', currentUser.uid),
      orderBy('date', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Report));
      setReports(fetchedReports);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching reports:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async () => {
    if (reportToDelete) {
      try {
        await deleteDoc(doc(db, 'reports', reportToDelete.id));
        setReportToDelete(null);
      } catch (error) {
        console.error("Error deleting report: ", error);
        // Optionally, show an error message to the user
      }
    }
  };

  const getReportTypeName = (type: Report['type']) => {
    switch(type) {
        case 'market-analysis': return t('marketAnalysisReport');
        case 'competitor-analysis': return t('competitorAnalysisReport');
        case 'content-analysis': return t('contentAnalysisReport');
        case 'visual-analyzer': return t('visualAnalyzerReport');
        case 'magic-tool': return t('magicToolReport');
        case 'content-copilot': return t('contentCoPilotReport');
        default: return type;
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-16">
          <SpinnerIcon className="w-10 h-10 text-blue-400" />
        </div>
      );
    }

    if (reports.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full mx-auto flex items-center justify-center mb-4">
            <DocumentTextIcon className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">{t('noReportsFound')}</h2>
          <p className="text-gray-400">{t('noReportsDescription')}</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
            <tr>
              <th scope="col" className="px-6 py-3">{t('reportQuery')}</th>
              <th scope="col" className="px-6 py-3">{t('reportType')}</th>
              <th scope="col" className="px-6 py-3">{t('reportDate')}</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">{t('reportActions')}</span></th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b border-slate-700 hover:bg-slate-700/40">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap truncate max-w-xs" title={report.query}>{report.query}</th>
                <td className="px-6 py-4">{getReportTypeName(report.type)}</td>
                <td className="px-6 py-4">{report.date}</td>
                <td className="px-6 py-4 text-left space-x-2 space-x-reverse">
                  <button onClick={() => setSelectedReport(report)} className="font-medium text-blue-400 hover:underline">{t('viewButton')}</button>
                  <button onClick={() => setReportToDelete(report)} className="font-medium text-red-400 hover:underline">{t('deleteButton')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white">{t('sidebarReports')}</h1>
      <Card>
        {renderContent()}
      </Card>
      
      <ReportDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      
      <ConfirmationModal
        isOpen={!!reportToDelete}
        onClose={() => setReportToDelete(null)}
        onConfirm={handleDelete}
        title={t('deleteReportTitle')}
        message={t('deleteReportMessage', { query: reportToDelete?.query || '' })}
      />
    </div>
  );
};

export default ReportsPage;