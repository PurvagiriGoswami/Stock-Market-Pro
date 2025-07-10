# Stoxio

A modern stock market analysis and portfolio management application built with React, TypeScript, and Vite.

## Features

- Real-time stock data visualization
- Portfolio tracking and management
- Stock predictions using Grok AI
- Watchlist functionality
- Dark/Light theme support
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Stoxio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   
   **Option A: Use the setup script (Recommended)**
   ```bash
   # On Windows PowerShell
   .\setup-env.ps1
   ```
   
   **Option B: Manual setup**
   - Create a `.env` file in the root directory
   - Add your Grok API credentials:
   ```env
   VITE_GROK_API_KEY=your_grok_api_key_here
   VITE_GROK_API_URL=https://api.x.ai/v1/chat/completions
   ```

4. Get your Grok API key:
   - Visit [X.AI Console](https://console.x.ai/)
   - Sign up or log in
   - Generate an API key
   - Copy the key to your `.env` file

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Building for Production

```bash
npm run build
```

## Deployment

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set environment variables in Netlify dashboard:
   - Go to Site settings > Environment variables
   - Add `VITE_GROK_API_KEY` with your API key
   - Add `VITE_GROK_API_URL` with the API URL
3. Deploy automatically from your main branch

### Environment Variables

- `VITE_GROK_API_KEY`: Your Grok API key (required for predictions)
- `VITE_GROK_API_URL`: Grok API endpoint (defaults to https://api.x.ai/v1/chat/completions)

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Use environment variables for all sensitive configuration
- For production, set environment variables in your hosting platform

## License

MIT
# MarketPro
# Stock-Market-Pro
# Stock-Market-Pro
