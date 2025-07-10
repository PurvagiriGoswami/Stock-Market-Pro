import React from 'react';
import { Star, TrendingUp, TrendingDown, Minus, X } from 'lucide-react';
import { Stock } from '../types';

interface WatchlistProps {
  stocks: Stock[];
  watchlist: string[];
  onRemoveFromWatchlist: (symbol: string) => void;
  onStockClick: (stock: Stock) => void;
}

const Watchlist: React.FC<WatchlistProps> = ({ 
  stocks, 
  watchlist, 
  onRemoveFromWatchlist, 
  onStockClick 
}) => {
  const watchlistStocks = stocks.filter(stock => watchlist.includes(stock.symbol));

  if (watchlistStocks.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="h-6 w-6 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Watchlist
          </h3>
        </div>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Star className="h-12 w-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
          <p>Your watchlist is empty</p>
          <p className="text-sm mt-1">Click the star icon on any stock to add it to your watchlist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Star className="h-6 w-6 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Watchlist
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ({watchlistStocks.length})
        </span>
      </div>
      
      <div className="space-y-2">
        {watchlistStocks.map((stock) => {
          const isPositive = stock.change > 0;
          const isNegative = stock.change < 0;
          
          return (
            <div
              key={stock.symbol}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              onClick={() => onStockClick(stock)}
            >
              <div className="flex items-center space-x-3">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {stock.symbol}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ${stock.price.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 ${
                  isPositive ? 'text-green-600 dark:text-green-400' : 
                  isNegative ? 'text-red-600 dark:text-red-400' : 
                  'text-gray-600 dark:text-gray-400'
                }`}>
                  {isPositive && <TrendingUp className="h-4 w-4" />}
                  {isNegative && <TrendingDown className="h-4 w-4" />}
                  {!isPositive && !isNegative && <Minus className="h-4 w-4" />}
                  <span className="text-sm font-medium">
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromWatchlist(stock.symbol);
                  }}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Watchlist;