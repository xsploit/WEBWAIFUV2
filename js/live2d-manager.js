/**
 * Live2D Manager Module
 * Handles all Live2D model loading, rendering, and lip-sync
 * Based on working hiyori-test.html implementation
 * Works alongside VRM without conflicts
 */

export class Live2DManager {
    constructor() {
        this.pixiApp = null;
        this.currentModel = null;
        this.isActive = false;
        this.mouthParameter = null;
        this.mouthParamIndex = -1;
        this.mouthFlapInterval = null;
        this.backgroundSprite = null; // Background image sprite
        this.backgroundUrl = null; // Store background URL for resize handling
        this._isRightDragging = false; // Right-click drag flag
        this._lastMouseX = 0; // Track last mouse X for dragging
        this._lastMouseY = 0; // Track last mouse Y for dragging
        this._minScale = 0.05; // Min zoom for model (5% of original size)
        this._maxScale = 5.0; // Max zoom for model (500% of original size)
        this._initialScale = null; // Store initial scale to allow going smaller
        
        // Store original animation state for re-enabling
        this._originalMotionUpdate = null;
        this._originalIdleMotionManager = null;
        this._motionsDisabled = false;
        
        // Ensure PIXI is available
        if (typeof window.PIXI === 'undefined') {
            console.error('❌ PIXI not loaded - Live2D will not work');
        }
    }

    /**
     * Initialize Pixi.js application for Live2D rendering
     */
    async initPixiApp(canvasElement) {
        if (this.pixiApp) {
            console.log('✅ Pixi.js already initialized');
            return this.pixiApp;
        }
        
        try {
            this.pixiApp = new PIXI.Application({
                view: canvasElement,
                width: window.innerWidth,
                height: window.innerHeight,
                backgroundColor: 0x000000,
                backgroundAlpha: 1, // Fully opaque for background layer
                resolution: window.devicePixelRatio || 1,
                autoDensity: true,
                antialias: true, // Better quality rendering
                clearBeforeRender: true // Clear canvas before each frame
            });
            
            console.log('✅ Pixi.js initialized for Live2D');

            // Prevent default context menu on right-click (so we can drag)
            if (this.pixiApp.view) {
                this.pixiApp.view.addEventListener('contextmenu', (e) => e.preventDefault());

                // Mouse down - start right-click drag
                this.pixiApp.view.addEventListener('mousedown', (e) => {
                    if (e.button === 2) { // Right button
                        this._isRightDragging = true;
                        this._lastMouseX = e.clientX;
                        this._lastMouseY = e.clientY;
                    }
                });

                // Mouse move - drag model when right button held
                this.pixiApp.view.addEventListener('mousemove', (e) => {
                    if (!this._isRightDragging || !this.currentModel) return;
                    const dx = e.clientX - this._lastMouseX;
                    const dy = e.clientY - this._lastMouseY;
                    this._lastMouseX = e.clientX;
                    this._lastMouseY = e.clientY;
                    // Move model in screen space
                    this.currentModel.x += dx;
                    this.currentModel.y += dy;
                });

                // Mouse up/leave - end drag
                const endDrag = () => { this._isRightDragging = false; };
                this.pixiApp.view.addEventListener('mouseup', endDrag);
                this.pixiApp.view.addEventListener('mouseleave', endDrag);

                // Wheel - zoom model (scale) with Alt modifier
                this.pixiApp.view.addEventListener('wheel', (e) => {
                    if (!this.currentModel) return;
                    // Only zoom if Alt is held (Alt+Wheel for model scaling)
                    if (!e.altKey) return;
                    e.preventDefault();
                    // UP = bigger (zoom in), DOWN = smaller (zoom out)
                    // deltaY is negative when scrolling UP, positive when scrolling DOWN
                    const zoomFactor = Math.pow(1.0015, -e.deltaY);
                    const currentScale = this.currentModel.scale.x; // uniform scale
                    const nextScale = Math.max(this._minScale, Math.min(this._maxScale, currentScale * zoomFactor));
                    this.currentModel.scale.set(nextScale);
                }, { passive: false });
            }
            return this.pixiApp;
        } catch (error) {
            console.error('❌ Pixi.js init error:', error);
            throw error;
        }
    }

