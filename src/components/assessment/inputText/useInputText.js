import { ref, watch, computed } from 'vue'

export function useInputText(props, emit) {
  // Internal state management
  const displayValue = ref(props.modelValue || '')
  const actualValue = ref(props.modelValue || '')
  const inputTimeoutId = ref(null)
  const isProcessingInput = ref(false)

  // Shifty behavior state
  const keystrokeCount = ref(0)

  // Vue: watch() to sync with parent v-model
  // This ensures our internal state stays aligned with external changes
  watch(() => props.modelValue, (newValue) => {
    if (newValue !== actualValue.value) {
      actualValue.value = newValue || ''
      displayValue.value = newValue || ''
    }
  }, { immediate: true })

  // Main input handler - routes to appropriate behavior
  const handleTextInput = (event) => {
    const newInputValue = event.target.value

    // Clear any existing timeout
    if (inputTimeoutId.value) {
      clearTimeout(inputTimeoutId.value)
      inputTimeoutId.value = null
    }

    switch (props.behaviorKind) {
      case 'shifty':
        handleShiftyBehavior(newInputValue)
        break
      case 'toxic':
        handleToxicBehavior(newInputValue)
        break
      default:
        // No regular behavior for InputText as per specs
        handleDirectInput(newInputValue)
    }
  }

  // Direct input (no behavior modifications)
  const handleDirectInput = (inputValue) => {
    displayValue.value = inputValue
    actualValue.value = inputValue
    emit('update:modelValue', inputValue)
  }

  // Shifty: delay + lose every 2nd/3rd character alternately
  const handleShiftyBehavior = (inputValue) => {
    isProcessingInput.value = true
    keystrokeCount.value += 1

    // Determine if we should lose this character
    // Pattern: lose 2nd, then 3rd, then 2nd, then 3rd...
    const shouldLoseChar = (keystrokeCount.value % 5 === 2) || (keystrokeCount.value % 5 === 0)

    // Show input immediately for user feedback
    displayValue.value = inputValue

    // Apply 0.3s delay
    inputTimeoutId.value = setTimeout(() => {
      let processedValue = inputValue

      if (shouldLoseChar && processedValue.length > 0) {
        // "Lose" the last character that was typed
        processedValue = processedValue.slice(0, -1)
      }

      // Update both display and actual values
      displayValue.value = processedValue
      actualValue.value = processedValue
      emit('update:modelValue', processedValue)
      isProcessingInput.value = false
    }, 300)
  }

  // Toxic: replace entire word as user types
  const handleToxicBehavior = (inputValue) => {
    // Show the input immediately for responsive feel
    displayValue.value = inputValue

    // Detect if user is typing a word (not just spaces/punctuation)
    const words = inputValue.trim().split(/\s+/)
    const currentWord = words[words.length - 1]

    // Only replace if we have a meaningful word and replacement options
    if (currentWord &&
        currentWord.length > 1 &&
        props.toxicReplacements &&
        props.toxicReplacements.length > 0) {

      // Get a random replacement word
      const randomReplacement = props.toxicReplacements[
        Math.floor(Math.random() * props.toxicReplacements.length)
      ]

      // Replace the current word
      const wordsExceptLast = words.slice(0, -1)
      const replacedText = wordsExceptLast.length > 0
        ? wordsExceptLast.join(' ') + ' ' + randomReplacement
        : randomReplacement

      // Update immediately - this creates the "gaslighting" effect
      displayValue.value = replacedText
      actualValue.value = replacedText
      emit('update:modelValue', replacedText)
    } else {
      // For non-words or short input, behave normally
      actualValue.value = inputValue
      emit('update:modelValue', inputValue)
    }
  }

  // Cleanup function for timeouts
  const cleanup = () => {
    if (inputTimeoutId.value) {
      clearTimeout(inputTimeoutId.value)
      inputTimeoutId.value = null
    }
  }

  // Vue Concept: computed properties for derived state
  const isInputDelayed = computed(() => {
    return props.behaviorKind === 'shifty' && isProcessingInput.value
  })

  // Return reactive values and functions for component use
  return {
    displayValue,
    handleTextInput,
    isInputDelayed,
    cleanup
  }
}
