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
                backgroundAlpha: 0, // Transparent
                resolution: window.devicePixelRatio || 1,
                autoDensity: true
            });
            
            console.log('✅ Pixi.js initialized for Live2D');
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
            
            this.currentModel.scale.set(scale);
            this.currentModel.x = this.pixiApp.screen.width / 2;
            this.currentModel.y = this.pixiApp.screen.height / 2;
            this.currentModel.anchor.set(0.5, 0.5);
            
            // Make interactive for dragging
            this.currentModel.interactive = true;
            this.currentModel.buttonMode = true;
            
            // Add to stage
            this.pixiApp.stage.addChild(this.currentModel);
            
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
            this.isActive = true;
            console.log('✅ Live2D mode active');
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
            
            console.log('✅ Live2D mode hidden');
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        if (!this.pixiApp || !this.currentModel) return;
        
        this.pixiApp.renderer.resize(window.innerWidth, window.innerHeight);
        
        // Recenter model
        this.currentModel.x = window.innerWidth / 2;
        this.currentModel.y = window.innerHeight / 2;
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
}

