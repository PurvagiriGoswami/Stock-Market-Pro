import React from 'react';
import { TrendingUp, TrendingDown, Minus, Star, StarOff } from 'lucide-react';
import { Stock } from '../types';

interface StockCardProps {
  stock: Stock;
  isInWatchlist: boolean;
  onToggleWatchlist: (symbol: string) => void;
  onClick: (stock: Stock) => void;
}

const StockCard: React.FC<StockCardProps> = ({ 
  stock, 
  isInWatchlist, 
  onToggleWatchlist, 
  onClick 
}) => {
  const isPositive = stock.change > 0;
  const isNegative = stock.change < 0;
  
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number) => `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
  const formatPercent = (percent: number) => `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    }
    return `${(volume / 1000).toFixed(0)}K`;
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
      onClick={() => onClick(stock)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {stock.symbol}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchlist(stock.symbol);
                }}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isInWatchlist ? (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                ) : (
                  <StarOff className="h-4 w-4 text-gray-400 hover:text-yellow-500" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {stock.name}
            </p>
            <span className="inline-block px-2 py-1 mt-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
              {stock.sector}
            </span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(stock.price)}
            </p>
            <div className={`flex items-center space-x-1 ${
              isPositive ? 'text-green-600 dark:text-green-400' : 
              isNegative ? 'text-red-600 dark:text-red-400' : 
              'text-gray-600 dark:text-gray-400'
            }`}>
              {isPositive && <TrendingUp className="h-4 w-4" />}
              {isNegative && <TrendingDown className="h-4 w-4" />}
              {!isPositive && !isNegative && <Minus className="h-4 w-4" />}
              <span className="text-sm font-medium">
                {formatChange(stock.change)} ({formatPercent(stock.changePercent)})
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600 dark:text-gray-400">Volume</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatVolume(stock.volume)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">P/E Ratio</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {stock.pe.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">52W High</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatPrice(stock.high52w)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-400">52W Low</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatPrice(stock.low52w)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockCard;