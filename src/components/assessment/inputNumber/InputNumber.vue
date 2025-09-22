<template>
  <div class="number-input-wrapper">
    <input
      type="number"
      :name="inputName"
      :value="getCurrentDisplayValue()"
      @input="handleNumberInput"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :step="step"
      class="number-input"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useInputNumber } from './useInputNumber.js'

const props = defineProps({
  modelValue: {
    type: [Number, null],
    default: null,
    validator: (value) => {
      // Vue Concept: Allow null for empty state, or valid numbers
      return value === null || typeof value === 'number'
    }
  },
  behaviorKind: {
    type: String,
    default: 'regular',
    validator: (value) => ['regular', 'shifty'].includes(value)
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
  isValidNumber
} = useInputNumber(props, emit)

const inputName = computed(() => props.name)
</script>

<style scoped>
.number-input-wrapper {
  display: inline-block;
}

.number-input {
  width: 10ch;
  padding: var(--space-8px) var(--space-12px);
  border: 1px solid var(--clr-stroke-strong);
  border-radius: 4px;
  font-size: var(--fontsize-body);
  transition: border-color 0.2s ease;
}
</style>
