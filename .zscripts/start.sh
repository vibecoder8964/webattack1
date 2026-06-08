#!/bin/sh

set -e

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="$SCRIPT_DIR"

echo "Starting ShopZone CTF application..."

# Navigate to the app directory
if [ -d "$BUILD_DIR/app" ]; then
    cd "$BUILD_DIR/app" || exit 1
elif [ -d "$BUILD_DIR/next-service-dist" ]; then
    # Fallback for old build format
    cd "$BUILD_DIR/next-service-dist" || exit 1
else
    cd "$BUILD_DIR" || exit 1
fi

export PORT="${PORT:-3000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export DATA_DIR="$(pwd)"

echo "PORT: $PORT"
echo "DATA_DIR: $DATA_DIR"

# Ensure ctf-data/uploads directory exists
mkdir -p "$(pwd)/ctf-data/uploads" 2>/dev/null || true

# Start Node.js server in background
node server.js &
NODE_PID=$!
echo "Server PID: $NODE_PID"

sleep 3

if ! kill -0 "$NODE_PID" 2>/dev/null; then
    echo "ERROR: Server failed to start"
    exit 1
else
    echo "Server started successfully (PID: $NODE_PID, Port: $PORT)"
fi

cd "$BUILD_DIR" || true

# Start Caddy
echo "Starting Caddy..."
exec caddy run --config Caddyfile --adapter caddyfile
