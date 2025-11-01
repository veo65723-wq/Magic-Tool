import React, { useState } from 'react';
import Card from './Card';
import { SearchIcon, SpinnerIcon, LightBulbIcon } from './icons';
import { GoogleGenAI, Type } from "@google/genai";
import { useTranslations } from '../hooks/useTranslations';
import type { KeywordData } from '../types';
import KeywordTable from './KeywordTable';
import { useUserSubscription } from '../contexts/UserSubscriptionContext';
import UpgradeModal from './UpgradeModal';

const KeywordGeneratorPage: React.FC = () => {
    const { t } = useTranslations();
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<KeywordData[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { canUseFeature, recordUsage } = useUserSubscription();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        if (!canUseFeature('keywordGenerator')) {
            setShowUpgradeModal(true);
            return;
        }

        setIsLoading(true);
        setResults(null);
        setError(null);

        try {
            await recordUsage('keywordGenerator');
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const keywordSchema = {
                type: Type.OBJECT,
                properties: {
                    keywords: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                keyword: { type: Type.STRING },
                                volume: { type: Type.STRING, description: "Estimated monthly search volume, e.g., '1.2K', '500'" },
                                sd: { type: Type.STRING, description: "SEO difficulty score, e.g., '65'" },
                                cpc: { type: Type.STRING, description: "Cost per click, e.g., '0.75'" }
                            },
                            required: ['keyword', 'volume', 'sd', 'cpc']
                        }
                    }
                }
            };

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Generate 120 relevant keywords for the topic: '${query}'. Provide estimated search volume, SEO difficulty, and CPC for each. The output must be in Arabic if the query is in Arabic, otherwise in English.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: keywordSchema,
                },
            });
            
            const data = JSON.parse(response.text.trim());
            setResults(data.keywords);

        } catch (err) {
            console.error("Error generating keywords:", err);
            setError("Failed to generate keywords. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-white">{t('sidebarKeywordGenerator')}</h1>
            <form onSubmit={handleGenerate}>
                <div className="relative w-full max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400">
                        <SearchIcon className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('keywordGeneratorPlaceholder')}
                        className="w-full bg-slate-800/60 border border-slate-700 text-white placeholder-gray-400 rounded-full py-3 ps-12 pe-40 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="absolute inset-y-0 end-0 flex items-center justify-center w-36 me-2 my-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-full transition duration-300 text-sm"
                        disabled={isLoading || !query}
                    >
                        {isLoading ? <SpinnerIcon className="w-5 h-5" /> : t('generateKeywordsButton')}
                    </button>
                </div>
            </form>

            {error && <Card className="text-center py-8 bg-red-500/20 border-red-500/50"><p className="text-red-300">{error}</p></Card>}

            {isLoading && (
                 <Card className="text-center py-16">
                    <SpinnerIcon className="w-12 h-12 text-blue-400 mx-auto" />
                    <p className="mt-4 text-white">{t('generatingKeywords')}</p>
                </Card>
            )}

            {results && <KeywordTable title={t('generatedKeywordsTitle')} data={results} />}

            {!isLoading && !results && (
                <Card className="text-center py-16">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full mx-auto flex items-center justify-center mb-4">
                        <LightBulbIcon className="w-8 h-8 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{t('discoverKeywordsTitle')}</h2>
                    <p className="text-gray-400">{t('discoverKeywordsDescription')}</p>
                </Card>
            )}
            <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </div>
    );
};

export default KeywordGeneratorPage;