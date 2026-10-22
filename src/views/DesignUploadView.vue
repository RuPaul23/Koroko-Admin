<template>
  <div class="design-studio-page">
    <div class="page-header">
      <div>
        <h1 class="page-title font-display">T-SHIRT MOCKUP & DESIGN STUDIO</h1>
        <p class="page-subtitle">Upload high-resolution graphics, position prints on Front / Back 240 GSM mockups, and publish live drops</p>
      </div>

      <div class="header-actions">
        <button class="btn-secondary font-tech" @click="resetStudio">
          RESET CANVAS
        </button>
        <button class="btn-publish font-tech" @click="publishDrop" :disabled="!frontDesign && !backDesign">
          PUBLISH TO KOROKO STORE &rarr;
        </button>
      </div>
    </div>

    <!-- Studio Canvas & Controls Grid -->
    <div class="studio-grid">
      <!-- Left: Interactive Mockup Canvas -->
      <div class="mockup-canvas-panel">
        <div class="canvas-top-tabs">
          <button 
            class="tab-btn font-tech" 
            :class="{ active: currentView === 'front' }"
            @click="currentView = 'front'"
          >
            FRONT MOCKUP
          </button>
          <button 
            class="tab-btn font-tech" 
            :class="{ active: currentView === 'back' }"
            @click="currentView = 'back'"
          >
            BACK MOCKUP
          </button>

          <div class="color-palette-bar">
            <span class="color-label font-tech">SHADE:</span>
            <button 
              v-for="color in availableColors" 
              :key="color.name" 
              class="color-dot"
              :class="{ selected: selectedColor.name === color.name }"
              :style="{ backgroundColor: color.hex }"
              :title="color.name"
              @click="selectedColor = color"
            ></button>
          </div>
        </div>

        <!-- The Canvas -->
        <div class="mockup-stage" :style="{ backgroundColor: selectedColor.canvasBg }">
          <!-- Apparel Blank Background -->
          <div class="apparel-wrapper">
            <img 
              :src="currentView === 'front' ? selectedColor.frontImage : selectedColor.backImage" 
              alt="Apparel Mockup" 
              class="apparel-base-img"
            />

            <!-- Printable Bounding Box -->
            <div class="printable-boundary">
              <!-- Overlay Graphic -->
              <div 
                v-if="currentArtwork" 
                class="design-layer"
                :style="artworkStyle"
                @mousedown="startDrag"
              >
                <img :src="currentArtwork" alt="Printed Graphic" class="graphic-img" />
                <div class="resize-handle" @mousedown.stop="startResize"></div>
              </div>

              <div v-else class="empty-dropzone-indicator">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="2"/>
                  <polyline points="17 8 12 3 7 8" stroke-width="2"/>
                  <line x1="12" y1="3" x2="12" y2="15" stroke-width="2"/>
                </svg>
                <span>Upload or select {{ currentView }} print design</span>
              </div>
            </div>
          </div>
        </div>

        <div class="canvas-controls-bar">
          <div class="control-item">
            <label>Scale: {{ designScale }}%</label>
            <input type="range" min="30" max="140" v-model.number="designScale" />
          </div>
          <div class="control-item">
            <label>Vertical Position: {{ designOffsetY }}px</label>
            <input type="range" min="-100" max="120" v-model.number="designOffsetY" />
          </div>
          <button class="center-btn font-tech" @click="centerArtwork">
            CENTER ARTWORK
          </button>
        </div>
      </div>

      <!-- Right: Product Drop Specification -->
      <div class="spec-panel">
        <h2 class="spec-title font-display">Drop Specifications</h2>

        <div class="upload-dual-boxes">
          <!-- Front Upload -->
          <div class="upload-card">
            <div class="upload-header">
              <span class="upload-title font-tech">FRONT CHEST / GRAPHIC</span>
              <button v-if="frontDesign" @click="frontDesign = null" class="clear-btn">Remove</button>
            </div>
            <label class="drop-zone">
              <input type="file" accept="image/*" @change="onFileChange($event, 'front')" />
              <div v-if="!frontDesign" class="drop-prompt">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke-width="2"/>
                  <polyline points="21 15 16 10 5 21" stroke-width="2"/>
                </svg>
                <span>PNG with Transparent BG (Min 300 DPI)</span>
              </div>
              <img v-else :src="frontDesign" alt="Front Preview" class="upload-thumb" />
            </label>
          </div>

          <!-- Back Upload -->
          <div class="upload-card">
            <div class="upload-header">
              <span class="upload-title font-tech">BACK OVERSIZED PRINT</span>
              <button v-if="backDesign" @click="backDesign = null" class="clear-btn">Remove</button>
            </div>
            <label class="drop-zone">
              <input type="file" accept="image/*" @change="onFileChange($event, 'back')" />
              <div v-if="!backDesign" class="drop-prompt">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke-width="2"/>
                  <polyline points="21 15 16 10 5 21" stroke-width="2"/>
                </svg>
                <span>Full Poster Back Graphic (PNG)</span>
              </div>
              <img v-else :src="backDesign" alt="Back Preview" class="upload-thumb" />
            </label>
          </div>
        </div>

        <!-- Sample Graphic Presets -->
        <div class="presets-section">
          <label class="presets-label font-tech">OR LOAD SAMPLE KOROKO ARTWORK</label>
          <div class="presets-list">
            <button 
              v-for="(preset, i) in sampleArtworks" 
              :key="i"
              class="preset-item"
              @click="loadSampleArtwork(preset.url)"
            >
              <img :src="preset.url" :alt="preset.name" />
              <span>{{ preset.name }}</span>
            </button>
          </div>
        </div>

        <!-- Drop Details Form -->
        <div class="details-form">
          <div class="form-row">
            <label>Product Drop Title</label>
            <input v-model="dropForm.title" type="text" placeholder="e.g. Neo-Tokyo Heavyweight Acid Tee" />
          </div>

          <div class="form-row-grid">
            <div class="form-row">
              <label>Retail Price (&#8377;)</label>
              <input v-model.number="dropForm.retailPrice" type="number" />
            </div>
            <div class="form-row">
              <label>Estimated Base Cost</label>
              <div class="static-val font-tech">&#8377;{{ dropForm.baseCost + dropForm.printCost }}</div>
            </div>
          </div>

          <div class="form-row">
            <label>Print Area Placement</label>
            <select v-model="dropForm.printPlacement">
              <option value="chest_and_back">Front Left Chest + Full Back Print</option>
              <option value="oversized_front">Oversized Center Front (A3 300 DPI)</option>
              <option value="minimalist_front">Minimalist Center Embroidery</option>
            </select>
          </div>

          <div class="form-row">
            <label>Category</label>
            <select v-model="dropForm.category">
              <option value="oversized_tees">Oversized Heavyweight Tees (240 GSM)</option>
              <option value="boxy_tees">Tokyo Boxy Drop-Shoulder Tees</option>
              <option value="hoodies">French Terry Winter Hoodies (400 GSM)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { adminStore } from '../state/store.js';

const currentView = ref('front');

const availableColors = [
  {
    name: 'Phantom Black',
    hex: '#141416',
    canvasBg: '#09090b',
    frontImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    backImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Bone White',
    hex: '#f5f5f7',
    canvasBg: '#18181b',
    frontImage: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80',
    backImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Acid Charcoal',
    hex: '#3f3f46',
    canvasBg: '#111115',
    frontImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
    backImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80'
  }
];

const selectedColor = ref(availableColors[0]);

const frontDesign = ref('https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80');
const backDesign = ref(null);

const designScale = ref(85);
const designOffsetY = ref(0);

const currentArtwork = computed(() => {
  return currentView.value === 'front' ? frontDesign.value : backDesign.value;
});

const artworkStyle = computed(() => {
  return {
    width: `${designScale.value}%`,
    transform: `translateY(${designOffsetY.value}px)`
  };
});

const sampleArtworks = [
  { name: 'Tokyo Noir Typography', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80' },
  { name: 'Cyberpunk Kanji', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80' },
  { name: 'Monochrome Wave', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&auto=format&fit=crop&q=80' }
];

const dropForm = ref({
  title: 'Cyber Kanji Heavyweight Drop Tee',
  category: 'oversized_tees',
  retailPrice: 1499,
  baseCost: 480,
  printCost: 190,
  printPlacement: 'chest_and_back'
});

const onFileChange = (e, side) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (side === 'front') {
        frontDesign.value = event.target.result;
        currentView.value = 'front';
      } else {
        backDesign.value = event.target.result;
        currentView.value = 'back';
      }
    };
    reader.readAsDataURL(file);
  }
};

const loadSampleArtwork = (url) => {
  if (currentView.value === 'front') {
    frontDesign.value = url;
  } else {
    backDesign.value = url;
  }
};

const centerArtwork = () => {
  designOffsetY.value = 0;
  designScale.value = 85;
};

const resetStudio = () => {
  frontDesign.value = null;
  backDesign.value = null;
  designOffsetY.value = 0;
  designScale.value = 85;
};

const publishDrop = () => {
  const newProduct = {
    id: 'koroko-' + Date.now(),
    title: dropForm.value.title,
    category: dropForm.value.category,
    colorways: [selectedColor.value.name],
    baseCost: dropForm.value.baseCost,
    printCost: dropForm.value.printCost,
    retailPrice: dropForm.value.retailPrice,
    mrp: Math.round(dropForm.value.retailPrice * 1.6),
    margin: `${Math.round(((dropForm.value.retailPrice - (dropForm.value.baseCost + dropForm.value.printCost)) / dropForm.value.retailPrice) * 100)}%`,
    active: true,
    mockupFront: selectedColor.value.frontImage,
    mockupBack: selectedColor.value.backImage
  };

  adminStore.products.unshift(newProduct);
  alert(`"${newProduct.title}" dropped successfully! It is now published and synced with https://koroko.in catalog.`);
};
</script>

<style scoped>
.design-studio-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}
.page-title {
  font-size: 24px;
  letter-spacing: 0.12em;
  margin-bottom: 4px;
}
.page-subtitle {
  font-size: 13px;
  color: var(--text-secondary);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.btn-secondary {
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  color: var(--text-secondary);
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  transition: all 0.2s;
}
.btn-secondary:hover {
  background: var(--bg-elevated);
  color: #ffffff;
}

.btn-publish {
  background: #ffffff;
  color: #000000;
  padding: 10px 20px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  transition: all 0.2s;
}
.btn-publish:hover:not(:disabled) {
  background: #e4e4e7;
  transform: translateY(-1px);
}
.btn-publish:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Studio Grid */
.studio-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 24px;
}

