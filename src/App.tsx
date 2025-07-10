import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import StockCard from './components/StockCard';
import StockModal from './components/StockModal';
import Watchlist from './components/Watchlist';
import Portfolio from './components/Portfolio';
import StockSearch from './components/StockSearch';
import { Stock, Portfolio as PortfolioType } from './types';
import { generateMockStocks, updateStockPrice } from './services/marketData';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [watchlist, setWatchlist] = useLocalStorage<string[]>('watchlist', []);
  const [portfolio] = useState<PortfolioType>({
    id: 'default',
    name: 'My Portfolio',
    totalValue: 125430.50,
    totalChange: 2345.20,
    totalChangePercent: 1.89,
    positions: [
      {
        symbol: 'AAPL',
        shares: 100,
        averagePrice: 150.00,
        currentPrice: 165.50,
        totalValue: 16550.00,
        change: 1550.00,
        changePercent: 10.33
      },
      {
        symbol: 'MSFT',
        shares: 50,
        averagePrice: 280.00,
        currentPrice: 295.75,
        totalValue: 14787.50,
        change: 787.50,
        changePercent: 5.63
      },
      {
        symbol: 'GOOGL',
        shares: 25,
        averagePrice: 2100.00,
        currentPrice: 2234.80,
        totalValue: 55870.00,
        change: 3370.00,
        changePercent: 6.40
      }
    ]
  });

  useEffect(() => {
    const initialStocks = generateMockStocks();
    setStocks(initialStocks);

    // Simulate real-time price updates
    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => updateStockPrice(stock))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleWatchlist = (symbol: string) => {
    const newWatchlist = watchlist.includes(symbol) 
      ? watchlist.filter(s => s !== symbol)
      : [...watchlist, symbol];
    setWatchlist(newWatchlist);
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(s => s !== symbol));
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Stock Search Section */}
          <div className="mb-8">
            <StockSearch onStockSelect={setSelectedStock} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Market Overview
                  </h2>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Live Market Data
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredStocks.map(stock => (
                    <StockCard
                      key={stock.symbol}
                      stock={stock}
                      isInWatchlist={watchlist.includes(stock.symbol)}
                      onToggleWatchlist={toggleWatchlist}
                      onClick={setSelectedStock}
                    />
                  ))}
                </div>
                
                {filteredStocks.length === 0 && searchQuery && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      No stocks found matching "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-6">
              <Watchlist
                stocks={stocks}
                watchlist={watchlist}
                onRemoveFromWatchlist={removeFromWatchlist}
                onStockClick={setSelectedStock}
              />
              
              <Portfolio
                portfolio={portfolio}
                stocks={stocks}
              />
            </div>
          </div>
        </main>
        
        {selectedStock && (
          <StockModal
            stock={selectedStock}
            onClose={() => setSelectedStock(null)}
          />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;