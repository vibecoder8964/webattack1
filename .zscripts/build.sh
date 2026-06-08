#!/bin/bash

# Redirect stderr to stdout
exec 2>&1

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Lightweight Express.js CTF application
LIGHTWEIGHT_DIR="/home/z/my-project/lightweight"

if [ ! -d "$LIGHTWEIGHT_DIR" ]; then
    echo "Error: Lightweight app directory not found: $LIGHTWEIGHT_DIR"
    exit 1
fi

echo "Building lightweight ShopZone CTF application..."
echo "App directory: $LIGHTWEIGHT_DIR"

cd "$LIGHTWEIGHT_DIR" || exit 1

BUILD_DIR="/tmp/build_fullstack_$BUILD_ID"
echo "Creating build directory: $BUILD_DIR"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Copy the entire lightweight app to build directory
echo "Copying application files..."
mkdir -p "$BUILD_DIR/app"
cp server.js "$BUILD_DIR/app/"
cp package.json "$BUILD_DIR/app/"
cp package-lock.json "$BUILD_DIR/app/"
cp -r node_modules "$BUILD_DIR/app/"
cp -r public "$BUILD_DIR/app/"
cp -r ctf-data "$BUILD_DIR/app/"

# Remove the database from ctf-data (it will be created on first run)
rm -f "$BUILD_DIR/app/shopzone.db" "$BUILD_DIR/app/shopzone.db-shm" "$BUILD_DIR/app/shopzone.db-wal"

# Copy Caddyfile
echo "Copying Caddyfile..."
cp "$LIGHTWEIGHT_DIR/Caddyfile" "$BUILD_DIR/"

# Copy start script
echo "Creating start script..."
cat > "$BUILD_DIR/start.sh" << 'STARTSCRIPT'
#!/bin/sh
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

echo "Starting ShopZone CTF application..."

cd app || exit 1

export PORT="${PORT:-3000}"
export HOSTNAME="${HOSTNAME:-0.0.0.0}"
export DATA_DIR="$(pwd)"

echo "PORT: $PORT"
echo "DATA_DIR: $DATA_DIR"

# Start the Node.js server in background
node server.js &
NODE_PID=$!

sleep 2

if ! kill -0 "$NODE_PID" 2>/dev/null; then
    echo "ERROR: Server failed to start"
    exit 1
else
    echo "Server started successfully (PID: $NODE_PID, Port: $PORT)"
fi

cd ..

# Start Caddy
echo "Starting Caddy..."
exec caddy run --config Caddyfile --adapter caddyfile
STARTSCRIPT

chmod +x "$BUILD_DIR/start.sh"

# Package
PACKAGE_FILE="${BUILD_DIR}.tar.gz"
echo "Packaging build to $PACKAGE_FILE..."
cd "$BUILD_DIR" || exit 1
tar -czf "$PACKAGE_FILE" .
cd - > /dev/null || exit 1

echo ""
echo "Build complete! Package: $PACKAGE_FILE"
echo "Package size:"
ls -lh "$PACKAGE_FILE"
