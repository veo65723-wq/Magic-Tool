import React from 'react';
import LandingHeader from './LandingHeader';
import { useTranslations } from '../hooks/useTranslations';
import { ChartBarIcon, UsersIcon, SearchIcon, LightBulbIcon, EyeIcon, DocumentTextIcon, CheckCircleIcon, SparklesIcon, ArrowRightIcon } from './icons';
import Card from './Card';

interface LandingPageProps {
  onNavigateToLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin }) => {
  const { t } = useTranslations();

  const features = [
    {
      icon: SearchIcon,
      title: t('featureMarketAnalysisTitle'),
      description: t('featureMarketAnalysisDesc')
    },
    {
      icon: UsersIcon,
      title: t('featureCompetitorAnalysisTitle'),
      description: t('featureCompetitorAnalysisDesc')
    },
    {
      icon: LightBulbIcon,
      title: t('featureContentCoPilotTitle'),
      description: t('featureContentCoPilotDesc')
    },
    {
      icon: DocumentTextIcon,
      title: t('featureContentAnalysisTitle'),
      description: t('featureContentAnalysisDesc')
    },
    {
      icon: EyeIcon,
      title: t('featureVisualAnalyzerTitle'),
      description: t('featureVisualAnalyzerDesc')
    },
    {
      icon: ChartBarIcon,
      title: t('featureSmartMonitorTitle'),
      description: t('featureSmartMonitorDesc')
    }
  ];

  const testimonials = [
    {
      quote: t('testimonial1Quote'),
      name: t('testimonial1Name'),
      role: t('testimonial1Role'),
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      quote: t('testimonial2Quote'),
      name: t('testimonial2Name'),
      role: t('testimonial2Role'),
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
        quote: t('testimonial3Quote'),
        name: t('testimonial3Name'),
        role: t('testimonial3Role'),
        avatar: 'https://i.pravatar.cc/150?img=3'
    }
  ];

  return (
    <div className="bg-slate-900 text-white">
      <LandingHeader onLoginClick={onNavigateToLogin} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden px-4">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" 
          style={{ backgroundImage: 'url(https://picsum.photos/seed/landing/1920/1080)' }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/80 to-slate-900"></div>
        <div className="relative z-10 animate-fade-in space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            {t('landingHeroTitle')}
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300">
            {t('landingHeroSubtitle')}
          </p>
          <button 
            onClick={onNavigateToLogin}
            className="group bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg py-4 px-8 rounded-lg transition-transform hover:scale-105 duration-300 shadow-lg"
          >
            <span className="flex items-center gap-2">
              {t('landingHeroCta')}
              <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('landingFeaturesTitle')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-12">{t('landingFeaturesSubtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-right p-8 hover:border-blue-500/50 hover:-translate-y-2 transition-transform duration-300">
                <div className="flex justify-end mb-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg inline-block">
                        <feature.icon className="w-8 h-8 text-blue-400" />
                    </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">{t('landingTestimonialsTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <Card key={index} className="text-right p-8">
                        <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                        <div className="flex justify-end items-center gap-4">
                             <div>
                                <p className="font-bold text-white">{testimonial.name}</p>
                                <p className="text-sm text-blue-300">{testimonial.role}</p>
                            </div>
                            <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full border-2 border-slate-600"/>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
         <div className="container mx-auto text-center max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('landingPricingTitle')}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-12">{t('landingPricingSubtitle')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
                <Card className="border-slate-700 p-8">
                    <h3 className="text-2xl font-bold text-white">{t('freePlan')}</h3>
                    <p className="text-gray-400 mt-2 mb-6">للبدء واستكشاف الأساسيات</p>
                    <p className="text-4xl font-bold text-white mb-6">$0 <span className="text-lg font-normal text-gray-400">/ {t('perMonth')}</span></p>
                    <ul className="space-y-3 text-gray-300">
                        <li className="flex items-center justify-end gap-3"><CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" /><span>تحليل السوق والمنافسين</span></li>
                        <li className="flex items-center justify-end gap-3"><CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" /><span>3 عمليات بحث عن الكلمات المفتاحية / يوم</span></li>
                        <li className="flex items-center justify-end gap-3"><CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" /><span>2 تحليل محتوى / يوم</span></li>
                    </ul>
                </Card>

                <Card className="border-purple-500 ring-2 ring-purple-500 p-8">
                     <div className="flex justify-between items-center">
                        <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">الأكثر شيوعاً</span>
                        <h3 className="text-2xl font-bold text-white">{t('proPlan')}</h3>
                    </div>
                    <p className="text-gray-400 mt-2 mb-6">للمستخدمين المتقدمين والفرق</p>
                    <p className="text-4xl font-bold text-white mb-6">$29 <span className="text-lg font-normal text-gray-400">/ {t('perMonth')}</span></p>
                    <ul className="space-y-3 text-gray-300 mb-8">
                        <li className="flex items-center justify-end gap-3"><SparklesIcon className="w-5 h-5 text-purple-300 flex-shrink-0" /><span>كل شيء في الخطة المجانية، بالإضافة إلى:</span></li>
                        <li className="flex items-center justify-end gap-3"><CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" /><span>استخدام غير محدود لجميع الأدوات</span></li>
                        <li className="flex items-center justify-end gap-3"><CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" /><span>مساعد المحتوى والمحلل البصري</span></li>
                        <li className="flex items-center justify-end gap-3"><CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" /><span>دعم فني ذو أولوية</span></li>
                    </ul>
                </Card>
            </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
            <div className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 rounded-xl p-10 md:p-16 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('landingCtaTitle')}</h2>
                <p className="text-blue-100 max-w-2xl mx-auto mb-8">{t('landingCtaSubtitle')}</p>
                <button 
                    onClick={onNavigateToLogin}
                    className="bg-white text-slate-800 font-bold text-lg py-3 px-8 rounded-lg transition-transform hover:scale-105 duration-300 shadow-lg"
                >
                    {t('landingCtaButton')}
                </button>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800">
        <div className="container mx-auto text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} {t('appName')}. {t('landingFooterText')}.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;