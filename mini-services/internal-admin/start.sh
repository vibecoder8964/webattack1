#!/bin/bash
# Start the internal admin mini-service
# Uses Node.js to spawn a detached bun process that persists independently

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ADMIN_DIR="$SCRIPT_DIR"
LOG_FILE="/tmp/admin-service.log"
PID_FILE="/tmp/admin-service.pid"

# Check if already running
if [ -f "$PID_FILE" ]; then
  OLD_PID=$(cat "$PID_FILE")
  if kill -0 "$OLD_PID" 2>/dev/null; then
    echo "Internal admin service is already running (PID: $OLD_PID)"
    exit 0
  fi
  rm -f "$PID_FILE"
fi

# Start using Node.js to create a detached process that survives parent exit
node -e "
const { spawn } = require('child_process');
const adminProcess = spawn('bun', ['index.ts'], {
  cwd: '$ADMIN_DIR',
  stdio: 'ignore',
  detached: true,
});
adminProcess.unref();
console.log(adminProcess.pid);
" > "$PID_FILE" 2>> "$LOG_FILE"

NEW_PID=$(cat "$PID_FILE")
echo "Internal admin service started (PID: $NEW_PID)"

# Wait and verify
sleep 2
if curl -s http://127.0.0.1:3071/admin/status > /dev/null 2>&1; then
  echo "Internal admin service is running on port 3071"
else
  echo "WARNING: Internal admin service may not have started correctly"
fi