    /**
     * Load a Live2D model from path OR file
     * Supports:
     * - File paths (e.g., './assets/live2d/hiyori/hiyori_pro_jp.model3.json')
     * - File objects (from user upload)
     * - Blob URLs (from user upload)
     * Uses proven code from hiyori-test.html
     */
    async loadModel(modelSource) {
        if (!this.pixiApp) {
            throw new Error('Pixi.js not initialized - call initPixiApp() first');
        }
        
        // Check if Live2D plugin is available
        if (!PIXI.live2d || !PIXI.live2d.Live2DModel) {
            throw new Error('pixi-live2d-display not loaded properly');
        }
        
        try {
            let modelPath = modelSource;
            
            // Handle File object (user uploaded)
            if (modelSource instanceof File) {
                console.log('📤 User uploaded Live2D model:', modelSource.name);
                modelPath = URL.createObjectURL(modelSource);
            }
            // Handle FileList (from input[type="file"])
            else if (modelSource instanceof FileList && modelSource.length > 0) {
                console.log('📤 User uploaded Live2D model:', modelSource[0].name);
                modelPath = URL.createObjectURL(modelSource[0]);
            }
            
            console.log('📥 Loading Live2D model from:', modelPath);
            
            // Remove previous model if exists
            if (this.currentModel) {
                this.pixiApp.stage.removeChild(this.currentModel);
                this.currentModel.destroy();
                this.currentModel = null;
            }
            
            // Load model
            // NOTE: autoInteract DISABLED - it triggers random motions that interfere with lip-sync!
            this.currentModel = await PIXI.live2d.Live2DModel.from(modelPath, {
                autoInteract: false, // ✅ Disabled - let lip-sync control mouth
                autoUpdate: true     // ✅ Keep this - updates model rendering
            });
            
            if (!this.currentModel) {
                throw new Error('Model failed to load');
            }
            
            console.log('✅ Live2D model loaded!');
            console.log('Model info:', {
                width: this.currentModel.width,
                height: this.currentModel.height,
                hasInternalModel: !!this.currentModel.internalModel
            });
            
            // Scale and position (same as hiyori-test.html)
            const scale = Math.min(
                this.pixiApp.screen.width / this.currentModel.width,
                this.pixiApp.screen.height / this.currentModel.height
            ) * 0.8;
            
            // Store initial scale so user can zoom smaller than default
            this._initialScale = scale;
            
            this.currentModel.scale.set(scale);
            this.currentModel.x = this.pixiApp.screen.width / 2;
            this.currentModel.y = this.pixiApp.screen.height / 2;
            this.currentModel.anchor.set(0.5, 0.5);
            
            // Make interactive for dragging
            this.currentModel.interactive = true;
            this.currentModel.buttonMode = true;
            
            // Add to stage - ensure model is on top of background
            // If background exists, add model after it; otherwise just add normally
            if (this.backgroundSprite && this.pixiApp.stage.children.includes(this.backgroundSprite)) {
                // Background exists - add model on top
                const bgIndex = this.pixiApp.stage.getChildIndex(this.backgroundSprite);
                this.pixiApp.stage.addChildAt(this.currentModel, bgIndex + 1);
            } else {
                // No background - just add normally
                this.pixiApp.stage.addChild(this.currentModel);
            }
            
            // Initially disable animations (will be re-enabled when TTS stops)
            this.disableAnimations();
            
            // Find mouth parameter (same as hiyori-test.html)
            this.findMouthParameter();
            
            return this.currentModel;
        } catch (error) {
            console.error('❌ Model loading error:', error);
            throw error;
        }
    }
    
    /**
     * Detect if a file is a Live2D model
     * @param {File|string} file - File object or filename
     * @returns {boolean} True if it's a Live2D model
     */
    static isLive2DModel(file) {
        const filename = (file instanceof File) ? file.name : file;
        return filename.toLowerCase().endsWith('.model3.json') || 
               filename.toLowerCase().endsWith('.model.json');
    }
    
    /**
     * Get default Live2D models from assets directory
     * @returns {Array} List of default model paths
     */
    static getDefaultModels() {
        return [
            {
                name: 'Hiyori Momose PRO',
                path: './assets/live2d/hiyori/hiyori_pro_jp.model3.json',
                thumbnail: './assets/live2d/hiyori/thumbnail.png',
                description: 'Original Neuro-sama model'
            }
            // Add more default models here as we provide them
        ];
    }