.mockup-canvas-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.canvas-top-tabs {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--border-ultra-subtle);
  padding-bottom: 14px;
}
.tab-btn {
  padding: 8px 16px;
  border-radius: var(--radius-xs);
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: all 0.2s;
}
.tab-btn.active {
  background: #ffffff;
  color: #000000;
  border-color: #ffffff;
}

.color-palette-bar {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}
.color-label {
  font-size: 10.5px;
  color: var(--text-muted);
}
.color-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}
.color-dot.selected {
  border-color: #ffffff;
  transform: scale(1.15);
}

.mockup-stage {
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 480px;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-ultra-subtle);
}

.apparel-wrapper {
  position: relative;
  width: 380px;
  height: 460px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.apparel-base-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-sm);
  filter: contrast(1.05) brightness(0.95);
}

.printable-boundary {
  position: absolute;
  top: 18%;
  left: 24%;
  width: 52%;
  height: 58%;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  pointer-events: none;
}

.design-layer {
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  position: relative;
}
.graphic-img {
  width: 100%;
  height: auto;
  display: block;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4));
}

.empty-dropzone-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
  text-align: center;
  padding: 10px;
}

.canvas-controls-bar {
  display: flex;
  align-items: center;
  gap: 18px;
  background: var(--bg-surface);
  padding: 14px 18px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-ultra-subtle);
}
.control-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}
.control-item label {
  font-size: 11px;
  color: var(--text-muted);
}
.control-item input[type="range"] {
  accent-color: #ffffff;
  width: 100%;
}
.center-btn {
  font-size: 11px;
  color: var(--text-subtle);
  border: 1px solid var(--border-subtle);
  padding: 8px 12px;
  border-radius: var(--radius-xs);
  transition: all 0.2s;
  white-space: nowrap;
}
.center-btn:hover {
  background: var(--bg-elevated);
  color: #ffffff;
}

