import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, increment, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { User } from 'firebase/auth';
import type { SubscriptionPlan } from '../types';

const FREE_PLAN_LIMITS = {
  keywordGenerator: 3,
  contentAnalysis: 2,
};

interface Usage {
  keywordGenerator: number;
  contentAnalysis: number;
  lastUsageTimestamp: Timestamp;
}

interface UserSubscriptionContextType {
  plan: SubscriptionPlan;
  isPro: boolean;
  // FIX: Added isAdmin property for admin panel access control.
  isAdmin: boolean;
  usage: Usage | null;
  isLoading: boolean;
  canUseFeature: (feature: keyof typeof FREE_PLAN_LIMITS) => boolean;
  recordUsage: (feature: keyof typeof FREE_PLAN_LIMITS) => Promise<void>;
  upgradeUser: () => Promise<void>;
}

const UserSubscriptionContext = createContext<UserSubscriptionContextType | undefined>(undefined);

export const UserSubscriptionProvider: React.FC<{ children: ReactNode; user: User }> = ({ children, user }) => {
  const [plan, setPlan] = useState<SubscriptionPlan>('free');
  // FIX: Added isAdmin state.
  const [isAdmin, setIsAdmin] = useState(false);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);

    const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
      setIsLoading(true);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPlan(data.subscriptionPlan || 'free');
        // FIX: Set admin status based on user role from Firestore.
        setIsAdmin(data.role === 'admin');
        
        const currentUsage = data.usage || { keywordGenerator: 0, contentAnalysis: 0, lastUsageTimestamp: null };
        
        // Check if usage needs to be reset (daily)
        const today = new Date().setHours(0, 0, 0, 0);
        const lastUsageDay = currentUsage.lastUsageTimestamp?.toDate().setHours(0, 0, 0, 0);

        if (today !== lastUsageDay) {
          const newUsage = {
            keywordGenerator: 0,
            contentAnalysis: 0,
            lastUsageTimestamp: serverTimestamp()
          };
          // The onSnapshot listener will be triggered by this update, ensuring state consistency.
          await updateDoc(userDocRef, { usage: newUsage });
        } else {
          setUsage(currentUsage);
        }

      } else {
        // Handle case where user doc might not exist yet
        console.log("User document not found!");
        setPlan('free');
        // FIX: Ensure isAdmin is reset for non-existent users.
        setIsAdmin(false);
        setUsage({ keywordGenerator: 0, contentAnalysis: 0, lastUsageTimestamp: Timestamp.now() });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const isPro = plan === 'pro';

  const canUseFeature = (feature: keyof typeof FREE_PLAN_LIMITS): boolean => {
    if (isPro || !usage) {
      return true;
    }
    return usage[feature] < FREE_PLAN_LIMITS[feature];
  };
  
  const recordUsage = async (feature: keyof typeof FREE_PLAN_LIMITS): Promise<void> => {
     if (!user) throw new Error("User not authenticated");
     const userDocRef = doc(db, 'users', user.uid);
     await updateDoc(userDocRef, {
        [`usage.${feature}`]: increment(1),
        'usage.lastUsageTimestamp': serverTimestamp()
     });
  };

  const upgradeUser = async (): Promise<void> => {
    if (!user) throw new Error("User not authenticated");
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
        subscriptionPlan: 'pro'
    });
  };


  const value = { plan, isPro, isAdmin, usage, isLoading, canUseFeature, recordUsage, upgradeUser };

  return (
    <UserSubscriptionContext.Provider value={value}>
      {children}
    </UserSubscriptionContext.Provider>
  );
};

export const useUserSubscription = () => {
  const context = useContext(UserSubscriptionContext);
  if (context === undefined) {
    throw new Error('useUserSubscription must be used within a UserSubscriptionProvider');
  }
  return context;
};