export type SubscriptionPlan = 'free' | 'pro';

export interface ChartDataPoint {
  name: string;
  uv: number;
}

export interface StrategicBrief {
  event: string;
  analysis: string;
  recommendation: string;
}

export interface KeywordData {
    keyword: string;
    volume: string;
    sd: string;
    cpc: string;
}

export interface MarketAnalysisData {
  searchVolumeTrend: ChartDataPoint[];
  summary: {
    keywordDifficulty: number;
    averageMonthlyVolume: number;
    seoDifficulty: string;
  };
  topKeywords: KeywordData[];
  longTailKeywords: KeywordData[];
  commonQuestions: string[];
  contentOpportunities: {
    type: string;
    title: string;
  }[];
}

export interface CompetitorAnalysisData {
  overview: {
    authorityScore: number;
    monthlyVisits: number;
    organicKeywords: number;
    backlinks: number;
  };
  trafficTrend: ChartDataPoint[];
  topKeywords: KeywordData[];
}

export type ReportType = 
    | 'market-analysis' 
    | 'competitor-analysis'
    | 'content-analysis'
    | 'visual-analyzer'
    | 'magic-tool'
    | 'content-copilot';

export interface Report {
  id: string;
  userId: string;
  type: ReportType;
  query: string;
  date: string;
  data: MarketAnalysisData | CompetitorAnalysisData | ContentStrategyData | string;
}

export interface MonitoredItem {
    id: string;
    userId: string;
    value: string;
    type: 'keyword' | 'competitor';
}

export interface ContentStrategyData {
    pillarPageIdea: {
        title: string;
        description: string;
    };
    blogIdeas: {
        title: string;
        summary: string;
    }[];
    socialMediaPosts: {
        platform: string;
        post: string;
    }[];
}

export interface AudiencePersona {
    avatarUrl: string;
    name: string;
    age: number;
    role: string;
    bio: string;
    goals: string[];
    painPoints: string[];
}

// FIX: Added Feature type for feature flag management.
export interface Feature {
  id: string;
  name: string;
  enabled: boolean;
}