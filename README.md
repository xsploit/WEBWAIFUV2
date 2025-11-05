# WEBWAIFU V2 🤖💖

> **An advanced AI VTuber companion with VRM avatar support, Edge TTS, and multi-provider LLM integration**

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## ✨ Features

### 🎭 VRM Avatar System
- **Full VRM Support**: Load custom .vrm avatars with complete bone mapping
- **Real-time Animations**: Mixamo FBX animation support with smooth transitions
- **Dynamic Expressions**: Automatic facial expressions and lip-sync
- **Live Lip-Sync**: Audio-reactive mouth movements synchronized to speech
- **Eye Tracking**: Eyes follow camera with performance-optimized updates (toggle in settings)
- **Cinematic Camera Reveal**: Dramatic 180° rotation animation when VRM loads
- **Idle & Talking States**: Automatic animation switching based on TTS state

### 🗣️ Edge TTS Integration
- **High-Quality Voices**: 400+ neural voices from Microsoft Edge TTS
- **Zero Cost**: Completely free, no API key required
- **Customizable**: Adjust rate, pitch, and volume in real-time
- **Streaming Support**: Efficient audio streaming for responsive playback
- **Multi-language**: Support for dozens of languages and accents

### 🤖 Multi-Provider LLM Support
- **Google Gemini**: Latest Gemini models (2.0 Flash, 1.5 Pro/Flash)
- **OpenAI**: GPT-4o, GPT-4 Turbo, GPT-3.5 Turbo
- **OpenRouter**: Access to Claude, Llama, and other models
- **Ollama**: Local AI models running completely offline
- **Streaming Responses**: Sentence-by-sentence streaming with real-time TTS
- **Smart Queuing**: Request queue management to prevent API overwhelm

### 🎤 Speech Recognition
- **Whisper AI Integration**: Browser-based Whisper Tiny model via Transformers.js
- **Web Worker Processing**: Off-thread transcription for smooth performance
- **100% Offline Capable**: No API calls, runs entirely in browser
- **Hotkey Support**: Configurable hotkeys (Shift, Ctrl, Alt, Space)
- **Real-time Transcription**: Live text display as you speak
- **Fallback Support**: Web Speech API as backup option

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Stunning blurred glass aesthetic with purple accents
- **Interactive Splash Screen**: Smooth loading experience with skip/load buttons
- **Dark Theme**: Eye-friendly dark mode optimized for long sessions
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Settings Panel**: Comprehensive settings for all features
- **Real-time Status**: Live status indicators for all operations

### 🧠 AI Memory System
- **Long-term Memory**: Conversations saved to IndexedDB with semantic search
- **Smart Embeddings**: MiniLM-L6-v2 model for semantic similarity matching
- **Importance Classification**: DistilBERT categorizes memory importance (critical/high/medium/low)
- **Sentiment Analysis**: Tracks emotional context of conversations
- **Context Retrieval**: Recalls relevant past conversations automatically
- **Privacy First**: All data stored locally in your browser

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome/Edge recommended)
- API key for your chosen LLM provider (optional for Ollama)
- VRM model files (sample included)
- Mixamo FBX animations (samples included)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/xsploit/WEBWAIFUV2.git
cd WEBWAIFUV2
```

2. **Open in browser**
```bash
# Simply open index.html in your browser
# No build process required - pure client-side!
```

3. **Configure your settings**
- Open Settings (⚙️ button in header)
- Select your LLM provider and enter API key
- Choose a TTS voice
- Select or upload a VRM model
- Start chatting!

## 📖 Usage Guide

### Loading a VRM Model

**Option 1: Use preloaded models**
1. Open Settings → VRM Model
2. Select from dropdown menu
3. Model loads automatically

**Option 2: Upload custom model**
1. Open Settings → VRM Model
2. Click "Upload VRM Model"
3. Select your .vrm file

### Configuring LLM Provider

**For Google Gemini:**
1. Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Settings → LLM Configuration → Select "Google Gemini"
3. Paste API key
4. Choose model (2.0 Flash recommended)

**For OpenAI:**
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Settings → LLM Configuration → Select "OpenAI"
3. Paste API key
4. Choose model (GPT-4o recommended)

**For Ollama (Local):**
1. Install [Ollama](https://ollama.ai)
2. Run: `ollama serve`
3. Pull a model: `ollama pull llama3.2`
4. Settings → LLM Configuration → Select "Ollama"
5. Verify URL: `http://localhost:11434`

