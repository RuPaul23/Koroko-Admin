<template>
  <div class="design-studio-page">
    <div class="page-header">
      <div>
        <h1 class="page-title font-display">T-SHIRT MOCKUP & DESIGN STUDIO</h1>
        <p class="page-subtitle">Upload Front, Back, and Optional dress angles to preview, set pricing, generate Tokyo titles via Groq AI, and push live</p>
      </div>

      <div class="header-actions">
        <button class="btn-secondary font-tech" @click="resetStudio">
          RESET CANVAS
        </button>
      </div>
    </div>

    <!-- Studio Canvas & Controls Grid -->
    <div class="studio-grid">
      <!-- Left: Interactive Uploaded Mockup Preview Stage (BIG PREVIEW OF UPLOADED IMAGES) -->
      <div class="mockup-canvas-panel">
        <div class="canvas-top-tabs">
          <button 
            class="tab-btn font-tech" 
            :class="{ active: currentView === 'front' }"
            @click="currentView = 'front'"
          >
            FRONT PREVIEW {{ frontDesign ? '(LOADED)' : '' }}
          </button>
          <button 
            class="tab-btn font-tech" 
            :class="{ active: currentView === 'back' }"
            @click="currentView = 'back'"
          >
            BACK PREVIEW {{ backDesign ? '(LOADED)' : '' }}
          </button>
          <button 
            v-if="additionalImages.length > 0"
            class="tab-btn font-tech" 
            :class="{ active: currentView.startsWith('optional_') }"
            @click="currentView = 'optional_0'"
          >
            ADDITIONAL ANGLES ({{ additionalImages.length }})
          </button>
        </div>

        <!-- The Canvas Stage: Large Direct Preview of the uploaded garment image -->
        <div class="mockup-stage">
          <div class="direct-preview-wrapper">
            <div v-if="activePreviewImage" class="active-image-view">
              <img 
                :src="activePreviewImage" 
                alt="Product Preview" 
                class="direct-preview-img"
              />
              <div class="preview-badge-overlay font-tech">
                {{ currentViewLabel.toUpperCase() }}
              </div>
            </div>

            <div v-else class="empty-preview-prompt">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="1.5"/>
                <circle cx="8.5" cy="8.5" r="1.5" stroke-width="1.5"/>
                <polyline points="21 15 16 10 5 21" stroke-width="1.5"/>
              </svg>
              <h3 class="font-display">No {{ currentView }} image uploaded</h3>
              <p>Upload a high-resolution Front or Back garment photo on the right panel to preview here.</p>
            </div>
          </div>
        </div>

        <!-- Angle selector thumbnail row for additional images -->
        <div v-if="additionalImages.length > 0 && currentView.startsWith('optional_')" class="optional-angles-bar">
          <span class="font-tech text-xs text-muted">SELECT ANGLE:</span>
          <button 
            v-for="(img, idx) in additionalImages" 
            :key="idx" 
            class="angle-thumb-btn"
            :class="{ active: currentView === 'optional_' + idx }"
            @click="currentView = 'optional_' + idx"
          >
            <img :src="img" alt="Angle thumbnail" />
            <span>Angle {{ idx + 1 }}</span>
          </button>
        </div>
      </div>

      <!-- Right: Product Drop Specification -->
      <div class="spec-panel">
        <div class="spec-header-row">
          <h2 class="spec-title font-display">Drop Specifications</h2>
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

        <!-- Groq AI Streetwear Auto-Naming Studio -->
        <div class="gemini-ai-card">
          <div class="gemini-header">
            <span class="gemini-title font-display">Tokyo Streetwear Naming Studio</span>
            <span class="gemini-badge font-tech">GROQ AI</span>
          </div>

          <div class="gemini-actions-row">
            <!-- Auto Name Generator via Groq AI -->
            <button 
              type="button" 
              class="ai-action-btn font-tech" 
              :disabled="aiNameLoading"
              @click="generateNameWithAi"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor">
                <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
              </svg>
              <span v-if="!aiNameLoading">GENERATE UNIQUE TITLE VIA GROQ AI</span>
              <span v-else>GENERATING VIA GROQ AI...</span>
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
            <input v-model="dropForm.title" type="text" placeholder="e.g. SHIBUYA NOIR 240 GSM OVERSIZED TEE" />
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

          <!-- Vendor Base Cost Breakdown -->
          <div class="pricing-breakdown-card">
            <div class="breakdown-title font-tech">VENDOR BASE COST (PRINTROVE / QIKINK)</div>
            <div class="breakdown-grid">
              <div class="breakdown-item">
                <label>Blank Garment Cost (&#8377;)</label>
                <input v-model.number="dropForm.baseCost" type="number" step="1" />
              </div>
              <div class="breakdown-item">
                <label>DTG/DTF Print Cost (&#8377;)</label>
                <input v-model.number="dropForm.printCost" type="number" step="1" />
              </div>
              <div class="breakdown-item">
                <label>Total Vendor Cost</label>
                <div class="vendor-total-val font-tech">&#8377;{{ (dropForm.baseCost || 0) + (dropForm.printCost || 0) }}</div>
              </div>
            </div>
          </div>

          <div class="form-row-grid">
            <div class="form-row">
              <label>Retail Selling Price (&#8377;)</label>
              <input v-model.number="dropForm.retailPrice" type="number" />
            </div>
            <div class="form-row">
              <label>Projected Profit Margin</label>
              <div class="static-val font-tech text-emerald">
                &#8377;{{ (dropForm.retailPrice || 0) - ((dropForm.baseCost || 0) + (dropForm.printCost || 0)) }}
                ({{ projectedMargin }}%)
              </div>
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { adminStore } from '../state/store.js';
import { KOROKO_CATEGORIES } from '../data/categories.js';

const categories = ref(KOROKO_CATEGORIES);
const currentView = ref('front');
const zipStatus = ref('');

// Authentic Koroko Garment Mockup Blanks (Black, White, Navy Blue)
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

// No fake or predefined mockups by default. Pure user uploads.
const frontDesign = ref(null);
const backDesign = ref(null);
const additionalImages = ref([]);

// AI States
const aiNameLoading = ref(false);
const aiGeneratedNote = ref('');

const dropForm = ref({
  title: '',
  category: 'oversized',
  retailPrice: 1499,
  baseCost: 285,
  printCost: 190,
  description: ''
});

const projectedMargin = computed(() => {
  const cogs = (dropForm.value.baseCost || 0) + (dropForm.value.printCost || 0);
  const retail = dropForm.value.retailPrice || 0;
  if (!retail) return 0;
  return Math.round(((retail - cogs) / retail) * 100);
});

// Large preview of currently selected uploaded angle
const activePreviewImage = computed(() => {
  if (currentView.value === 'front') return frontDesign.value;
  if (currentView.value === 'back') return backDesign.value;
  if (currentView.value.startsWith('optional_')) {
    const idx = parseInt(currentView.value.replace('optional_', ''), 10);
    return additionalImages.value[idx] || null;
  }
  return null;
});

const currentViewLabel = computed(() => {
  if (currentView.value === 'front') return 'Front View';
  if (currentView.value === 'back') return 'Back View';
  if (currentView.value.startsWith('optional_')) {
    const idx = parseInt(currentView.value.replace('optional_', ''), 10);
    return `Additional Angle ${idx + 1}`;
  }
  return currentView.value;
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

// Client-side ZIP extraction for Qikink / Printrove downloaded mockup packs
const handleZipUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!window.JSZip) {
    alert('ZIP extraction library is loading, please try again in a moment.');
    return;
  }

  zipStatus.value = `Extracting images from "${file.name}"...`;

  try {
    const zip = await window.JSZip.loadAsync(file);
    const extracted = [];

    const entries = Object.keys(zip.files);
    for (const filename of entries) {
      const entry = zip.files[filename];
      if (!entry.dir && /\.(png|jpg|jpeg|webp)$/i.test(filename) && !filename.startsWith('__MACOSX')) {
        const blob = await entry.async('blob');
        const url = URL.createObjectURL(blob);
        extracted.push({ name: filename, url });
      }
    }

    if (extracted.length > 0) {
      // Intelligently assign front and back based on filename, or sequential order
      const front = extracted.find(f => /front|01/i.test(f.name)) || extracted[0];
      const back = extracted.find(f => /back|02/i.test(f.name)) || extracted[1];

      if (front) {
        frontDesign.value = front.url;
        currentView.value = 'front';
      }
      if (back) {
        backDesign.value = back.url;
      }

      // Add remaining extracted images as additional lifestyle/angle images
      extracted.forEach(item => {
        if (item !== front && item !== back) {
          additionalImages.value.push(item.url);
        }
      });

      zipStatus.value = `Extracted ${extracted.length} high-resolution mockup images! Assigned Front & Back prints. The ZIP file was discarded.`;
    } else {
      zipStatus.value = 'No compatible images (PNG/JPG/WEBP) found in the ZIP archive.';
    }
  } catch (err) {
    zipStatus.value = `Failed to extract ZIP: ${err.message}`;
  }
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
  zipStatus.value = '';
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

const onCategorySelect = () => {
  const cat = categories.value.find(c => c.id === dropForm.value.category);
  if (cat && !dropForm.value.description) {
    dropForm.value.description = `${cat.silhouette}. ${cat.fabric}.`;
  }
};

const publishDrop = () => {
  const newProduct = {
    id: 'koroko-' + Date.now(),
    title: dropForm.value.title || 'KOROKO LIMITED TOKYO PIECE',
    category: dropForm.value.category,
    colorways: ['Custom Drop'],
    baseCost: dropForm.value.baseCost,
    printCost: dropForm.value.printCost,
    retailPrice: dropForm.value.retailPrice,
    mrp: Math.round(dropForm.value.retailPrice * 1.6),
    margin: `${projectedMargin.value}%`,
    active: true,
    mockupFront: frontDesign.value || '',
    mockupBack: backDesign.value || frontDesign.value || '',
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

.preset-selector-strip {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 12px 18px;
  border-radius: 8px;
  flex-wrap: wrap;
}

.preset-label {
  font-size: 11px;
  letter-spacing: 0.1em;
  color: #71717a;
  font-weight: 700;
}

.preset-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.preset-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #18181b;
  border: 1px solid #27272a;
  color: #e4e4e7;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-chip:hover {
  background: #27272a;
  border-color: #3f3f46;
  color: #ffffff;
}

.provider-tag {
  background: rgba(255, 255, 255, 0.1);
  color: #a1a1aa;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  letter-spacing: 0.05em;
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

.btn-zip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-surface);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34d399;
  padding: 9px 16px;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-zip:hover {
  background: rgba(16, 185, 129, 0.12);
  border-color: #34d399;
}
.btn-zip input {
  display: none;
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

.zip-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  color: #34d399;
  font-size: 12px;
}
.zip-close {
  font-size: 18px;
  color: #34d399;
  cursor: pointer;
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
  min-height: 520px;
  position: relative;
  overflow: hidden;
  background: #09090b;
  border: 1px solid var(--border-subtle);
}

.direct-preview-wrapper {
  width: 100%;
  height: 100%;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.active-image-view {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.direct-preview-img {
  max-width: 100%;
  max-height: 480px;
  object-fit: contain;
  border-radius: var(--radius-sm);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.preview-badge-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 10px;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  border-radius: 4px;
}

.empty-preview-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-muted);
  text-align: center;
  padding: 40px 20px;
}
.empty-preview-prompt svg {
  color: #3f3f46;
}
.empty-preview-prompt h3 {
  font-size: 18px;
  color: #e4e4e7;
  letter-spacing: 0.05em;
}
.empty-preview-prompt p {
  font-size: 12px;
  color: #71717a;
  max-width: 320px;
  line-height: 1.5;
}

.optional-angles-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0 0 0;
  border-top: 1px solid var(--border-ultra-subtle);
  overflow-x: auto;
}
.angle-thumb-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #18181b;
  border: 1px solid #27272a;
  color: #a1a1aa;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}
.angle-thumb-btn img {
  width: 24px;
  height: 24px;
  object-fit: cover;
  border-radius: 3px;
}
.angle-thumb-btn.active {
  border-color: #ffffff;
  color: #ffffff;
  background: #27272a;
}

.pricing-breakdown-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  margin-top: 8px;
  margin-bottom: 8px;
}
.breakdown-title {
  font-size: 10.5px;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 10px;
}
.breakdown-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}
.breakdown-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.breakdown-item label {
  font-size: 10.5px;
  color: #a1a1aa;
}
.breakdown-item input {
  background: #141416;
  border: 1px solid #27272a;
  color: #ffffff;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
}
.vendor-total-val {
  font-size: 13px;
  color: #f59e0b;
  font-weight: 700;
  padding-top: 6px;
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
