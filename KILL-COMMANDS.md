# Kill Commands Reference

Quick reference for killing Storybook and other processes.

## 🎯 Quick Commands

### Kill Storybook (Easiest)

```bash
# From workspace root
pnpm nx run storybook:kill

# Or from storybook package
cd packages/@dsai/storybook
pnpm kill
pnpm stop  # alias for kill
```

### Direct Kill Commands

**Kill by process name:**

```bash
pkill -9 -f storybook
```

**Kill by port:**

```bash
# Port 6006 (default)
lsof -ti:6006 | xargs kill -9

# Port 6007 (fallback)
lsof -ti:6007 | xargs kill -9
```

**Kill all at once:**

```bash
pkill -9 -f storybook && lsof -ti:6006 | xargs kill -9 && lsof -ti:6007 | xargs kill -9
```

## 📋 Available Scripts

### From Workspace Root

```bash
pnpm nx run storybook:kill      # Kill Storybook
pnpm nx run storybook:stop      # Alias for kill
```

### From Storybook Package

```bash
cd packages/@dsai/storybook
pnpm kill                       # Kill Storybook
pnpm stop                       # Alias for kill
```

### Direct Script

```bash
bash tools/scripts/kill-storybook.sh
```

## 🔍 Check What's Running

**List Storybook processes:**

```bash
ps aux | grep -i storybook | grep -v grep
```

**Check ports:**

```bash
lsof -i:6006  # Check port 6006
lsof -i:6007  # Check port 6007
```

**Check if Storybook is running:**

```bash
curl -s http://localhost:6006 > /dev/null && echo "✅ Running" || echo "❌ Not running"
```

## 🛠️ Manual Kill by PID

**Find PID:**

```bash
ps aux | grep storybook | grep -v grep
# Look for the PID number in second column
```

**Kill by PID:**

```bash
kill -9 <PID>
# Example: kill -9 94956
```

## ⚡ Force Kill Everything

**Nuclear option (kills ALL node processes):**

```bash
pkill -9 node  # ⚠️ WARNING: Kills ALL node processes!
```

**Safer - just Storybook:**

```bash
pkill -9 -f storybook
pkill -9 -f "nx.*storybook"
```

## 📝 Script Location

The kill script is at:

```
tools/scripts/kill-storybook.sh
```

It automatically:

- ✅ Kills all Storybook processes
- ✅ Kills processes on ports 6006 and 6007
- ✅ Verifies everything is killed
- ✅ Shows status

## 🎯 Common Use Cases

### Restart Storybook

```bash
pnpm nx run storybook:kill
sleep 2
pnpm nx run storybook:storybook
```

### Free Up Port

```bash
lsof -ti:6006 | xargs kill -9
```

### Clean Restart

```bash
pnpm nx run storybook:kill
rm -rf node_modules/.vite .nx/cache
pnpm nx run storybook:storybook
```

---

**Quick Reference:**

- `pnpm kill` - Kill Storybook (from storybook package)
- `pkill -9 -f storybook` - Direct kill command
- `lsof -ti:6006 | xargs kill -9` - Kill by port
