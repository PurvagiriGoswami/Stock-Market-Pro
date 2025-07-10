import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Stock, ChartData } from '../types';
import AdvancedStockChart from './AdvancedStockChart';
import PredictionPanel from './PredictionPanel';
import { generateChartData } from '../services/marketData';

interface StockModalProps {
  stock: Stock;
  onClose: () => void;
}

const StockModal: React.FC<StockModalProps> = ({ stock, onClose }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1d' | '1w' | '1m' | '3m' | '1y'>('1w');
  const [chartData] = useState<ChartData[]>(() => generateChartData(30));

  const timeframeOptions = [
    { value: '1d', label: '1D' },
    { value: '1w', label: '1W' },
    { value: '1m', label: '1M' },
    { value: '3m', label: '3M' },
    { value: '1y', label: '1Y' },
  ];

  const isPositive = stock.change > 0;
  const isNegative = stock.change < 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(1)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    }
    return formatCurrency(value);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stock.symbol}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{stock.name}</p>
              </div>
              <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                {stock.sector}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Close modal"
            >
              <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(stock.price)}
                    </p>
                    <div className={`flex items-center space-x-1 ${
                      isPositive ? 'text-green-600 dark:text-green-400' : 
                      isNegative ? 'text-red-600 dark:text-red-400' : 
                      'text-gray-600 dark:text-gray-400'
                    }`}>
                      {isPositive && <TrendingUp className="h-5 w-5" />}
                      {isNegative && <TrendingDown className="h-5 w-5" />}
                      {!isPositive && !isNegative && <Minus className="h-5 w-5" />}
                      <span className="text-lg font-medium">
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} 
                        ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {timeframeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedTimeframe(option.value as '1d' | '1w' | '1m' | '3m' | '1y')}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${
                          selectedTimeframe === option.value
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                <AdvancedStockChart 
                  data={chartData} 
                  symbol={stock.symbol} 
                  timeframe={selectedTimeframe} 
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Market Cap</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatLargeNumber(stock.marketCap)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">P/E Ratio</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stock.pe.toFixed(2)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">52W High</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(stock.high52w)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">52W Low</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(stock.low52w)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Volume</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {(stock.volume / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dividend</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stock.dividend.toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <PredictionPanel symbol={stock.symbol} chartData={chartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockModal;