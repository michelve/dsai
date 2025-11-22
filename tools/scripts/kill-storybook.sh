#!/usr/bin/env bash
# Kill all Storybook processes

echo "🔪 Killing Storybook processes..."

# Kill by process name
pkill -9 -f storybook 2>/dev/null

# Kill by port (if process still running on 6006)
if lsof -ti:6006 > /dev/null 2>&1; then
  echo "   Killing process on port 6006..."
  lsof -ti:6006 | xargs kill -9 2>/dev/null
fi

# Kill by port 6007 (fallback port)
if lsof -ti:6007 > /dev/null 2>&1; then
  echo "   Killing process on port 6007..."
  lsof -ti:6007 | xargs kill -9 2>/dev/null
fi

sleep 1

# Verify
if pgrep -f storybook > /dev/null; then
  echo "⚠️  Some Storybook processes may still be running"
  ps aux | grep -i storybook | grep -v grep
else
  echo "✅ All Storybook processes killed"
fi

