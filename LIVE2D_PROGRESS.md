# Live2D Integration Progress

## ✅ **COMPLETED**

### 1. **Live2D Manager Module Created** (`js/live2d-manager.js`)
- ✅ Full Live2D model loading
- ✅ Mouth parameter detection (from working `hiyori-test.html`)
- ✅ Amplitude-based lip-sync (for Fish Audio, Edge TTS)
- ✅ Motion playback support
- ✅ **User upload support** (File objects, FileList)
- ✅ **File type detection** (`.model3.json`)
- ✅ **Default model list** (extensible)
- ✅ Show/hide functionality (mode switching)
- ✅ Clean resource management

### 2. **Architecture Documentation**
- ✅ `LIVE2D_INTEGRATION_PLAN.md` - Complete architecture
- ✅ `LIVE2D_DIRECTORY_STRUCTURE.md` - Asset organization
- ✅ Separate rendering systems (VRM vs Live2D)

### 3. **Hiyori Test Working**
- ✅ `hiyori-test.html` - Proven implementation
- ✅ Mouth flaps working
- ✅ Parameter API understood

---

## 🔄 **IN PROGRESS**

### Live2D Libraries (TODO #1)
Need to add to `index.html`:
```html
<!-- Pixi.js v6.5.10 -->
<script src="https://cdn.jsdelivr.net/npm/pixi.js@6.5.10/dist/browser/pixi.min.js"></script>

<!-- Live2D Cubism Core -->
<script src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"></script>

<!-- pixi-live2d-display (Cubism 4 support) -->
<script src="https://cdn.jsdelivr.net/npm/pixi-live2d-display@0.4.0/dist/cubism4.min.js"></script>

<!-- Expose PIXI to window -->
<script>window.PIXI = PIXI;</script>
```

---

## 📋 **TODO (High Priority)**

### 1. **Add Libraries to `index.html`**
- Add Pixi.js v6
- Add Live2D Cubism Core
- Add pixi-live2d-display
- Expose `window.PIXI`

### 2. **Add Second Canvas**
```html
<!-- Three.js canvas (existing) -->
<canvas id="three-canvas"></canvas>

<!-- Pixi.js canvas (NEW) -->
<canvas id="pixi-canvas" style="position: absolute; top: 0; left: 0; display: none;"></canvas>
```

### 3. **Wire Up in `app.js`**
```javascript
// Import Live2D manager
import { Live2DManager } from './js/live2d-manager.js';

// Initialize
const live2DManager = new Live2DManager();

// Setup on page load
await live2DManager.initPixiApp(document.getElementById('pixi-canvas'));

// Load default model
await live2DManager.loadModel('./assets/live2d/hiyori/hiyori_pro_jp.model3.json');
```

### 4. **Abstract `updateLipSync()`**
```javascript
function updateLipSync(currentTime) {
    if (APP_STATE.avatarType === 'vrm') {
        // Existing VRM lip-sync (3 blend shapes)
        updateVRMLipSync(currentTime);
    } else if (APP_STATE.avatarType === 'live2d') {
        // New Live2D lip-sync (1 mouth parameter)
        live2DManager.updateMouthFromAmplitude(APP_STATE.currentAmplitude);
    }
}
```

### 5. **Add UI Toggle**
```html
<div class="control-group">
    <label>Avatar Type</label>
    <select id="avatarTypeSelect" onchange="switchAvatarType(this.value)">
        <option value="vrm" selected>VRM (3D)</option>
        <option value="live2d">Live2D (2D)</option>
    </select>
</div>
```

### 6. **File Upload Auto-Detection**
```javascript
function handleModelUpload(file) {
    if (Live2DManager.isLive2DModel(file)) {
        switchToLive2D();
        await live2DManager.loadModel(file);
    } else if (file.name.endsWith('.vrm')) {
        switchToVRM();
        await loadVRMModel(file);
    }
}
```

---

## 🎯 **KEY PRINCIPLES (Don't Break!)**

### ✅ **DO:**
- Keep VRM code untouched
- Use separate canvases (VRM = Three.js, Live2D = Pixi.js)
- Only ONE canvas visible at a time
- Stop Three.js render loop when Live2D is active
- Support user uploads for both types
- Provide default models in `assets/` directory

### ❌ **DON'T:**
- Touch existing VRM lip-sync code
- Render both VRM and Live2D simultaneously
- Mix Three.js and Pixi.js rendering
- Break Edge TTS or Fish Audio TTS

---

## 📁 **Files Modified/Created**

### Created:
- ✅ `js/live2d-manager.js` - Complete Live2D module
- ✅ `LIVE2D_INTEGRATION_PLAN.md` - Architecture doc
- ✅ `LIVE2D_DIRECTORY_STRUCTURE.md` - Asset organization
- ✅ `LIVE2D_PROGRESS.md` - This file

### Need to Modify:
- 🔄 `index.html` - Add libraries, second canvas, UI controls
- 🔄 `js/app.js` - Import manager, abstract lip-sync, mode switching

---

## 🚀 **Next Steps**

1. Add Pixi.js + Live2D libraries to `index.html`
2. Add second `<canvas id="pixi-canvas">` to HTML
3. Import `Live2DManager` in `app.js`
4. Abstract `updateLipSync()` for dual support
5. Add avatar type selector UI
6. Test with Fish Audio and Edge TTS

---

## 📊 **Progress: 30%**

- ✅ Module created (reusable code from `hiyori-test.html`)
- ✅ Architecture planned (separate rendering)
- ✅ User upload support (file detection)
- 🔄 UI integration (next step)
- ⏳ Testing (after integration)

