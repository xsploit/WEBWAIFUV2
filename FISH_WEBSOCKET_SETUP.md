# 🐟 Fish Audio WebSocket Server Setup

Ultra-fast Fish Audio TTS streaming with manual toggle.

---

## 🎯 **How It Works**

**Default (Unchecked):**
- Uses Netlify REST API
- Works everywhere (local + production)
- Latency: ~500-1400ms

**WebSocket Mode (Checked):**
- Uses local WebSocket server
- Requires running `npm run fish-server`
- Latency: ~200-400ms (3x faster!)
- Audio chunks play AS THEY ARE GENERATED

---

## 🚀 **Quick Start (Local)**

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Fish Audio WebSocket Server

```bash
npm run fish-server
```

You should see:
```
✅ Fish Audio WebSocket Server running on ws://localhost:8765/fish-ws
📡 Waiting for connections...
```

### 3. Open Your App

```bash
# Open index.html in browser
# Or use live-server, VS Code Live Server, etc.
```

### 4. Configure Fish Audio

In the app settings:
1. Set **TTS Provider** → Fish Audio
2. Enter your **Fish Audio API Key**
3. (Optional) Enter **Voice Model ID**
4. ✅ **Check** "Use Local WebSocket Server (Faster)"

### 5. Test It!

Send a message and watch the console:

**You'll see:**
```
🐟 Attempting to connect to local Fish Audio WebSocket server...
✅ Fish WebSocket connected
✅ Fish Audio WebSocket ready!
🚀 Using Fish Audio WebSocket (LOCAL)
🎵 Fish WS audio chunk: 14126 bytes (1 total)
🎵 Fish WS audio chunk: 47924 bytes (2 total)
```

**Latency:** ~200-400ms for first audio chunk!

---

## 📊 **Performance Comparison**

| Method | First Audio Latency | Use Case |
|--------|---------------------|----------|
| **WebSocket (Local)** | ~200-400ms | Development, Testing |
| **REST API (Netlify)** | ~500-1400ms | Production |

---

## 🔧 **Troubleshooting**

### WebSocket Not Connecting

**Check if server is running:**
```bash
# Should show: ✅ Fish Audio WebSocket Server running...
npm run fish-server
```

**Check console for errors:**
- Open browser DevTools → Console
- Look for: `⚠️ Fish WebSocket connection timeout - will use REST API`

**Automatic Fallback:**
If WebSocket fails, the app automatically uses REST API (Netlify Function).

### Still Using REST API

**Make sure:**
1. WebSocket server is running (`npm run fish-server`)
2. **"Use Local WebSocket Server" checkbox is CHECKED** in Fish Audio settings
3. Fish Audio is selected as TTS provider
4. Fish API key is entered

**Check status:**
- Open browser DevTools → Console
- Look for: `✅ Fish Audio WebSocket connected - ultra-fast mode enabled!`
- Or: `⚠️ WebSocket server not available - run: npm run fish-server`

---

## 🌐 **Production (Netlify)**

No setup needed! The app automatically detects production environment and uses REST API.

**Deploy normally:**
```bash
netlify deploy --prod
```

Fish Audio works via Netlify Functions (no WebSocket server required).

---

## 📝 **How The Toggle Works**

```javascript
// User manually enables WebSocket mode
if (settings.fishUseWebSocket && fishWebSocketConnected) {
  // Use ultra-fast WebSocket streaming
  useWebSocket();
} else {
  // Use REST API (default/fallback)
  useNetlifyRESTAPI();
}
```

**Key Points:**
- ❌ **Unchecked** = Uses Netlify REST API (default, works everywhere)
- ✅ **Checked** = Uses local WebSocket server (faster, requires `npm run fish-server`)
- Saved to localStorage (persists across sessions)
- If WebSocket fails to connect, auto-unchecks and falls back to REST API

---

## 🎮 **Test Server**

Want to test WebSocket streaming separately?

```bash
npm run test-ws
# Opens test UI at http://localhost:3000
```

Includes:
- Chatbot interface
- Latency metrics
- Real-time audio streaming
- VTuber-style test messages

---

## ✅ **Best Practices**

1. **Development:** Run `npm run fish-server` for fast testing
2. **Production:** Deploy to Netlify (REST API handles it)
3. **Keep it simple:** No need for Railway, Render, or VPS hosting

---

## 🆘 **Need Help?**

**Audio chunks arrive but don't play?**
- See `FISH_WS_DEBUG.md` for detailed debugging steps
- Check browser console for new debug logs
- Verify `🏁 Fish stream closed` appears in console

**WebSocket server won't start?**
```bash
# Make sure port 8765 is free
# Check if Node.js is installed: node --version
```

**Fish Audio not working at all?**
- Verify API key is correct
- Check Fish Audio credits/quota
- Try Edge TTS as fallback

**Want to change WebSocket port?**
Edit `fish-websocket-server.js`:
```javascript
const PORT = 8765; // Change this
```

And update `js/app.js`:
```javascript
const FISH_WS_URL = 'ws://localhost:8765/fish-ws'; // Match port
```

---

**That's it!** Simple local setup, automatic production fallback. 🚀
