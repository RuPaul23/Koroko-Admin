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
      </div>
    </div>

    <!-- Studio Canvas & Controls Grid -->
    <div class="studio-grid">
      <!-- Left: Interactive Mockup Canvas Stage (BIG PREVIEW) -->
      <div class="mockup-canvas-panel">
        <div class="canvas-top-tabs">
          <button 
            class="tab-btn font-tech" 
            :class="{ active: currentView === 'front' }"
            @click="currentView = 'front'"
          >
            FRONT PREVIEW
          </button>
          <button 
            class="tab-btn font-tech" 
            :class="{ active: currentView === 'back' }"
            @click="currentView = 'back'"
          >
            BACK PREVIEW
          </button>
          <button 
            v-if="additionalImages.length > 0"
            class="tab-btn font-tech" 
            :class="{ active: currentView === 'optional' }"
            @click="currentView = 'optional'"
          >
            ADDITIONAL ANGLES ({{ additionalImages.length }})
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

        <!-- The Canvas Stage: Large Realistic Garment Preview -->
        <div class="mockup-stage" :style="{ backgroundColor: selectedColor.canvasBg }">
          <div class="apparel-wrapper">
            <!-- Authentic Garment Blank (Hoodie or Tee) -->
            <img 
              :src="currentMockupImage" 
              alt="Apparel Mockup Preview" 
              class="apparel-base-img"
            />

            <!-- Printable Bounding Box -->
            <div v-if="currentView !== 'optional'" class="printable-boundary">
              <div 
                v-if="currentArtwork" 
                class="design-layer"
                :style="artworkStyle"
              >
                <img :src="currentArtwork" alt="Printed Graphic" class="graphic-img" />
              </div>

              <div v-else class="empty-dropzone-indicator">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke-width="2"/>
                  <polyline points="17 8 12 3 7 8" stroke-width="2"/>
                  <line x1="12" y1="3" x2="12" y2="15" stroke-width="2"/>
                </svg>
                <span>No {{ currentView }} graphic uploaded yet</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentView !== 'optional'" class="canvas-controls-bar">
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
        <div class="spec-header-row">
          <h2 class="spec-title font-display">Drop Specifications</h2>
          <span class="badge badge-emerald">Real AI Generator</span>
        </div>

        <!-- Dual Upload: Front and Back with Proper File Previews -->
        <div class="upload-dual-boxes">
          <!-- Front Upload -->
          <div class="upload-card">
            <div class="upload-header">
              <span class="upload-title font-tech">FRONT IMAGE UPLOAD</span>
              <button v-if="frontDesign" @click="frontDesign = null" class="clear-btn">Remove</button>
            </div>
            <label class="drop-zone" :class="{ 'has-file': frontDesign }">
              <input type="file" accept="image/*" @change="onFileChange($event, 'front')" />
              <div v-if="!frontDesign" class="drop-prompt">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke-width="2"/>
                  <polyline points="21 15 16 10 5 21" stroke-width="2"/>
                </svg>
                <span>Click to Upload Front</span>
              </div>
              <div v-else class="thumb-container">
                <img :src="frontDesign" alt="Front Graphic" class="upload-thumb" />
                <span class="thumb-tag font-tech">FRONT LOADED</span>
              </div>
            </label>
          </div>

          <!-- Back Upload -->
          <div class="upload-card">
            <div class="upload-header">
              <span class="upload-title font-tech">BACK IMAGE UPLOAD</span>
              <button v-if="backDesign" @click="backDesign = null" class="clear-btn">Remove</button>
            </div>
            <label class="drop-zone" :class="{ 'has-file': backDesign }">
              <input type="file" accept="image/*" @change="onFileChange($event, 'back')" />
              <div v-if="!backDesign" class="drop-prompt">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke-width="2"/>
                  <polyline points="21 15 16 10 5 21" stroke-width="2"/>
                </svg>
                <span>Click to Upload Back</span>
              </div>
              <div v-else class="thumb-container">
                <img :src="backDesign" alt="Back Graphic" class="upload-thumb" />
                <span class="thumb-tag font-tech">BACK LOADED</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Optional Additional Images Section -->
        <div class="optional-images-box">
          <div class="optional-header">
            <span class="font-tech optional-title">OPTIONAL ADD-ON IMAGES (LIFESTYLE / CLOSE-UP)</span>
            <label class="add-optional-btn font-tech">
              + ADD IMAGE
              <input type="file" accept="image/*" multiple @change="onAddOptionalImages" />
            </label>
          </div>
          <div v-if="additionalImages.length > 0" class="optional-thumbs-list">
            <div v-for="(img, idx) in additionalImages" :key="idx" class="opt-thumb-wrap">
              <img :src="img" alt="Optional image" />
              <button class="remove-opt" @click="removeOptionalImage(idx)">&times;</button>
            </div>
          </div>
        </div>

        <!-- AI Streetwear Studio Assistant -->
        <div class="gemini-ai-card">
          <div class="gemini-header">
            <span class="gemini-title font-display">Tokyo Streetwear AI Studio</span>
            <span class="gemini-badge font-tech">AUTHENTIC NAMING</span>
          </div>

          <div class="gemini-actions-row">
            <!-- Auto Name Generator -->
            <button 
              type="button" 
              class="ai-action-btn font-tech" 
              :disabled="aiNameLoading"
              @click="generateNameWithAi"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
              </svg>
              <span v-if="!aiNameLoading">AUTO-GENERATE DRESS NAME</span>
              <span v-else>GENERATING VIA AI...</span>
            </button>

            <!-- Image Generator -->
            <button 
              type="button" 
              class="ai-action-btn font-tech" 
              :disabled="aiImageLoading"
              @click="showImagePromptModal = true"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>GENERATE IMAGE VIA AI</span>
            </button>
          </div>
        </div>

        <!-- Drop Details Form -->
        <div class="details-form">
          <div class="form-row">
            <div class="label-with-ai">
              <label>Product Drop Title</label>
              <span v-if="aiGeneratedNote" class="ai-pill">{{ aiGeneratedNote }}</span>
            </div>
            <input v-model="dropForm.title" type="text" placeholder="e.g. SHIBUYA NOIR OVERSIZED TEE" />
          </div>

          <!-- Category Selection fetched from koroko.in -->
          <div class="form-row">
            <label>Store Category (Fetched from koroko.in)</label>
            <select v-model="dropForm.category" @change="onCategorySelect">
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }} - {{ cat.badge }}
              </option>
            </select>
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
            <label>Catalog Description</label>
            <textarea v-model="dropForm.description" rows="2" placeholder="Japanese streetwear description..."></textarea>
          </div>
        </div>

        <!-- PUBLISH BUTTON AT THE BOTTOM -->
        <div class="bottom-publish-section">
          <button 
            class="btn-publish-bottom font-tech" 
            @click="publishDrop" 
            :disabled="!frontDesign && !backDesign"
          >
            PUBLISH TO KOROKO STORE &rarr;
          </button>
        </div>
      </div>
    </div>

    <!-- Image Prompt Modal -->
    <div v-if="showImagePromptModal" class="modal-backdrop" @click.self="showImagePromptModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="font-display">Generate Graphic / Model Image</h2>
          <button class="close-x" @click="showImagePromptModal = false">&times;</button>
        </div>

        <form @submit.prevent="generateImageWithAi" class="modal-form">
          <div class="form-item">
            <label>Describe Graphic or Garment Prompt</label>
            <textarea 
              v-model="aiImagePrompt" 
              rows="3" 
              placeholder="e.g. Cyberpunk Japanese kanji calligraphy poster, chrome textures, high contrast monochrome vector..."
              required
            ></textarea>
          </div>

          <div class="form-item">
            <label>Apply Output To</label>
            <select v-model="aiTargetSide">
              <option value="front">Front Graphic</option>
              <option value="back">Back Graphic</option>
              <option value="optional">Add as Optional Photo</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="showImagePromptModal = false">Cancel</button>
            <button type="submit" class="btn-save font-tech" :disabled="aiImageLoading">
              <span v-if="!aiImageLoading">GENERATE ARTWORK &rarr;</span>
              <span v-else>CREATING...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { adminStore } from '../state/store.js';
