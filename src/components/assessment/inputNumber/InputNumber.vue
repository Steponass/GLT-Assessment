<template>
  <div class="number-input-wrapper">
    <input
      type="text"
      :name="inputName"
      :value="getCurrentDisplayValue()"
      @input="handleNumberInput"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :step="step"
      :readonly="getIsPirateMode()"
      class="number-input"
      :class="{
        'pirate-mode': getIsPirateMode()
      }"
    />

    <!-- Vue Concept: Conditional rendering for pirate message -->
    <div
      v-if="getShowPirateMessage()"
      class="pirate-message"
      aria-live="polite"
    >
      The pirates have taken over 🏴‍☠️
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useInputNumber } from './useInputNumber.js'

const props = defineProps({
  modelValue: {
    type: [Number, String, null],
    default: null,
    validator: (value) => {
      // Vue Concept: Allow null for empty state, numbers, or pirate string
      return value === null ||
             typeof value === 'number' ||
             value === 'AARRRGH'
    }
  },
  behaviorKind: {
    type: String,
    default: 'regular',
    validator: (value) => ['regular', 'shifty', 'pirate'].includes(value)
  },
  name: {
    type: String,
    default: () => `number-${Math.random().toString(36).substr(2, 9)}`
  },
  placeholder: {
    type: String,
    default: 'Enter a number'
  },
  min: {
    type: Number,
    default: undefined
  },
  max: {
    type: Number,
    default: undefined
  },
  step: {
    type: [Number, String],
    default: 'any'
  }
})

const emit = defineEmits(['update:modelValue'])

// Vue Concept: Destructure only needed functions from composable
const {
  handleNumberInput,
  getCurrentDisplayValue,
  isValidNumber,
  getIsPirateMode,
  getShowPirateMessage
} = useInputNumber(props, emit)

const inputName = computed(() => props.name)
</script>

<style scoped>
.number-input-wrapper {
  position: relative;
  display: inline-block;
}

.number-input {
  width: 12ch;
  padding: var(--space-8px) var(--space-12px);
  border: 1px solid var(--clr-stroke-strong);
  border-radius: 4px;
  font-size: var(--fontsize-body);
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.number-input:focus {
  outline: none;
  border-color: var(--clr-primary);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--clr-primary) 20%, transparent);
}

/* Vue Concept: Pirate mode styling */
.number-input.pirate-mode {
  background-color: var(--clr-background-disabled, #f5f5f5);
  color: var(--clr-text-pirate, #8B4513);
  font-weight: bold;
  text-align: center;
  font-size: var(--fontsize-h4);
  cursor: not-allowed;
  border-color: var(--clr-warning-border, #ffeaa7);
  text-transform: uppercase;
}

.pirate-message {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: var(--space-4px);
  padding: var(--space-8px);
  background-color: var(--clr-warning-background, #fff3cd);
  border: 1px solid var(--clr-warning-border, #ffeaa7);
  border-radius: var(--border-radius-small);
  font-size: var(--fontsize-small);
  color: var(--clr-warning-text, #856404);
  text-align: center;
  animation: pirateAppear 0.3s ease-in;
  z-index: 10;
}

@keyframes pirateAppear {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
