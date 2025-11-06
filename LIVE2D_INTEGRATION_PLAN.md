# 🎭 Live2D Integration Plan for WEBWAIFU V2

## 📋 Overview
This document outlines the strategy for integrating Live2D support alongside the existing VRM system, allowing users to choose between VRM (3D) and Live2D (2D) avatars.

---

## 🎯 Integration Strategy: **Unified Avatar Interface**

Create an **abstraction layer** that provides the same interface for both VRM and Live2D, so the rest of the app doesn't need to know which type is loaded.

---

## 📊 Current VRM Functions to Abstract

### 1. **Loading & Initialization**
| Function | VRM Implementation | Live2D Equivalent |
|----------|-------------------|-------------------|
| `loadVRM(url)` | GLTFLoader + VRMLoaderPlugin | `PIXI.live2d.Live2DModel.from()` |
| Scene setup | `scene.add(vrm.scene)` | `app.stage.addChild(model)` |
| Cleanup | `VRMUtils.deepDispose()` | `model.destroy()` |

**New Abstraction:**
```javascript
async function loadAvatar(url, type) {
    if (type === 'vrm') {
        return await loadVRM(url);
    } else if (type === 'live2d') {
        return await loadLive2D(url);
    }
}
```

---

### 2. **Animation Loop**
| Function | VRM Implementation | Live2D Equivalent |
|----------|-------------------|-------------------|
| `animate()` | `vrm.update(deltaTime)` | Auto-updated by PIXI ticker |
| Animation mixer | `mixer.update(deltaTime)` | N/A (Live2D has built-in motions) |
| Body animations | Mixamo FBX files | Live2D motion JSON files |

**Abstraction:**
```javascript
function updateAvatar(deltaTime) {
    if (APP_STATE.avatarType === 'vrm') {
        if (APP_STATE.vrm) APP_STATE.vrm.update(deltaTime);
        if (APP_STATE.mixer) APP_STATE.mixer.update(deltaTime);
    }
    // Live2D auto-updates via PIXI.Ticker
}
```

---

### 3. **Lip Sync (CRITICAL)**
| Function | VRM Implementation | Live2D Equivalent |
|----------|-------------------|-------------------|
| `updateLipSync()` | Set blend shapes: `aa`, `ih`, `ou` | Set parameter: `ParamMouthOpenY` |
| Phoneme mapping | `PHONEME_TO_BLEND_SHAPE` | Amplitude-based (no phonemes) |
| Expression manager | `vrm.expressionManager.setValue()` | `model.internalModel.coreModel.setParameterValueByIndex()` |

**Current VRM Lip Sync:**
```javascript
// VRM uses 3 blend shapes
manager.setValue('aa', finalAa);  // Open mouth (vowels)
manager.setValue('ih', finalIh);  // Wide mouth (ee, ih)
manager.setValue('ou', finalOu);  // Round mouth (oo, oh)
```

**Live2D Lip Sync (Simpler):**
```javascript
// Live2D uses 1 parameter (mouth open amount)
const mouthParamIndex = findMouthParameter();
coreModel.setParameterValueByIndex(mouthParamIndex, amplitude);
```

**Unified Abstraction:**
```javascript
function setMouthShape(aa, ih, ou, amplitude) {
    if (APP_STATE.avatarType === 'vrm') {
        const manager = APP_STATE.vrm.expressionManager;
        manager.setValue('aa', aa);
        manager.setValue('ih', ih);
        manager.setValue('ou', ou);
    } else if (APP_STATE.avatarType === 'live2d') {
        // Convert VRM blend shapes to single mouth value
        const mouthOpen = Math.max(aa, ih, ou) * amplitude;
        setLive2DMouthParameter(mouthOpen);
    }
}
```

---

### 4. **Eye Tracking**
| Function | VRM Implementation | Live2D Equivalent |
|----------|-------------------|-------------------|
| Eye tracking | `vrm.lookAt.target` | `model.internalModel.focusController.focus(x, y)` |
| Target type | THREE.Object3D | Normalized coordinates (x, y) |

