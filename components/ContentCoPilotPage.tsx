import React, { useState } from 'react';
import Card from './Card';
import { SearchIcon, SpinnerIcon, LightBulbIcon } from './icons';
import { GoogleGenAI, Type } from "@google/genai";
import type { ContentStrategyData, Report } from '../types';
import StrategyReport from './StrategyReport';
import { useTranslations } from '../hooks/useTranslations';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const ContentCoPilotPage: React.FC = () => {
    const { t } = useTranslations();
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [result, setResult] = useState<ContentStrategyData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;
        setIsLoading(true);
        setResult(null);
        setError(null);
        setIsSaved(false);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const strategySchema = {
                type: Type.OBJECT,
                properties: {
                    pillarPageIdea: { 
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            description: { type: Type.STRING }
                        }
                    },
                    blogIdeas: { 
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                summary: { type: Type.STRING }
                            }
                        }
                    },
                    socialMediaPosts: { 
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                platform: { type: Type.STRING },
                                post: { type: Type.STRING }
                            }
                        }
                    }
                }
            };

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Create a comprehensive content strategy for the topic: '${query}'. Provide one pillar page idea with a title and description, three related blog post ideas with titles and summaries, and two social media post ideas (one for LinkedIn, one for Twitter/X) with the platform name and post content. All output must be in Arabic.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: strategySchema,
                },
            });
            
            const data = JSON.parse(response.text.trim());
            setResult(data);

        } catch (err) {
            console.error("Error generating strategy:", err);
            setError("Failed to generate content strategy. Please try again.");
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
                type: 'content-copilot',
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
            <h1 className="text-3xl font-bold text-white">{t('sidebarContentCoPilot')}</h1>
            <form onSubmit={handleGenerate}>
                <div className="relative w-full max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400">
                        <SearchIcon className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('contentCoPilotPlaceholder')}
                        className="w-full bg-slate-800/60 border border-slate-700 text-white placeholder-gray-400 rounded-full py-3 ps-12 pe-40 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="absolute inset-y-0 end-0 flex items-center justify-center w-36 me-2 my-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-full transition duration-300 text-sm"
                        disabled={isLoading || !query}
                    >
                        {isLoading ? <SpinnerIcon className="w-5 h-5" /> : t('generateStrategyButton')}
                    </button>
                </div>
            </form>

            {error && <Card className="text-center py-8 bg-red-500/20 border-red-500/50"><p className="text-red-300">{error}</p></Card>}

            {isLoading && (
                 <Card className="text-center py-16">
                    <SpinnerIcon className="w-12 h-12 text-blue-400 mx-auto" />
                    <p className="mt-4 text-white">جاري إنشاء الاستراتيجية...</p>
                </Card>
            )}

            {result && (
                <div>
                     <div className="flex justify-end mb-4">
                        <button 
                            onClick={handleSaveReport}
                            disabled={isSaving || isSaved}
                            className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600/50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center gap-2"
                        >
                            {isSaving ? <SpinnerIcon className="w-5 h-5"/> : null}
                            {isSaving ? t('savingReportButton') : isSaved ? t('savedReportButton') : t('saveReportButton')}
                        </button>
                    </div>
                    <StrategyReport data={result} />
                </div>
            )}
            
            {!isLoading && !result && (
                <Card className="text-center py-16">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full mx-auto flex items-center justify-center mb-4">
                        <LightBulbIcon className="w-8 h-8 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{t('discoverStrategyTitle')}</h2>
                    <p className="text-gray-400">{t('discoverStrategyDescription')}</p>
                </Card>
            )}
        </div>
    );
};

export default ContentCoPilotPage;