    /**
     * Find the mouth parameter in the model
     * EXACT copy from hiyori-test.html (lines 260-280)
     */
    findMouthParameter() {
        if (!this.currentModel || !this.currentModel.internalModel) {
            console.warn('⚠️ No model or internalModel');
            return;
        }
        
        try {
            const coreModel = this.currentModel.internalModel.coreModel;
            if (!coreModel) {
                console.warn('⚠️ No coreModel');
                return;
            }
            
            const paramCount = coreModel.getParameterCount();
            const mouthParams = ['ParamMouthOpenY', 'PARAM_MOUTH_OPEN_Y', 'MouthOpen', 'Mouth'];
            
            console.log(`📋 Searching ${paramCount} parameters for mouth...`);
            
            // Search through all parameters
            for (let i = 0; i < paramCount; i++) {
                let paramId = null;
                if (coreModel._model && coreModel._model.parameters && coreModel._model.parameters.ids) {
                    paramId = coreModel._model.parameters.ids[i];
                }
                
                if (paramId && mouthParams.includes(paramId)) {
                    this.mouthParameter = paramId;
                    this.mouthParamIndex = i;
                    console.log('✅ Found mouth parameter:', paramId, 'at index', i);
                    return;
                }
            }
            
            console.warn('⚠️ Could not find mouth parameter');
        } catch (error) {
            console.error('❌ Error finding mouth parameter:', error);
        }
    }

    /**
     * Update mouth shape based on amplitude (for TTS without phonemes)
     * For Fish Audio and other TTS that don't provide phonemes
     */
    updateMouthFromAmplitude(amplitude) {
        if (!this.currentModel || this.mouthParamIndex === -1) return;
        
        try {
            const coreModel = this.currentModel.internalModel.coreModel;
            const mouthOpen = Math.min(amplitude * 2, 1.0); // Scale amplitude to 0-1
            
            coreModel.setParameterValueByIndex(this.mouthParamIndex, mouthOpen);
        } catch (error) {
            console.error('❌ Error updating mouth from amplitude:', error);
        }
    }

    /**
     * Reset mouth to neutral position (same as Python version's _relax_mouth_to_neutral)
     * Forces mouth to fully close
     */
    resetMouthToNeutral() {
        if (!this.currentModel || this.mouthParamIndex === -1) return;
        
        try {
            const coreModel = this.currentModel.internalModel.coreModel;
            coreModel.setParameterValueByIndex(this.mouthParamIndex, 0.0);
            console.log('✅ Mouth reset to neutral (closed)');
        } catch (error) {
            console.error('❌ Error resetting mouth:', error);
        }
    }

    /**
     * Disable all animations (idle, breathing, etc.) to prevent interference with lip-sync
     * Called when TTS starts speaking
     */
    disableAnimations() {
        if (!this.currentModel || !this.currentModel.internalModel) return;
        
        try {
            const internalModel = this.currentModel.internalModel;
            
            // Method 1: Stop motion manager
            if (internalModel.motionManager) {
                internalModel.motionManager.stopAllMotions();
                console.log('✅ Stopped motion manager');
            }
            
            // Method 2: Save and disable idle motion manager (breathing/idle animations)
            if (internalModel.idleMotionManager) {
                this._originalIdleMotionManager = internalModel.idleMotionManager;
                internalModel.idleMotionManager.stopAllMotions();
                // Note: We don't set to null anymore - we'll restore it later
                console.log('✅ Disabled idle motion manager');
            }
            
            // Method 3: Save and disable motion manager's update method
            if (internalModel.motionManager) {
                const motionManager = internalModel.motionManager;
                // Save original update method if not already saved
                if (!this._originalMotionUpdate) {
                    this._originalMotionUpdate = motionManager.update.bind(motionManager);
                }
                // Override with no-op
                motionManager.update = () => {}; // No-op
                console.log('✅ Disabled motion manager update loop');
            }
            
            this._motionsDisabled = true;
            console.log('✅ All auto-motions disabled for lip-sync');
        } catch (error) {
            console.log('⚠️ Could not disable some motions:', error.message);
        }
    }

    /**
     * Re-enable idle animations (breathing, idle motions, etc.)
     * Called when TTS stops speaking
     */
    enableAnimations() {
        if (!this.currentModel || !this.currentModel.internalModel) return;
        if (!this._motionsDisabled) return; // Already enabled
        
        try {
            const internalModel = this.currentModel.internalModel;
            
            // Method 1: Restore motion manager update method
            if (internalModel.motionManager && this._originalMotionUpdate) {
                internalModel.motionManager.update = this._originalMotionUpdate;
                console.log('✅ Re-enabled motion manager update loop');
            }
            
            // Method 2: Re-enable idle motion manager (if it was saved)
            // Note: We can't fully restore it if it was nulled, but we can restart idle motions
            if (internalModel.motionManager && internalModel.groups?.idle) {
                // Try to start a random idle motion
                try {
                    internalModel.motionManager.startRandomMotion(internalModel.groups.idle, 0);
                    console.log('✅ Re-enabled idle animations');
                } catch (error) {
                    console.log('⚠️ Could not restart idle motion (may not be available):', error.message);
                }
            }
            
            this._motionsDisabled = false;
            console.log('✅ Animations re-enabled - model will animate naturally');
        } catch (error) {
            console.log('⚠️ Could not re-enable some motions:', error.message);
        }
    }

