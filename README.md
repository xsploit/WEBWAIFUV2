<div align="center">

# 🤖💖 WEBWAIFU V2

### Your AI Companion in the Browser

**Talk • Listen • Respond • Remember**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/xsploit/WEBWAIFUV2)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Netlify Status](https://img.shields.io/badge/netlify-deployed-00C7B7.svg)](https://webwaifu.netlify.app)
[![Code Health](https://img.shields.io/badge/code%20health-98%25-brightgreen.svg)](archive/AUDIT_REPORT.md)
[![VRM Support](https://img.shields.io/badge/VRM-0.x-ff69b4.svg)](https://vrm.dev)
[![Live2D Support](https://img.shields.io/badge/Live2D-Cubism%203%2F4-blue.svg)](https://www.live2d.com)
[![AI Powered](https://img.shields.io/badge/AI-Multi--Provider-orange.svg)](#llm-provider-setup)

*A browser-based AI companion with VRM and Live2D avatar support, real-time lip-sync, and multi-provider LLM integration. No server required—runs entirely client-side.*

[🚀 Live Demo](https://webwaifu.netlify.app) • [📖 Documentation](#documentation) • [🐛 Report Bug](https://github.com/xsploit/WEBWAIFUV2/issues)

---

</div>

## ✨ What is this?

An interactive AI character that lives in your browser. Talk to it using voice or text, watch it respond with full lip-sync and animations, powered by your choice of AI provider (Gemini, OpenAI, OpenRouter, or local Ollama).

## 🎯 Features

### Core Functionality
- 🎭 **Dual Avatar System** - **VRM** (3D models) or **Live2D** (2D models) - switch between them anytime!
- 🎨 **VRM Mode** - 3D models with phoneme-based lip-sync, facial expressions, Mixamo animations, eye tracking
- 🎨 **Live2D Mode** - 2D models with amplitude-based lip-sync, idle animations, breathing effects
- 🔊 **Dual TTS Support** - Edge TTS (free, 400+ voices, phonemes) or Fish Audio (paid, custom voice cloning, amplitude-based)
- 🤖 **Multi-Provider LLM** - Gemini, OpenAI, OpenRouter, Ollama (local)
- 🎤 **Speech Recognition** - Browser-based Whisper AI via Web Worker (no API calls)
- 🧠 **Memory System** - Semantic search with embeddings, auto-summarize with separate LLM (sliding window), conversation continuity, IndexedDB storage
- 🎬 **Animation System** - Mixamo FBX for VRM, automatic idle/talking states, animations pause during speech

### Technical Highlights
- ⚡ Pure client-side (no server/build process)
- 🎵 Real-time audio analysis for mouth movement
- 👁️ Eye tracking that follows camera
- 🚀 Pre-buffering for instant TTS chunk playback
- ☁️ Netlify-ready with serverless function support for Fish Audio

---

## 🚀 Quick Start

### Local Development

```bash
git clone https://github.com/xsploit/WEBWAIFUV2.git
cd WEBWAIFUV2
```

**⚠️ IMPORTANT: Use a local server, not `file://` protocol**

While you can open `index.html` directly in your browser, **it's recommended to use a local server** for better compatibility:

**Option 1: VSCode Live Server (Recommended)**
1. Install [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VSCode
2. Right-click `index.html` → **"Open with Live Server"**
3. Opens at `http://localhost:5500` (or similar)

**Option 2: Python HTTP Server**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then open `http://localhost:8000`

**Option 3: Node.js HTTP Server**
```bash
npx http-server -p 8000
```
Then open `http://localhost:8000`

**Why use a server?**
- ES6 modules work better with HTTP protocol
- Avoid CORS issues when loading local files
- Some browser features require `http://` or `https://` (not `file://`)

### Netlify Deployment

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/xsploit/WEBWAIFUV2)

> **Note**: Fish Audio TTS requires Netlify deployment (serverless functions for API proxy).

---

## ⚙️ Configuration

1. Open **Settings** (⚙️ gear icon in header)
2. Choose **Avatar Type** (VRM or Live2D) - this determines which avatar system is active
3. Choose LLM provider, enter API key
4. Select TTS provider (Edge or Fish Audio)
5. Pick a voice
6. **For VRM Mode**: Load a VRM model (or use the default)
7. **For Live2D Mode**: Load a Live2D model (`.model3.json` file) or select from preloaded models
8. **Start chatting!**

---

## 🤖 LLM Provider Setup

### 🟢 Gemini (Recommended for Free Tier)
- **Get Key**: https://makersuite.google.com/app/apikey
- **Models**: Gemini 2.0 Flash, 1.5 Pro/Flash
- **Notes**: Best free option, fast responses

### 🟣 OpenAI
- **Get Key**: https://platform.openai.com/api-keys
- **Models**: GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo
- **Notes**: Premium quality, paid only

### 🔵 OpenRouter (Access to Claude, Llama, etc)
- **Get Key**: https://openrouter.ai/keys
- **Models**: Auto-fetched from API
- **Notes**: Multiple providers in one API

### 🟠 Ollama (Local, Offline, Private)

<div align="center">

#### 🔥 **IMPORTANT: Ollama Network Setup** 🔥

</div>

Ollama runs locally and is blocked by browser CORS policies by default. **You MUST configure it to allow network access:**

#### Step 1: Enable "Allow through network" in Ollama app
1. Open **Ollama** app on your computer
2. Click the **Ollama icon** in system tray (Windows) or menu bar (Mac)
3. Go to **Settings**
4. Enable **"Allow through network"** or **"Expose on network"**
5. **Restart Ollama** for changes to take effect

#### Step 2: Set CORS origins to allow all (*)
Ollama needs to accept requests from your browser. Configure CORS:

**Windows (PowerShell as Administrator):**
```powershell
# Set environment variable for Ollama to allow all origins
[System.Environment]::SetEnvironmentVariable('OLLAMA_ORIGINS', '*', 'User')

# Restart Ollama for changes to take effect
```

**macOS/Linux (Terminal):**
```bash
# Add to ~/.zshrc or ~/.bashrc
export OLLAMA_ORIGINS="*"

# Restart Ollama
launchctl stop com.ollama.ollama
launchctl start com.ollama.ollama
```

**Alternative: Run Ollama with CORS flag**
```bash
# Windows (CMD)
set OLLAMA_ORIGINS=* && ollama serve

# macOS/Linux
OLLAMA_ORIGINS=* ollama serve
```

#### Step 3: Install and run a model
```bash
# Download a model (first time only)
ollama pull llama3.2

# Verify it's running
ollama list

# Your Ollama URL in WEBWAIFU settings:
# http://localhost:11434
```

#### Why is this needed?
Browsers block cross-origin requests for security. Since WEBWAIFU runs from `file://` (local) or `https://webwaifu.netlify.app` (deployed), and Ollama runs on `http://localhost:11434`, the browser sees this as cross-origin and blocks it **unless** Ollama explicitly allows it via CORS headers.

Setting `OLLAMA_ORIGINS=*` tells Ollama to send the correct CORS headers (`Access-Control-Allow-Origin: *`) so your browser allows the connection.

**Recommended Models for Ollama:**
- `llama3.2` - Fast, lightweight (3B/1B)
- `llama3.1` - Balanced quality (8B)
- `mistral` - Great for roleplay
- `gemma2` - Google's model
- `qwen2.5` - Multilingual support

---

## 🔊 TTS Setup

### Edge TTS (Default)
- ✅ **Free**, 400+ voices
- ✅ Works out of the box
- ✅ High quality neural voices
- 📋 Select voice from dropdown in settings

### Fish Audio (Advanced)
- 🐟 Custom voice cloning
- 💰 Paid service
- 🔑 **API Key**: https://fish.audio/app/api-keys
- ☁️ **Works on deployed Netlify site only** (uses serverless functions)
- 📖 See [FISH_AUDIO_SETUP.md](FISH_AUDIO_SETUP.md) for details

> **Note**: Fish Audio uses amplitude-based lip-sync (less precise than Edge TTS phonemes). First sentence has ~1s delay, then pre-buffering makes it instant!

---

## 🎨 Avatar System

### VRM vs Live2D - Which Should You Use?

**VRM (3D Models):**
- ✅ Full 3D environment with lighting, shadows, camera controls
- ✅ Phoneme-based lip-sync (more accurate) with Edge TTS
- ✅ Mixamo FBX animation support
- ✅ Eye tracking that follows camera
- ✅ Facial expressions (happy, sad, etc.)
- ✅ 3D room environment with uploadable backgrounds
- ⚠️ Requires more GPU power
- ⚠️ Larger file sizes

**Live2D (2D Models):**
- ✅ Lightweight 2D rendering (better for low-end devices)
- ✅ Beautiful 2D anime-style avatars
- ✅ Idle animations and breathing effects
- ✅ Amplitude-based lip-sync (works with both Edge TTS and Fish Audio)
- ✅ Simpler, more stylized aesthetic
- ⚠️ Amplitude-based lip-sync is less precise than phoneme-based
- ⚠️ No 3D environment (pure 2D canvas)
- ⚠️ No eye tracking or facial expressions

### 🎭 Using VRM Models

1. **Select "VRM" from Avatar Type dropdown**
2. **Upload a VRM file** (`.vrm` format) or choose from preloaded models
3. **VRM features available:**
   - 3D room environment toggle
   - Background image upload
   - Grid/floor visibility
   - Camera controls
   - Avatar position/scale controls
   - Eye tracking toggle

**Lip-Sync Behavior:**
- **Edge TTS**: Uses phoneme-based lip-sync (3 blend shapes: `aa`, `ih`, `ou`) - very accurate
- **Fish Audio**: Falls back to amplitude-based lip-sync (less precise)

### 🎨 Using Live2D Models

1. **Select "Live2D" from Avatar Type dropdown**
2. **Upload a Live2D model** (`.model3.json` file) or choose from preloaded models
3. **Live2D features:**
   - Automatic mouth parameter detection
   - Idle animations (breathing, subtle movements)
   - Animations automatically pause during speech
   - Animations resume when speech ends

**How It Works:**
- **Model Format**: Supports Cubism 3.x/4.x models (`.model3.json`)
- **Animations**: When TTS starts, all idle/breathing animations are disabled to prevent mouth interference
- **Lip-Sync**: Uses amplitude-based analysis (reads audio waveform) - same method for both Edge TTS and Fish Audio
- **Mouth Control**: Directly controls `ParamMouthOpenY` parameter in real-time

**Lip-Sync Behavior:**
- **Edge TTS**: Uses amplitude-based (phonemes are ignored for Live2D)
- **Fish Audio**: Uses amplitude-based (same method)
- Both providers analyze audio waveform and map amplitude → mouth opening value (0.0 to 1.0)

### ⚠️ Important Caveats

**VRM Mode:**
- ✅ **3D Room Environment** is ONLY available in VRM mode
- ✅ Camera reveal animation only plays for VRM
- ✅ Switching to Live2D hides the 3D canvas and shows the 2D canvas
- ⚠️ VRM models are larger files (typically 10-50MB)

**Live2D Mode:**
- ✅ **2D rendering only** - no 3D environment, lighting, or shadows
- ✅ Simpler, more performant on low-end devices
- ⚠️ **No 3D Room Environment controls** - these are hidden when in Live2D mode
- ⚠️ **No eye tracking** - Live2D doesn't support it
- ⚠️ **Amplitude-based lip-sync only** - less precise than phoneme-based, but works with all TTS providers
- ⚠️ Model must have `ParamMouthOpenY` or similar mouth parameter (most models do)

**Switching Between Modes:**
- You can switch between VRM and Live2D anytime using the **Avatar Type** dropdown
- The app remembers your last choice (saved in localStorage)
- When switching:
  - VRM → Live2D: 3D canvas hidden, 2D canvas shown
  - Live2D → VRM: 2D canvas hidden, 3D canvas shown, camera reveal plays
- **Both systems can coexist** - only one is visible at a time

**Animation Control:**
- **During TTS**: All idle animations are automatically disabled to prevent mouth interference
- **After TTS**: Idle animations automatically resume (breathing, subtle movements)
- This ensures clean lip-sync without competing animations

---

## 🧠 Memory System

WEBWAIFU V2 features a sophisticated memory system that stores conversations locally in your browser using **IndexedDB** - no server required, fully private.

### How Memory Works

**Architecture:**
- **IndexedDB Storage** - All conversations stored locally in your browser (persistent across sessions)
- **Semantic Search** - Uses AI embeddings to find relevant past conversations
- **Memory Modes** - Three strategies for managing context window size
- **Conversation Continuity** - Automatically loads last 10 messages on startup

### Memory Modes

**1. Auto-Prune (Default)**
```
When conversation history exceeds limit:
→ Delete oldest 10 messages
→ Keep recent 45 messages
```
- ✅ Simple, predictable
- ✅ Fast, no LLM calls
- ⚠️ Context is lost forever

**2. Auto-Summarize**
```
When conversation history exceeds limit:
→ Save oldest messages to IndexedDB (backup)
→ Use separate LLM to summarize them
→ Replace 10 messages with 1 summary
→ Keep last 30 raw messages (sliding window)
```
- ✅ **Preserves context** using AI compression
- ✅ **Uses separate LLM** - use cheap/local models (Ollama) for summaries, expensive ones (GPT-4) for chat
- ✅ **Sliding window** - keeps last 30 messages raw for quality
- ✅ **Originals saved** - no data loss, all messages backed up to IndexedDB
- ⚠️ Requires summarization LLM configured
- ⚠️ Slower than auto-prune (LLM call needed)

**3. Hybrid (Best of Both)**
```
→ Auto-summarize if LLM available
→ Falls back to auto-prune if summarization fails
```

### Semantic Search

**How it works:**
1. **User sends message** → System generates embedding vector
2. **Search IndexedDB** → Compare with stored conversation embeddings
3. **Return top 3 matches** → Most relevant past conversations
4. **Inject into context** → LLM sees: `[Memory Context: ...]` + current conversation

**Model:** MiniLM-L6-v2 (23MB, runs in browser)

**Why it's powerful:**
- AI can reference conversations from weeks/months ago
- Semantic matching finds **meaning**, not just keywords
- Searches across ALL stored memories, not just recent 50

### Sliding Window (Auto-Summarize Mode)

```
Conversation: 60 messages total
Max History: 50 messages

┌─────────────────────────────────────────┐
│ [Summary of 10 messages] ← Compressed   │ ← Oldest (summarized)
├─────────────────────────────────────────┤
│ Message 11-30: RAW                      │ ← Middle (raw)
│ Message 31-50: RAW                      │ ← Recent (raw)
│ Message 51-60: RAW                      │ ← Newest (raw)
└─────────────────────────────────────────┘
          ↑
    Last 30 kept raw for quality
```

**Why sliding window?**
- Recent conversations stay **detailed** (better LLM context)
- Old conversations get **compressed** (save space)
- Original messages **backed up** to IndexedDB (no data loss)

### Separate Summarization LLM

**Use Case:** Run expensive LLM for chat (GPT-4, Claude), cheap/local LLM for summaries (Ollama)

**Example Setup:**
```
Chat LLM:        OpenRouter → Claude 3.5 Sonnet ($3/M tokens)
Summary LLM:     Ollama → Llama 3.2 (FREE, local)
```

**Benefits:**
- 💰 **Save money** - Summaries use cheap/free models
- 🚀 **Keep quality** - Chat uses premium models
- 🔒 **Privacy** - Summarize locally with Ollama, chat with cloud
- ⚡ **Performance** - Local summaries = instant

### Storage Quota Monitoring

**Auto-Cleanup (Optional):**
- **Enable Auto-Cleanup** → Deletes old memories based on importance/age
- **Retention Days** → Keep memories for X days (default: 90)
- **Min Importance** → Only keep memories with importance score ≥ X (0-10)
- **Manual Cleanup** → Button to delete all memories and free space

**Storage Info Display:**
- Shows used/total quota (e.g., "42.3 MB / 5.0 GB")
- Warns when approaching quota limit
- Estimates messages/memories that can be stored

### Conversation Continuity

**On App Restart:**
1. IndexedDB loads last 10 messages
2. Messages populate `conversationHistory`
3. AI immediately has context from previous session
4. User can continue conversation where they left off

**Why this matters:**
- No "cold start" - AI remembers you
- Conversations feel continuous across days/weeks
- Combined with semantic search, AI has both **recent** (last 10) and **relevant** (top 3 matches) context

### Memory Settings

```javascript
// In Settings → Memory Management
memoryMode: 'auto-prune' | 'auto-summarize' | 'hybrid'
maxConversationHistory: 50              // When to trigger cleanup
enableLongTermMemory: true              // Store in IndexedDB
autoSaveInterval: 0                     // Auto-save every X seconds (0 = manual)
enableAutoCleanup: false                // Delete old/low-importance memories
memoryRetentionDays: 90                 // Keep memories for X days
minMemoryImportance: 5                  // Keep memories with score ≥ X

// Separate Summarization LLM
summarizationLlmProvider: 'ollama'      // Which provider for summaries
summarizationLlmModel: 'llama3.2'       // Which model for summaries
```

---

## 🤖 AI Models Loaded in Browser

WEBWAIFU V2 runs **three AI models entirely in your browser** using Web Workers - no external API calls, fully private and offline-capable.

### 1. Whisper Tiny (Speech Recognition)

**Purpose:** Convert voice input to text

**Stats:**
- **Size:** ~40MB
- **Model:** `Xenova/whisper-tiny` (OpenAI Whisper)
- **Languages:** 99+ languages supported
- **Accuracy:** ~85% WER (Word Error Rate)
- **Speed:** Real-time transcription

**How it loads:**
```javascript
// On first voice input:
1. User clicks microphone button
2. Browser downloads model from HuggingFace CDN
3. Model cached in browser (IndexedDB/Cache API)
4. Loaded into Web Worker (non-blocking)
5. Ready for transcription (~5-10 seconds first load)

// On subsequent uses:
→ Loads instantly from browser cache
```

**Technical Details:**
- Runs in **Web Worker** (`whisper-worker.js`) - doesn't block UI
- Uses **@xenova/transformers** (ONNX Runtime for browser)
- Audio resampled to 16kHz before processing
- Outputs text with timestamp metadata

**Performance:**
- **First load:** 5-10 seconds (download + initialize)
- **Cached load:** <1 second
- **Transcription:** ~1-2 seconds per 10-second audio clip
- **Memory:** ~100MB RAM while active

### 2. MiniLM-L6-v2 (Semantic Embeddings)

**Purpose:** Convert text to numerical vectors for semantic search

**Stats:**
- **Size:** 23MB
- **Model:** `Xenova/all-MiniLM-L6-v2` (Sentence Transformers)
- **Dimensions:** 384 (vector size)
- **Use Case:** Memory semantic search

**How it works:**
```javascript
// User sends message: "I love pizza"
1. Message converted to 384-dimensional vector: [0.234, -0.891, ...]
2. Compare with all stored memory vectors using cosine similarity
3. Return top 3 most similar memories
4. Inject into LLM context

// Example search:
Query: "What's my favorite food?"
→ Finds: "I love pizza" (from 2 weeks ago)
→ LLM sees memory and responds: "You mentioned loving pizza!"
```

**Loading:**
- Loads automatically when **enableLongTermMemory** is ON
- Cached after first load (~2-3 seconds)
- Runs in main thread (lightweight)

**Performance:**
- **Embedding generation:** <50ms per message
- **Search 1000 memories:** <100ms
- **Memory:** ~50MB RAM

### 3. DistilBERT (Sentiment Classification) - Optional

**Purpose:** Analyze emotional tone of messages (happy, sad, angry, etc.)

**Stats:**
- **Size:** 250MB
- **Model:** `Xenova/distilbert-base-uncased-finetuned-sst-2-english`
- **Classes:** Positive, Negative, Neutral
- **Accuracy:** ~85%

**How it works:**
```javascript
// Analyze user message sentiment:
Message: "I'm so happy today!"
→ Sentiment: Positive (0.95 confidence)
→ Used to:
   - Adjust avatar expression (smile for positive, sad for negative)
   - Store memory importance score (emotional messages = higher importance)
   - Trigger context-aware animations
```

**Loading:**
- **Optional** - Only loads if sentiment analysis is enabled
- **Largest model** - Takes 10-20 seconds on first load
- Cached after first load

**Performance:**
- **Classification:** ~100-200ms per message
- **Memory:** ~300MB RAM while loaded

### Web Worker Architecture

**Why Web Workers?**
- **Non-blocking:** Models run in separate thread - UI stays responsive
- **Parallel processing:** Multiple models can run simultaneously
- **No freezing:** 250MB model loads don't freeze the app

**How it's implemented:**
```
Main Thread                    Web Worker Thread
─────────────────────────────────────────────────────
[User speaks] ───────────────→ [Load Whisper model]
[UI responsive]                [Transcribe audio]
[User can interact] ←────────── [Return text result]
```

**Data Flow:**
```javascript
// whisper-worker.js
1. Main thread sends audio buffer to worker
2. Worker processes audio with Whisper model
3. Worker sends back transcription text
4. Main thread displays result (no blocking!)
```

### Model Caching Strategy

**First Load (Cold Start):**
```
1. User triggers AI feature
2. Download model from HuggingFace CDN
3. Store in browser cache (IndexedDB + Cache API)
4. Load into memory
5. Ready to use

Total: 5-30 seconds depending on model size
```

**Subsequent Loads (Warm Start):**
```
1. User triggers AI feature
2. Load from browser cache (instant)
3. Load into memory
4. Ready to use

Total: <1 second
```

**Cache Persistence:**
- Models stored in browser forever (until cleared)
- Survives page refreshes, browser restarts
- Uses browser storage APIs (same as installed PWAs)

### Memory Usage Summary

**With All Models Loaded:**
```
Whisper Tiny:       ~100MB RAM
MiniLM-L6-v2:       ~50MB RAM
DistilBERT:         ~300MB RAM (optional)
Three.js/VRM:       ~150MB RAM
Total:              ~600MB RAM
```

**Browser Compatibility:**
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ⚠️ Limited Web Worker support (may be slower)

### Offline Capabilities

**Once models are cached:**
- ✅ **Speech recognition** - Fully offline
- ✅ **Semantic search** - Fully offline
- ✅ **Sentiment analysis** - Fully offline
- ❌ **LLM chat** - Requires internet (unless using Ollama locally)
- ❌ **Edge TTS** - Requires internet

**Use Case:** Run Ollama locally + cached Whisper = fully offline AI companion!

---

## 📁 Project Structure

```
WEBWAIFUV2/
├── index.html              # Main app
├── css/styles.css          # UI styling
├── js/
│   ├── app.js              # Core logic (4,527 lines, 98% code health)
│   ├── live2d-manager.js   # Live2D model management and rendering
│   ├── whisper-worker.js   # Speech recognition Web Worker
│   ├── loadMixamoAnimation.js
│   └── mixamoVRMRigMap.js
├── assets/
│   ├── models/             # VRM files
│   ├── live2d/             # Live2D models (.model3.json files)
│   └── animations/         # Mixamo FBX files
├── netlify/
│   └── functions/          # Serverless functions for Fish Audio
└── archive/                # Documentation
```

---

## 📚 Documentation

All documentation is now in this README. For detailed technical information, see:
- 🔍 [AUDIT_REPORT.md](archive/AUDIT_REPORT.md) - Settings persistence audit (in archive/)

---

## 🛠️ Tech Stack

### Frontend
- **Vanilla JS** (ES6 modules)
- **Three.js** (3D rendering for VRM)
- **Pixi.js v6.5.10** (2D rendering for Live2D)
- **@pixiv/three-vrm** (VRM support)
- **pixi-live2d-display** (Live2D model support)
- **Live2D Cubism Core** (Cubism 3.x/4.x runtime)
- **Edge TTS Universal** (speech synthesis)
- **@xenova/transformers** (Whisper AI, embeddings, classification)

### Backend (Optional, for Fish Audio)
- **Netlify Functions** (serverless)
- **fish-audio** npm package

### Storage
- **IndexedDB** (conversation memory with semantic search)
- **localStorage** (settings persistence)

### AI Models (Browser-Based)
- **Whisper Tiny** - Speech-to-text (~40MB, Web Worker, offline-capable)
- **MiniLM-L6-v2** - Semantic embeddings (23MB, offline-capable)
- **DistilBERT** - Sentiment classification (250MB, optional, offline-capable)

### Memory Features
- **Semantic Search** - Find relevant past conversations using AI embeddings
- **Auto-Summarize** - Use separate LLM to compress old messages (sliding window)
- **Auto-Prune** - Simple deletion of old messages
- **Conversation Continuity** - Auto-load last 10 messages on restart
- **Storage Quota Monitoring** - Track usage, auto-cleanup old/low-importance memories

---

## ⚡ Performance

- **Code Health**: 98% (180 lines dead code removed)
- **Settings Persistence**: 35/35 settings persist across reloads
- **Memory Usage**: ~150MB with all models loaded
- **Frame Rate**: 60fps (30fps eye tracking optimization)
- **TTS Latency**: <50ms with pre-buffering
- **LLM Latency**: Network-dependent, streaming enabled

---

## 🌐 Browser Support

| Browser | Recommended | Notes |
|---------|-------------|-------|
| Chrome 90+ | ✅ | Best performance |
| Edge 90+ | ✅ | Best performance |
| Firefox 88+ | ⚠️ | No Web Speech API fallback |
| Safari 14+ | ⚠️ | Limited WebWorker support |

---

## 🐛 Troubleshooting

### VRM model won't load
- Check console for errors (F12)
- Ensure it's **VRM 0.x** format (not VRM 1.0)
- Try a different model from [VRoid Hub](https://hub.vroid.com)

### Live2D model won't load
- Check console for errors (F12)
- Ensure model is **Cubism 3.x or 4.x** format (`.model3.json`)
- Model must include all required files (`.moc3`, textures, `.model3.json`)
- Verify model path is correct (relative to HTML file)
- Try a different model - some models may have compatibility issues

### Live2D mouth not moving
- Ensure TTS is actually playing (check browser audio)
- Check console for "✅ Found mouth parameter" message
- Model may not have `ParamMouthOpenY` parameter (most models do)
- Try a different Live2D model
- Ensure animations are disabled during speech (check console logs)

### TTS not working
- Edge TTS requires **internet connection**
- Fish Audio requires **Netlify deployment**
- Check browser audio isn't muted

### LLM errors
- Verify **API key** is correct
- Check console for specific error
- Ensure provider has **credits/quota**

### Speech recognition fails
- Grant **microphone permission**
- Check correct device selected
- Whisper model downloads on first use (~40MB)

### Fish Audio 404 errors locally
- Fish Audio **only works on deployed Netlify**
- Use **Edge TTS** for local development
- Or run `netlify dev` to test functions locally

### Ollama connection refused
- Enable **"Allow through network"** in Ollama app
- Set **`OLLAMA_ORIGINS=*`** environment variable
- Verify Ollama is running: `ollama list`
- Check URL is `http://localhost:11434`

---

## 📜 License

**MIT License** - see [LICENSE](LICENSE) file

---

## 🙏 Credits

<div align="center">

Built with 💖 by [@xsploit](https://github.com/xsploit)

### Libraries Used
[Three.js](https://threejs.org) • [Pixi.js](https://pixijs.com) • [@pixiv/three-vrm](https://github.com/pixiv/three-vrm) • [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display) • [Live2D Cubism SDK](https://www.live2d.com) • [edge-tts-universal](https://github.com/SchneeHertz/edge-tts-universal) • [@xenova/transformers](https://github.com/xenova/transformers.js) • [fish-audio](https://fish.audio)

### Assets
Sample VRM models from [VRoid Hub](https://hub.vroid.com) • Live2D models (Hiyori Momose PRO) • Animations from [Mixamo](https://mixamo.com)

</div>

---

## 🤝 Contributing

Pull requests welcome! For major changes, please open an issue first.

```bash
git checkout -b feature/your-feature
git commit -m "Add feature"
git push origin feature/your-feature
```

---

## 🔗 Links

<div align="center">

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-181717?logo=github)](https://github.com/xsploit/WEBWAIFUV2)
[![Issues](https://img.shields.io/badge/GitHub-Issues-red?logo=github)](https://github.com/xsploit/WEBWAIFUV2/issues)
[![Live Demo](https://img.shields.io/badge/Live-Demo-00C7B7?logo=netlify)](https://webwaifu.netlify.app)
[![Original WEBWAIFU](https://img.shields.io/badge/Original-WEBWAIFU-blue)](https://github.com/xsploit/WEBWAIFU)

</div>

---

<div align="center">

**Note**: This is a hobby project built for fun. Code quality has been audited (see reports in `archive/`). Fish Audio integration uses Netlify serverless functions to work around CORS. All AI processing happens via external APIs except for Whisper/embeddings which run in-browser. Live2D support uses Pixi.js for 2D rendering, separate from the Three.js VRM system. Animations automatically pause during speech for clean lip-sync.

**Star ⭐ this repo if you like it!**

</div>
