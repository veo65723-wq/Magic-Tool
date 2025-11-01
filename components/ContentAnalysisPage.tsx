import React, { useState } from 'react';
import Card from './Card';
import { SearchIcon, SpinnerIcon, DocumentTextIcon } from './icons';
import { GoogleGenAI } from "@google/genai";
import { useTranslations } from '../hooks/useTranslations';
import { useUserSubscription } from '../contexts/UserSubscriptionContext';
import UpgradeModal from './UpgradeModal';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import type { Report } from '../types';

const ContentAnalysisPage: React.FC = () => {
    const { t } = useTranslations();
    const [isLoading, setIsLoading] = useState(false);
    const [url, setUrl] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { canUseFeature, recordUsage } = useUserSubscription();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;
        
        if (!canUseFeature('contentAnalysis')) {
            setShowUpgradeModal(true);
            return;
        }

        setIsLoading(true);
        setResult(null);
        setError(null);
        setIsSaved(false);

        try {
            await recordUsage('contentAnalysis');
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `Analyze the content at the following URL for SEO and content marketing effectiveness: ${url}. Provide a detailed analysis covering:
- **SEO Score (out of 100):** An estimated score based on on-page SEO factors.
- **Strengths:** What the content does well.
- **Weaknesses:** Areas for improvement.
- **Actionable Recommendations:** Specific, concrete steps to improve the content.
- **Suggested Meta Title & Description:** Optimized for clicks and relevance.
Format your response in an easy-to-read way. The analysis should be in Arabic.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });
            
            setResult(response.text);

        } catch (err) {
            console.error("Error analyzing content:", err);
            setError("Failed to analyze content. Please check the URL and try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveReport = async () => {
        if (!result || !auth.currentUser) return;
        setIsSaving(true);
        try {
            const reportData: Omit<Report, 'id'> = {
                userId: auth.currentUser.uid,
                type: 'content-analysis',
                query: url,
                date: new Date().toISOString().split('T')[0],
                data: result,
            };
            await addDoc(collection(db, 'reports'), reportData);
            setIsSaved(true);
        } catch (error) {
            console.error("Error saving report: ", error);
            setError(t('errorSavingReport'));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-white">{t('contentAnalysisTitle')}</h1>
            <form onSubmit={handleAnalyze}>
                <div className="relative w-full max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400">
                        <SearchIcon className="w-5 h-5" />
                    </div>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={t('contentAnalysisPlaceholder')}
                        className="w-full bg-slate-800/60 border border-slate-700 text-white placeholder-gray-400 rounded-full py-3 ps-12 pe-28 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="absolute inset-y-0 end-0 flex items-center justify-center w-24 me-2 my-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-full transition duration-300 text-sm"
                        disabled={isLoading || !url}
                    >
                        {isLoading ? <SpinnerIcon className="w-5 h-5" /> : t('analyzeButton')}
                    </button>
                </div>
            </form>

            {error && <Card className="text-center py-8 bg-red-500/20 border-red-500/50"><p className="text-red-300">{error}</p></Card>}

            {isLoading && (
                 <Card className="text-center py-16">
                    <SpinnerIcon className="w-12 h-12 text-blue-400 mx-auto" />
                    <p className="mt-4 text-white">{t('analyzingContent')}</p>
                </Card>
            )}

            {result && (
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">{t('analysisResults')}</h3>
                        <button 
                            onClick={handleSaveReport}
                            disabled={isSaving || isSaved}
                            className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600/50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center gap-2"
                        >
                            {isSaving ? <SpinnerIcon className="w-5 h-5"/> : null}
                            {isSaving ? t('savingReportButton') : isSaved ? t('savedReportButton') : t('saveReportButton')}
                        </button>
                    </div>
                    <pre className="text-gray-300 whitespace-pre-wrap font-sans bg-slate-900/50 p-4 rounded-lg">{result}</pre>
                </Card>
            )}

            {!isLoading && !result && (
                <Card className="text-center py-16">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full mx-auto flex items-center justify-center mb-4">
                        <DocumentTextIcon className="w-8 h-8 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{t('analyzeContentTitle')}</h2>
                    <p className="text-gray-400">{t('analyzeContentDescription')}</p>
                </Card>
            )}
             <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </div>
    );
};

export default ContentAnalysisPage;