    /**
     * Start animated mouth flaps (for testing or continuous speech)
     * EXACT copy from hiyori-test.html (lines 295-330)
     */
    startMouthFlaps() {
        this.stopMouthFlaps();
        
        if (!this.currentModel || this.mouthParamIndex === -1) {
            console.warn('⚠️ Cannot start mouth flaps - no model or mouth parameter');
            return;
        }
        
        console.log('👄 Starting mouth flaps...');
        
        let mouthOpen = 0;
        let direction = 1;
        
        this.mouthFlapInterval = setInterval(() => {
            if (!this.currentModel || this.mouthParamIndex === -1) return;
            
            try {
                // Oscillate between 0 and 1
                mouthOpen += direction * 0.15;
                
                if (mouthOpen >= 0.8) {
                    direction = -1;
                } else if (mouthOpen <= 0) {
                    direction = 1;
                }
                
                // Set mouth parameter
                const coreModel = this.currentModel.internalModel.coreModel;
                coreModel.setParameterValueByIndex(this.mouthParamIndex, mouthOpen);
            } catch (error) {
                console.error('❌ Mouth flap error:', error);
                this.stopMouthFlaps();
            }
        }, 50); // 20 FPS
    }

    /**
     * Stop mouth flaps
     * EXACT copy from hiyori-test.html (lines 332-355)
     */
    stopMouthFlaps() {
        if (this.mouthFlapInterval) {
            clearInterval(this.mouthFlapInterval);
            this.mouthFlapInterval = null;
            
            // Reset mouth to closed
            if (this.currentModel && this.mouthParamIndex !== -1) {
                try {
                    const coreModel = this.currentModel.internalModel.coreModel;
                    coreModel.setParameterValueByIndex(this.mouthParamIndex, 0);
                    console.log('🤐 Mouth flaps stopped, mouth closed');
                } catch (error) {
                    console.error('❌ Error resetting mouth:', error);
                }
            }
        }
    }

    /**
     * Play a motion animation
     * Based on hiyori-test.html (lines 358-380)
     */
    playMotion(motionName) {
        if (!this.currentModel) {
            console.warn('⚠️ No model loaded');
            return;
        }
        
        try {
            console.log(`🎬 Playing motion: ${motionName}`);
            
            if (this.currentModel.motion) {
                this.currentModel.motion(motionName);
            } else if (this.currentModel.internalModel?.motionManager) {
                this.currentModel.internalModel.motionManager.startMotion(motionName, 0);
            }
        } catch (error) {
            console.error('❌ Motion error:', error);
        }
    }

    /**
     * Show Live2D canvas (switch to Live2D mode)
     */
    show() {
        if (this.pixiApp && this.pixiApp.view) {
            this.pixiApp.view.style.display = 'block';
            this.pixiApp.view.style.zIndex = '500'; // Below UI elements (header: 1000, chat: 1000) but above canvas-container (1)
            this.pixiApp.view.style.pointerEvents = 'auto'; // Allow model dragging
            this.pixiApp.view.style.position = 'fixed'; // Ensure proper stacking context
            this.pixiApp.view.style.top = '0';
            this.pixiApp.view.style.left = '0';
            this.pixiApp.view.style.width = '100%';
            this.pixiApp.view.style.height = '100%';

            // Add class to body to hide overlay via CSS (more reliable than injected styles)
            document.body.classList.add('live2d-active');

            // Force overlay to be behind Live2D canvas
            let style = document.getElementById('live2d-overlay-fix');
            if (!style) {
                style = document.createElement('style');
                style.id = 'live2d-overlay-fix';
                style.textContent = `
                    body::after {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                    }
                    body::before {
                        z-index: -1 !important;
                    }
                `;
                document.head.appendChild(style);
            }

            // Force a reflow to ensure styles are applied
            void this.pixiApp.view.offsetHeight;

            this.isActive = true;
            console.log('✅ Live2D mode active - overlay hidden, canvas z-index: 9999');
        }
    }

