import React, { useState } from 'react';
import Card from './Card';
import { SearchIcon, SpinnerIcon, UsersIcon, SendIcon } from './icons';
import { useTranslations } from '../hooks/useTranslations';
import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { MarketAnalysisData, Report } from '../types';
import LineChartComponent from './charts/LineChartComponent';
import DoughnutChartComponent from './charts/DoughnutChartComponent';
import KeywordTable from './KeywordTable';
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';


const MarketAnalysisPage: React.FC = () => {
  const { t } = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<MarketAnalysisData | null>(null);
  
  const [chat, setChat] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const [activeQuestion, setActiveQuestion] = useState<{ question: string; answer: string; } | null>(null);
  const [isQuestionLoading, setIsQuestionLoading] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setIsLoading(true);
    setError(null);
    setResults(null);
    setChat(null);
    setChatHistory([]);
    setActiveQuestion(null);
    setIsSaved(false);
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const marketAnalysisSchema = {
            type: Type.OBJECT,
            properties: {
                searchVolumeTrend: {
                    type: Type.ARRAY,
                    description: "An array of 7 objects representing the last 7 months of search volume. Each object has 'name' (month abbreviation, e.g., 'Jan') and 'uv' (a number for volume).",
                    items: {
                        type: Type.OBJECT,
                        properties: { name: { type: Type.STRING }, uv: { type: Type.NUMBER } }
                    }
                },
                summary: {
                    type: Type.OBJECT,
                    properties: {
                        keywordDifficulty: { type: Type.NUMBER, description: "A score from 0 to 10." },
                        averageMonthlyVolume: { type: Type.NUMBER },
                        seoDifficulty: { type: Type.STRING, description: "A score from 0 to 100." }
                    }
                },
                topKeywords: {
                    type: Type.ARRAY,
                    description: "An array of 4 top keywords.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            keyword: { type: Type.STRING },
                            volume: { type: Type.STRING },
                            sd: { type: Type.STRING },
                            cpc: { type: Type.STRING }
                        }
                    }
                },
                longTailKeywords: {
                    type: Type.ARRAY,
                    description: "An array of 3 long-tail keywords.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            keyword: { type: Type.STRING },
                            volume: { type: Type.STRING },
                            sd: { type: Type.STRING },
                            cpc: { type: Type.STRING }
                        }
                    }
                },
                commonQuestions: {
                    type: Type.ARRAY,
                    description: "An array of 4 common questions people ask about this topic.",
                    items: { type: Type.STRING }
                },
                contentOpportunities: {
                    type: Type.ARRAY,
                    description: "An array of 3 distinct content opportunity objects.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, description: "e.g., 'Comprehensive Guide', 'Case Study'" },
                            title: { type: Type.STRING, description: "A catchy title for a piece of content." }
                        }
                    }
                }
            },
            required: ["searchVolumeTrend", "summary", "topKeywords", "longTailKeywords", "commonQuestions", "contentOpportunities"]
        };

        const prompt = `أنت خبير في تحليل الأسواق الرقمية. قم بإجراء تحليل شامل للسوق حول الموضوع التالي: '${query}'. قدم بيانات مفصلة. يجب أن تكون جميع المخرجات النصية (الكلمات الرئيسية، الأسئile، الأفكار) باللغة العربية.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: marketAnalysisSchema,
            },
        });

        const data: MarketAnalysisData = JSON.parse(response.text.trim());
        setResults(data);

        // Initialize Chat
        const initialChat = ai.chats.create({
          model: 'gemini-2.5-flash',
          history: [
            {
              role: 'user',
              parts: [{ text: `You are a market analysis expert. You have just provided the following report for the query '${query}': ${JSON.stringify(data)}. Now, answer the user's follow-up questions.` }],
            },
            {
              role: 'model',
              parts: [{ text: t('chatInitialMessage') }],
            }
          ],
        });
        setChat(initialChat);

    } catch (err) {
        console.error("Error analyzing market:", err);
        setError("Failed to analyze market. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleQuestionClick = async (question: string) => {
    if (activeQuestion?.question === question) {
        setActiveQuestion(null);
        return;
    }
    setIsQuestionLoading(question);
    setActiveQuestion(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Based on the market analysis for "${query}", provide a concise answer or a brief content outline for the following user question: "${question}". The response should be in Arabic.`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        setActiveQuestion({ question, answer: response.text });
    } catch (err) {
        console.error("Error getting answer:", err);
        setError("Failed to get answer for the question.");
    } finally {
        setIsQuestionLoading(null);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !chat || isChatLoading) return;

    const userMessage = { role: 'user' as const, text: chatMessage };
    setChatHistory(prev => [...prev, userMessage]);
    const messageToSend = chatMessage;
    setChatMessage('');
    setIsChatLoading(true);
    
    try {
        const response = await chat.sendMessage({ message: messageToSend });
        const modelMessage = { role: 'model' as const, text: response.text };
        setChatHistory(prev => [...prev, modelMessage]);
    } catch (err) {
        console.error("Chat error:", err);
        setError("Chat failed. Please try again.");
    } finally {
        setIsChatLoading(false);
    }
  };
  
    const formatVolume = (num: number) => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(0)}K`;
        }
        return num.toString();
    };

    const handleSaveReport = async () => {
        if (!results || !auth.currentUser) return;
        setIsSaving(true);
        try {
            const reportData: Omit<Report, 'id'> = {
                userId: auth.currentUser.uid,
                type: 'market-analysis',
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


  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white">{t('sidebarMarketAnalysis')}</h1>
      <form onSubmit={handleSearch}>
        <div className="relative w-full max-w-2xl mx-auto">
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-gray-400">
            <SearchIcon className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('marketAnalysisPlaceholder')}
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
          <p className="mt-4 text-white">{t('generatingMarketAnalysis')}</p>
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
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-white mb-4">{t('searchVolumeTrendTitle')}</h3>
                        <LineChartComponent data={results.searchVolumeTrend} />
                    </div>
                    <div className="flex-shrink-0 w-full lg:w-64 flex flex-col items-center justify-center bg-slate-700/50 p-6 rounded-lg">
                        <DoughnutChartComponent value={results.summary.keywordDifficulty} label={t('keywordDifficultyLabel')} color="#38bdf8" />
                        <div className="text-center mt-4">
                            <p className="text-gray-300 text-sm">{t('avgGlobalSearchVolumeLabel')}</p>
                            <p className="text-white font-bold text-2xl">{formatVolume(results.summary.averageMonthlyVolume)}<span className="text-base font-normal">{t('perMonth')}</span></p>
                            <p className="text-gray-400 text-xs">{t('seoDifficultyLabel')} {t('difficultyValue', { value: results.summary.seoDifficulty })}</p>
                        </div>
                    </div>
                </div>
            </Card>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <KeywordTable title={t('topKeywordsTitle')} data={results.topKeywords} />
                <KeywordTable title={t('longTailKeywordsTitle')} data={results.longTailKeywords} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title={t('questionsBehaviorTitle')}>
                    <div className="flex flex-col gap-3">
                        {results.commonQuestions.map(q => (
                            <div key={q}>
                                <button
                                    onClick={() => handleQuestionClick(q)}
                                    className="w-full text-right bg-blue-500/80 hover:bg-blue-500/100 text-white font-semibold py-2 px-4 rounded-full transition-colors flex items-center justify-between"
                                >
                                    <span>{q}</span>
                                    {isQuestionLoading === q && <SpinnerIcon className="w-4 h-4" />}
                                </button>
                                {activeQuestion?.question === q && (
                                    <div className="mt-2 p-4 bg-slate-700/50 rounded-lg animate-fade-in">
                                        <pre className="text-gray-300 whitespace-pre-wrap font-sans">{activeQuestion.answer}</pre>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title={t('contentOpportunitiesTitle')}>
                    <div className="space-y-3">
                        {results.contentOpportunities.map((op, index) => (
                             <div key={index} className="bg-slate-700/50 p-4 rounded-lg border-l-4 border-purple-400">
                                <p className="text-purple-300 text-sm font-semibold">{op.type}</p>
                                <h4 className="text-white font-semibold">{op.title}</h4>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            
            {chat && (
                 <Card title={t('chatWithExpertTitle')}>
                    <div className="space-y-4 max-h-96 overflow-y-auto p-4 bg-slate-900/50 rounded-lg mb-4">
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xl px-4 py-2 rounded-xl ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-300'}`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isChatLoading && (
                             <div className="flex justify-start">
                                <div className="max-w-xl px-4 py-2 rounded-xl bg-slate-700 text-gray-300">
                                   <SpinnerIcon className="w-5 h-5" />
                                </div>
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder={t('chatPlaceholder')}
                            className="flex-grow bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300"
                            disabled={isChatLoading}
                        />
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-3 rounded-lg transition duration-300 disabled:bg-slate-600" disabled={isChatLoading || !chatMessage.trim()}>
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                </Card>
            )}

        </div>
      )}

      {!isLoading && !results && (
        <Card className="text-center py-16">
          <div className="w-16 h-16 bg-slate-700/50 rounded-full mx-auto flex items-center justify-center mb-4">
            <UsersIcon className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">{t('analyzeMarketTitle')}</h2>
          <p className="text-gray-400">{t('analyzeMarketDescription')}</p>
        </Card>
      )}
    </div>
  );
};

export default MarketAnalysisPage;