**Abstraction:**
```javascript
function updateEyeTracking(targetX, targetY, targetZ) {
    if (APP_STATE.avatarType === 'vrm') {
        // VRM uses 3D Object3D
        eyeTrackingTarget.position.set(targetX, targetY, targetZ);
        APP_STATE.vrm.lookAt.target = eyeTrackingTarget;
    } else if (APP_STATE.avatarType === 'live2d') {
        // Live2D uses 2D normalized coords
        const dx = (targetX - model.x) / app.screen.width;
        const dy = (targetY - model.y) / app.screen.height;
        model.internalModel.focusController.focus(dx * 2, dy * 2);
    }
}
```

---

### 5. **Positioning & Transforms**
| Function | VRM Implementation | Live2D Equivalent |
|----------|-------------------|-------------------|
| Position | `vrm.scene.position.set(x, y, z)` | `model.position.set(x, y)` |
| Scale | `vrm.scene.scale.set(s, s, s)` | `model.scale.set(s)` |
| Rotation | `vrm.scene.rotation.y = Math.PI` | N/A (2D sprite) |
| Floor snap | Adjust `position.y` | N/A (no floor concept) |

**Abstraction:**
```javascript
function setAvatarPosition(x, y, z) {
    if (APP_STATE.avatarType === 'vrm') {
        APP_STATE.vrm.scene.position.set(x, y, z);
    } else if (APP_STATE.avatarType === 'live2d') {
        // Convert 3D to 2D screen space
        model.x = x;
        model.y = y;
    }
}

function setAvatarScale(scale) {
    if (APP_STATE.avatarType === 'vrm') {
        APP_STATE.vrm.scene.scale.set(scale, scale, scale);
    } else if (APP_STATE.avatarType === 'live2d') {
        model.scale.set(scale);
    }
}
```

---

### 6. **Animations (Idle, Talking)**
| Function | VRM Implementation | Live2D Equivalent |
|----------|-------------------|-------------------|
| `loadAnimations()` | Load FBX with `loadMixamoAnimation()` | Built-in motions in model |
| `playAnimation(type)` | `mixer.clipAction(clip).play()` | `model.motion(motionName)` |
| Animation types | `idle`, `talking` | `Idle`, `TapBody`, etc. |

**Abstraction:**
```javascript
function playAvatarAnimation(type) {
    if (APP_STATE.avatarType === 'vrm') {
        // Existing VRM code
        if (type === 'idle' && APP_STATE.idleAnimation) {
            APP_STATE.idleAnimation.play();
        } else if (type === 'talking' && APP_STATE.talkingAnimation) {
            APP_STATE.talkingAnimation.play();
        }
    } else if (APP_STATE.avatarType === 'live2d') {
        // Map to Live2D motions
        const motionMap = {
            'idle': 'Idle',
            'talking': 'TapBody'  // Or any motion
        };
        const motionName = motionMap[type];
        if (motionName && model.motion) {
            model.motion(motionName);
        }
    }
}
```

---

## 🏗️ New Architecture: **Separate Rendering Systems**

### **Key Insight: VRM and Live2D are COMPLETELY SEPARATE!**

Live2D is **pure 2D** - it can't exist in a 3D scene. We need to **switch** between modes, not overlay.

**Architecture:**
```
VRM Mode:
┌─────────────────────────────────────┐
│  Three.js Scene (ACTIVE)            │
│  - 3D Room                           │
│  - VRM Character (in scene)         │
│  - Lighting, shadows, 3D controls   │
└─────────────────────────────────────┘

Live2D Mode:
┌─────────────────────────────────────┐
│  Pixi.js Scene (ACTIVE)             │
│  - Live2D Character (2D sprite)     │
│  - 2D/gradient background           │
│  - Simple 2D controls               │
└─────────────────────────────────────┘
       (Three.js scene HIDDEN)
```

### **Canvas Setup:**
```html
<!-- VRM Mode: Show Three.js, hide Pixi.js -->
<canvas id="three-canvas"></canvas>  <!-- display: block -->
<canvas id="pixi-canvas"></canvas>   <!-- display: none -->

<!-- Live2D Mode: Hide Three.js, show Pixi.js -->
<canvas id="three-canvas"></canvas>  <!-- display: none -->
<canvas id="pixi-canvas"></canvas>   <!-- display: block -->
```

