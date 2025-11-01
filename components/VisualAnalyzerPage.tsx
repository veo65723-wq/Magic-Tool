import React, { useState, useRef } from 'react';
import Card from './Card';
import { EyeIcon, PhotoIcon, SpinnerIcon } from './icons';
import { useTranslations } from '../hooks/useTranslations';
import { GoogleGenAI } from "@google/genai";
import { auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import type { Report } from '../types';

const VisualAnalyzerPage: React.FC = () => {
  const { t } = useTranslations();
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
        setIsSaved(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsLoading(true);
    setAnalysis(null);
    setError(null);
    setIsSaved(false);

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const base64Data = image.split(',')[1];
        const mimeType = image.split(';')[0].split(':')[1];

        const imagePart = {
            inlineData: {
                mimeType,
                data: base64Data,
            },
        };

        const textPart = {
            text: `أنت خبير في التحليل التسويقي والبصري. قم بتحليل الصورة المقدمة. ${prompt ? `ركز بشكل خاص على هذا السؤال: "${prompt}"` : 'قدم تحليلاً شاملاً للجمهور المستهدف، والرسالة التسويقية، والمشاعر التي تثيرها، وقدم توصيات لتحسينها.'} يجب أن يكون التحليل باللغة العربية.`
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        setAnalysis(response.text);

    } catch (err) {
        console.error("Error analyzing image:", err);
        setError(t('errorAnalyzingImage'));
    } finally {
        setIsLoading(false);
    }
  };

  const handleSaveReport = async () => {
    if (!analysis || !auth.currentUser) return;
    setIsSaving(true);
    try {
        const reportData: Omit<Report, 'id'> = {
            userId: auth.currentUser.uid,
            type: 'visual-analyzer',
            query: prompt || t('visualAnalysisResults'),
            date: new Date().toISOString().split('T')[0],
            data: analysis,
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
      <h1 className="text-3xl font-bold text-white">{t('sidebarVisualAnalyzer')}</h1>
      
      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                />
                <div
                    className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-slate-700/30 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {image ? (
                        <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64">
                            <PhotoIcon className="w-16 h-16 text-slate-500 mb-4" />
                            <p className="font-semibold text-white">{t('uploadImagePrompt')}</p>
                            <p className="text-sm text-gray-400">{t('uploadImageHelper')}</p>
                        </div>
                    )}
                </div>
                
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('imageAnalysisPlaceholder')}
                    rows={3}
                    className="mt-4 w-full bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300"
                    disabled={isLoading}
                />
                <button
                    onClick={handleAnalyze}
                    disabled={!image || isLoading}
                    className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-300 disabled:bg-slate-600"
                >
                    {isLoading ? <SpinnerIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    <span>{t('analyzeImageButton')}</span>
                </button>
            </div>
            
            <div className="min-h-[20rem]">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <SpinnerIcon className="w-10 h-10 text-blue-400" />
                    </div>
                )}
                {error && <p className="text-red-400 text-center">{error}</p>}
                {analysis && (
                    <Card className="bg-slate-700/30 h-full">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">{t('visualAnalysisResults')}</h3>
                            <button 
                                onClick={handleSaveReport}
                                disabled={isSaving || isSaved}
                                className="bg-slate-700 hover:bg-slate-600 disabled:bg-slate-600/50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center gap-2"
                            >
                                {isSaving ? <SpinnerIcon className="w-5 h-5"/> : null}
                                {isSaving ? t('savingReportButton') : isSaved ? t('savedReportButton') : t('saveReportButton')}
                            </button>
                        </div>
                        <p className="text-gray-300 whitespace-pre-line">{analysis}</p>
                    </Card>
                )}
            </div>
        </div>
      </Card>
    </div>
  );
};

export default VisualAnalyzerPage;