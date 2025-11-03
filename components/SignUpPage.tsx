import React, { useState } from 'react';
import { LogoIcon, UserIcon, EmailIcon, LockIcon, EyeOpenIcon, EyeClosedIcon, SpinnerIcon } from './icons';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useTranslations } from '../hooks/useTranslations';

interface SignUpPageProps {
  onNavigateToLogin: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigateToLogin }) => {
  const { t } = useTranslations();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t('signUpErrorPasswordMismatch'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: fullName });
      
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: fullName,
        email: user.email,
        createdAt: serverTimestamp(),
        subscriptionPlan: 'free',
        usage: {
          keywordGenerator: 0,
          contentAnalysis: 0,
          lastUsageTimestamp: serverTimestamp()
        }
      });
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError(t('signUpErrorEmailInUse'));
      } else if (error.code === 'auth/weak-password') {
        setError(t('signUpErrorWeakPassword'));
      } else {
        setError(t('signUpErrorGeneral'));
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat" 
      style={{ backgroundImage: 'url(https://picsum.photos/seed/market/1920/1080)' }}
    >
      <div className="absolute inset-0 bg-slate-900 bg-opacity-70 backdrop-blur-sm"></div>
      <div className="relative z-10 p-8 sm:p-10 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <LogoIcon className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">{t('appName')}</h1>
          </div>
          <h2 className="text-3xl font-extrabold text-white">{t('signUpTitle')}</h2>
        </div>

        <form onSubmit={handleSignUp}>
          {error && <p className="bg-red-500/20 border border-red-500/50 text-red-300 text-sm text-center p-3 rounded-lg mb-4">{error}</p>}
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-400">
              <UserIcon className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder={t('signUpFullNamePlaceholder')}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg p-3 ps-12 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300" 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-4 relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-400">
              <EmailIcon className="w-5 h-5" />
            </div>
            <input 
              type="email" 
              placeholder={t('signUpEmailPlaceholder')}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg p-3 ps-12 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-4 relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-400">
              <LockIcon className="w-5 h-5" />
            </div>
            <input 
              type={passwordVisible ? "text" : "password"} 
              placeholder={t('signUpPasswordPlaceholder')}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg p-3 ps-12 pe-12 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button 
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-gray-400 hover:text-white"
            >
              {passwordVisible ? <EyeClosedIcon className="w-5 h-5" /> : <EyeOpenIcon className="w-5 h-5" />}
            </button>
          </div>

          <div className="mb-6 relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-400">
              <LockIcon className="w-5 h-5" />
            </div>
            <input 
              type={confirmPasswordVisible ? "text" : "password"} 
              placeholder={t('signUpConfirmPasswordPlaceholder')}
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg p-3 ps-12 pe-12 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <button 
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 end-0 flex items-center pe-3.5 text-gray-400 hover:text-white"
            >
              {confirmPasswordVisible ? <EyeClosedIcon className="w-5 h-5" /> : <EyeOpenIcon className="w-5 h-5" />}
            </button>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg mb-6 flex justify-center items-center disabled:bg-slate-600"
            disabled={loading}
          >
            {loading ? <SpinnerIcon className="w-5 h-5" /> : t('signUpButton')}
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-300">
          {t('signUpHaveAccount')} <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToLogin(); }} className="font-semibold text-blue-400 hover:underline">{t('signUpLoginNow')}</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;