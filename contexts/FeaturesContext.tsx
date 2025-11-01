import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';
import type { Feature } from '../types';

interface FeaturesContextType {
  features: Feature[];
  loading: boolean;
  isFeatureEnabled: (featureName: string) => boolean;
}

const FeaturesContext = createContext<FeaturesContextType | undefined>(undefined);

export const FeaturesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'features'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const featuresData: Feature[] = [];
      querySnapshot.forEach((doc) => {
        featuresData.push({ id: doc.id, ...doc.data() } as Feature);
      });
      setFeatures(featuresData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching features:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isFeatureEnabled = (featureName: string): boolean => {
    const feature = features.find(f => f.name === featureName);
    return feature ? feature.enabled : false;
  };

  const value = { features, loading, isFeatureEnabled };

  return (
    <FeaturesContext.Provider value={value}>
      {children}
    </FeaturesContext.Provider>
  );
};

export const useFeatures = () => {
  const context = useContext(FeaturesContext);
  if (context === undefined) {
    throw new Error('useFeatures must be used within a FeaturesProvider');
  }
  return context;
};