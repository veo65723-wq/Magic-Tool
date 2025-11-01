import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import SignUpPage from './components/SignUpPage';
import LandingPage from './components/LandingPage'; // Import LandingPage
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { SpinnerIcon } from './components/icons';
import { useLanguage } from './contexts/LanguageContext';
import { UserSubscriptionProvider } from './contexts/UserSubscriptionContext';
import { FeaturesProvider } from './contexts/FeaturesContext';

// Add 'landing' to the view types
type View = 'landing' | 'login' | 'signup';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Set initial view to 'landing'
  const [view, setView] = useState<View>('landing');
  const { language } = useLanguage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const handleNavigate = (targetView: View) => {
    setView(targetView);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <SpinnerIcon className="w-12 h-12 text-blue-400" />
      </div>
    );
  }

  if (user) {
    return (
      <UserSubscriptionProvider user={user}>
        <FeaturesProvider>
           <Dashboard user={user} />
        </FeaturesProvider>
      </UserSubscriptionProvider>
    );
  }

  // Updated logic to handle the 'landing' view
  switch (view) {
    case 'landing':
      return <LandingPage onNavigateToLogin={() => handleNavigate('login')} />;
    case 'login':
      return <LoginPage onNavigateToSignup={() => handleNavigate('signup')} />;
    case 'signup':
      return <SignUpPage onNavigateToLogin={() => handleNavigate('login')} />;
    default:
      return <LandingPage onNavigateToLogin={() => handleNavigate('login')} />;
  }
};

export default App;