import { KOROKO_CATEGORIES } from '../data/categories.js';

const categories = ref(KOROKO_CATEGORIES);
const currentView = ref('front');

// Authentic Koroko Garment Mockup Blanks
const availableColors = [
  {
    name: 'Phantom Black',
    hex: '#141416',
    canvasBg: '#09090b',
    frontImage: 'https://cdn.printrove.com/merchants/300632/templates/1001001648/store-mockups/black/mockups/e5cef519-1e79-4945-8418-1b7d83807b91-mockup-1371-498-black-1792312333069.webp',
    backImage: 'https://cdn.printrove.com/merchants/300632/templates/1001001648/store-mockups/black/mockups/b4f09df2-40b0-49f2-a797-2f701d5f52fa-mockup-1371-499-black-1792312334325.webp'
  },
  {
    name: 'White',
    hex: '#f5f5f7',
    canvasBg: '#18181b',
    frontImage: 'https://cdn.printrove.com/merchants/300632/templates/1001001648/store-mockups/white/mockups/b8d950d6-9ab5-4d00-a078-86f0c30d37dc-mockup-1371-498-white-1792312331576.webp',
    backImage: 'https://cdn.printrove.com/catalog/products/1371/images/1b4f02e2-61fb-43ce-98a3-921c66b7457d-02-back.png'
  },
  {
    name: 'Navy Blue',
    hex: '#032d49',
    canvasBg: '#0b1118',
    frontImage: 'https://cdn.printrove.com/merchants/300632/templates/1001001648/store-mockups/navy-blue/mockups/5183d1a1-cbf6-4f3f-9914-ed686826f131-mockup-1371-498-navy-blue-1792312335603.webp',
    backImage: 'https://cdn.printrove.com/merchants/300632/templates/1001001648/store-mockups/navy-blue/mockups/259cf9d4-5545-49bd-8b33-e517f1c57caf-mockup-1371-499-navy-blue-1792312337734.webp'
  }
];

