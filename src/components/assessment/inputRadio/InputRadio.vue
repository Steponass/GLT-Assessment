<template>
  <div class="radio-group">
    <div
      v-for="option in options"
      :key="option.value"
      class="radio-option"
    >
      <label class="radio-label">
        <input
          type="radio"
          :name="inputName"
          :value="option.value"
          :checked="selectedValue === option.value"
          @change="handleRadioSelection"
          class="radio-input"
        />
        <span class="radio-text">
          {{ getDisplayText(option.text) }}
        </span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useInputRadio } from './useInputRadio.js'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    required: true,
    validator: (options) => {
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
    default: () => `radio-${Math.random().toString(36).substr(2, 9)}`
  }
})

const emit = defineEmits(['update:modelValue'])

const {
  selectedValue,
  handleRadioSelection,
  getDisplayText
} = useInputRadio(props, emit)

const inputName = computed(() => props.name)
</script>

<style scoped>

.radio-group {
  display: flex;
  gap: var(--space-12-16px);
}

.radio-option {
  display: flex;
  align-items: center;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: var(--space-8px);
  cursor: pointer;
}

.radio-input {
  width: var(--space-12-16px);
  height: var(--space-12-16px);
  cursor: pointer;
}

.radio-text {
  user-select: none;
}

</style>
