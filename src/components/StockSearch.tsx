import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, BarChart3, Info, X } from 'lucide-react';
import { Stock, ChartData } from '../types';
import { generateChartData } from '../services/marketData';

interface StockSearchProps {
  onStockSelect: (stock: Stock) => void;
}

const StockSearch: React.FC<StockSearchProps> = ({ onStockSelect }) => {
  const [searchSymbol, setSearchSymbol] = useState('');
  const [searchedStock, setSearchedStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  // Mock function to simulate stock data fetching
  const fetchStockData = async (symbol: string): Promise<Stock> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock data for any symbol
    const basePrice = 50 + Math.random() * 300;
    const change = (Math.random() - 0.5) * 20;
    const changePercent = (change / basePrice) * 100;
    
    const mockNames: { [key: string]: string } = {
      'AAPL': 'Apple Inc.',
      'MSFT': 'Microsoft Corporation',
      'GOOGL': 'Alphabet Inc.',
      'AMZN': 'Amazon.com Inc.',
      'TSLA': 'Tesla Inc.',
      'NVDA': 'NVIDIA Corporation',
      'META': 'Meta Platforms Inc.',
      'NFLX': 'Netflix Inc.',
      'JPM': 'JPMorgan Chase & Co.',
      'JNJ': 'Johnson & Johnson',
    };

    const mockSectors: { [key: string]: string } = {
      'AAPL': 'Technology',
      'MSFT': 'Technology',
      'GOOGL': 'Technology',
      'AMZN': 'Consumer Discretionary',
      'TSLA': 'Consumer Discretionary',
      'NVDA': 'Technology',
      'META': 'Technology',
      'NFLX': 'Communication Services',
      'JPM': 'Financial Services',
      'JNJ': 'Healthcare',
    };

    return {
      symbol: symbol.toUpperCase(),
      name: mockNames[symbol.toUpperCase()] || `${symbol.toUpperCase()} Corporation`,
      price: basePrice + change,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap: Math.floor(Math.random() * 2000000000000) + 100000000000,
      high52w: basePrice * (1 + Math.random() * 0.3),
      low52w: basePrice * (1 - Math.random() * 0.3),
      pe: Math.random() * 30 + 10,
      dividend: Math.random() * 5,
      sector: mockSectors[symbol.toUpperCase()] || 'General',
    };
  };

  const handleSearch = async () => {
    if (!searchSymbol.trim()) return;

    setIsLoading(true);
    setError(null);
    setSearchedStock(null);

    try {
      const stockData = await fetchStockData(searchSymbol.trim());
      setSearchedStock(stockData);
      
      // Generate chart data for the searched stock
      const chartData = generateChartData(30);
      setChartData(chartData);
    } catch {
      setError('Failed to fetch stock data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchSymbol('');
    setSearchedStock(null);
    setError(null);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatVolume = (num: number): string => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
          Stock Analysis
        </h2>
        {searchedStock && (
          <button
            onClick={clearSearch}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Clear search"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Enter stock symbol (e.g., AAPL, MSFT, TSLA)"
          value={searchSymbol}
          onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
          onKeyPress={handleKeyPress}
          className="pl-10 pr-4 py-3 w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading || !searchSymbol.trim()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Stock Analysis Results */}
      {searchedStock && (
        <div className="space-y-6">
          {/* Stock Header */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {searchedStock.symbol}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{searchedStock.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">{searchedStock.sector}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${searchedStock.price.toFixed(2)}
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  searchedStock.change >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {searchedStock.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {searchedStock.change >= 0 ? '+' : ''}{searchedStock.change.toFixed(2)} 
                  ({searchedStock.changePercent >= 0 ? '+' : ''}{searchedStock.changePercent.toFixed(2)}%)
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Market Cap</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatNumber(searchedStock.marketCap)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Volume</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatVolume(searchedStock.volume)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">P/E Ratio</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {searchedStock.pe.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Dividend Yield</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {searchedStock.dividend.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* 52-Week Range */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">52-Week Range</h4>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">Low</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${searchedStock.low52w.toFixed(2)}
                </p>
              </div>
              <div className="flex-1 mx-4">
                <div className="relative h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                  <div 
                    className="absolute h-2 bg-blue-600 rounded-full"
                    style={{
                      left: `${((searchedStock.price - searchedStock.low52w) / (searchedStock.high52w - searchedStock.low52w)) * 100}%`,
                      width: '4px',
                      transform: 'translateX(-50%)'
                    }}
                  ></div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">High</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  ${searchedStock.high52w.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => onStockSelect(searchedStock)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Details
            </button>
            <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Add to Watchlist
            </button>
          </div>
        </div>
      )}

      {/* Quick Tips */}
      {!searchedStock && !isLoading && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Quick Tips</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Enter any stock symbol to get real-time analysis</li>
                <li>• Popular symbols: AAPL, MSFT, GOOGL, TSLA, AMZN</li>
                <li>• View detailed charts and performance metrics</li>
                <li>• Add stocks to your watchlist for easy tracking</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockSearch; 