### **CSS:**
```css
#three-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;  /* Default: VRM mode */
}

#pixi-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;  /* Hidden by default */
}

/* When switching modes, toggle display */
body.live2d-mode #three-canvas { display: none; }
body.live2d-mode #pixi-canvas { display: block; }
```

### **Avatar Manager Module**
```javascript
const AvatarManager = {
    type: null,  // 'vrm' or 'live2d'
    instance: null,  // The actual model
    pixiApp: null,  // Pixi.js application (for Live2D)
    threeAnimationId: null,  // RequestAnimationFrame ID for Three.js
    
    async load(url, type) {
        // Clean up previous avatar
        this.destroy();
        
        this.type = type;
        
        if (type === 'vrm') {
            // SWITCH TO VRM MODE
            this.switchToVRMMode();
            this.instance = await loadVRM(url);  // Existing VRM loader
            this.startThreeJSLoop();  // Start Three.js animation loop
            
        } else if (type === 'live2d') {
            // SWITCH TO LIVE2D MODE
            this.switchToLive2DMode();
            await this.initPixiApp();  // Create Pixi app if needed
            this.instance = await loadLive2D(url);  // New Live2D loader
            this.stopThreeJSLoop();  // Stop Three.js rendering (not needed)
        }
    },
    
    switchToVRMMode() {
        // Show Three.js canvas, hide Pixi.js canvas
        document.getElementById('three-canvas').style.display = 'block';
        document.getElementById('pixi-canvas').style.display = 'none';
        document.body.classList.remove('live2d-mode');
        document.body.classList.add('vrm-mode');
        
        // Show VRM-specific UI controls
        document.querySelectorAll('.vrm-only').forEach(el => el.style.display = 'block');
        document.querySelectorAll('.live2d-only').forEach(el => el.style.display = 'none');
    },
    
    switchToLive2DMode() {
        // Hide Three.js canvas, show Pixi.js canvas
        document.getElementById('three-canvas').style.display = 'none';
        document.getElementById('pixi-canvas').style.display = 'block';
        document.body.classList.remove('vrm-mode');
        document.body.classList.add('live2d-mode');
        
        // Show Live2D-specific UI controls
        document.querySelectorAll('.vrm-only').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.live2d-only').forEach(el => el.style.display = 'block');
    },
    
    initPixiApp() {
        if (!this.pixiApp) {
            const canvas = document.getElementById('pixi-canvas');
            this.pixiApp = new PIXI.Application({
                view: canvas,
                width: window.innerWidth,
                height: window.innerHeight,
                background: '#1a1a2e',  // Solid background (NOT transparent!)
                resolution: window.devicePixelRatio || 1,
                autoDensity: true
            });
            window.PIXI = PIXI;  // Required by pixi-live2d-display
        }
    },
    
    startThreeJSLoop() {
        // Start the existing Three.js animate() function
        if (!this.threeAnimationId) {
            animate();  // Existing function from app.js
        }
    },
    
    stopThreeJSLoop() {
        // Stop Three.js rendering loop (save CPU when not needed)
        if (this.threeAnimationId) {
            cancelAnimationFrame(this.threeAnimationId);
            this.threeAnimationId = null;
        }
    },
    
    update(deltaTime) {
        // Only called in VRM mode (from Three.js animate loop)
        if (this.type === 'vrm' && this.instance) {
            this.instance.update(deltaTime);
        }
        // Live2D auto-updates via PIXI.Ticker
    },
    
    setMouthShape(aa, ih, ou, amplitude) {
        if (this.type === 'vrm') {
            // VRM blend shapes (3 parameters)
            const manager = this.instance.expressionManager;
            manager.setValue('aa', aa);
            manager.setValue('ih', ih);
            manager.setValue('ou', ou);
        } else if (this.type === 'live2d') {
            // Live2D single parameter
            const mouthOpen = Math.max(aa, ih, ou) * amplitude;
            setLive2DMouthParameter(this.instance, mouthOpen);
        }
    },
    
    playAnimation(type) {
        if (this.type === 'vrm') {
            // Existing VRM animation (idle, talking)
            playAnimation(type);  // Existing function
        } else if (this.type === 'live2d') {
            // Live2D motions
            const motionMap = { 'idle': 'Idle', 'talking': 'TapBody' };
            const motionName = motionMap[type];
            if (motionName && this.instance.motion) {
                this.instance.motion(motionName);
            }
        }
    },
    
    setPosition(x, y, z) {
        if (this.type === 'vrm') {
            // 3D positioning
            this.instance.scene.position.set(x, y, z);
        } else if (this.type === 'live2d') {
            // 2D screen positioning
            this.instance.x = x;
            this.instance.y = y;
        }
    },
    
    setScale(scale) {
        if (this.type === 'vrm') {
            this.instance.scene.scale.set(scale, scale, scale);
        } else if (this.type === 'live2d') {
            this.instance.scale.set(scale);
        }
    },
    
    updateEyeTracking(x, y, z) {
        if (this.type === 'vrm') {
            // VRM 3D eye tracking
            if (eyeTrackingTarget) {
                eyeTrackingTarget.position.set(x, y, z);
                this.instance.lookAt.target = eyeTrackingTarget;
            }
        } else if (this.type === 'live2d') {
            // Live2D 2D eye tracking
            const dx = (x - this.instance.x) / this.pixiApp.screen.width;
            const dy = (y - this.instance.y) / this.pixiApp.screen.height;
            this.instance.internalModel.focusController.focus(dx * 2, dy * 2);
        }
    },
    
    destroy() {
        if (this.type === 'vrm' && this.instance) {
            // Clean up VRM
            APP_STATE.scene.remove(this.instance.scene);
            VRMUtils.deepDispose(this.instance.scene);
            this.stopThreeJSLoop();
        } else if (this.type === 'live2d' && this.instance) {
            // Clean up Live2D
            this.pixiApp.stage.removeChild(this.instance);
            this.instance.destroy();
        }
        this.instance = null;
        this.type = null;
    }
};
```

