import React, { useState } from 'react';
import { LogoIcon, EmailIcon, LockIcon, EyeOpenIcon, EyeClosedIcon, GoogleIcon, SpinnerIcon } from './icons';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useTranslations } from '../hooks/useTranslations';

interface LoginPageProps {
  onNavigateToSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigateToSignup }) => {
  const { t } = useTranslations();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError(t('loginErrorInvalidCredentials'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError(t('loginErrorGoogle'));
      console.error(error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-slate-900"
    >
      <div className="p-8 sm:p-10 bg-slate-800/50 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <LogoIcon className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">{t('appName')}</h1>
          </div>
          <h2 className="text-3xl font-extrabold text-white">{t('loginWelcome')}</h2>
        </div>

        <form onSubmit={handleLogin}>
          {error && <p className="bg-red-500/20 border border-red-500/50 text-red-300 text-sm text-center p-3 rounded-lg mb-4">{error}</p>}
          <div className="mb-4 relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-gray-400">
              <EmailIcon className="w-5 h-5" />
            </div>
            <input 
              type="email" 
              placeholder={t('loginEmailPlaceholder')}
              className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 rounded-lg p-3 ps-12 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300" 
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
              placeholder={t('loginPasswordPlaceholder')}
              className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-gray-400 rounded-lg p-3 ps-12 pe-12 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition duration-300"
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
          
          <div className="flex items-center justify-between mb-6 text-sm">
             <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-600" />
              <label htmlFor="remember-me" className="ms-2 text-gray-300">{t('loginRememberMe')}</label>
            </div>
            <a href="#" className="text-blue-400 hover:underline">{t('loginForgotPassword')}</a>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg flex justify-center items-center disabled:bg-image-none disabled:bg-slate-600"
            disabled={loading}
          >
            {loading ? <SpinnerIcon className="w-5 h-5" /> : t('loginButton')}
          </button>
          
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-4 text-gray-400 text-sm">{t('loginOr')}</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
          
          <button onClick={handleGoogleSignIn} type="button" className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold py-2.5 px-4 rounded-lg hover:bg-gray-200 transition duration-300 disabled:opacity-70" disabled={loading}>
            <GoogleIcon className="w-5 h-5" />
            <span>{t('loginWithGoogle')}</span>
          </button>

        </form>
        
        <p className="mt-8 text-center text-sm text-gray-300">
          {t('loginNoAccount')} <a href="#" onClick={(e) => { e.preventDefault(); onNavigateToSignup(); }} className="font-semibold text-blue-400 hover:underline">{t('loginSignUpNow')}</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;