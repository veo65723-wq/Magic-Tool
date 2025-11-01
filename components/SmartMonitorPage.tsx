import React, { useState, useEffect } from 'react';
import Card from './Card';
import { CloseIcon, SpinnerIcon } from './icons';
import { useTranslations } from '../hooks/useTranslations';
import type { MonitoredItem } from '../types';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, doc, deleteDoc } from 'firebase/firestore';

const SmartMonitorPage: React.FC = () => {
  const { t } = useTranslations();
  const [monitoredItems, setMonitoredItems] = useState<MonitoredItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newKeyword, setNewKeyword] = useState('');
  const [newCompetitor, setNewCompetitor] = useState('');

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const itemsCollection = collection(db, 'monitored_items');
    const q = query(itemsCollection, where('userId', '==', currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MonitoredItem));
      setMonitoredItems(fetchedItems);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching monitored items:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddItem = async (type: 'keyword' | 'competitor') => {
    const value = type === 'keyword' ? newKeyword.trim() : newCompetitor.trim();
    if (!value || !auth.currentUser) return;

    try {
      await addDoc(collection(db, 'monitored_items'), {
        userId: auth.currentUser.uid,
        value: value,
        type: type,
      });
      if (type === 'keyword') setNewKeyword('');
      else setNewCompetitor('');
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'monitored_items', id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const keywords = monitoredItems.filter(item => item.type === 'keyword');
  const competitors = monitoredItems.filter(item => item.type === 'competitor');

  const renderList = (items: MonitoredItem[], emptyMessage: string) => {
    if (isLoading) {
      return <div className="flex justify-center py-4"><SpinnerIcon className="w-6 h-6 text-blue-400" /></div>;
    }
    if (items.length === 0) {
      return <p className="text-gray-400 text-center py-4">{emptyMessage}</p>;
    }
    return (
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center bg-slate-700/50 p-2 rounded-md animate-fade-in">
            <span className="text-white">{item.value}</span>
            <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-400">
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-white">{t('sidebarSmartMonitor')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title={t('monitoredKeywords')}>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder={t('addKeywordPlaceholder')}
                    className="flex-grow bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300"
                />
                <button onClick={() => handleAddItem('keyword')} disabled={!newKeyword.trim()} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-slate-600">{t('addButton')}</button>
            </div>
            {renderList(keywords, t('noKeywordsMonitored'))}
        </Card>

        <Card title={t('monitoredCompetitors')}>
             <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newCompetitor}
                    onChange={(e) => setNewCompetitor(e.target.value)}
                    placeholder={t('addCompetitorPlaceholder')}
                    className="flex-grow bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300"
                />
                <button onClick={() => handleAddItem('competitor')} disabled={!newCompetitor.trim()} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-slate-600">{t('addButton')}</button>
            </div>
             {renderList(competitors, t('noCompetitorsMonitored'))}
        </Card>
      </div>
    </div>
  );
};

export default SmartMonitorPage;