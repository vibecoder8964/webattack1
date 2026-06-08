#!/bin/bash
cd /home/z/my-project
export DATABASE_URL="file:./ctf.db"
export DATA_DIR="/home/z/my-project"
export PORT=3000
export HOSTNAME=0.0.0.0

# Auto-restart loop
while true; do
    echo "[$(date)] Starting Next.js dev server..."
    npx next dev -p 3000 -H 0.0.0.0
    EXIT_CODE=$?
    echo "[$(date)] Server exited with code $EXIT_CODE, restarting in 3s..."
    sleep 3
done