---

## 🎨 UI Changes Needed

### **1. Avatar Type Selector (New)**
```html
<div class="control-group">
    <label>🎭 Avatar Type</label>
    <select id="avatarType" class="setting-input">
        <option value="vrm">VRM (3D)</option>
        <option value="live2d">Live2D (2D)</option>
    </select>
</div>
```

### **2. Conditional UI Display**
Add CSS classes to controls:
```html
<!-- VRM-specific controls (hide in Live2D mode) -->
<div class="vrm-only">Floor Snap button</div>
<div class="vrm-only">Position Y slider</div>
<div class="vrm-only">3D Room settings</div>
<div class="vrm-only">Mixamo animation uploads</div>

<!-- Live2D-specific controls (hide in VRM mode) -->
<div class="live2d-only">Position X/Y sliders</div>
<div class="live2d-only">Motion selector</div>
<div class="live2d-only">Background color picker</div>

<!-- SHARED controls (show for BOTH) -->
<div>TTS settings</div>
<div>AI chat settings</div>
<div>Memory settings</div>
<div>Whisper AI settings</div>
```

### **3. File Upload**
- Detect file type from extension:
  - `.vrm` → VRM mode
  - `.model3.json` → Live2D mode
- Auto-switch avatar type

---

## 📁 File Structure Changes

### **New Files to Add**
```
js/
├── app.js                    (main app - keep existing VRM code)
├── avatar-manager.js         (NEW - abstraction layer)
├── vrm-adapter.js            (NEW - VRM-specific logic)
├── live2d-adapter.js         (NEW - Live2D-specific logic)
└── lip-sync-manager.js       (NEW - unified lip sync)
```

### **Or Keep it Simple (Recommended)**
Just add Live2D functions to existing `app.js`:
```javascript
// NEW: Live2D Functions
async function loadLive2D(url) { ... }
function updateLive2DLipSync() { ... }
function setLive2DMouthParameter(model, value) { ... }
```

---

## 🔧 Implementation Steps

