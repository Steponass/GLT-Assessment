import { ref, computed, watch } from 'vue'

export function useInputRadio(props, emit) {
  const selectedValue = ref(props.modelValue)
  const hasSelectedOnce = ref(false)
  const timeoutId = ref(null)
  const isProcessingSelection = ref(false)

  // Sync with parent component's v-model
  // Vue Concept: This watch ensures our internal state stays in sync
  // with the parent component's data, which is crucial for form handling
  watch(() => props.modelValue, (newValue) => {
    selectedValue.value = newValue
  }, { immediate: true })

  const handleRadioSelection = (event) => {
    const newValue = event.target.value

    // Clear any existing timeout
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
      timeoutId.value = null
    }

    switch (props.behaviorKind) {
      case 'regular':
        handleRegularBehavior(newValue)
        break
      case 'shifty':
        handleShiftyBehavior(newValue)
        break
      case 'toxic':
        handleToxicBehavior(newValue)
        break
      default:
        handleRegularBehavior(newValue)
    }
  }

  // Regular behavior: 0.6 second delay before selection registers
  const handleRegularBehavior = (value) => {
    timeoutId.value = setTimeout(() => {
      selectedValue.value = value
      emit('update:modelValue', value)
    }, 600)
  }

  // Shifty behavior: Selection appears to work, then switches after 2 seconds
  const handleShiftyBehavior = (value) => {
    selectedValue.value = value
    emit('update:modelValue', value)

    timeoutId.value = setTimeout(() => {
      const otherOptions = props.options.filter(option => option.value !== value)

      if (otherOptions.length > 0) {

        const randomOption = otherOptions[Math.floor(Math.random() * otherOptions.length)]
        selectedValue.value = randomOption.value
        emit('update:modelValue', randomOption.value)
      }
    }, 600)
  }

  // Toxic behavior: Selection works normally, but question text changes
  const handleToxicBehavior = (value) => {
    selectedValue.value = value
    emit('update:modelValue', value)

    // Mark that user has made a selection (this triggers question text change)
    hasSelectedOnce.value = true
  }

  // Vue Concept: computed properties for derived state
  // This computed property will automatically re-run whenever hasSelectedOnce changes
  // No manual dependency tracking needed like React's useMemo
  const shouldShowAlteredQuestion = computed(() => {
    return props.behaviorKind === 'toxic' && hasSelectedOnce.value
  })

  // Function to get display text for options
  // In toxic mode, this doesn't change - the question itself changes instead
  const getDisplayText = (originalText) => {
    return originalText
  }

  // Vue Concept: Return reactive values and functions for component use
  // These will automatically trigger re-renders when their dependencies change
  return {
    selectedValue,
    handleRadioSelection,
    getDisplayText,
    shouldShowAlteredQuestion,
    isProcessingSelection
  }
}
