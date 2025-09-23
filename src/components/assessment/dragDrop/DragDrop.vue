<template>
  <div class="drag-drop-container">
    <div class="drag-drop-layout">
      <!-- Available Items Pool -->
      <div
        class="items-pool"
        :class="{ 'drag-over': isDragOverPool }"
        @dragover.prevent="handleDragOverPool"
        @dragleave="handleDragLeavePool"
        @drop="handleDropToPool"
      >
        <h3 class="pool-title">Available Items</h3>
        <div class="items-list">
          <DragDropItem
            v-for="item in availableItems"
            :key="`pool-${item}`"
            :item="item"
            :is-dragging="draggingItem === item"
            location="pool"
            @dragstart="handleDragStart"
            @dragend="handleDragEnd"
          />
        </div>
      </div>

      <!-- Categories -->
      <div class="categories-container">
        <div
          v-for="category in categories"
          :key="category"
          class="category-zone"
          :class="{
            'drag-over': dragOverCategory === category,
            'shifty-highlight': shiftyHighlightCategory === category
          }"
          @dragover.prevent="() => handleDragOverCategory(category)"
          @dragleave="() => handleDragLeaveCategory(category)"
          @drop="(event) => handleDropToCategory(event, category)"
        >
          <h3 class="category-title">{{ category }}</h3>
          <div class="category-items">
            <DragDropItem
              v-for="item in modelValue[category]"
              :key="`${category}-${item}`"
              :item="item"
              :is-dragging="draggingItem === item"
              :location="category"
              @dragstart="handleDragStart"
              @dragend="handleDragEnd"
            />

            <!-- Empty state -->
            <div
              v-if="modelValue[category].length === 0"
              class="empty-category"
            >
              Drop items here
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="sr-only" aria-live="polite" aria-atomic="true">
      {{ screenReaderAnnouncement }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import DragDropItem from './DragDropItem.vue'
import { useDragDrop } from './useDragDrop.js'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    validator: (value) => {
      // Vue: Validate modelValue structure
      return typeof value === 'object' &&
             Object.values(value).every(arr => Array.isArray(arr))
    }
  },
  items: {
    type: Array,
    required: true,
    validator: (items) => items.every(item => typeof item === 'string')
  },
  categories: {
    type: Array,
    required: true,
    validator: (categories) => {
      return categories.length >= 2 &&
             categories.length <= 3 &&
             categories.every(cat => typeof cat === 'string')
    }
  },
  behaviorKind: {
    type: String,
    default: 'regular',
    validator: (value) => ['regular', 'shifty'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue'])

// Destructuring composable for clean component API
const {
  draggingItem,
  dragOverCategory,
  isDragOverPool,
  shiftyHighlightCategory,
  screenReaderAnnouncement,
  handleDragStart,
  handleDragEnd,
  handleDragOverCategory,
  handleDragLeaveCategory,
  handleDragOverPool,
  handleDragLeavePool,
  handleDropToCategory,
  handleDropToPool
} = useDragDrop(props, emit)

// Vue: Computed property for available items
const availableItems = computed(() => {
  const assignedItems = Object.values(props.modelValue).flat()
  return props.items.filter(item => !assignedItems.includes(item))
})
</script>

<style scoped>
.drag-drop-container {
  width: 100%;
}

.drag-drop-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--space-24px);
  min-height: 400px;
}

/* Items Pool Styling */
.items-pool {
  padding: var(--space-16px);
  border: 2px solid var(--clr-stroke-weak);
  border-radius: var(--radius-8px);
  background-color: var(--clr-secondary);
  transition: all 0.2s ease;
}

.items-pool.drag-over {
  border-color: var(--clr-primary);
  background-color: color-mix(in srgb, var(--clr-secondary) 90%, var(--clr-primary) 10%);
}

.pool-title {
  margin-bottom: var(--space-12px);
  text-align: center;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-8px);
  min-height: 100px;
}

/* Categories Styling */
.categories-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-16px);
}

.category-zone {
  padding: var(--space-16px);
  border: 2px solid var(--clr-stroke-weak);
  border-radius: var(--radius-8px);
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.category-zone.drag-over {
  border-color: var(--clr-primary);
  background-color: color-mix(in srgb, #ffffff 90%, var(--clr-primary) 10%);
}

.category-zone.shifty-highlight {
  border-color: var(--clr-stroke-strong);
  background-color: color-mix(in srgb, #ffffff 85%, var(--clr-stroke-strong) 15%);
  animation: shiftyPulse 0.5s ease-in-out;
}

@keyframes shiftyPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.category-title {
  margin-bottom: var(--space-12px);
  text-align: center;
}

.category-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-8px);
  min-height: 100px;
}

.empty-category {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  border: 2px dashed var(--clr-stroke-weak);
  border-radius: var(--radius-4px);
  color: var(--clr-text-weak);
  font-style: italic;
}

/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 768px) {
  .drag-drop-layout {
    grid-template-columns: 1fr;
    gap: var(--space-16px);
  }

  .categories-container {
    grid-template-columns: 1fr;
  }
}
</style>
