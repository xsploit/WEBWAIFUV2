# WEBWAIFU V2

A browser-based AI companion with VRM avatar support, real-time lip-sync, and multi-provider LLM integration. No server required—runs entirely client-side.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## What is this?

An interactive AI character that lives in your browser. Talk to it using voice or text, watch it respond with full lip-sync and animations, powered by your choice of AI provider (Gemini, OpenAI, OpenRouter, or local Ollama).

## Features

**Core Functionality**
- **VRM Avatar System** - Load any VRM model, automatic lip-sync (phoneme + amplitude-based), facial expressions
- **Dual TTS Support** - Edge TTS (free, 400+ voices) or Fish Audio (paid, custom voice cloning)
- **Multi-Provider LLM** - Gemini, OpenAI, OpenRouter, Ollama (local)
- **Speech Recognition** - Browser-based Whisper AI via Web Worker (no API calls)
- **Memory System** - Semantic search with embeddings, stores conversations locally in IndexedDB
- **Animation System** - Mixamo FBX support, auto-switches between idle and talking states

**Technical Highlights**
- Pure client-side (no server/build process)
- Real-time audio analysis for mouth movement
- Eye tracking that follows camera
- Pre-buffering for instant TTS chunk playback
- Netlify-ready with serverless function support for Fish Audio

## Quick Start

### Local Development

```bash
git clone https://github.com/xsploit/WEBWAIFUV2.git
cd WEBWAIFUV2
```

Open `index.html` in your browser. That's it.

### Netlify Deployment

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/xsploit/WEBWAIFUV2)

Fish Audio TTS requires Netlify deployment (serverless functions for API proxy). See [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) for details.

## Configuration

1. Open Settings (gear icon in header)
2. Choose LLM provider, enter API key
3. Select TTS provider (Edge or Fish Audio)
4. Pick a voice
5. Load a VRM model (or use the default)
6. Start chatting

### LLM Provider Setup

**Gemini** (recommended for free tier)
- Get key: https://makersuite.google.com/app/apikey
- Models: Gemini 2.0 Flash, 1.5 Pro/Flash

**OpenAI**
- Get key: https://platform.openai.com/api-keys
- Models: GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo

**OpenRouter** (access to Claude, Llama, etc)
- Get key: https://openrouter.ai/keys
- Models: Auto-fetched from API

**Ollama** (local, offline)
- Install: https://ollama.ai
- Run: `ollama serve` then `ollama pull llama3.2`
- URL: http://localhost:11434

### TTS Setup

**Edge TTS** (Default)
- Free, 400+ voices
- Works out of the box
- Select voice from dropdown

**Fish Audio** (Advanced)
- Custom voice cloning
- Requires API key: https://fish.audio/app/api-keys
- Works on deployed Netlify site only (uses serverless functions)
- See [FISH_AUDIO_SETUP.md](FISH_AUDIO_SETUP.md)

## Project Structure

```
WEBWAIFUV2/
├── index.html              # Main app
├── css/styles.css          # UI styling
├── js/
│   ├── app.js              # Core logic (4,294 lines, 98% code health)
│   ├── whisper-worker.js   # Speech recognition Web Worker
│   ├── loadMixamoAnimation.js
│   └── mixamoVRMRigMap.js
├── assets/
│   ├── models/             # VRM files
│   └── animations/         # Mixamo FBX files
├── netlify/
│   └── functions/          # Serverless functions for Fish Audio
└── docs/                   # See below
```

## Documentation

- [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) - Deploy guide with jsdelivr CDN fix
- [FISH_AUDIO_SETUP.md](FISH_AUDIO_SETUP.md) - Fish Audio integration details
- [AUDIT_REPORT.md](AUDIT_REPORT.md) - Settings persistence audit
- [DEAD_CODE_REPORT.md](DEAD_CODE_REPORT.md) - Code health analysis
- [CODE_TRACE_VERIFICATION.md](CODE_TRACE_VERIFICATION.md) - Dead code verification

## Tech Stack

**Frontend**
- Vanilla JS (ES6 modules)
- Three.js (3D rendering)
- @pixiv/three-vrm (VRM support)
- Edge TTS Universal (speech synthesis)
- @xenova/transformers (Whisper AI, embeddings, classification)

**Backend** (Optional, for Fish Audio)
- Netlify Functions (serverless)
- fish-audio npm package

**Storage**
- IndexedDB (conversation memory)
- localStorage (settings)

**Models**
- Whisper Tiny (speech-to-text)
- MiniLM-L6-v2 (embeddings, 23MB)
- DistilBERT (sentiment classification, 250MB - optional)

## Performance

- **Code Health**: 98% (180 lines dead code removed)
- **Settings Persistence**: 35/35 settings persist across reloads
- **Memory Usage**: ~150MB with all models loaded
- **Frame Rate**: 60fps (30fps eye tracking optimization)
- **TTS Latency**: <50ms with pre-buffering
- **LLM Latency**: Network-dependent, streaming enabled

## Browser Support

| Browser | Recommended | Notes |
|---------|-------------|-------|
| Chrome 90+ | ✅ | Best performance |
| Edge 90+ | ✅ | Best performance |
| Firefox 88+ | ⚠️ | No Web Speech API fallback |
| Safari 14+ | ⚠️ | Limited WebWorker support |

## Troubleshooting

**VRM model won't load**
- Check console for errors
- Ensure it's VRM 0.x format (not VRM 1.0)
- Try a different model

**TTS not working**
- Edge TTS requires internet
- Fish Audio requires Netlify deployment
- Check browser audio isn't muted

**LLM errors**
- Verify API key
- Check console for specific error
- Ensure provider has credits/quota

**Speech recognition fails**
- Grant microphone permission
- Check correct device selected
- Whisper model downloads on first use (~40MB)

**Fish Audio 404 errors locally**
- Fish Audio only works on deployed Netlify
- Use Edge TTS for local development
- Or run `netlify dev` to test functions locally

## License

MIT License - see LICENSE file

## Credits

Built by [@xsploit](https://github.com/xsploit)

**Libraries Used**
- Three.js
- @pixiv/three-vrm
- edge-tts-universal
- @xenova/transformers
- fish-audio (optional)

**Assets**
- Sample VRM models from VRoid Hub
- Animations from Mixamo

## Contributing

Pull requests welcome. For major changes, open an issue first.

```bash
git checkout -b feature/your-feature
git commit -m "Add feature"
git push origin feature/your-feature
```

## Links

- **Repo**: https://github.com/xsploit/WEBWAIFUV2
- **Issues**: https://github.com/xsploit/WEBWAIFUV2/issues
- **Original WEBWAIFU**: https://github.com/xsploit/WEBWAIFU
- **Live Demo**: https://webwaifu.netlify.app (if deployed)

---

**Note**: This is a hobby project built for fun. Code quality has been audited (see reports in repo). Fish Audio integration uses Netlify serverless functions to work around CORS. All AI processing happens via external APIs except for Whisper/embeddings which run in-browser.
