
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-6 ${className}`}>
      {title && <h3 className="text-lg font-bold text-white mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