const selectedColor = ref(availableColors[0]);

// Initially empty so user can cleanly upload their own front & back images
const frontDesign = ref(null);
const backDesign = ref(null);
const additionalImages = ref([]);

const designScale = ref(80);
const designOffsetY = ref(0);

// AI States
const aiNameLoading = ref(false);
const aiImageLoading = ref(false);
const aiGeneratedNote = ref('');
const showImagePromptModal = ref(false);
const aiImagePrompt = ref('Cyberpunk Tokyo typography graphic in monochrome street style');
const aiTargetSide = ref('front');

const dropForm = ref({
  title: 'SHIBUYA REBEL 240 GSM OVERSIZED TEE',
  category: 'oversized',
  retailPrice: 1499,
  baseCost: 285,
  printCost: 190,
  description: 'Crafted from heavy 240 GSM combed cotton with bio-wash finish and authentic high-density Japanese street calligraphy.'
});

const currentMockupImage = computed(() => {
  if (currentView.value === 'optional' && additionalImages.value.length > 0) {
    return additionalImages.value[0];
  }
  return currentView.value === 'front' ? selectedColor.value.frontImage : selectedColor.value.backImage;
});

const currentArtwork = computed(() => {
  return currentView.value === 'front' ? frontDesign.value : backDesign.value;
});

const artworkStyle = computed(() => {
  return {
    width: `${designScale.value}%`,
    transform: `translateY(${designOffsetY.value}px)`
  };
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

const onAddOptionalImages = (e) => {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = (event) => {
      additionalImages.value.push(event.target.result);
    };
    reader.readAsDataURL(file);
  });
};

const removeOptionalImage = (index) => {
  additionalImages.value.splice(index, 1);
};

const centerArtwork = () => {
  designOffsetY.value = 0;
  designScale.value = 80;
};

const resetStudio = () => {
  frontDesign.value = null;
  backDesign.value = null;
  additionalImages.value = [];
  designOffsetY.value = 0;
  designScale.value = 80;
  aiGeneratedNote.value = '';
};

// Auto Name Generator using Backend AI
const generateNameWithAi = async () => {
  aiNameLoading.value = true;
  aiGeneratedNote.value = '';

  try {
    const backendUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace('/api', '')}/api/gemini` : '/api/gemini';

    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate-name',
        category: dropForm.value.category,
        prompt: dropForm.value.title
      })
    });

    const data = await res.json();
    if (data.success && data.result) {
      dropForm.value.title = data.result.title;
      if (data.result.description) {
        dropForm.value.description = data.result.description;
      }
      aiGeneratedNote.value = 'Generated by Tokyo AI Director';
    }
  } catch (err) {
    console.warn('AI Generation error:', err.message);
  } finally {
    aiNameLoading.value = false;
  }
};

// Image Generator
const generateImageWithAi = async () => {
  aiImageLoading.value = true;

  try {
    const backendUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace('/api', '')}/api/gemini` : '/api/gemini';
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'generate-image',
        prompt: aiImagePrompt.value
      })
    });

    const data = await res.json();
    if (data.success && data.imageUrl) {
      if (aiTargetSide.value === 'front') {
        frontDesign.value = data.imageUrl;
        currentView.value = 'front';
      } else if (aiTargetSide.value === 'back') {
        backDesign.value = data.imageUrl;
        currentView.value = 'back';
      } else {
        additionalImages.value.push(data.imageUrl);
      }
      showImagePromptModal.value = false;
    }
  } catch (err) {
    alert('AI Image generation error: ' + err.message);
  } finally {
    aiImageLoading.value = false;
  }
};

const onCategorySelect = () => {
  const cat = categories.value.find(c => c.id === dropForm.value.category);
  if (cat && !dropForm.value.description) {
    dropForm.value.description = `${cat.silhouette}. ${cat.fabric}.`;
  }
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
    mockupBack: selectedColor.value.backImage,
    additionalImages: [...additionalImages.value]
  };

  adminStore.products.unshift(newProduct);
  alert(`"${newProduct.title}" has been published and synced with https://koroko.in catalog!`);
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

