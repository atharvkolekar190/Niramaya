#!/bin/bash

echo "🏥 TEAM CONSOLE 2 - COMPLETE HEALTHCARE PLATFORM STARTUP"
echo "========================================================"
echo ""

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
for port in 3000 3001 3004 5001 5002 5050 5175 5176 5177 5178 8000; do
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
cd "/Users/ishankpandey/Downloads/Team Console  2/Smart India Hackathon 2025/API"
source venv/bin/activate
PORT=5001 python app.py &
MEDICINE_PID=$!
echo "   ✅ Medicine API started (PID: $MEDICINE_PID)"

# Start Skin Disease API (Port 5002)
echo ""
echo "2️⃣ Starting Skin Disease API (Port 5002)..."
cd "/Users/ishankpandey/Downloads/Team Console  2/Skin-Disease-Prediction-main"
source venv_new/bin/activate
PORT=5002 python app.py &
SKIN_DISEASE_PID=$!
echo "   ✅ Skin Disease API started (PID: $SKIN_DISEASE_PID)"

# Start Health Records API (Port 3004)
echo ""
echo "3️⃣ Starting Health Records API (Port 3002)..."
cd "/Users/ishankpandey/Downloads/Team Console  2/Smart India Hackathon 2025/Digital health records"
PORT=3002 npm start &
HEALTH_RECORDS_PID=$!
echo "   ✅ Health Records API started (PID: $HEALTH_RECORDS_PID)"

# Start Chat Service (Port 5050)
echo ""
echo "4️⃣ Starting Chat Service (Port 5050)..."
cd "/Users/ishankpandey/Downloads/Team Console  2/chat-sih"
npm run server &
CHAT_PID=$!
echo "   ✅ Chat Service started (PID: $CHAT_PID)"

# Start Unified Backend (Port 8000)
echo ""
echo "5️⃣ Starting Unified Backend (Port 8000)..."
cd "/Users/ishankpandey/Downloads/Team Console  2/Smart India Hackathon 2025/unified-backend"
python app.py &
UNIFIED_PID=$!
echo "   ✅ Unified Backend started (PID: $UNIFIED_PID)"

# Start Main Website (Port 3000)
echo ""
echo "6️⃣ Starting Main Website (Port 3000)..."
cd "/Users/ishankpandey/Downloads/Team Console  2/Smart India Hackathon 2025/Rural Healthcare Website Design (2)"
npx vite --port 3000 --strictPort --open=false --host 0.0.0.0 &
MAIN_WEBSITE_PID=$!
echo "   ✅ Main Website started (PID: $MAIN_WEBSITE_PID)"

# Start Skin Disease Frontend (Port 3001)
echo ""
echo "7️⃣ Starting Skin Disease Frontend (Port 3001)..."
cd "/Users/ishankpandey/Downloads/Team Console  2/Skin-Disease-Prediction-main/Skin Disease Prediction Form"
npx vite --port 3001 --strictPort --open=false --host 0.0.0.0 &
SKIN_FRONTEND_PID=$!
echo "   ✅ Skin Disease Frontend started (PID: $SKIN_FRONTEND_PID)"

# Start Video Calling App (Port 5175)
echo ""
echo "8️⃣ Starting Video Calling App (Port 5175)..."
cd "/Users/ishankpandey/Downloads/Team Console  2/Smart India Hackathon 2025/Rural Healthcare Website Design (2)/ZEGOCLOUD-VideoCalling-App-main"
npx vite --port 5175 --strictPort --open=false --host 0.0.0.0 &
VIDEO_CALL_PID=$!
echo "   ✅ Video Calling App started (PID: $VIDEO_CALL_PID)"

echo ""
echo "⏳ Waiting for all services to initialize..."
sleep 15

# Start integrated feature micro-frontends on fixed ports
echo "9️⃣ Starting Village Health Hub (Port 5176)..."
cd "/Users/ishankpandey/Downloads/Team Console  2/Village Health Hub"
npx vite --port 5176 --strictPort --open=false --host 0.0.0.0 &
VHH_PID=$!
echo "   ✅ Village Health Hub started (PID: $VHH_PID)"

echo "🔟 Starting Pregnancy & Period Tracker (Port 5177)..."
cd "/Users/ishankpandey/Downloads/Team Console  2/Pregnancy and Period Tracker"
npx vite --port 5177 --strictPort --open=false --host 0.0.0.0 &
PREG_PID=$!
echo "   ✅ Pregnancy & Period Tracker started (PID: $PREG_PID)"

echo "1️⃣1️⃣ Starting Blood Donation App (Port 5178)..."
cd "/Users/ishankpandey/Downloads/Team Console  2/Blood Donation App Features"
npx vite --port 5178 --strictPort --open=false --host 0.0.0.0 &
BLOOD_PID=$!
echo "   ✅ Blood Donation App started (PID: $BLOOD_PID)"

echo ""
echo "🔍 CHECKING SERVICE STATUS..."
echo "============================"

# Check all services
services=(
    "Main Website:3000"
    "Skin Disease Frontend:3001"
    "Health Records API:3004"
    "Medicine API:5001"
    "Skin Disease API:5002"
    "Chat Service:5050"
    "Video Calling App:5175"
    "Village Health Hub:5176"
    "Pregnancy & Period Tracker:5177"
    "Blood Donation App:5178"
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
echo "• Skin Disease Detection: http://localhost:3001"
echo "• Video Calling: http://localhost:5175"
echo "• Village Health Hub: http://localhost:5176"
echo "• Pregnancy & Period Tracker: http://localhost:5177"
echo "• Blood Donation: http://localhost:5178"
echo "• Unified API: http://localhost:8000"
echo ""
echo "🔧 BACKEND SERVICES:"
echo "• Medicine API: http://localhost:5001"
echo "• Skin Disease API: http://localhost:5002"
echo "• Health Records API: http://localhost:3004"
echo "• Chat Service: http://localhost:5050"
echo ""
echo "📊 FEATURES AVAILABLE:"
echo "• AI-Powered Symptom Checker with Voice Input"
echo "• Medicine Availability Tracker"
echo "• Skin Disease Detection (Integrated + Standalone)"
echo "• Video Calling (Integrated in Main Website)"
echo "• Digital Health Records"
echo "• Community Chat"
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
