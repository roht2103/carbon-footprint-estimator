#!/bin/bash

# Carbon Footprint Estimator Deployment Script

echo "🌱 Deploying Carbon Footprint Estimator..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "📝 Please copy .env.example to .env.local and fill in your values"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Build the application
echo "🔨 Building application..."
bun run build

# Run database migrations
echo "🗄️  Setting up database..."
bun run db:push

echo "✅ Deployment complete!"
echo "🚀 Run 'bun run start' to start the production server"