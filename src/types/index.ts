export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  high52w: number;
  low52w: number;
  pe: number;
  dividend: number;
  sector: string;
}

export interface PredictionData {
  symbol: string;
  prediction: number;
  confidence: number;
  timeframe: '1d' | '1w' | '1m' | '3m';
  factors: string[];
  trend: 'bullish' | 'bearish' | 'neutral';
  lastUpdated: Date;
}

export interface ChartData {
  timestamp: number;
  price: number;
  volume: number;
}

export interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  totalChange: number;
  totalChangePercent: number;
  positions: Position[];
}

export interface Position {
  symbol: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  change: number;
  changePercent: number;
}

export interface Alert {
  id: string;
  symbol: string;
  type: 'price' | 'volume' | 'change';
  condition: 'above' | 'below';
  value: number;
  isActive: boolean;
  triggered: boolean;
  createdAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  defaultTimeframe: '1d' | '1w' | '1m' | '3m' | '1y';
  watchlist: string[];
  alertsEnabled: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
}