/* Spec Panel */
.spec-panel {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.spec-title {
  font-size: 18px;
  letter-spacing: 0.05em;
}

.upload-dual-boxes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.upload-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.upload-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.upload-title {
  font-size: 10.5px;
  color: var(--text-muted);
}
.clear-btn {
  font-size: 10.5px;
  color: var(--accent-rose);
}

.drop-zone {
  border: 1px dashed var(--border-medium);
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: all 0.2s;
}
.drop-zone:hover {
  border-color: #ffffff;
  background: var(--bg-elevated);
}
.drop-zone input[type="file"] {
  display: none;
}
.drop-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  font-size: 11px;
  text-align: center;
  padding: 8px;
}
.upload-thumb {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.presets-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.presets-label {
  font-size: 10.5px;
  color: var(--text-muted);
}
.presets-list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}
.preset-item {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xs);
  padding: 6px 10px;
  color: var(--text-subtle);
  font-size: 11px;
  white-space: nowrap;
  transition: all 0.2s;
}
.preset-item:hover {
  border-color: #ffffff;
  color: #ffffff;
}
.preset-item img {
  width: 22px;
  height: 22px;
  border-radius: 2px;
  object-fit: cover;
}

.details-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 6px;
}
.form-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-row label {
  font-size: 11.5px;
  color: var(--text-secondary);
  font-weight: 500;
}
.form-row input, .form-row select {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xs);
  padding: 10px 14px;
  font-size: 13px;
  outline: none;
  transition: all 0.2s;
}
.form-row input:focus, .form-row select:focus {
  border-color: #ffffff;
  background: var(--bg-elevated);
}

.form-row-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.static-val {
  background: var(--bg-surface);
  border: 1px solid var(--border-ultra-subtle);
  padding: 10px 14px;
  border-radius: var(--radius-xs);
  font-size: 13px;
  color: #34d399;
}

@media (max-width: 1024px) {
  .studio-grid {
    grid-template-columns: 1fr;
  }
}
</style>