### **Phase 0: Canvas Setup**
1. Add second `<canvas id="pixi-canvas">` to `index.html` (overlaid on same position as Three.js canvas)
2. Add CSS to position both canvases absolutely (same position, full screen)
3. Set Pixi canvas to `display: none` by default (VRM mode is default)
4. Add CSS classes `.vrm-mode` and `.live2d-mode` to `<body>` for mode switching

### **Phase 1: Add Live2D Support (No UI)**
1. ✅ Add Pixi.js v6 to `index.html`
2. ✅ Add Live2D Cubism Core to `index.html`
3. ✅ Add `pixi-live2d-display` to `index.html`
4. Create `initPixiApp()` function - init Pixi.js with solid background (NOT transparent)
5. Create `loadLive2D()` function in `app.js`
6. Create `switchToVRMMode()` and `switchToLive2DMode()` functions (toggle canvas visibility)
7. Test switching between modes

### **Phase 2: Lip Sync Abstraction**
1. Create `setMouthShape()` abstraction
2. Modify `updateLipSync()` to call `setMouthShape()`
3. Implement Live2D mouth parameter detection
4. Test lip sync with both VRM and Live2D

### **Phase 3: UI Integration**
1. Add "Avatar Type" selector
2. Add conditional UI visibility (VRM vs Live2D controls)
3. Add file type detection on upload
4. Save avatar type to localStorage

### **Phase 4: Feature Parity**
1. Implement Live2D eye tracking
2. Implement Live2D animations (motions)
3. Implement Live2D positioning controls
4. Add Live2D model gallery/presets

---

## ⚠️ Known Limitations & Mode Differences

### **Live2D Mode:**
**What it is:**
- Pure 2D sprite rendering (Pixi.js)
- Character in screen space (not world space)
- Simple gradient/solid color background

**Limitations:**
- ❌ No 3D environment (3D scene is HIDDEN)
- ❌ No floor snapping (no concept of "floor")
- ❌ No 3D camera controls
- ❌ No Mixamo animations (uses built-in motions)
- ❌ No advanced phoneme lip sync (amplitude only)

**Advantages:**
- ✅ Lightweight (smaller file sizes)
- ✅ Simpler 2D positioning
- ✅ Better performance
- ✅ 2D parallax effects possible
- ✅ Built-in motions

### **VRM Mode:**
**What it is:**
- Full 3D model rendering (Three.js)
- Character in 3D world space
- 3D room environment

**Limitations:**
- ❌ Larger file sizes
- ❌ More complex positioning
- ❌ Higher performance cost

**Advantages:**
- ✅ Full 3D environment
- ✅ 3D camera controls
- ✅ Floor snapping
- ✅ Mixamo animations
- ✅ Advanced phoneme lip sync
- ✅ Depth perception

### **What's Shared:**
- ✅ TTS (Fish Audio + Edge TTS + **Azure TTS planned**)
- ✅ AI chat (Gemini, Ollama, OpenRouter, etc.)
- ✅ Memory system (IndexedDB + embeddings)
- ✅ Whisper AI (speech recognition)
- ✅ Settings persistence (localStorage)

---

## 🎯 Recommended Approach

**OPTION A: Gradual Integration (Safest)**
1. Keep all VRM code exactly as-is
2. Add parallel Live2D functions with `live2d_` prefix
3. Add avatar type toggle
4. Slowly abstract common functions over time

**OPTION B: Full Abstraction (Cleanest, but riskier)**
1. Create `AvatarManager` class immediately
2. Refactor all existing VRM code to use abstractions
3. Add Live2D as a second adapter
4. Risk: Breaking existing VRM functionality

**RECOMMENDATION: Start with Option A, migrate to Option B later.**

---

## 📝 Code Checklist

### Functions to Abstract:
- [x] `loadVRM()` → `loadAvatar(url, type)`
- [x] `updateLipSync()` → `setMouthShape(aa, ih, ou, amplitude)`
- [x] Eye tracking logic → `updateEyeTracking(x, y, z)`
- [x] `playAnimation(type)` → `playAvatarAnimation(type)`
- [x] Position/scale controls → `setAvatarPosition/Scale()`
- [ ] `snapVRMToFloor()` → Only for VRM (no Live2D equivalent)

