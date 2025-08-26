#!/bin/bash

# Script para testar o health check localmente
# Simula o comportamento do Railway healthcheck

echo "🔍 Testing Railway Health Check Configuration..."
echo ""

# Start the server in background
echo "🚀 Starting server..."
npm run start:dev &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 10

# Test health check endpoint
echo "🏥 Testing health check endpoint..."
echo ""

# Test with localhost (normal request)
echo "📍 Testing localhost request:"
curl -s http://localhost:3001/health | jq . || echo "❌ Failed to connect to localhost"
echo ""

# Test with Railway healthcheck hostname simulation
echo "📍 Testing with Railway healthcheck hostname simulation:"
curl -s -H "Host: healthcheck.railway.app" http://localhost:3001/health | jq . || echo "❌ Failed with Railway hostname"
echo ""

# Test port binding
echo "📊 Server process info:"
ps aux | grep "node.*dist/main" | grep -v grep || echo "❌ Server process not found"
echo ""

# Cleanup
echo "🧹 Cleaning up..."
kill $SERVER_PID 2>/dev/null || echo "Server already stopped"

echo "✅ Health check test completed!"
