<template>
  <div class="input-text-container">
    <input
      type="text"
      :value="displayValue"
      @input="handleTextInput"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="[
        'text-input',
        {
          'input-processing': isInputDelayed,
          'input-shifty': behaviorKind === 'shifty',
          'input-toxic': behaviorKind === 'toxic'
        }
      ]"
    />

    <!-- Visual feedback for shifty behavior -->
    <div
      v-if="isInputDelayed"
      class="processing-indicator"
      aria-hidden="true"
    >
      Processing...
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount } from 'vue'
import { useInputText } from './useInputText.js'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  behaviorKind: {
    type: String,
    default: 'shifty',
    validator: (value) => ['shifty', 'toxic'].includes(value)
  },
  toxicReplacements: {
    type: Array,
    default: () => [],
    validator: (replacements) => {
      return replacements.every(word => typeof word === 'string' && word.length > 0)
    }
  },
  placeholder: {
    type: String,
    default: 'Type your answer here...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: () => `text-input-${Math.random().toString(36).substr(2, 9)}`
  }
})

// Vue: defineEmits for component communication
const emit = defineEmits(['update:modelValue'])

const {
  displayValue,
  handleTextInput,
  isInputDelayed,
  cleanup
} = useInputText(props, emit)

// Vue: Lifecycle hooks for cleanup
onBeforeUnmount(() => {
  cleanup()
})

// Vue: defineExpose to make methods available to parent components
// This allows parent components to programmatically clear or reset the input
defineExpose({
  focus: () => {
    // Could add focus functionality if needed
  },
  clear: () => {
    displayValue.value = ''
    emit('update:modelValue', '')
  }
})
</script>

<style scoped>
.input-text-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

.text-input {
  width: 100%;
  padding: var(--space-8-12px) var(--space-12-16px);
  border: 2px solid var(--clr-stroke-strong);
}

.input-processing {
  background-color: var(--clr-background-processing, #fef3c7);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.processing-indicator {
  position: absolute;
  top: 100%;
  left: 0;
  font-size: var(--fontsize-small);
  color: var(--clr-text-secondary);
  margin-top: var(--space-4px);
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
