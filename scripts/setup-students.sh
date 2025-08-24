#!/bin/bash

echo "🚀 Rotaract Club MUJ - Student Account Setup"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo ""

# Check if we're in the scripts directory
if [ ! -f "create-students.js" ]; then
    echo "❌ Please run this script from the scripts directory"
    echo "   cd scripts"
    echo "   ./setup-students.sh"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if students.csv exists
if [ ! -f "students.csv" ]; then
    echo "❌ students.csv file not found!"
    echo "   Please ensure students.csv is in the scripts directory"
    exit 1
fi

echo "📊 Found students.csv with student data"
echo ""

# Count students in CSV
STUDENT_COUNT=$(wc -l < students.csv)
STUDENT_COUNT=$((STUDENT_COUNT - 1)) # Subtract header row
echo "📋 Total students to process: $STUDENT_COUNT"
echo ""

echo "⚠️  IMPORTANT NOTES:"
echo "===================="
echo "• This will create/update $STUDENT_COUNT student accounts"
echo "• Default password: RotaractMUJ@2024!"
echo "• Role: Student (not Executive)"
echo "• Access: Event registration, profile management, service hours tracking"
echo ""

read -p "Do you want to continue? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled"
    exit 1
fi

echo ""
echo "🚀 Starting student account creation..."
echo "======================================"
echo ""

# Run the student creation script
node create-students.js students.csv

echo ""
echo "🎯 Setup complete!"
echo "=================="
echo "Check the output above for any errors or warnings."
echo ""
echo "📧 Students can now login with:"
echo "   Email: Their email from the CSV"
echo "   Password: RotaractMUJ@2024!"
echo ""
echo "🔐 Role: Student (limited permissions)"
echo "🎯 Access: Event registration, profile management"
echo ""
