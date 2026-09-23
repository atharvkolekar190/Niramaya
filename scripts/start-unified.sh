#!/bin/bash

echo "🏥 Starting Unified Healthcare Platform..."
echo "=========================================="

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Function to check if port is in use
check_port() {
    if lsof -i :$1 >/dev/null 2>&1; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

# Function to kill processes on specific ports
kill_port() {
    echo "🧹 Cleaning up port $1..."
    lsof -ti :$1 | xargs kill -9 2>/dev/null || true
    sleep 1
}

# Kill existing processes
echo ""
echo "🧹 Cleaning up existing processes..."
pkill -f "python.*app.py" 2>/dev/null || true
pkill -f "node.*server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true

# Clean up specific ports
kill_port 3000
kill_port 3002
kill_port 5001
kill_port 8000

echo ""
echo "⏳ Waiting for cleanup to complete..."
sleep 3

echo ""
echo "🚀 Starting Backend Services..."

# Check if we're in the right directory
if [ ! -d "$ROOT_DIR/backend/medicine-api" ] && [ ! -d "$ROOT_DIR/Smart India Hackathon 2025/unified-backend" ]; then
    echo "❌ Repository services were not found"
    exit 1
fi

# Start Medicine API (Port 5001)
echo ""
echo "1️⃣ Starting Medicine API (Port 5001)..."
if [ -d "$ROOT_DIR/backend/medicine-api" ]; then
    cd "$ROOT_DIR/backend/medicine-api"
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
        PORT=5001 python app.py &
        MEDICINE_PID=$!
        echo "   ✅ Medicine API started (PID: $MEDICINE_PID)"
    else
        echo "   ❌ Virtual environment not found in API directory"
    fi
    cd "$ROOT_DIR"
else
    echo "   ❌ API directory not found"
fi

# Start Health Records API (Port 3002)
echo ""
echo "3️⃣ Starting Health Records API (Port 3002)..."
if [ -d "$ROOT_DIR/backend/health-records" ]; then
    cd "$ROOT_DIR/backend/health-records"
    PORT=3002 node server.js &
    HEALTH_PID=$!
    echo "   ✅ Health Records API started (PID: $HEALTH_PID)"
    cd "$ROOT_DIR"
else
    echo "   ❌ Health records backend directory not found"
fi

# Wait for backend services to start
echo ""
echo "⏳ Waiting for backend services to initialize..."
sleep 8

# Check backend services
echo ""
echo "🔍 Checking backend services..."
check_port 5001 && echo "   ✅ Medicine API (5001): Ready"
check_port 3002 && echo "   ✅ Health Records API (3002): Ready"

# Start Unified Backend (Port 8000)
echo ""
echo "5️⃣ Starting Unified Backend (Port 8000)..."
if [ -d "$ROOT_DIR/Smart India Hackathon 2025/unified-backend" ]; then
    cd "$ROOT_DIR/Smart India Hackathon 2025/unified-backend"
    if [ ! -f "venv/bin/activate" ]; then
        echo "   📦 Creating virtual environment..."
        python3 -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    else
        source venv/bin/activate
    fi
    python app.py &
    UNIFIED_PID=$!
    echo "   ✅ Unified Backend started (PID: $UNIFIED_PID)"
    cd "$ROOT_DIR"
    sleep 3
else
    echo "   ❌ unified-backend directory not found"
fi

# Start Main Frontend (Port 3000)
echo ""
echo "6️⃣ Starting Main Frontend (Port 3000)..."
if [ -d "$ROOT_DIR/frontend/main-web" ]; then
    cd "$ROOT_DIR/frontend/main-web"
    npm run dev &
    FRONTEND_PID=$!
    echo "   ✅ Main Frontend started (PID: $FRONTEND_PID)"
    cd "$ROOT_DIR"
else
    echo "   ❌ Main frontend directory not found"
fi

# Wait for frontend to start
echo ""
echo "⏳ Waiting for frontend to initialize..."
sleep 5

echo ""
echo "🎉 UNIFIED HEALTHCARE PLATFORM IS RUNNING!"
echo "=========================================="
echo ""
echo "🌐 ACCESS POINTS:"
echo "   • Main Platform: http://localhost:3000"
echo "   • Unified API: http://localhost:8000"
echo ""
echo "🔧 BACKEND SERVICES:"
echo "   • Medicine API: http://localhost:5001"
echo "   • Health Records API: http://localhost:3002"
echo ""
echo "📊 API ENDPOINTS (via Unified Backend):"
echo "   • Medicine: http://localhost:8000/api/medicine/*"
echo "   • Health Records: http://localhost:8000/api/health-records/*"
echo ""
echo "🔍 HEALTH CHECKS:"
echo "   • Unified Backend: http://localhost:8000/health"
echo "   • Medicine API: http://localhost:5001/health"
echo "   • Health Records: http://localhost:3002/health"
echo ""
echo "🛑 To stop all services:"
echo "   ./stop-unified.sh"
echo ""
echo "✨ Your healthcare platform is now running on just 2 main ports!"
echo "   Frontend: 3000 | Unified Backend: 8000"

# Keep script running and show logs
echo ""
echo "📋 Service PIDs:"
echo "   Medicine API: $MEDICINE_PID"
echo "   Health Records API: $HEALTH_PID"
echo "   Unified Backend: $UNIFIED_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap 'echo ""; echo "🛑 Stopping all services..."; pkill -f "python.*app.py"; pkill -f "node.*server.js"; pkill -f "vite"; pkill -f "nodemon"; echo "✅ All services stopped!"; exit 0' INT

wait
