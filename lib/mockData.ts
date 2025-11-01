import type { MarketAnalysisData, CompetitorAnalysisData } from '../types';

export const marketAnalysisMock: MarketAnalysisData = {
  searchVolumeTrend: [
    { name: 'Jan', uv: 400 },
    { name: 'Feb', uv: 300 },
    { name: 'Mar', uv: 500 },
    { name: 'Apr', uv: 450 },
    { name: 'May', uv: 600 },
    { name: 'Jun', uv: 550 },
    { name: 'Jul', uv: 650 },
  ],
  summary: {
    keywordDifficulty: 7,
    averageMonthlyVolume: 150000,
    seoDifficulty: '72',
  },
  topKeywords: [
    { keyword: 'شراء اونلاين', volume: '75K', sd: '82', cpc: '0.95' },
    { keyword: 'متاجر الكترونية السعودية', volume: '45K', sd: '75', cpc: '1.10' },
    { keyword: 'افضل موقع تسوق', volume: '30K', sd: '78', cpc: '0.80' },
    { keyword: 'كود خصم', volume: '1.2M', sd: '90', cpc: '0.25' },
  ],
  longTailKeywords: [
    { keyword: 'كيف ابدأ متجر الكتروني في السعودية', volume: '5K', sd: '55', cpc: '1.50' },
    { keyword: 'ارخص مواقع التسوق الالكتروني الدفع عند الاستلام', volume: '8K', sd: '60', cpc: '1.20' },
    { keyword: 'افضل شركات الشحن للمتاجر الالكترونية', volume: '3K', sd: '45', cpc: '1.75' },
  ],
  commonQuestions: [
    'ما هي أفضل منصة للتجارة الإلكترونية؟',
    'كم تكلفة إنشاء متجر إلكتروني؟',
    'كيف يتم شحن المنتجات للعملاء؟',
    'ما هي طرق الدفع المتاحة في السعودية؟',
  ],
  // FIX: Renamed 'contentOpportunity' to 'contentOpportunities' and converted it to an array to match the MarketAnalysisData type.
  contentOpportunities: [
    {
      type: 'دليل شامل',
      title: 'دليلك الكامل لبدء التجارة الإلكترونية في السعودية لعام 2024',
    },
  ],
};

export const competitorAnalysisMock: CompetitorAnalysisData = {
  overview: {
    authorityScore: 8,
    monthlyVisits: 2500000,
    organicKeywords: 120000,
    backlinks: 85000,
  },
  trafficTrend: [
    { name: 'Jan', uv: 2100000 },
    { name: 'Feb', uv: 2300000 },
    { name: 'Mar', uv: 2200000 },
    { name: 'Apr', uv: 2500000 },
    { name: 'May', uv: 2700000 },
    { name: 'Jun', uv: 2600000 },
    { name: 'Jul', uv: 2800000 },
  ],
  topKeywords: [
    { keyword: 'عروض نون', volume: '500K', sd: 'Brand', cpc: '0.10' },
    { keyword: 'كود خصم نون', volume: '800K', sd: 'Brand', cpc: '0.05' },
    { keyword: 'جوالات', volume: '350K', sd: '88', cpc: '1.80' },
    { keyword: 'اجهزة كهربائية', volume: '200K', sd: '85', cpc: '1.50' },
  ],
};