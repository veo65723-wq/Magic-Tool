import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

export const useTranslations = () => {
  const { language } = useLanguage();

  const t = (key: keyof typeof translations.ar, replacements?: { [key: string]: string | number }) => {
    let translation = translations[language][key] || key;
    if (replacements) {
      Object.keys(replacements).forEach(rKey => {
        translation = translation.replace(`{${rKey}}`, String(replacements[rKey]));
      });
    }
    return translation;
  };

  return { t, language };
};