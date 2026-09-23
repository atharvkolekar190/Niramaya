#!/bin/bash

echo "🛑 STOPPING TEAM CONSOLE 2 HEALTHCARE PLATFORM"
echo "=============================================="
echo ""

echo "🧹 Stopping all services..."

# Kill all Node.js processes
echo "• Stopping Node.js services..."
pkill -f "node" 2>/dev/null || true

# Kill all Python processes
echo "• Stopping Python services..."
pkill -f "python" 2>/dev/null || true

# Kill all Vite processes
echo "• Stopping Vite development servers..."
pkill -f "vite" 2>/dev/null || true

# Kill all nodemon processes
echo "• Stopping nodemon processes..."
pkill -f "nodemon" 2>/dev/null || true

# Kill specific port processes
echo "• Cleaning up specific ports..."
for port in 3000 3001 3004 5001 5002 5050 5175 8000; do
    lsof -ti :$port | xargs kill -9 2>/dev/null || true
done

echo ""
echo "⏳ Waiting for processes to stop..."
sleep 3

echo ""
echo "🔍 Checking if all services are stopped..."

services=(
    "Main Website:3000"
    "Skin Disease Frontend:3001"
    "Health Records API:3004"
    "Medicine API:5001"
    "Skin Disease API:5002"
    "Chat Service:5050"
    "Video Calling App:5175"
    "Unified Backend:8000"
)

all_stopped=true
for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    if lsof -i :$port >/dev/null 2>&1; then
        echo "⚠️  $name ($port): Still running"
        all_stopped=false
    else
        echo "✅ $name ($port): Stopped"
    fi
done

echo ""
if [ "$all_stopped" = true ]; then
    echo "🎉 All services have been stopped successfully!"
else
    echo "⚠️  Some services may still be running. You may need to stop them manually."
fi

echo ""
echo "✨ Team Console 2 Healthcare Platform has been stopped."