    /**
     * Hide Live2D canvas (switch to VRM mode)
     */
    hide() {
        if (this.pixiApp && this.pixiApp.view) {
            this.pixiApp.view.style.display = 'none';
            this.isActive = false;
            
            // Reset mouth to neutral when hiding (prevent stuck-open mouth)
            this.resetMouthToNeutral();
            
            // Remove class from body to restore overlay
            document.body.classList.remove('live2d-active');
            
            // Remove injected style
            const style = document.getElementById('live2d-overlay-fix');
            if (style) {
                style.remove();
            }
            
            console.log('✅ Live2D mode hidden');
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        if (!this.pixiApp) return;
        
        this.pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
        
        // Recenter model if exists
        if (this.currentModel) {
            this.currentModel.x = window.innerWidth / 2;
            this.currentModel.y = window.innerHeight / 2;
        }
        
        // Update background size if exists
        if (this.backgroundSprite) {
            this.updateBackgroundSize();
        }
    }

    /**
     * Clean up resources
     */
    destroy() {
        this.stopMouthFlaps();
        
        if (this.currentModel) {
            this.pixiApp.stage.removeChild(this.currentModel);
            this.currentModel.destroy();
            this.currentModel = null;
        }
        
        if (this.pixiApp) {
            this.pixiApp.destroy(true);
            this.pixiApp = null;
        }
        
        console.log('✅ Live2D manager destroyed');
    }

    /**
     * Set background image for Live2D canvas
     * @param {string} imageUrl - URL of the background image
     */
    setBackground(imageUrl) {
        if (!this.pixiApp) {
            console.warn('⚠️ Pixi.js not initialized - cannot set background');
            return;
        }

        // Remove existing background if any
        this.clearBackground();

        // Load and set background image with high quality
        const texture = PIXI.Texture.from(imageUrl);
        
        // Set texture to use linear filtering for better quality when scaled
        texture.baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
        
        this.backgroundSprite = new PIXI.Sprite(texture);
        
        // Scale to fill canvas while maintaining aspect ratio
        const scaleX = this.pixiApp.screen.width / this.backgroundSprite.width;
        const scaleY = this.pixiApp.screen.height / this.backgroundSprite.height;
        const scale = Math.max(scaleX, scaleY); // Cover entire canvas
        
        this.backgroundSprite.scale.set(scale);
        
        // Center the background
        this.backgroundSprite.x = (this.pixiApp.screen.width - this.backgroundSprite.width) / 2;
        this.backgroundSprite.y = (this.pixiApp.screen.height - this.backgroundSprite.height) / 2;
        
        // Ensure background is fully opaque and visible
        this.backgroundSprite.alpha = 1.0;
        
        // Clear any existing children first, then add background at index 0 (bottom layer)
        // Remove model temporarily if it exists
        let model = null;
        if (this.currentModel && this.pixiApp.stage.children.includes(this.currentModel)) {
            model = this.currentModel;
            this.pixiApp.stage.removeChild(this.currentModel);
        }
        
        // Add background first (bottom layer)
        this.pixiApp.stage.addChildAt(this.backgroundSprite, 0);
        
        // Re-add model on top if it existed
        if (model) {
            this.pixiApp.stage.addChild(model);
        }
        
        // Store URL for resize handling
        this.backgroundUrl = imageUrl;
        
        console.log('✅ Live2D background set');
    }
    
    /**
     * Update background size on window resize
     */
    updateBackgroundSize() {
        if (!this.backgroundSprite || !this.pixiApp) return;
        
        // Recalculate scale and position
        const scaleX = this.pixiApp.screen.width / this.backgroundSprite.texture.width;
        const scaleY = this.pixiApp.screen.height / this.backgroundSprite.texture.height;
        const scale = Math.max(scaleX, scaleY);
        
        this.backgroundSprite.scale.set(scale);
        this.backgroundSprite.x = (this.pixiApp.screen.width - this.backgroundSprite.width) / 2;
        this.backgroundSprite.y = (this.pixiApp.screen.height - this.backgroundSprite.height) / 2;
    }

    /**
     * Clear background image
     */
    clearBackground() {
        if (this.backgroundSprite && this.pixiApp) {
            this.pixiApp.stage.removeChild(this.backgroundSprite);
            this.backgroundSprite.destroy();
            this.backgroundSprite = null;
            this.backgroundUrl = null;
            console.log('✅ Live2D background cleared');
        }
    }
}

