import React from 'react';

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  children?: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, children, className }) => {
  return (
    <div className={`bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-5 flex flex-col ${className}`}>
        <div className="flex items-start gap-4">
            <div className="p-3 bg-slate-700/50 rounded-lg">
                <Icon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
        {children && <div className="mt-2 flex-grow flex flex-col justify-end">{children}</div>}
    </div>
  );
};

export default StatCard;
