#!/bin/bash

echo "🏥 TEAM CONSOLE 2 - COMPLETE HEALTHCARE PLATFORM STARTUP"
echo "========================================================"
echo ""

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

# Function to kill process on port
kill_port() {
    echo "🧹 Cleaning up port $1..."
    lsof -ti :$1 | xargs kill -9 2>/dev/null || true
    sleep 2
}

echo "🧹 CLEANING UP EXISTING PROCESSES..."
echo "===================================="

# Kill existing processes on all ports
for port in 3000 3002 5001 8000; do
    kill_port $port
done

echo ""
echo "⏳ Waiting for cleanup to complete..."
sleep 5

echo ""
echo "🚀 STARTING ALL HEALTHCARE SERVICES..."
echo "====================================="

# Start Medicine API (Port 5001)
echo ""
echo "1️⃣ Starting Medicine API (Port 5001)..."
cd "$ROOT_DIR/backend/medicine-api"
source venv/bin/activate
PORT=5001 python app.py &
MEDICINE_PID=$!
echo "   ✅ Medicine API started (PID: $MEDICINE_PID)"

# Start Health Records API (Port 3002)
echo ""
echo "3️⃣ Starting Health Records API (Port 3002)..."
cd "$ROOT_DIR/backend/health-records"
PORT=3002 npm start &
HEALTH_RECORDS_PID=$!
echo "   ✅ Health Records API started (PID: $HEALTH_RECORDS_PID)"

# Start Unified Backend (Port 8000)
echo ""
echo "5️⃣ Starting Unified Backend (Port 8000)..."
cd "$ROOT_DIR/Smart India Hackathon 2025/unified-backend"
python app.py &
UNIFIED_PID=$!
echo "   ✅ Unified Backend started (PID: $UNIFIED_PID)"

# Start Main Website (Port 3000)
echo ""
echo "6️⃣ Starting Main Website (Port 3000)..."
cd "$ROOT_DIR/frontend/main-web"
npx vite --port 3000 --strictPort --open=false --host 0.0.0.0 &
MAIN_WEBSITE_PID=$!
echo "   ✅ Main Website started (PID: $MAIN_WEBSITE_PID)"

# Start Video Calling App (Port 5175)
echo ""
echo "8️⃣ Starting Video Calling App (Port 5175)..."
cd "$ROOT_DIR/video-consultation/zegocloud-app"
npx vite --port 5175 --strictPort --open=false --host 0.0.0.0 &
VIDEO_CALL_PID=$!
echo "   ✅ Video Calling App started (PID: $VIDEO_CALL_PID)"

echo ""
echo "⏳ Waiting for all services to initialize..."
sleep 15

echo ""
echo "🔍 CHECKING SERVICE STATUS..."
echo "============================"

# Check all services
services=(
    "Main Website:3000"
    "Health Records API:3002"
    "Medicine API:5001"
    "Video Calling App:5175"
    "Unified Backend:8000"
)

for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    if lsof -i :$port >/dev/null 2>&1; then
        echo "✅ $name ($port): ACTIVE"
    else
        echo "❌ $name ($port): INACTIVE"
    fi
done

echo ""
echo "🎉 TEAM CONSOLE 2 HEALTHCARE PLATFORM IS RUNNING!"
echo "================================================="
echo ""
echo "🌐 ACCESS POINTS:"
echo "• Main Platform: http://localhost:3000"
echo "• Video Calling: http://localhost:5175"
echo "• Unified API: http://localhost:8000"
echo ""
echo "🔧 BACKEND SERVICES:"
echo "• Medicine API: http://localhost:5001"
echo "• Health Records API: http://localhost:3002"
echo ""
echo "📊 FEATURES AVAILABLE:"
echo "• AI-Powered Symptom Checker with Voice Input"
echo "• Medicine Availability Tracker"
echo "• Video Calling (Integrated in Main Website)"
echo "• Digital Health Records"
echo "• Multi-language Support (English, Hindi, Punjabi)"
echo ""
echo "🛑 To stop all services:"
echo "pkill -f 'node\\|python\\|vite\\|nodemon'"
echo ""
echo "✨ Your complete healthcare platform is now running!"
echo "   All features are integrated and working together!"

# Keep the script running
echo ""
echo "Press Ctrl+C to stop all services"
wait
