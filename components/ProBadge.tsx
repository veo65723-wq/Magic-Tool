import React from 'react';
import { SparklesIcon } from './icons';

const ProBadge: React.FC = () => {
  return (
    <div className="bg-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1">
      <SparklesIcon className="w-3 h-3" />
      <span>PRO</span>
    </div>
  );
};

export default ProBadge;