.btn-secondary {
  border: 1px solid var(--border-subtle);
  background: var(--bg-surface);
  color: var(--text-secondary);
  padding: 9px 16px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  transition: all 0.2s;
}
.btn-secondary:hover {
  background: var(--bg-elevated);
  color: #ffffff;
}

/* Studio Grid */
.studio-grid {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
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
  width: 20px;
  height: 20px;
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
  object-fit: contain;
  border-radius: var(--radius-sm);
}

.printable-boundary {
  position: absolute;
  top: 22%;
  left: 26%;
  width: 48%;
  height: 52%;
  border: 1px dashed rgba(255, 255, 255, 0.25);
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
  position: relative;
}
.graphic-img {
  width: 100%;
  height: auto;
  display: block;
}

.empty-dropzone-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.35);
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
  gap: 18px;
}
.spec-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  height: 100px;
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
.drop-zone.has-file {
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.2);
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
  padding: 6px;
}
.thumb-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
}
.upload-thumb {
  max-width: 90%;
  max-height: 75px;
  object-fit: contain;
}
.thumb-tag {
  position: absolute;
  bottom: 4px;
  right: 6px;
  font-size: 9px;
  color: #34d399;
  background: rgba(0, 0, 0, 0.8);
  padding: 1px 4px;
  border-radius: 2px;
}

/* Optional Add-on Images */
.optional-images-box {
  background: var(--bg-surface);
  border: 1px solid var(--border-ultra-subtle);
  border-radius: var(--radius-sm);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.optional-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.optional-title {
  font-size: 10.5px;
  color: var(--text-muted);
}
.add-optional-btn {
  font-size: 11px;
  color: #34d399;
  cursor: pointer;
}
.add-optional-btn input {
  display: none;
}
.optional-thumbs-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.opt-thumb-wrap {
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 4px;
  border: 1px solid var(--border-subtle);
  overflow: hidden;
}
.opt-thumb-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.remove-opt {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  font-size: 12px;
  width: 16px;
  height: 16px;
  line-height: 14px;
}

/* AI Card */
.gemini-ai-card {
  background: linear-gradient(135deg, rgba(30, 30, 40, 0.6) 0%, rgba(15, 15, 20, 0.8) 100%);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.gemini-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.gemini-title {
  font-size: 13.5px;
  font-weight: 600;
  color: #ffffff;
}
.gemini-badge {
  font-size: 10px;
  color: #34d399;
  background: rgba(16, 185, 129, 0.1);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}
.gemini-actions-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.ai-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  color: var(--text-subtle);
  border-radius: var(--radius-xs);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: all 0.2s;
}
.ai-action-btn:hover:not(:disabled) {
  border-color: #ffffff;
  background: var(--bg-elevated);
  color: #ffffff;
}
.ai-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Form */
.details-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.form-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.label-with-ai {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ai-pill {
  font-size: 10px;
  color: #34d399;
  font-family: var(--font-mono-tech);
}
.form-row label {
  font-size: 11.5px;
  color: var(--text-secondary);
  font-weight: 500;
}
.form-row input, .form-row select, .form-row textarea {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xs);
  padding: 10px 14px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
  color: #ffffff;
  transition: all 0.2s;
}
.form-row input:focus, .form-row select:focus, .form-row textarea:focus {
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

/* Bottom Publish Section */
.bottom-publish-section {
  margin-top: 8px;
  padding-top: 14px;
  border-top: 1px solid var(--border-ultra-subtle);
}
.btn-publish-bottom {
  width: 100%;
  background: #ffffff;
  color: #000000;
  padding: 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  transition: all 0.2s;
}
.btn-publish-bottom:hover:not(:disabled) {
  background: #e4e4e7;
  transform: translateY(-1px);
}
.btn-publish-bottom:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
}
.modal-card {
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 500px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h2 {
  font-size: 17px;
  letter-spacing: 0.04em;
}
.close-x {
  font-size: 24px;
  color: var(--text-muted);
  cursor: pointer;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-item label {
  font-size: 11.5px;
  color: var(--text-secondary);
}
.form-item textarea, .form-item select {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xs);
  padding: 10px 14px;
  font-size: 13px;
  outline: none;
  font-family: inherit;
  color: #ffffff;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}
.btn-cancel {
  padding: 10px 18px;
  color: var(--text-muted);
  font-size: 12px;
}
.btn-save {
  background: #ffffff;
  color: #000000;
  padding: 10px 20px;
  border-radius: var(--radius-xs);
  font-weight: 700;
  font-size: 12px;
}

@media (max-width: 1024px) {
  .studio-grid {
    grid-template-columns: 1fr;
  }
}
</style>
