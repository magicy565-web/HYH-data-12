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
  // Strategic Inputs
  targetAudience?: string;
  usps?: string;
  priceRange?: string;
}

// Simplified and robust result interface
export interface ResearchResult {
  marketSummary: string;
  trends: { year: string; value: number }[]; // Simplified trend data
  shares: { name: string; value: number }[]; // Simplified share data
  competitors: {
    name: string;
    price: string;
    features: string;
    website?: string;
  }[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  // Strategic Insights
  consumerSentiment: string;
  marketingChannels: string[];
  pricingStrategy: string;
  actionPlan: string[];
  rawSearchLinks?: string[];
}

// ... Keep other types for Trade/Logistics/TikTok/Report ...
export interface LogisticsFormData {
  length: number;
  width: number;
  height: number;
  weight?: number;
  unitsPerCbm?: number;
  market: TargetMarket;
}

export interface LogisticsResult {
  seaFreightCost: { perCbm: string; perUnit: string; };
  airFreightCost: { perKg: string; perUnit: string; };
  advice: string;
  warehouses: string[];
}

export interface TikTokShopLink { title: string; url: string; }
export interface TikTokCreator { handle: string; name: string; followers: string; avgViews: string; description: string; }
export interface TikTokDiscoveryFilters { topic: string; views: string; followers: string; }

export enum TradeCountry { UK = 'United Kingdom', US = 'United States', DE = 'Germany', IT = 'Italy', FR = 'France', ES = 'Spain' }
export enum TradeChannel { SUPERMARKET = 'Supermarket', RETAIL_STORE = 'Retail Store', HYPERMARKET = 'Hypermarket', VENDING_MACHINE = 'Vending Machine' }
export interface TradeResearchResult { matchScore: number; demandScore: number; developmentScore: number; averageScore: number; reasoning: string; }
export interface Buyer { name: string; type: string; description: string; website?: string; }
export interface CantonFairData { id: number; buyerName: string; country: string; products: string; contactInfo: string; sessionDate: string; }

export type Language = 'en' | 'zh';
export type ReportItemType = 'text' | 'chart-line' | 'chart-bar' | 'swot';
export interface ReportItem { id: string; type: ReportItemType; title: string; comment?: string; timestamp: number; data: any; }
export interface ReportContextType { items: ReportItem[]; addItem: (item: Omit<ReportItem, 'id' | 'timestamp'>) => void; removeItem: (id: string) => void; moveItem: (id: string, direction: 'up' | 'down') => void; clearReport: () => void; }
export type BuyerSize = 'Small' | 'Medium' | 'Large' | 'Any';
