import React, { useState } from 'react';
import Card from './Card';
import { MagicWandIcon, SpinnerIcon } from './icons';
import { GoogleGenAI } from "@google/genai";
import { useTranslations } from '../hooks/useTranslations';
import { useUserSubscription } from '../contexts/UserSubscriptionContext';
import UpgradeModal from './UpgradeModal';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import type { Report } from '../types';

const MagicToolPage: React.FC = () => {
    const { t } = useTranslations();
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { isPro } = useUserSubscription();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        if (!isPro) {
            setShowUpgradeModal(true);
            return;
        }

        setIsLoading(true);
        setResult(''); // Use empty string to indicate loading has started
        setError(null);
        setIsSaved(false);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `Act as an expert marketing assistant. Provide a comprehensive, well-structured, and actionable answer to the following user query. Format the response using markdown for readability. The response should be in Arabic. User Query: ${query}`;

            const responseStream = await ai.models.generateContentStream({
                model: "gemini-2.5-pro",
                contents: prompt,
            });

            let fullText = '';
            for await (const chunk of responseStream) {
                fullText += chunk.text;
                setResult(fullText);
            }

        } catch (err) {
            console.error("Error using Magic Tool:", err);
            setError("Failed to get a response. Please try again.");
            setResult(null); // Clear result on error
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
                type: 'magic-tool',
                query: query,
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
            <h1 className="text-3xl font-bold text-white">{t('magicToolTitle')}</h1>
            <p className="text-lg text-gray-400 max-w-3xl">{t('magicToolDescription')}</p>
            
            <form onSubmit={handleGenerate}>
                <Card>
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('magicToolPlaceholder')}
                        className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 rounded-lg p-4 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300 min-h-[120px]"
                        disabled={isLoading}
                        rows={5}
                    />
                    <div className="mt-4 flex justify-end">
                         <button
                            type="submit"
                            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition duration-300"
                            disabled={isLoading || !query}
                        >
                            {isLoading ? <SpinnerIcon className="w-5 h-5" /> : <MagicWandIcon className="w-5 h-5" />}
                            <span>{t('magicToolGenerateButton')}</span>
                        </button>
                    </div>
                </Card>
            </form>

            {error && <Card className="text-center py-8 bg-red-500/20 border-red-500/50"><p className="text-red-300">{error}</p></Card>}

            {(isLoading && result === '') && (
                 <Card className="text-center py-16">
                    <SpinnerIcon className="w-12 h-12 text-blue-400 mx-auto" />
                    <p className="mt-4 text-white">{t('magicToolLoadingText')}</p>
                </Card>
            )}

            {result !== null && (
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">{t('analysisResults')}</h3>
                        <button 
                            onClick={handleSaveReport}
                            disabled={isLoading || isSaving || isSaved}
                            className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600/50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center gap-2"
                        >
                            {isSaving ? <SpinnerIcon className="w-5 h-5"/> : null}
                            {isSaving ? t('savingReportButton') : isSaved ? t('savedReportButton') : t('saveReportButton')}
                        </button>
                    </div>
                    <div className="text-gray-300 whitespace-pre-wrap font-sans bg-slate-900/50 p-4 rounded-lg min-h-[100px]">
                        {result}
                        {isLoading && <span className="typing-cursor">|</span>}
                    </div>
                </Card>
            )}

             <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </div>
    );
};

export default MagicToolPage;