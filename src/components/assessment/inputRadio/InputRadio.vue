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
          @click="handleRadioSelection"
          class="radio-input"
        />
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

const emit = defineEmits(['update:modelValue', 'clear-toxic'])

const {
  selectedValue,
  handleRadioSelection,
  getDisplayText,
  clearToxicSelection
} = useInputRadio(props, emit)

defineExpose({
  clearToxicSelection
})

const inputName = computed(() => props.name)
</script>

<style scoped>

.radio-group {
  display: flex;
  justify-content: space-between;
  width: 400px;
}

.radio-option {
  flex: 1;
  display: flex;
  justify-content: center;
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
