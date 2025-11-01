import React, { useRef, useState } from 'react';
import Card from './Card';
import LineChartComponent from './charts/LineChartComponent';
import DoughnutChartComponent from './charts/DoughnutChartComponent';
import KeywordTable from './KeywordTable';
import { CloseIcon, ExportIcon, SpinnerIcon } from './icons';
import type { Report, MarketAnalysisData, CompetitorAnalysisData, ContentStrategyData } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useTranslations } from '../hooks/useTranslations';
import StrategyReport from './StrategyReport';

interface ReportDetailModalProps {
    report: Report | null;
    onClose: () => void;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ report, onClose }) => {
    const { t } = useTranslations();
    const reportContentRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    if (!report) return null;

    const handleExportPDF = async () => {
        if (!reportContentRef.current) return;
        setIsExporting(true);

        try {
            const canvas = await html2canvas(reportContentRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#0f172a' 
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / pdfWidth;
            const imgHeight = canvasHeight / ratio;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            const filename = `report_${report.query.replace(/\s+/g, '_')}.pdf`;
            pdf.save(filename);

        } catch (error) {
            console.error("Error exporting to PDF:", error);
            alert(t('errorExporting'));
        } finally {
            setIsExporting(false);
        }
    };


    const formatVolume = (num: number) => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(0)}K`;
        }
        return num.toString();
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return `${(num / 1000000).toFixed(1)}M`;
        }
        if (num >= 1000) {
            return `${(num / 1000).toFixed(0)}K`;
        }
        return num.toString();
    };

    const data = report.data;

    const renderContent = () => {
        switch (report.type) {
            case 'market-analysis':
                const marketData = data as MarketAnalysisData;
                return (
                    <>
                        <Card>
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="flex-grow">
                                    <h3 className="text-xl font-bold text-white mb-4">{t('searchVolumeTrendTitle')}</h3>
                                    <LineChartComponent data={marketData.searchVolumeTrend} />
                                </div>
                                <div className="flex-shrink-0 w-full lg:w-64 flex flex-col items-center justify-center bg-slate-700/50 p-6 rounded-lg">
                                    <DoughnutChartComponent value={marketData.summary.keywordDifficulty} label={t('keywordDifficultyLabel')} color="#38bdf8" />
                                    <div className="text-center mt-4">
                                        <p className="text-gray-300 text-sm">{t('avgGlobalSearchVolumeLabel')}</p>
                                        <p className="text-white font-bold text-2xl">{formatVolume(marketData.summary.averageMonthlyVolume)}<span className="text-base font-normal">{t('perMonth')}</span></p>
                                        <p className="text-gray-400 text-xs">{t('seoDifficultyLabel')} {t('difficultyValue', { value: marketData.summary.seoDifficulty })}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <KeywordTable title={t('topKeywordsTitle')} data={marketData.topKeywords} />
                            <KeywordTable title={t('longTailKeywordsTitle')} data={marketData.longTailKeywords} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card title={t('questionsBehaviorTitle')}>
                                <div className="flex flex-wrap gap-3">
                                    {marketData.commonQuestions.map(q => (
                                        <span key={q} className="bg-blue-500/80 text-white font-semibold py-2 px-4 rounded-full text-right">
                                            {q}
                                        </span>
                                    ))}
                                </div>
                            </Card>
                            <Card title={t('contentOpportunitiesTitle')}>
                                <div className="space-y-3">
                                    {marketData.contentOpportunities.map((op, index) => (
                                         <div key={index} className="bg-slate-700/50 p-4 rounded-lg border-l-4 border-purple-400">
                                            <p className="text-purple-300 text-sm font-semibold">{op.type}</p>
                                            <h4 className="text-white font-semibold">{op.title}</h4>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </>
                );

            case 'competitor-analysis':
                const competitorData = data as CompetitorAnalysisData;
                return (
                     <>
                         <Card>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                <div>
                                    <p className="text-3xl font-bold text-cyan-400">{competitorData.overview.authorityScore}/10</p>
                                    <p className="text-sm text-gray-400">{t('authorityScore')}</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-cyan-400">{formatNumber(competitorData.overview.monthlyVisits)}</p>
                                    <p className="text-sm text-gray-400">{t('monthlyVisits')}</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-cyan-400">{formatNumber(competitorData.overview.organicKeywords)}</p>
                                    <p className="text-sm text-gray-400">{t('organicKeywords')}</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-cyan-400">{formatNumber(competitorData.overview.backlinks)}</p>
                                    <p className="text-sm text-gray-400">{t('backlinks')}</p>
                                </div>
                            </div>
                        </Card>
                        <Card title={t('organicTrafficTrendTitle')}>
                            <LineChartComponent data={competitorData.trafficTrend} />
                        </Card>
                        <KeywordTable title={t('competitorTopKeywordsTitle')} data={competitorData.topKeywords} />
                    </>
                );

            case 'content-copilot':
                return <StrategyReport data={data as ContentStrategyData} />;
            
            case 'content-analysis':
            case 'visual-analyzer':
            case 'magic-tool':
                return (
                    <Card title={t('analysisResults')}>
                        <pre className="text-gray-300 whitespace-pre-wrap font-sans">{data as string}</pre>
                    </Card>
                );

            default:
                return <p className="text-white">نوع التقرير غير معروف.</p>;
        }
    };

    const getReportTitle = () => {
        switch (report.type) {
            case 'market-analysis': return t('marketAnalysisFor');
            case 'competitor-analysis': return t('competitorAnalysisFor');
            default: return t('reportFor');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
                <header className="sticky top-0 bg-slate-900/80 backdrop-blur-sm z-10 p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
                    <div className="flex-grow min-w-0">
                        <h2 className="text-xl font-bold text-white truncate">{t('reportDetailsTitle')}</h2>
                        <p className="text-gray-400 truncate" title={report.query}>
                           <span className="font-semibold">{getReportTitle()}</span> 
                           {report.query}
                        </p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 ms-4">
                        <button
                            onClick={handleExportPDF}
                            disabled={isExporting}
                            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-gray-300 font-semibold py-2 px-3 rounded-lg transition duration-300 text-sm disabled:opacity-50"
                        >
                            {isExporting ? <SpinnerIcon className="w-4 h-4" /> : <ExportIcon className="w-4 h-4" />}
                            <span>{isExporting ? t('exportingButton') : t('exportPdfButton')}</span>
                        </button>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors duration-200">
                            <CloseIcon className="w-6 h-6 text-gray-400" />
                        </button>
                    </div>
                </header>
                <main ref={reportContentRef} className="overflow-y-auto p-6 space-y-6 bg-slate-900">
                   {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default ReportDetailModal;