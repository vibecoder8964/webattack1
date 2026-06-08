#!/bin/bash
cd /home/z/my-project/lightweight
export DATA_DIR="/home/z/my-project/lightweight"
export PORT=3000
export HOSTNAME=0.0.0.0

echo "Starting ShopZone CTF server on port 3000..."
exec node server.js
