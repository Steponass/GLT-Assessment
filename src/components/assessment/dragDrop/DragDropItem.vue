<template>
  <div
    class="drag-item"
    :class="{
      'is-dragging': isDragging,
      'draggable': !isDragging
    }"
    :draggable="!isDragging"
    :tabindex="0"
    :aria-label="`${item} - Press space to pick up, arrow keys to move, space to drop`"
    role="button"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @keydown="handleKeyDown"
    @focus="handleFocus"
    @blur="handleBlur"
  >
    <p>{{ item }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: {
    type: String,
    required: true
  },
  isDragging: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    required: true // 'pool' or category name
  }
})

const emit = defineEmits(['dragstart', 'dragend'])

// Vue Concept: Local state for keyboard interaction
const isKeyboardActive = ref(false)
const isKeyboardSelected = ref(false)

const handleDragStart = (dragEvent) => {
  // Vue Concept: Set drag data for HTML5 API
  dragEvent.dataTransfer.setData('text/plain', props.item)
  dragEvent.dataTransfer.effectAllowed = 'move'
  emit('dragstart', props.item)
}

const handleDragEnd = () => {
  emit('dragend', props.item)
}

const handleFocus = () => {
  isKeyboardActive.value = true
}

const handleBlur = () => {
  isKeyboardActive.value = false
  isKeyboardSelected.value = false
}

const handleKeyDown = (keyboardEvent) => {
  switch (keyboardEvent.key) {
    case ' ':
    case 'Enter':
      keyboardEvent.preventDefault()
      if (isKeyboardSelected.value) {
        // Drop item
        isKeyboardSelected.value = false
        emit('dragend', props.item)
      } else {
        // Pick up item
        isKeyboardSelected.value = true
        emit('dragstart', props.item)
      }
      break

    case 'Escape':
      keyboardEvent.preventDefault()
      isKeyboardSelected.value = false
      emit('dragend', props.item)
      break
  }
}
</script>

<style scoped>
.drag-item {
  padding: var(--space-12px) var(--space-16px);
  background-color: #ffffff;
  border: 1px solid var(--clr-stroke-weak);
  border-radius: var(--radius-4px);
  cursor: grab;
  user-select: none;
  transition: all 0.2s ease;

  /* Button-like appearance with extra padding as requested */
  box-shadow: var(--shadow-elevation-1);
}

.drag-item:hover {
  border-color: var(--clr-stroke-strong);
  box-shadow: var(--shadow-elevation-2);
}

.drag-item:focus {
  outline: 2px solid var(--clr-primary);
  outline-offset: 2px;
}

.drag-item.draggable:active {
  cursor: grabbing;
}

.drag-item.is-dragging {
  opacity: 0.5;
  cursor: grabbing;
  transform: rotate(2deg);
}

/* Keyboard interaction states */
.drag-item:focus-visible {
  border-color: var(--clr-primary);
  box-shadow: var(--shadow-elevation-3);
}
</style>
