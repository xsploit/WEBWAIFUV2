<div align="center">

# 🤖💖 WEBWAIFU V2

### Your AI Companion in the Browser

**Talk • Listen • Respond • Remember**

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/xsploit/WEBWAIFUV2)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Netlify Status](https://img.shields.io/badge/netlify-deployed-00C7B7.svg)](https://webwaifu.netlify.app)
[![Code Health](https://img.shields.io/badge/code%20health-98%25-brightgreen.svg)](AUDIT_REPORT.md)
[![VRM Support](https://img.shields.io/badge/VRM-0.x-ff69b4.svg)](https://vrm.dev)
[![AI Powered](https://img.shields.io/badge/AI-Multi--Provider-orange.svg)](#llm-provider-setup)

*A browser-based AI companion with VRM avatar support, real-time lip-sync, and multi-provider LLM integration. No server required—runs entirely client-side.*

[🚀 Live Demo](https://webwaifu.netlify.app) • [📖 Documentation](#documentation) • [🐛 Report Bug](https://github.com/xsploit/WEBWAIFUV2/issues)

---

</div>

## ✨ What is this?

An interactive AI character that lives in your browser. Talk to it using voice or text, watch it respond with full lip-sync and animations, powered by your choice of AI provider (Gemini, OpenAI, OpenRouter, or local Ollama).

## 🎯 Features

### Core Functionality
- 🎭 **VRM Avatar System** - Load any VRM model, automatic lip-sync (phoneme + amplitude-based), facial expressions
- 🔊 **Dual TTS Support** - Edge TTS (free, 400+ voices) or Fish Audio (paid, custom voice cloning)
- 🤖 **Multi-Provider LLM** - Gemini, OpenAI, OpenRouter, Ollama (local)
- 🎤 **Speech Recognition** - Browser-based Whisper AI via Web Worker (no API calls)
- 🧠 **Memory System** - Semantic search with embeddings, stores conversations locally in IndexedDB
- 🎬 **Animation System** - Mixamo FBX support, auto-switches between idle and talking states

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

Open `index.html` in your browser. **That's it.**

### Netlify Deployment

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/xsploit/WEBWAIFUV2)

> **Note**: Fish Audio TTS requires Netlify deployment (serverless functions for API proxy).

---

## ⚙️ Configuration

1. Open **Settings** (⚙️ gear icon in header)
2. Choose LLM provider, enter API key
3. Select TTS provider (Edge or Fish Audio)
4. Pick a voice
5. Load a VRM model (or use the default)
6. **Start chatting!**

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

## 📁 Project Structure

```
WEBWAIFUV2/
├── index.html              # Main app
├── css/styles.css          # UI styling
├── js/
│   ├── app.js              # Core logic (4,295 lines, 98% code health)
│   ├── whisper-worker.js   # Speech recognition Web Worker
│   ├── loadMixamoAnimation.js
│   └── mixamoVRMRigMap.js
├── assets/
│   ├── models/             # VRM files
│   └── animations/         # Mixamo FBX files
├── netlify/
│   └── functions/          # Serverless functions for Fish Audio
└── archive/                # Documentation
```

---

## 📚 Documentation

- 📖 [NETLIFY_DEPLOYMENT.md](archive/NETLIFY_DEPLOYMENT.md) - Deploy guide with jsdelivr CDN fix
- 🐟 [FISH_AUDIO_SETUP.md](archive/FISH_AUDIO_SETUP.md) - Fish Audio integration details
- 🔍 [AUDIT_REPORT.md](archive/AUDIT_REPORT.md) - Settings persistence audit
- 🧹 [DEAD_CODE_REPORT.md](archive/DEAD_CODE_REPORT.md) - Code health analysis
- ✅ [CODE_TRACE_VERIFICATION.md](archive/CODE_TRACE_VERIFICATION.md) - Dead code verification

---

## 🛠️ Tech Stack

### Frontend
- **Vanilla JS** (ES6 modules)
- **Three.js** (3D rendering)
- **@pixiv/three-vrm** (VRM support)
- **Edge TTS Universal** (speech synthesis)
- **@xenova/transformers** (Whisper AI, embeddings, classification)

### Backend (Optional, for Fish Audio)
- **Netlify Functions** (serverless)
- **fish-audio** npm package

### Storage
- **IndexedDB** (conversation memory)
- **localStorage** (settings)

### AI Models
- **Whisper Tiny** - Speech-to-text (~40MB, runs in browser)
- **MiniLM-L6-v2** - Embeddings (23MB)
- **DistilBERT** - Sentiment classification (250MB, optional)

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
[Three.js](https://threejs.org) • [@pixiv/three-vrm](https://github.com/pixiv/three-vrm) • [edge-tts-universal](https://github.com/SchneeHertz/edge-tts-universal) • [@xenova/transformers](https://github.com/xenova/transformers.js) • [fish-audio](https://fish.audio)

### Assets
Sample VRM models from [VRoid Hub](https://hub.vroid.com) • Animations from [Mixamo](https://mixamo.com)

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

**Note**: This is a hobby project built for fun. Code quality has been audited (see reports in `archive/`). Fish Audio integration uses Netlify serverless functions to work around CORS. All AI processing happens via external APIs except for Whisper/embeddings which run in-browser.

**Star ⭐ this repo if you like it!**

</div>
