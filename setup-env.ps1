# Setup Environment Variables for MarketPro
# This script helps you create a .env file with your Grok API credentials

Write-Host "Setting up environment variables for MarketPro..." -ForegroundColor Green

# Check if .env file already exists
if (Test-Path ".env") {
    Write-Host "Warning: .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Setup cancelled." -ForegroundColor Red
        exit
    }
}

# Get API key from user
Write-Host "`nPlease enter your Grok API key:" -ForegroundColor Cyan
Write-Host "You can get it from: https://console.x.ai/" -ForegroundColor Gray
$apiKey = Read-Host "API Key"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host "Error: API key cannot be empty!" -ForegroundColor Red
    exit
}

# Create .env file
$envContent = @(
    "VITE_GROK_API_KEY=$apiKey",
    "VITE_GROK_API_URL=https://api.x.ai/v1/chat/completions"
)

Set-Content -Path ".env" -Value $envContent

Write-Host "`n✅ Environment variables set up successfully!" -ForegroundColor Green
Write-Host "📁 .env file created with your API credentials" -ForegroundColor Green
Write-Host "🔒 The .env file is already in .gitignore and won't be committed to Git" -ForegroundColor Green
Write-Host "`nYou can now run 'npm run dev' to start the development server" -ForegroundColor Cyan 