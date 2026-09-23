#!/bin/bash

echo "Starting Community Chat Application..."
echo

echo "Starting Backend Server..."
npm run server &
BACKEND_PID=$!

echo "Waiting 3 seconds for backend to start..."
sleep 3

echo "Starting Frontend Server..."
cd client && npm start &
FRONTEND_PID=$!

echo
echo "Both servers are starting up!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait




