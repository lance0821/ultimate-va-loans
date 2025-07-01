#!/bin/bash
# Save as cleanup-ports.sh
PORTS=(3000 3001 3010)

echo "Cleaning up development ports..."
for port in "${PORTS[@]}"; do
    PID=$(lsof -t -i:$port 2>/dev/null)
    if [ -n "$PID" ]; then
        echo "Killing process $PID on port $port"
        kill -15 $PID
        sleep 1
        # Force kill if necessary
        if kill -0 $PID 2>/dev/null; then
            kill -9 $PID
        fi
    else
        echo "Port $port is available"
    fi
done