import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { format } from 'date-fns';
import { ChartData } from '../types';

interface StockChartProps {
  data: ChartData[];
  symbol: string;
  timeframe: '1d' | '1w' | '1m' | '3m' | '1y';
}

const StockChart: React.FC<StockChartProps> = ({ data, symbol, timeframe }) => {
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

  const formatTooltip = (value: any, name: string) => {
    if (name === 'price') {
      return [`$${value.toFixed(2)}`, 'Price'];
    }
    if (name === 'volume') {
      return [`${(value / 1000000).toFixed(1)}M`, 'Volume'];
    }
    return [value, name];
  };

  const formatTooltipLabel = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM dd, yyyy HH:mm');
  };

  const isPositive = data.length > 1 && data[data.length - 1].price > data[0].price;

  return (
    <div className="h-96 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
          <CartesianGrid 
            strokeDasharray="3 3" 
            className="stroke-gray-200 dark:stroke-gray-700"
          />
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
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;