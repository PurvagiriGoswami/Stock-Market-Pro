import React from 'react';
import { PieChart, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Stock, Portfolio as PortfolioType } from '../types';

interface PortfolioProps {
  portfolio: PortfolioType;
  stocks: Stock[];
}

const Portfolio: React.FC<PortfolioProps> = ({ portfolio, stocks }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const isPositive = portfolio.totalChangePercent > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Portfolio
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Value</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(portfolio.totalValue)}
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total P&L</p>
          <div className={`flex items-center space-x-1 ${
            isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <p className="text-xl font-bold">
              {formatCurrency(portfolio.totalChange)}
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Return</p>
          <p className={`text-xl font-bold ${
            isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {formatPercent(portfolio.totalChangePercent)}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-md font-medium text-gray-900 dark:text-white">
          Positions
        </h4>
        
        {portfolio.positions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            <p>No positions in portfolio</p>
            <p className="text-sm mt-1">Add stocks to start tracking your portfolio</p>
          </div>
        ) : (
          <div className="space-y-2">
            {portfolio.positions.map((position) => {
              const positionIsPositive = position.changePercent > 0;
              const stock = stocks.find(s => s.symbol === position.symbol);
              
              return (
                <div
                  key={position.symbol}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {position.symbol}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {position.shares} shares @ {formatCurrency(position.averagePrice)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(position.totalValue)}
                    </p>
                    <div className={`flex items-center justify-end space-x-1 ${
                      positionIsPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {positionIsPositive ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="text-sm">
                        {formatPercent(position.changePercent)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;