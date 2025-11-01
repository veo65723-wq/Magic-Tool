import React from 'react';
import Card from './Card';
import type { KeywordData } from '../types';
import { ExportIcon } from './icons';
import { useTranslations } from '../hooks/useTranslations';

interface KeywordTableProps {
  title: string;
  data: KeywordData[];
}

const KeywordTable: React.FC<KeywordTableProps> = ({ title, data }) => {
    const { t } = useTranslations();
    
    const handleExport = () => {
        const filename = title.toLowerCase().replace(/[\s/]/g, '_') + '.csv';
        const headers = [t('keyword'), t('searchVolume'), t('difficulty'), t('cpc')];
        const csvContent = [
            headers.join(','),
            ...data.map(item => `"${item.keyword}","${item.volume}","${item.sd}","${item.cpc}"`)
        ].join('\n');

        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-gray-300 font-semibold py-2 px-3 rounded-lg transition duration-300 text-sm"
                    // FIX: Used translation function for aria-label
                    aria-label={t('exportAriaLabel', { title })}
                >
                    <ExportIcon className="w-4 h-4" />
                    <span>{t('exportCsvButton')}</span>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-slate-700/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">{t('keyword')}</th>
                            <th scope="col" className="px-6 py-3">{t('searchVolume')}</th>
                            <th scope="col" className="px-6 py-3">{t('difficulty')}</th>
                            <th scope="col" className="px-6 py-3">{t('cpc')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/40">
                                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{item.keyword}</th>
                                <td className="px-6 py-4">{item.volume}</td>
                                <td className="px-6 py-4">{item.sd}</td>
                                <td className="px-6 py-4">${item.cpc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default KeywordTable;