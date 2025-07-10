import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Scatter,
  ScatterChart
} from 'recharts';
import { format } from 'date-fns';
import { ChartData } from '../types';
import { 
  BarChart3, 
  Activity
} from 'lucide-react';

interface AdvancedStockChartProps {
  data: ChartData[];
  symbol: string;
  timeframe: '1d' | '1w' | '1m' | '3m' | '1y';
}

type ChartType = 'line' | 'area' | 'candlestick' | 'scatter';
type Indicator = 'sma' | 'ema' | 'bollinger' | 'volume' | 'rsi' | 'macd';

const AdvancedStockChart: React.FC<AdvancedStockChartProps> = ({ data, symbol, timeframe }) => {
  const [chartType, setChartType] = useState<ChartType>('area');
  const [showIndicators, setShowIndicators] = useState<Set<Indicator>>(new Set(['sma']));
  const [showVolume, setShowVolume] = useState(false);

      // Calculate technical indicators
    const enhancedData = useMemo(() => {
      if (!data || data.length === 0) return [];

      const prices = data.map(d => d.price);

    // Calculate SMA
    const sma20 = calculateSMA(prices, 20);
    const sma50 = calculateSMA(prices, 50);

    // Calculate EMA
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);

    // Calculate Bollinger Bands
    const bb = calculateBollingerBands(prices, 20, 2);

    // Calculate RSI
    const rsi = calculateRSI(prices, 14);

    // Calculate MACD
    const macd = calculateMACD(prices);

    return data.map((item, index) => ({
      ...item,
      sma20: sma20[index],
      sma50: sma50[index],
      ema12: ema12[index],
      ema26: ema26[index],
      bbUpper: bb.upper[index],
      bbLower: bb.lower[index],
      bbMiddle: bb.middle[index],
      rsi: rsi[index],
      macdLine: macd.macdLine[index],
      signalLine: macd.signalLine[index],
      histogram: macd.histogram[index],
    }));
  }, [data]);

  const formatXAxis = (timestamp: number) => {
    switch (timeframe) {
      case '1d':
        return format(new Date(timestamp), 'HH:mm');
      case '1w':
        return format(new Date(timestamp), 'EEE');
      case '1m':
        return format(new Date(timestamp), 'MM/dd');
      case '3m':
        return format(new Date(timestamp), 'MM/dd');
      case '1y':
        return format(new Date(timestamp), 'MMM');
      default:
        return format(new Date(timestamp), 'MM/dd');
    }
  };

  const formatTooltip = (value: number, name: string) => {
    if (name === 'price') {
      return [`$${value.toFixed(2)}`, 'Price'];
    }
    if (name === 'volume') {
      return [`${(value / 1000000).toFixed(1)}M`, 'Volume'];
    }
    if (name.includes('sma') || name.includes('ema') || name.includes('bb')) {
      return [`$${value.toFixed(2)}`, name.toUpperCase()];
    }
    if (name === 'rsi') {
      return [`${value.toFixed(1)}`, 'RSI'];
    }
    if (name.includes('macd')) {
      return [`${value.toFixed(3)}`, name.toUpperCase()];
    }
    return [value, name];
  };

  const formatTooltipLabel = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM dd, yyyy HH:mm');
  };

  const isPositive = data.length > 1 && data[data.length - 1].price > data[0].price;

  const toggleIndicator = (indicator: Indicator) => {
    const newIndicators = new Set(showIndicators);
    if (newIndicators.has(indicator)) {
      newIndicators.delete(indicator);
    } else {
      newIndicators.add(indicator);
    }
    setShowIndicators(newIndicators);
  };

  const renderMainChart = () => {
    const commonProps = {
      data: enhancedData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={formatTooltipLabel}
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={2}
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: isPositive ? '#10b981' : '#ef4444',
                stroke: '#ffffff',
                strokeWidth: 2
              }}
            />
            {showIndicators.has('sma') && (
              <>
                <Line
                  type="monotone"
                  dataKey="sma20"
                  stroke="#3b82f6"
                  strokeWidth={1}
                  dot={false}
                  name="SMA 20"
                />
                <Line
                  type="monotone"
                  dataKey="sma50"
                  stroke="#8b5cf6"
                  strokeWidth={1}
                  dot={false}
                  name="SMA 50"
                />
              </>
            )}
            {showIndicators.has('ema') && (
              <>
                <Line
                  type="monotone"
                  dataKey="ema12"
                  stroke="#f59e0b"
                  strokeWidth={1}
                  dot={false}
                  name="EMA 12"
                />
                <Line
                  type="monotone"
                  dataKey="ema26"
                  stroke="#ec4899"
                  strokeWidth={1}
                  dot={false}
                  name="EMA 26"
                />
              </>
            )}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop 
                  offset="5%" 
                  stopColor={isPositive ? '#10b981' : '#ef4444'} 
                  stopOpacity={0.3}
                />
                <stop 
                  offset="95%" 
                  stopColor={isPositive ? '#10b981' : '#ef4444'} 
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={formatTooltipLabel}
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={2}
              fill={`url(#gradient-${symbol})`}
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: isPositive ? '#10b981' : '#ef4444',
                stroke: '#ffffff',
                strokeWidth: 2
              }}
            />
            {showIndicators.has('bollinger') && (
              <>
                <Line
                  type="monotone"
                  dataKey="bbUpper"
                  stroke="#6b7280"
                  strokeWidth={1}
                  dot={false}
                  name="BB Upper"
                />
                <Line
                  type="monotone"
                  dataKey="bbLower"
                  stroke="#6b7280"
                  strokeWidth={1}
                  dot={false}
                  name="BB Lower"
                />
                <Line
                  type="monotone"
                  dataKey="bbMiddle"
                  stroke="#9ca3af"
                  strokeWidth={1}
                  dot={false}
                  name="BB Middle"
                />
              </>
            )}
          </AreaChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={formatTooltipLabel}
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
              }}
            />
            <Scatter
              dataKey="price"
              fill={isPositive ? '#10b981' : '#ef4444'}
              name="Price"
            />
          </ScatterChart>
        );

      default:
        return null;
    }
  };

  const renderVolumeChart = () => {
    if (!showVolume) return null;

    return (
      <div className="h-32 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={enhancedData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={formatXAxis}
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 10 }}
            />
            <Tooltip
              formatter={formatTooltip}
              labelFormatter={formatTooltipLabel}
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
              }}
            />
            <Bar dataKey="volume" fill="#6b7280" opacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Chart Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            {symbol} Chart
          </h3>
          
          {/* Chart Type Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Chart:</span>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)}
              className="px-3 py-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              title="Select chart type"
            >
              <option value="area">Area</option>
              <option value="line">Line</option>
              <option value="scatter">Scatter</option>
            </select>
          </div>
        </div>

        {/* Indicator Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`p-2 rounded-lg transition-colors ${
              showVolume 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            title="Toggle Volume"
          >
            <Activity className="h-4 w-4" />
          </button>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => toggleIndicator('sma')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                showIndicators.has('sma')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              SMA
            </button>
            <button
              onClick={() => toggleIndicator('ema')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                showIndicators.has('ema')
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              EMA
            </button>
            <button
              onClick={() => toggleIndicator('bollinger')}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                showIndicators.has('bollinger')
                  ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              BB
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderMainChart()}
        </ResponsiveContainer>
      </div>

      {/* Volume Chart */}
      {renderVolumeChart()}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Price</span>
        </div>
        {showIndicators.has('sma') && (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-blue-500"></div>
              <span>SMA 20</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-purple-500"></div>
              <span>SMA 50</span>
            </div>
          </>
        )}
        {showIndicators.has('ema') && (
          <>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-orange-500"></div>
              <span>EMA 12</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-pink-500"></div>
              <span>EMA 26</span>
            </div>
          </>
        )}
        {showIndicators.has('bollinger') && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-gray-500"></div>
            <span>Bollinger Bands</span>
          </div>
        )}
        {showVolume && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 opacity-70"></div>
            <span>Volume</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Technical indicator calculation functions
const calculateSMA = (prices: number[], period: number): number[] => {
  const sma: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
    } else {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
  }
  return sma;
};

