# Live2D Directory Structure

## 📁 Asset Organization

```
assets/
├── live2d/                          (NEW - Live2D models)
│   ├── hiyori/                      (Default model - Neuro-sama)
│   │   ├── hiyori_pro_jp.model3.json
│   │   ├── hiyori_pro_jp.moc3
│   │   ├── hiyori_pro_jp.physics3.json
│   │   ├── hiyori_pro_jp.pose3.json
│   │   ├── textures/
│   │   │   └── texture_00.png
│   │   ├── motions/
│   │   │   ├── Idle.motion3.json
│   │   │   ├── TapBody.motion3.json
│   │   │   └── ...
│   │   └── thumbnail.png
│   │
│   └── [more default models here]
│
├── models/                          (Existing - VRM models)
│   ├── 165071072471339578.vrm
│   ├── 5936120875254998949.vrm
│   ├── AvatarSample_H.vrm
│   └── Upgraded_Yumeko_vrm.vrm
│
└── animations/                      (Existing - Mixamo)
    ├── Happy Idle.fbx
    └── Talking.fbx
```

---

## 🔧 File Type Detection

### **VRM Models (3D)**
- Extension: `.vrm`
- Example: `AvatarSample_H.vrm`
- Renderer: **Three.js**

### **Live2D Models (2D)**
- Extension: `.model3.json` (Cubism 3.x/4.x) or `.model.json` (Cubism 2.1)
- Example: `hiyori_pro_jp.model3.json`
- Renderer: **Pixi.js + pixi-live2d-display**

---

## 📤 User Upload Support

### **Automatic Detection**
```javascript
// In app.js
function handleModelUpload(file) {
    if (Live2DManager.isLive2DModel(file)) {
        // Load as Live2D
        APP_STATE.avatarType = 'live2d';
        live2DManager.loadModel(file);
    } else if (file.name.endsWith('.vrm')) {
        // Load as VRM
        APP_STATE.avatarType = 'vrm';
        loadVRMModel(file);
    } else {
        alert('Unsupported file type. Please upload .vrm or .model3.json');
    }
}
```

### **Supported Formats**

| Avatar Type | File Extension | SDK Version | Status |
|-------------|---------------|-------------|--------|
| **VRM** | `.vrm` | VRM 1.0 | ✅ Working |
| **Live2D** | `.model3.json` | Cubism 3.x/4.x | 🔄 In Progress |
| **Live2D** | `.model.json` | Cubism 2.1 | ⚠️ Legacy (needs testing) |

---

## 🎯 Default Models

### **Live2D Models Included:**

1. **Hiyori Momose PRO** (Original Neuro-sama)
   - Path: `./assets/live2d/hiyori/hiyori_pro_jp.model3.json`
   - Format: Cubism 3.x
   - Size: ~5MB (with textures)
   - Description: The iconic model used by Neuro-sama

*(More models can be added here)*

---

## 💾 localStorage Persistence

```javascript
APP_STATE.settings = {
    avatarType: 'vrm',                    // 'vrm' or 'live2d'
    vrmModelPath: '',                     // Last loaded VRM
    live2dModelPath: '',                  // Last loaded Live2D model
    // ... other settings
};
```

---

## 🔄 Model Switching Flow

```javascript
// User selects avatar type
function switchAvatarType(type) {
    if (type === 'vrm') {
        live2DManager.hide();
        showThreeJSCanvas();
        // Three.js render loop continues
    } else if (type === 'live2d') {
        hideThreeJSCanvas();
        stopThreeJSLoop(); // IMPORTANT: Stop rendering VRM
        live2DManager.show();
        // Pixi.js render loop continues
    }
    
    APP_STATE.avatarType = type;
    saveSetting('avatarType', type);
}
```

---

## 📝 Notes

- **VRM and Live2D never render simultaneously** (performance)
- **Only one canvas visible at a time**
- **User can switch between modes without reloading page**
- **Both types support user uploads**
- **Default models are provided for both types**

