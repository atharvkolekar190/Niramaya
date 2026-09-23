#!/bin/bash

echo "🛑 Stopping Unified Healthcare Platform..."
echo "========================================"

echo ""
echo "🧹 Stopping all services..."

# Stop Python Flask apps
echo "   • Stopping Python Flask applications..."
pkill -f "python.*app.py" 2>/dev/null || echo "     No Python Flask apps running"

# Stop Node.js servers
echo "   • Stopping Node.js servers..."
pkill -f "node.*server.js" 2>/dev/null || echo "     No Node.js servers running"

# Stop Vite development servers
echo "   • Stopping Vite development servers..."
pkill -f "vite" 2>/dev/null || echo "     No Vite servers running"

# Stop nodemon processes
echo "   • Stopping nodemon processes..."
pkill -f "nodemon" 2>/dev/null || echo "     No nodemon processes running"

# Force kill processes on specific ports
echo ""
echo "🔧 Force cleaning ports..."

for port in 3000 3001 3004 5001 5002 5050 8000; do
    if lsof -i :$port >/dev/null 2>&1; then
        echo "   • Cleaning port $port..."
        lsof -ti :$port | xargs kill -9 2>/dev/null || true
    fi
done

echo ""
echo "⏳ Waiting for cleanup..."
sleep 2

echo ""
echo "✅ All services stopped!"
echo ""
echo "📊 Port Status:"
for port in 3000 3001 3004 5001 5002 5050 8000; do
    if lsof -i :$port >/dev/null 2>&1; then
        echo "   ❌ Port $port: Still in use"
    else
        echo "   ✅ Port $port: Available"
    fi
done

echo ""
echo "🎯 To restart: ./start-unified.sh"
