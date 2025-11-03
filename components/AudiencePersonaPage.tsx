import React, { useState } from 'react';
import Card from './Card';
import { UsersIcon, SpinnerIcon } from './icons';
import { GoogleGenAI, Type } from "@google/genai";
import { useTranslations } from '../hooks/useTranslations';
import type { AudiencePersona } from '../types';
import AudiencePersonaCard from './AudiencePersonaCard';
import { useUserSubscription } from '../contexts/UserSubscriptionContext';
import UpgradeModal from './UpgradeModal';

const AudiencePersonaPage: React.FC = () => {
    const { t } = useTranslations();
    const [isLoading, setIsLoading] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<AudiencePersona[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { isPro } = useUserSubscription();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        if (!isPro) {
            setShowUpgradeModal(true);
            return;
        }

        setIsLoading(true);
        setResults(null);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const personaSchema = {
                type: Type.OBJECT,
                properties: {
                    personas: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                avatarUrl: { type: Type.STRING, description: "A generated avatar URL from api.dicebear.com based on the persona's name." },
                                name: { type: Type.STRING },
                                age: { type: Type.NUMBER },
                                role: { type: Type.STRING },
                                bio: { type: Type.STRING },
                                goals: { type: Type.ARRAY, items: { type: Type.STRING } },
                                painPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
                            },
                            required: ['avatarUrl', 'name', 'age', 'role', 'bio', 'goals', 'painPoints']
                        }
                    }
                }
            };

            const prompt = `Based on this product description: '${query}', generate 3 detailed audience personas. For each persona, provide a name, age, role, a short bio, 3 goals, and 3 pain points. Also, generate a unique, stable avatar URL for each using the 'https://api.dicebear.com/8.x/initials/svg?seed=[Name]' format, replacing [Name] with the persona's name (URL-encoded). All text output must be in Arabic.`;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: personaSchema,
                },
            });
            
            const data = JSON.parse(response.text.trim());
            setResults(data.personas);

        } catch (err) {
            console.error("Error generating personas:", err);
            setError(t('errorGeneratingPersonas'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold text-white">{t('audiencePersonaPageTitle')}</h1>
            <p className="text-lg text-gray-400 max-w-3xl">{t('audiencePersonaPageDescription')}</p>
            
            <form onSubmit={handleGenerate}>
                <Card>
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('audiencePersonaPlaceholder')}
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
                            {isLoading ? <SpinnerIcon className="w-5 h-5" /> : <UsersIcon className="w-5 h-5" />}
                            <span>{t('generatePersonasButton')}</span>
                        </button>
                    </div>
                </Card>
            </form>

            {error && <Card className="text-center py-8 bg-red-500/20 border-red-500/50"><p className="text-red-300">{error}</p></Card>}

            {isLoading && (
                 <Card className="text-center py-16">
                    <SpinnerIcon className="w-12 h-12 text-blue-400 mx-auto" />
                    <p className="mt-4 text-white">{t('generatingPersonas')}</p>
                </Card>
            )}

            {results && (
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white">{t('generatedPersonasTitle')}</h2>
                    {results.map((persona, index) => (
                        <AudiencePersonaCard key={index} persona={persona} />
                    ))}
                </div>
            )}

            <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
        </div>
    );
};

export default AudiencePersonaPage;