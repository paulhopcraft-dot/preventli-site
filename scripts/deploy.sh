#!/bin/bash
# Preventli deployment script
# Usage: ./scripts/deploy.sh [--prod]

set -e

echo "🚀 Preventli Deploy Script"
echo "=========================="

# Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo "📦 Installing Vercel CLI..."
  npm install -g vercel
fi

# Build check
echo "🏗  Building project..."
npm run build

if [ "$1" == "--prod" ]; then
  echo "🌍 Deploying to PRODUCTION..."
  vercel --prod
else
  echo "🔧 Deploying to PREVIEW..."
  echo "(Use --prod flag for production deployment)"
  vercel
fi

echo "✅ Deploy complete!"
