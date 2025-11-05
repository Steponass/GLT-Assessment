<template>
  <div class="checkbox-group">
    <div
      v-for="option in options"
      :key="option.value"
      class="checkbox-option"
    >
      <label class="checkbox-label">
        <input
          type="checkbox"
          :name="inputName"
          :value="option.value"
          :checked="isChecked(option.value)"
          @change="handleCheckboxChange"
          class="checkbox-input"
        />
        <span class="checkbox-text">
          {{ getDisplayText(option.value) }}
        </span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useInputCheckbox } from './useInputCheckbox.js'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
    validator: (value) => {
      // Vue Concept: Custom validator ensures array input
      // Unlike InputRadio which accepts String/Number, checkboxes need arrays
      return Array.isArray(value)
    }
  },
  options: {
    type: Array,
    required: true,
    validator: (options) => {
      // Vue Concept: Reusing same validation pattern as InputRadio
      // Ensures consistent option object structure across input types
      return options.every(option =>
        typeof option === 'object' &&
        'value' in option &&
        'text' in option
      )
    }
  },
  behaviorKind: {
    type: String,
    default: 'regular',
    validator: (value) => ['regular', 'shifty', 'toxic'].includes(value)
  },
  name: {
    type: String,
    default: () => `checkbox-${Math.random().toString(36).substr(2, 9)}`
  }
})

const emit = defineEmits(['update:modelValue'])

// Vue Concept: Destructuring composable return for clean component API
// All state management and business logic is encapsulated in the composable
const {
  handleCheckboxChange,
  getDisplayText,
  isChecked,
} = useInputCheckbox(props, emit)

// Vue Concept: Computed property for template optimization
// Prevents creating new strings on every re-render
const inputName = computed(() => props.name)
</script>

<style scoped>
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-12px);
  width: 100%;
}

.checkbox-option {
  display: flex;
  align-items: flex-start;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: var(--space-8px);
  cursor: pointer;
  width: 100%;
}

.checkbox-input {
  width: var(--space-16px);
  height: var(--space-16px);
  accent-color: var(--clr-stroke-strong);
  margin-top: 2px;
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-text {
  user-select: none;
}


</style>
