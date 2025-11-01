import React, { useState } from 'react';
import Card from './Card';
import { SearchIcon, SpinnerIcon, UsersIcon } from './icons';
import { useTranslations } from '../hooks/useTranslations';
import { GoogleGenAI, Type } from "@google/genai";
import type { CompetitorAnalysisData, Report } from '../types';
import LineChartComponent from './charts/LineChartComponent';
import KeywordTable from './KeywordTable';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const CompetitorAnalysisPage: React.FC = () => {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CompetitorAnalysisData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setIsLoading(true);
    setError(null);
    setResults(null);
    setIsSaved(false);
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const competitorAnalysisSchema = {
            type: Type.OBJECT,
            properties: {
                overview: {
                    type: Type.OBJECT,
                    properties: {
                        authorityScore: { type: Type.NUMBER, description: "A score from 0 to 10." },
                        monthlyVisits: { type: Type.NUMBER },
                        organicKeywords: { type: Type.NUMBER },
                        backlinks: { type: Type.NUMBER }
                    }
                },
                trafficTrend: {
                    type: Type.ARRAY,
                    description: "An array of 7 objects for the last 7 months of traffic. Each has 'name' (month) and 'uv' (volume).",
                    items: {
                        type: Type.OBJECT,
                        properties: { name: { type: Type.STRING }, uv: { type: Type.NUMBER } }
                    }
                },
                topKeywords: {
                    type: Type.ARRAY,
                    description: "An array of 4 top organic keywords.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            keyword: { type: Type.STRING },
                            volume: { type: Type.STRING },
                            sd: { type: Type.STRING },
                            cpc: { type: Type.STRING }
                        }
                    }
                }
            },
            required: ["overview", "trafficTrend", "topKeywords"]
        };

        const prompt = `أنت خبير في تحليل المنافسين. قم بإجراء تحليل SEO لموقع الويب التالي: '${query}'. قدم بيانات مفصلة عن نظرة عامة (قوة النطاق، الزيارات الشهرية، الكلمات المفتاحية، الروابط الخلفية)، واتجاه الزيارات العضوية لآخر 7 أشهر، وأفضل 4 كلمات مفتاحية. يجب أن تكون جميع المخرجات النصية (الكلمات الرئيسية) باللغة العربية.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: competitorAnalysisSchema,
            },
        });

        const data: CompetitorAnalysisData = JSON.parse(response.text.trim());
        setResults(data);

    } catch (err) {
        console.error("Error analyzing competitor:", err);
        setError("Failed to analyze competitor. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!results || !auth.currentUser) return;
    setIsSaving(true);
    try {
        const reportData: Omit<Report, 'id'> = {
            userId: auth.currentUser.uid,
            type: 'competitor-analysis',
            query: query,
            date: new Date().toISOString().split('T')[0],
            data: results,
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white">{t('sidebarCompetitorAnalysis')}</h1>
      <form onSubmit={handleSearch}>
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400">
            <SearchIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('competitorAnalysisPlaceholder')}
            className="w-full bg-slate-800/60 border border-slate-700 text-white placeholder-gray-400 rounded-full py-3 ps-12 pe-28 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="absolute inset-y-0 end-0 flex items-center justify-center w-24 me-2 my-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-full transition duration-300 text-sm"
            disabled={isLoading || !query}
          >
            {isLoading ? <SpinnerIcon className="w-5 h-5" /> : t('analyzeButton')}
          </button>
        </div>
      </form>

      {isLoading && (
        <Card className="text-center py-16">
          <SpinnerIcon className="w-12 h-12 text-blue-400 mx-auto" />
          <p className="mt-4 text-white">جاري تحليل المنافس...</p>
        </Card>
      )}

      {error && <Card className="text-center py-8 bg-red-500/20 border-red-500/50"><p className="text-red-300">{error}</p></Card>}

      {results && (
        <div className="space-y-6 animate-fade-in">
            <Card>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-white">{t('analysisResults')} "{query}"</h2>
                  <button 
                    onClick={handleSaveReport}
                    disabled={isSaving || isSaved}
                    className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600/50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center gap-2"
                  >
                    {isSaving ? <SpinnerIcon className="w-5 h-5"/> : null}
                    {isSaving ? t('savingReportButton') : isSaved ? t('savedReportButton') : t('saveReportButton')}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                        <p className="text-3xl font-bold text-cyan-400">{results.overview.authorityScore}/10</p>
                        <p className="text-sm text-gray-400">{t('authorityScore')}</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-cyan-400">{formatNumber(results.overview.monthlyVisits)}</p>
                        <p className="text-sm text-gray-400">{t('monthlyVisits')}</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-cyan-400">{formatNumber(results.overview.organicKeywords)}</p>
                        <p className="text-sm text-gray-400">{t('organicKeywords')}</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-cyan-400">{formatNumber(results.overview.backlinks)}</p>
                        <p className="text-sm text-gray-400">{t('backlinks')}</p>
                    </div>
                </div>
            </Card>

            <Card title={t('organicTrafficTrendTitle')}>
                <LineChartComponent data={results.trafficTrend} />
            </Card>

            <KeywordTable title={t('competitorTopKeywordsTitle')} data={results.topKeywords} />
        </div>
      )}

      {!isLoading && !results && (
        <Card className="text-center py-16">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full mx-auto flex items-center justify-center mb-4">
            <UsersIcon className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">{t('analyzeCompetitorTitle')}</h2>
          <p className="text-gray-400">{t('analyzeCompetitorDescription')}</p>
        </Card>
      )}
    </div>
  );
};

export default CompetitorAnalysisPage;