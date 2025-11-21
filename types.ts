
export enum TargetMarket {
  UK = 'United Kingdom',
  US = 'United States'
}

export enum CompanyType {
  MANUFACTURER = 'Manufacturer',
  TRADER = 'Trader',
  AGENT = 'Agent'
}

export interface FormData {
  companyName: string;
  companyWebsite?: string;
  market: TargetMarket;
  productName: string;
  companyType: CompanyType;
  images: File[];
}

export interface Competitor {
  name: string;
  features: string;
  price?: string;
  website?: string;
}

export interface MarketTrendData {
  year: string;
  marketSize: number; // Normalized 0-100 or value
}

export interface CompetitorShareData {
  name: string;
  share: number; // Percentage
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface ResearchResult {
  marketSummary: string;
  fiveYearTrendAnalysis: string;
  swot: SWOT;
  competitors: Competitor[];
  chartData: {
    trends: MarketTrendData[];
    shares: CompetitorShareData[];
  };
  rawSearchLinks?: string[];
}

export interface LogisticsFormData {
  length: number;
  width: number;
  height: number;
  weight?: number;
  unitsPerCbm?: number;
  market: TargetMarket;
}

export interface LogisticsResult {
  seaFreightCost: {
    perCbm: string;
    perUnit: string;
  };
  airFreightCost: {
    perKg: string;
    perUnit: string;
  };
  advice: string;
  warehouses: string[];
}

// TikTok Types
export interface TikTokShopLink {
  title: string;
  url: string;
}

export interface TikTokCreator {
  handle: string;
  name: string;
  followers: string;
  avgViews: string;
  description: string;
}

export interface TikTokDiscoveryFilters {
  topic: string;
  views: string;
  followers: string;
}

// Trade Research Types
export enum TradeCountry {
  UK = 'United Kingdom',
  US = 'United States',
  DE = 'Germany',
  IT = 'Italy',
  FR = 'France',
  ES = 'Spain'
}

export enum TradeChannel {
  SUPERMARKET = 'Supermarket',
  RETAIL_STORE = 'Retail Store',
  HYPERMARKET = 'Hypermarket',
  VENDING_MACHINE = 'Vending Machine'
}

export interface TradeResearchResult {
  matchScore: number; // 1-10
  demandScore: number; // 1-10
  developmentScore: number; // 1-10
  averageScore: number;
  reasoning: string;
}

export interface Buyer {
  name: string;
  type: string;
  description: string;
  website?: string;
}

export interface CantonFairData {
  id: number;
  buyerName: string;
  country: string;
  products: string;
  contactInfo: string; // simulated email/phone
  sessionDate: string; // Spring or Autumn
}

export type Language = 'en' | 'zh';
