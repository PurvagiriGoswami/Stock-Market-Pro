import { Stock, ChartData } from '../types';

// Simulate real-time market data
export const generateMockStocks = (): Stock[] => {
  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary' },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
    { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
    { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
  ];

  return stocks.map(stock => {
    const basePrice = 100 + Math.random() * 400;
    const change = (Math.random() - 0.5) * 10;
    const changePercent = (change / basePrice) * 100;
    
    return {
      ...stock,
      price: basePrice + change,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap: Math.floor(Math.random() * 2000000000000) + 100000000000,
      high52w: basePrice * (1 + Math.random() * 0.3),
      low52w: basePrice * (1 - Math.random() * 0.3),
      pe: Math.random() * 30 + 10,
      dividend: Math.random() * 5,
    };
  });
};

export const generateChartData = (days: number = 30): ChartData[] => {
  const data: ChartData[] = [];
  const startPrice = 100 + Math.random() * 200;
  let currentPrice = startPrice;
  
  for (let i = 0; i < days; i++) {
    const timestamp = Date.now() - (days - i) * 24 * 60 * 60 * 1000;
    currentPrice += (Math.random() - 0.5) * 10;
    
    data.push({
      timestamp,
      price: Math.max(currentPrice, 10),
      volume: Math.floor(Math.random() * 5000000) + 500000,
    });
  }
  
  return data;
};

export const updateStockPrice = (stock: Stock): Stock => {
  const priceChange = (Math.random() - 0.5) * 2;
  const newPrice = Math.max(stock.price + priceChange, 1);
  const change = newPrice - stock.price;
  const changePercent = (change / stock.price) * 100;
  
  return {
    ...stock,
    price: newPrice,
    change,
    changePercent,
    volume: stock.volume + Math.floor((Math.random() - 0.5) * 100000),
  };
};