const calculateEMA = (prices: number[], period: number): number[] => {
  const ema: number[] = [];
  const multiplier = 2 / (period + 1);

  for (let i = 0; i < prices.length; i++) {
    if (i === 0) {
      ema.push(prices[i]);
    } else {
      ema.push((prices[i] * multiplier) + (ema[i - 1] * (1 - multiplier)));
    }
  }

  return ema;
};

const calculateBollingerBands = (prices: number[], period: number = 20, stdDev: number = 2) => {
  const sma = calculateSMA(prices, period);
  const upper: number[] = [];
  const lower: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
    } else {
      const slice = prices.slice(i - period + 1, i + 1);
      const mean = sma[i];
      const variance = slice.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / period;
      const standardDeviation = Math.sqrt(variance);
      
      upper.push(mean + (standardDeviation * stdDev));
      lower.push(mean - (standardDeviation * stdDev));
    }
  }

  return { upper, lower, middle: sma };
};

const calculateRSI = (prices: number[], period: number = 14): number[] => {
  const rsi: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  for (let i = 0; i < prices.length; i++) {
    if (i < period) {
      rsi.push(NaN);
    } else {
      const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b, 0) / period;
      const rs = avgGain / avgLoss;
      const rsiValue = 100 - (100 / (1 + rs));
      rsi.push(rsiValue);
    }
  }

  return rsi;
};

const calculateMACD = (prices: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) => {
  const fastEMA = calculateEMA(prices, fastPeriod);
  const slowEMA = calculateEMA(prices, slowPeriod);
  const macdLine: number[] = [];
  const signalLine: number[] = [];
  const histogram: number[] = [];

  for (let i = 0; i < prices.length; i++) {
    if (isNaN(fastEMA[i]) || isNaN(slowEMA[i])) {
      macdLine.push(NaN);
    } else {
      macdLine.push(fastEMA[i] - slowEMA[i]);
    }
  }

  const signalEMA = calculateEMA(macdLine.filter(val => !isNaN(val)), signalPeriod);
  let signalIndex = 0;

  for (let i = 0; i < prices.length; i++) {
    if (isNaN(macdLine[i])) {
      signalLine.push(NaN);
    } else {
      signalLine.push(signalEMA[signalIndex] || NaN);
      signalIndex++;
    }
  }

  for (let i = 0; i < prices.length; i++) {
    if (isNaN(macdLine[i]) || isNaN(signalLine[i])) {
      histogram.push(NaN);
    } else {
      histogram.push(macdLine[i] - signalLine[i]);
    }
  }

  return { macdLine, signalLine, histogram };
};

export default AdvancedStockChart; 