### New Functions Needed:
- [ ] `loadLive2D(url)` - Load Live2D model into Pixi.js
- [ ] `updateLive2DLipSync()` - Amplitude-based mouth movement
- [ ] `setLive2DMouthParameter(model, value)` - Set mouth open amount
- [ ] `getLive2DMotions(model)` - Get available motions
- [ ] `playLive2DMotion(model, name)` - Play a motion
- [ ] `destroyLive2D(model)` - Clean up Live2D model

---

## 🎤 Future TTS Providers (Planned)

### **Azure TTS (Microsoft Azure Cognitive Services)**

**Why add it?**
- **"Walmart Neuro-sama" feature** 🤖
- Original Neuro-sama used:
  - Hiyori Live2D model ✅ (we have this!)
  - Azure TTS "Ashley" voice
  - Pitch: 1.3x speed
- Let users recreate iconic AI VTuber setup

**Implementation:**
```javascript
TTS_PROVIDERS.azure = {
    name: 'Azure TTS',
    voices: [
        { id: 'en-US-AshleyNeural', name: 'Ashley (Neuro-sama voice)' },
        { id: 'en-US-JennyNeural', name: 'Jenny' },
        // ... more voices
    ],
    settings: {
        pitch: 1.3,  // Default for Neuro-sama
        rate: 1.0,
        volume: 1.0
    }
};
```

**API Requirements:**
- Azure Subscription Key
- Azure region endpoint
- SSML support for pitch control:
```xml
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
  <voice name="en-US-AshleyNeural">
    <prosody pitch="+30%" rate="1.0">Hello, I'm Neuro-sama!</prosody>
  </voice>
</speak>
```

**Lip Sync:**
- Azure TTS provides **word boundaries** (like Edge TTS)
- Can support **phoneme-based lip sync** for VRM
- Amplitude-based fallback for Live2D

**Status:** 🔮 Future feature (maybe)

---

## 🚀 Next Steps

1. **Test the `hiyori-test.html` with mouth flaps** ✅ (DONE)
2. **Plan integration strategy** ✅ (THIS DOCUMENT)
3. **Add Pixi.js + Live2D libraries to `index.html`**
4. **Create `loadLive2D()` function in `app.js`**
5. **Add avatar type selector to UI**
6. **Test side-by-side VRM + Live2D loading**

---

## 💡 Key Insights

- **VRM** = 3D model, phoneme-based lip sync, Mixamo animations, Three.js, 3D environment
- **Live2D** = 2D sprite, amplitude-based lip sync, built-in motions, Pixi.js, 2D background
- **Both** can share: TTS audio, AI chat, memory system, UI controls
- **Separate rendering** = VRM and Live2D are COMPLETELY SEPARATE (not layered)
- **Abstraction layer** = Key to clean integration without breaking VRM

---

## 🎬 Rendering Architecture (CORRECTED)

### **VRM Mode:**
```
┌────────────────────────────────────┐
│  Three.js Canvas (VISIBLE)         │
│  ┌──────────────────────────────┐  │
│  │  3D Room Environment         │  │
│  │  VRM Character (3D in scene) │  │
│  │  Lighting & Shadows          │  │
│  │  Camera Controls (OrbitControls) │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘

Pixi.js Canvas (HIDDEN)
```

### **Live2D Mode:**
```
Three.js Canvas (HIDDEN - not rendering)

┌────────────────────────────────────┐
│  Pixi.js Canvas (VISIBLE)          │
│  ┌──────────────────────────────┐  │
│  │  Solid/Gradient Background   │  │
│  │  Live2D Character (2D sprite)│  │
│  │  2D positioning controls     │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

**Key points:**
- **VRM Mode**: Three.js renders, Pixi.js is hidden
- **Live2D Mode**: Pixi.js renders, Three.js is hidden (stops rendering loop)
- **Mode switching**: Hide one canvas, show the other
- **Performance**: Only one rendering system active at a time
- **UI**: Different controls shown/hidden based on mode

---

**STATUS: PLANNING COMPLETE ✅**
**READY TO IMPLEMENT: YES 🚀**
**SEPARATE RENDERING: YES ✅**
**NO 3D BACKGROUND FOR LIVE2D: CORRECT ✅**