### Setting Up TTS

1. Open Settings → Edge TTS
2. Select voice from dropdown (400+ options)
3. Adjust rate, pitch, volume as desired
4. Enable "Auto-play AI responses"
5. Click "Test Voice" to preview

### Using Speech Recognition

1. Open Settings → Speech Recognition
2. Choose hotkey (default: Shift)
3. Select language
4. Hold hotkey and speak
5. Release to stop recording
6. Text appears in chat input

### Animation System

**Automatic Mode** (Default):
- Idle animation plays when not speaking
- Talking animation plays during TTS
- Smooth transitions between states

**Animation Settings**:
- Transition Time: Controls fade speed between animations
- Place custom FBX files in `assets/animations/`
- Animations auto-load with VRM model

### Eye Tracking

**Enable/Disable**:
1. Open Settings → VRM Model
2. Toggle "👁️ Enable Eye Tracking" checkbox
3. Eyes will smoothly follow camera movements

**Performance**:
- Optimized to update every 2 frames (30fps)
- Minimal performance impact
- Can be toggled on/off anytime

### Memory System

**Automatic Memory Storage**:
- All conversations automatically saved to IndexedDB
- AI embeddings generated for semantic search
- Importance and sentiment analyzed automatically

**How It Works**:
1. Every message you send is embedded and classified
2. Relevant past conversations retrieved on new messages
3. AI uses context from previous interactions
4. Memories persist across browser sessions

**Privacy**:
- All data stored locally in browser (IndexedDB)
- No cloud storage or external servers
- Clear browser data to reset memories

## 🎯 Advanced Features

### Streaming Mode
When enabled, the AI response streams sentence-by-sentence:
1. Each sentence is spoken as it arrives
2. Reduces perceived latency
3. More natural conversation flow
4. Enable in Settings → LLM Configuration

### Custom Backgrounds
1. Settings → Background
2. Click "Upload Background"
3. Select image file
4. Background displays behind avatar

### Avatar Customization
- **Position Y**: Adjust vertical position
- **Scale**: Resize avatar (0.5x - 2x)
- Real-time adjustments while chatting

### Conversation History
- Last 20 messages automatically saved
- Provides context for AI responses
- Clears on page refresh

## 🛠️ Technical Details

### Architecture
```
WEBWAIFU V2
├── Pure Client-Side (No server required)
├── ES6 Modules
├── Three.js for 3D rendering
├── @pixiv/three-vrm for VRM support
├── Edge TTS Universal for speech synthesis
├── Whisper AI (Transformers.js) for speech recognition via Web Worker
├── @xenova/transformers for AI embeddings, classification & Whisper
└── IndexedDB for persistent memory storage
```

### Performance Optimizations
- **Efficient Animation System**: Uses Three.js AnimationMixer
- **Audio Analysis**: Real-time FFT for lip-sync
- **Frame-Throttled Eye Tracking**: Updates every 2 frames for 30fps efficiency
- **Optimized Memory Search**: Vector similarity search with IndexedDB
- **Smart Request Queue**: Prevents API spam
- **Lazy Loading**: Resources load on-demand
- **Local Storage**: Settings persist across sessions

### Supported Formats
- **VRM Models**: .vrm (VRM 0.x specification)
- **Animations**: .fbx (Mixamo format)
- **Backgrounds**: JPG, PNG, GIF, WEBP
- **Audio**: Edge TTS (MP3 stream)

## 🔧 Configuration Files

### Settings Storage
All settings are stored in browser `localStorage`:
- `llmProvider`, `llmModel`, `llmApiKey`
- `ttsVoice`, `ttsRate`, `ttsPitch`, `ttsVolume`
- `currentVrmPath`, `avatarPositionY`, `avatarScale`
- `systemPrompt`, `voiceHotkey`, `speechLang`

