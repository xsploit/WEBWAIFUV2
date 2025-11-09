# Fish Audio WebSocket Debug Guide

## Changes Made
1. ✅ Fixed MIME type: `audio/mp3` → `audio/mpeg`
2. ✅ Added debug logging when `fish-closed` message received
3. ✅ Added logging for audio blob size and chunk count
4. ✅ Added logging in `speakText()` to confirm audio playback attempt
5. ✅ **DISABLED pre-buffering for WebSocket mode** (was overwriting promises)

## How to Test

### 1. Start Fish WebSocket Server
```bash
npm run fish-server
```

Expected output:
```
✅ Fish Audio WebSocket Server running on ws://localhost:8765/fish-ws
📡 Waiting for connections...
```

### 2. Open App in Browser
- Open `index.html` in your browser
- Open DevTools Console (F12)

### 3. Configure Fish Audio
1. Settings → TTS Provider → Fish Audio
2. Enter your Fish Audio API Key
3. ✅ Check "Use Local WebSocket Server (Faster)"
4. Send a test message

## Expected Console Output

### Browser Console (SHOULD SEE ALL OF THESE):
```
🐟 Connecting to local Fish Audio WebSocket server...
✅ Fish WebSocket connected
✅ Fish Audio WebSocket ready!
🚀 Using Fish Audio WebSocket (FAST MODE)
🎵 Fish WS audio chunk: 14130 bytes (1 total)
🎵 Fish WS audio chunk: 21322 bytes (2 total)
🎵 Fish WS audio chunk: 1746 bytes (3 total)
🏁 Fish stream closed - combining audio chunks...     ← NEW!
✅ Created audio blob: 37198 bytes from 3 chunks      ← NEW!
🎵 Audio blob ready: 37198 bytes, type: audio/mpeg    ← NEW!
▶️ Playing VRM talking animation
🔊 AudioContext resumed
```

### Server Console:
```
✅ Client connected
🐟 Saving Fish Audio credentials...
🚀 Starting new Fish Audio stream...
📝 Message generator started
📤 Yielding: "Your message here..."
🎵 Audio chunk: 14130 bytes
🎵 Audio chunk: 21322 bytes
🎵 Audio chunk: 1746 bytes
✅ Message generator complete
🔌 Fish Audio connection closed
```

## Why Pre-Buffering Was Disabled

**The Problem:**
1. First message starts → sets `APP_STATE.fishWsResolve = resolveFunc1`
2. Pre-buffer starts for second message → **OVERWRITES** `APP_STATE.fishWsResolve = resolveFunc2`
3. First message finishes → resolves `resolveFunc2` (WRONG!)
4. Second message finishes → `fishWsResolve` is null → `⚠️ no pending promise!`

**The Solution:**
Disabled pre-buffering for WebSocket mode since:
- WebSocket already has ultra-fast latency (~200-400ms)
- Pre-buffering only saves ~200ms between chunks
- Not worth the complexity of managing multiple WebSocket promises

**Note:** Pre-buffering still works for REST API mode (Edge TTS, Fish REST API)

## Troubleshooting

### Issue: No audio plays
**Check browser console for:**
- ❌ Missing: `🏁 Fish stream closed` → Server not sending 'fish-closed' message
- ❌ Missing: `✅ Created audio blob` → Promise not being resolved
- ❌ Missing: `🎵 Audio blob ready` → `speakText()` not receiving audio
- ⚠️ `fish-closed received but no pending promise!` → Pre-buffering conflict (should be FIXED now)

### Issue: MIME type error
**Look for:** Browser errors about invalid audio format
**Should now see:** `type: audio/mpeg` (NOT `audio/mp3`)

### Issue: Audio chunks arrive but blob is 0 bytes
**Possible causes:**
- WebSocket binary data not being stored correctly
- `event.data` is ArrayBuffer instead of Blob (need to convert)

## Next Steps if Still Broken

1. **Check if fish-closed is received:**
   - If you see `🏁 Fish stream closed` → Server is sending it ✅
   - If NOT → Server-side issue with RealtimeEvents.CLOSE handler

2. **Check blob size:**
   - Should match sum of chunk sizes (14130 + 21322 + 1746 = 37198)
   - If 0 bytes → Chunks not being stored properly

3. **Check audio playback:**
   - If blob is created but doesn't play → Check browser's audio playback
   - Try saving blob and playing manually: `URL.createObjectURL(audioBlob)`

## Key Code Locations

- `js/app.js:2155-2172` - WebSocket message handler (fish-closed)
- `js/app.js:2206-2237` - synthesizeFishAudioChunk() WebSocket mode
- `js/app.js:2390-2392` - speakText() audio blob logging
- `fish-websocket-server.js:97-100` - Server sends fish-closed
