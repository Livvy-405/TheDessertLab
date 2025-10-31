#!/bin/zsh
# Start Dessert Lab frontend and backend servers

# Start backend
cd dessert-lab-backend && npm start &
BACKEND_PID=$!
cd ..

# Start frontend
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID
wait $FRONTEND_PID
