#!/bin/bash

echo "🏥 Starting Unified Healthcare Platform..."
echo "=========================================="

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
kill_port 3001
kill_port 3004
kill_port 5001
kill_port 5002
kill_port 5050
kill_port 8000

echo ""
echo "⏳ Waiting for cleanup to complete..."
sleep 3

echo ""
echo "🚀 Starting Backend Services..."

# Check if we're in the right directory
if [ ! -d "API" ] && [ ! -d "unified-backend" ]; then
    echo "❌ Please run this script from the Smart India Hackathon 2025 directory"
    exit 1
fi

# Start Medicine API (Port 5001)
echo ""
echo "1️⃣ Starting Medicine API (Port 5001)..."
if [ -d "API" ]; then
    cd "API"
    if [ -f "venv/bin/activate" ]; then
        source venv/bin/activate
        PORT=5001 python app.py &
        MEDICINE_PID=$!
        echo "   ✅ Medicine API started (PID: $MEDICINE_PID)"
    else
        echo "   ❌ Virtual environment not found in API directory"
    fi
    cd ..
else
    echo "   ❌ API directory not found"
fi

# Start Skin Disease API (Port 5002)
echo ""
echo "2️⃣ Starting Skin Disease API (Port 5002)..."
if [ -d "Skin-Disease-Prediction-main" ]; then
    cd "Skin-Disease-Prediction-main"
    if [ -f "venv_new/bin/activate" ]; then
        source venv_new/bin/activate
        PORT=5002 python app.py &
        SKIN_PID=$!
        echo "   ✅ Skin Disease API started (PID: $SKIN_PID)"
    else
        echo "   ❌ venv_new not found, trying venv..."
        if [ -f "venv/bin/activate" ]; then
            source venv/bin/activate
            PORT=5002 python app.py &
            SKIN_PID=$!
            echo "   ✅ Skin Disease API started (PID: $SKIN_PID)"
        else
            echo "   ❌ No virtual environment found"
        fi
    fi
    cd ..
else
    echo "   ❌ Skin-Disease-Prediction-main directory not found"
fi

# Start Health Records API (Port 3004)
echo ""
echo "3️⃣ Starting Health Records API (Port 3004)..."
if [ -d "Digital health records" ]; then
    cd "Digital health records"
    PORT=3004 node server.js &
    HEALTH_PID=$!
    echo "   ✅ Health Records API started (PID: $HEALTH_PID)"
    cd ..
else
    echo "   ❌ Digital health records directory not found"
fi

# Start Chat Service (Port 5050)
echo ""
echo "4️⃣ Starting Chat Service (Port 5050)..."
if [ -d "../chat-sih" ]; then
    cd "../chat-sih"
    npm run server &
    CHAT_PID=$!
    echo "   ✅ Chat Service started (PID: $CHAT_PID)"
    cd "../Smart India Hackathon 2025"
else
    echo "   ❌ chat-sih directory not found"
fi

# Wait for backend services to start
echo ""
echo "⏳ Waiting for backend services to initialize..."
sleep 8

# Check backend services
echo ""
echo "🔍 Checking backend services..."
check_port 5001 && echo "   ✅ Medicine API (5001): Ready"
check_port 5002 && echo "   ✅ Skin Disease API (5002): Ready"
check_port 3004 && echo "   ✅ Health Records API (3004): Ready"
check_port 5050 && echo "   ✅ Chat Service (5050): Ready"

# Start Unified Backend (Port 8000)
echo ""
echo "5️⃣ Starting Unified Backend (Port 8000)..."
if [ -d "unified-backend" ]; then
    cd "unified-backend"
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
    cd ..
    sleep 3
else
    echo "   ❌ unified-backend directory not found"
fi

# Start Main Frontend (Port 3000)
echo ""
echo "6️⃣ Starting Main Frontend (Port 3000)..."
if [ -d "Rural Healthcare Website Design (2)" ]; then
    cd "Rural Healthcare Website Design (2)"
    npm run dev &
    FRONTEND_PID=$!
    echo "   ✅ Main Frontend started (PID: $FRONTEND_PID)"
    cd ..
else
    echo "   ❌ Rural Healthcare Website Design (2) directory not found"
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
echo "   • Skin Disease API: http://localhost:5002"
echo "   • Health Records API: http://localhost:3004"
echo "   • Chat Service: http://localhost:5050"
echo ""
echo "📊 API ENDPOINTS (via Unified Backend):"
echo "   • Medicine: http://localhost:8000/api/medicine/*"
echo "   • Skin Disease: http://localhost:8000/api/skin-disease/*"
echo "   • Health Records: http://localhost:8000/api/health-records/*"
echo "   • Chat: http://localhost:8000/api/chat/*"
echo ""
echo "🔍 HEALTH CHECKS:"
echo "   • Unified Backend: http://localhost:8000/health"
echo "   • Medicine API: http://localhost:5001/health"
echo "   • Health Records: http://localhost:3004/health"
echo "   • Chat Service: http://localhost:5050/api/health"
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
echo "   Skin Disease API: $SKIN_PID"
echo "   Health Records API: $HEALTH_PID"
echo "   Chat Service: $CHAT_PID"
echo "   Unified Backend: $UNIFIED_PID"
echo "   Frontend: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap 'echo ""; echo "🛑 Stopping all services..."; pkill -f "python.*app.py"; pkill -f "node.*server.js"; pkill -f "vite"; pkill -f "nodemon"; echo "✅ All services stopped!"; exit 0' INT

wait
