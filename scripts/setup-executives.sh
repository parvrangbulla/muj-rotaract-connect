#!/bin/bash

echo "🎯 Rotaract Club MUJ - Executive Account Setup"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo ""

# Check if we're in the right directory
if [ ! -f "create-executives.js" ]; then
    echo "❌ Please run this script from the scripts directory"
    echo "   cd scripts"
    echo "   ./setup-executives.sh"
    exit 1
fi

echo "📦 Installing required dependencies..."
npm install firebase csv-parser

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

echo "🔧 Next steps:"
echo "1. Edit 'create-executives.js' and update Firebase configuration"
echo "2. Edit 'executives-template.csv' with actual executive details"
echo "3. Run: node create-executives.js"
echo ""

echo "📚 For detailed instructions, see: EXECUTIVE_SETUP.md"
echo ""

echo "🚀 Ready to create executive accounts!"
echo "   Make sure to update the configuration files first."
