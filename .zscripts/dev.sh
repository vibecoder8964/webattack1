#!/bin/bash

set -euo pipefail

# Get script directory (.zscripts)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

log_step_start() {
        local step_name="$1"
        echo "=========================================="
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting: $step_name"
        echo "=========================================="
        export STEP_START_TIME
        STEP_START_TIME=$(date +%s)
}

log_step_end() {
        local step_name="${1:-Unknown step}"
        local end_time
        end_time=$(date +%s)
        local duration=$((end_time - STEP_START_TIME))
        echo "=========================================="
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Completed: $step_name"
        echo "[LOG] Step: $step_name | Duration: ${duration}s"
        echo "=========================================="
        echo ""
}

wait_for_service() {
        local host="$1"
        local port="$2"
        local service_name="$3"
        local max_attempts="${4:-30}"
        local attempt=1

        echo "Waiting for $service_name to be ready on $host:$port..."

        while [ "$attempt" -le "$max_attempts" ]; do
                if curl -s --connect-timeout 2 --max-time 5 "http://$host:$port" >/dev/null 2>&1; then
                        echo "$service_name is ready!"
                        return 0
                fi

                echo "Attempt $attempt/$max_attempts: $service_name not ready yet, waiting..."
                sleep 1
                attempt=$((attempt + 1))
        done

        echo "ERROR: $service_name failed to start within $max_attempts seconds"
        return 1
}

LIGHTWEIGHT_DIR="$PROJECT_DIR/lightweight"

cd "$LIGHTWEIGHT_DIR"

log_step_start "npm install"
echo "[NPM] Installing dependencies..."
npm install
log_step_end "npm install"

log_step_start "Starting lightweight ShopZone CTF server"

RESTART_COUNT=0
MAX_RESTARTS=50

while [ $RESTART_COUNT -lt $MAX_RESTARTS ]; do
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting ShopZone CTF server (attempt $((RESTART_COUNT + 1))/$MAX_RESTARTS)..."

        DATA_DIR="$LIGHTWEIGHT_DIR" \
        PORT=3000 \
        node server.js &
        DEV_PID=$!

        if wait_for_service "localhost" "3000" "ShopZone CTF server" 15; then
                log_step_end "Starting ShopZone CTF server"
                echo "[NPM] Server is running (PID: $DEV_PID)"

                # Health check
                if curl -fsS localhost:3000 >/dev/null 2>&1; then
                        echo "[NPM] Health check passed"
                fi

                # Wait for the server process to exit
                wait "$DEV_PID" 2>/dev/null
                EXIT_CODE=$?
                echo "[$(date '+%Y-%m-%d %H:%M:%S')] Server exited with code $EXIT_CODE"
        else
                echo "[NPM] Server failed to start"
                kill "$DEV_PID" 2>/dev/null || true
        fi

        RESTART_COUNT=$((RESTART_COUNT + 1))
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Restarting in 5 seconds... (restart $RESTART_COUNT/$MAX_RESTARTS)"
        sleep 5
done

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Max restarts reached. Exiting."
