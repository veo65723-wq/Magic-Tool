import React from 'react';
import Card from './Card';
import type { AudiencePersona } from '../types';
import { useTranslations } from '../hooks/useTranslations';

interface AudiencePersonaCardProps {
  persona: AudiencePersona;
}

const AudiencePersonaCard: React.FC<AudiencePersonaCardProps> = ({ persona }) => {
  const { t } = useTranslations();
  return (
    <Card className="flex flex-col md:flex-row items-start gap-6">
      <img src={persona.avatarUrl} alt={persona.name} className="w-24 h-24 rounded-full border-2 border-blue-400 object-cover flex-shrink-0 mx-auto md:mx-0" />
      <div className="flex-grow text-center md:text-left">
        <h3 className="text-xl font-bold text-white">{persona.name}, {persona.age}</h3>
        <p className="text-blue-300 font-semibold">{persona.role}</p>
        <p className="text-gray-400 mt-2 text-sm">{persona.bio}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <h4 className="font-bold text-white mb-2">{t('goals')}</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {persona.goals.map((goal, i) => <li key={i}>{goal}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">{t('painPoints')}</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {persona.painPoints.map((point, i) => <li key={i}>{point}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AudiencePersonaCard;