### File Structure
```
WEBWAIFUV2/
├── index.html              # Main application
├── css/
│   └── styles.css          # Professional modern styles
├── js/
│   ├── app.js              # Main application logic
│   ├── loadMixamoAnimation.js  # Animation loader
│   ├── mixamoVRMRigMap.js      # Bone mapping
│   ├── three-vrm-core.module.js
│   └── three-vrm-animation.module.js
└── assets/
    ├── models/             # VRM files
    │   ├── AvatarSample_H.vrm
    │   └── ... (more models)
    └── animations/         # FBX animations
        ├── Happy Idle.fbx
        ├── Talking.fbx
        └── ... (more animations)
```

## 🎨 Customization

### Adding Custom Voices
Edge TTS provides 400+ voices automatically. Just select from dropdown!

### Adding Custom Models
1. Place .vrm files in `assets/models/`
2. Update dropdown in `index.html` (optional)
3. Or use "Upload VRM Model" button

### Adding Custom Animations
1. Download animations from [Mixamo](https://www.mixamo.com)
2. Export as FBX (without skin)
3. Place in `assets/animations/`
4. Update paths in Settings → Animation Settings

### Theming
Edit `css/styles.css` CSS variables:
```css
:root {
    --accent-primary: #6366f1;  /* Primary accent color */
    --bg-primary: #0a0a0f;      /* Background color */
    --text-primary: #ffffff;     /* Text color */
    /* ... more variables */
}
```

## 🐛 Troubleshooting

### VRM Model Not Loading
- Ensure file is valid .vrm format (VRM 0.x)
- Check browser console for errors
- Try a different model
- Verify file isn't corrupted

### TTS Not Working
- Edge TTS requires internet connection
- Check browser supports audio playback
- Try different voice
- Verify auto-play isn't blocked

### LLM Not Responding
- Verify API key is correct
- Check internet connection
- Ensure API has credits/quota
- Try different model
- Check browser console for errors

### Speech Recognition Failing
- Grant microphone permissions
- Verify correct mic selected in browser
- Check language setting matches your speech
- Try refreshing page

### Animations Not Playing
- Verify FBX files are valid Mixamo format
- Check file paths are correct
- Ensure VRM model loaded successfully
- Look for errors in console

### Performance Issues
- Close other browser tabs
- Reduce avatar scale
- Use simpler VRM model
- Disable browser extensions
- Try Chrome/Edge browsers

## 📊 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Firefox | 88+ | ⚠️ Limited (no speech recognition) |
| Safari | 14+ | ⚠️ Limited (no speech recognition) |
| Opera | 76+ | ✅ Full Support |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics engine
- [@pixiv/three-vrm](https://github.com/pixiv/three-vrm) - VRM support
- [Edge TTS](https://github.com/rany2/edge-tts) - Text-to-speech
- [@xenova/transformers](https://github.com/xenova/transformers.js) - AI embeddings and classification
- [Mixamo](https://www.mixamo.com) - Animation library
- Built with inspiration from [VU-VRM](https://github.com/Automattic/VU-VRM)

## 🔗 Links

- **Repository**: [https://github.com/xsploit/WEBWAIFUV2](https://github.com/xsploit/WEBWAIFUV2)
- **Issues**: [https://github.com/xsploit/WEBWAIFUV2/issues](https://github.com/xsploit/WEBWAIFUV2/issues)
- **Original WEBWAIFU**: [https://github.com/xsploit/WEBWAIFU](https://github.com/xsploit/WEBWAIFU)

## 📞 Support

If you encounter issues or have questions:
1. Check the Troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Include browser console errors if applicable

## 🎯 Roadmap

**Completed** ✅
- [x] Eye tracking system with performance optimization
- [x] Cinematic camera reveal animation
- [x] AI-powered memory system with embeddings
- [x] Glassmorphism UI redesign
- [x] Interactive splash screen
- [x] Whisper AI for browser-based speech recognition (Web Worker)

**Planned** 🚀
- [ ] First-person exploration mode with FPS controls
- [ ] AI tool calling for autonomous movement ("come here", "go to corner")
- [ ] Grid-based pathfinding for VRM navigation
- [ ] Walking animations with velocity-based triggering
- [ ] Additional animation presets
- [ ] VRM expression editor
- [ ] Chat history export
- [ ] Multi-avatar support
- [ ] Custom emotion triggers
- [ ] Twitch chat integration
- [ ] OBS overlay mode

---

**Made with ❤️ by the WEBWAIFU community**

*Transform your AI interactions into immersive VTuber experiences!*









