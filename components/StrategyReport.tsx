import React from 'react';
import Card from './Card';
import type { ContentStrategyData } from '../types';
import { MagicWandIcon, LinkedInIcon } from './icons';
import { useTranslations } from '../hooks/useTranslations';

const StrategyReport: React.FC<{ data: ContentStrategyData }> = ({ data }) => {
  const { t } = useTranslations();
  return (
    <div className="animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <MagicWandIcon className="w-8 h-8 text-purple-400" />
            <span>{t('strategyReportTitle')}</span>
        </h2>
        <div className="space-y-6">
            <Card title={t('pillarPageIdea')}>
                <div className="bg-slate-700/50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white">{data.pillarPageIdea.title}</h3>
                    <p className="text-gray-300 mt-1">{data.pillarPageIdea.description}</p>
                </div>
            </Card>

            <Card title={t('blogPostIdeas')}>
                <div className="space-y-4">
                    {data.blogIdeas.map((idea, index) => (
                        <div key={index} className="bg-slate-700/50 p-4 rounded-lg border-l-4 border-cyan-400">
                            <h4 className="font-bold text-white">{idea.title}</h4>
                            <p className="text-sm text-gray-300 mt-1">{idea.summary}</p>
                        </div>
                    ))}
                </div>
            </Card>

            <Card title={t('socialMediaPostIdeas')}>
                <div className="space-y-4">
                     {data.socialMediaPosts.map((post, index) => (
                        <div key={index} className="bg-slate-700/50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                {post.platform.toLowerCase().includes('linkedin') && <LinkedInIcon className="w-5 h-5 text-cyan-200" />}
                                <span className="font-semibold text-cyan-200">{post.platform}</span>
                            </div>
                            <p className="text-white whitespace-pre-line">{post.post}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    </div>
  );
};

export default StrategyReport;