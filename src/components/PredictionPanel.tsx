import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react';
import { PredictionData, ChartData } from '../types';
import { generateAdvancedPrediction } from '../services/advancedPrediction';

interface PredictionPanelProps {
  symbol: string;
  chartData: ChartData[];
}

const PredictionPanel: React.FC<PredictionPanelProps> = ({ symbol, chartData }) => {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState<'1d' | '1w' | '1m' | '3m'>('1w');

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const newPrediction = await generateAdvancedPrediction(symbol, timeframe, chartData);
      setPrediction(newPrediction);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction();
  }, [symbol, timeframe]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'bearish':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'bullish':
        return 'text-green-600 dark:text-green-400';
      case 'bearish':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 dark:text-green-400';
    if (confidence >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            AI Prediction
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as '1d' | '1w' | '1m' | '3m')}
            className="px-3 py-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            title="Select prediction timeframe"
          >
            <option value="1d">1 Day</option>
            <option value="1w">1 Week</option>
            <option value="1m">1 Month</option>
            <option value="3m">3 Months</option>
          </select>
          <button
            onClick={fetchPrediction}
            disabled={loading}
            className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors disabled:opacity-50"
            title="Refresh prediction"
          >
            <RefreshCw className={`h-4 w-4 text-purple-600 dark:text-purple-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Generating prediction...</span>
        </div>
      ) : prediction ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              {getTrendIcon(prediction.trend)}
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {timeframe.toUpperCase()} Prediction
                </p>
                <p className={`text-2xl font-bold ${getTrendColor(prediction.trend)}`}>
                  {prediction.prediction > 0 ? '+' : ''}{prediction.prediction.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Confidence</p>
              <p className={`text-xl font-bold ${getConfidenceColor(prediction.confidence)}`}>
                {prediction.confidence}%
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Key Factors
            </h4>
            <ul className="space-y-1">
              {prediction.factors.map((factor, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {prediction.lastUpdated.toLocaleString()}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Unable to generate prediction. Please try again.
        </div>
      )}
    </div>
  );
};

export default PredictionPanel;