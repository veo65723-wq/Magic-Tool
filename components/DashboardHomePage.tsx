
import React, { useState } from 'react';
import Card from './Card';
import StatCard from './StatCard';
import { UsersIcon, SearchIcon, ChartBarIcon, DocumentTextIcon, LightBulbIcon, SpinnerIcon } from './icons';
import MiniLineChart from './charts/MiniLineChart';
import type { ChartDataPoint, StrategicBrief } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { GoogleGenAI, Type } from "@google/genai";

const chartData: ChartDataPoint[] = [
  { name: 'Jan', uv: 4000 },
  { name: 'Feb', uv: 3000 },
  { name: 'Mar', uv: 2000 },
  { name: 'Apr', uv: 2780 },
  { name: 'May', uv: 1890 },
  { name: 'Jun', uv: 2390 },
  { name: 'Jul', uv: 3490 },
];

const DashboardHomePage: React.FC = () => {
    const { t } = useTranslations();
    const [isLoadingBrief, setIsLoadingBrief] = useState(false);
    const [strategicBrief, setStrategicBrief] = useState<StrategicBrief | null>(null);
    const [error, setError] = useState<string | null>(null);

    const findOpportunities = async () => {
        setIsLoadingBrief(true);
        setStrategicBrief(null);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const briefSchema = {
                type: Type.OBJECT,
                properties: {
                    event: { type: Type.STRING, description: "وصف موجز للحدث الذي تم اكتشافه (باللغة العربية)." },
                    analysis: { type: Type.STRING, description: "تحليل استراتيجي لما يعنيه هذا الحدث (باللغة العربية)." },
                    recommendation: { type: Type.STRING, description: "توصية قابلة للتنفيذ للاستفادة من الفرصة (باللغة العربية)." },
                },
            };

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: "أنت خبير استراتيجي في التسويق الرقمي. لقد اكتشف مرصدك أن أحد المنافسين الرئيسيين (noon.com) قد نشر للتو مقالاً جديداً عن 'أفضل الهواتف الذكية الاقتصادية لعام 2024'. قم بإنشاء موجز فرصة استراتيجي. صف الحدث، وقدم تحليلًا (على سبيل المثال، قد يركزون على الميزات التقنية ولكنهم يفتقدون مقارنات تجربة المستخدم)، وقدم توصية محددة (على سبيل المثال، 'انشر مقالًا بعنوان \'5 هواتف ذكية اقتصادية يحبها المستخدمون بالفعل\' مع شهادات حقيقية').",
                config: {
                    responseMimeType: "application/json",
                    responseSchema: briefSchema,
                },
            });
            const data = JSON.parse(response.text.trim());
            setStrategicBrief(data);
        } catch (err) {
            console.error(err);
            setError("Failed to generate strategic brief.");
        } finally {
            setIsLoadingBrief(false);
        }
    };


  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white">{t('dashboardTitle')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={UsersIcon} title={t('monthlyVisits')} value="1.2M">
          <MiniLineChart data={chartData} color="#38bdf8" />
        </StatCard>
        <StatCard icon={SearchIcon} title={t('organicKeywords')} value="24.5K">
           <MiniLineChart data={chartData.slice().reverse()} color="#a78bfa" />
        </StatCard>
        <StatCard icon={ChartBarIcon} title={t('authorityScore')} value="8.5/10">
            <MiniLineChart data={chartData} color="#f472b6" />
        </StatCard>
        <StatCard icon={DocumentTextIcon} title={t('backlinks')} value="500K">
            <MiniLineChart data={chartData.slice().reverse()} color="#4ade80" />
        </StatCard>
      </div>
      
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-xl font-bold text-white mb-2 sm:mb-0">{t('strategicObservatory')}</h2>
            <button
                onClick={findOpportunities}
                disabled={isLoadingBrief}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 text-sm disabled:bg-slate-600"
            >
                {isLoadingBrief ? <SpinnerIcon className="w-5 h-5" /> : <LightBulbIcon className="w-5 h-5" />}
                <span>{isLoadingBrief ? t('searchingForOpportunities') : t('findNewOpportunities')}</span>
            </button>
        </div>

        {strategicBrief && (
            <div className="space-y-4 bg-slate-700/50 p-4 rounded-lg animate-fade-in">
                <h3 className="font-bold text-lg text-white border-b border-slate-600 pb-2">{t('strategicBriefTitle')}</h3>
                <div>
                    <h4 className="font-semibold text-cyan-300">{t('discoveredEvent')}</h4>
                    <p className="text-gray-300">{strategicBrief.event}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-cyan-300">{t('strategicAnalysis')}</h4>
                    <p className="text-gray-300">{strategicBrief.analysis}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-emerald-300">{t('strategicRecommendation')}</h4>
                    <p className="text-gray-200">{strategicBrief.recommendation}</p>
                </div>
            </div>
        )}
        {error && <p className="text-red-400 text-center">{error}</p>}
      </Card>

    </div>
  );
};

export default DashboardHomePage;