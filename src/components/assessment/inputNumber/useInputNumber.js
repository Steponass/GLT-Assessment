import { ref, watch } from 'vue'

export function useInputNumber(props, emit) {
  // Vue Concept: Number input requires careful type handling
  // Store both internal value and display value for different behaviors
  const internalValue = ref(props.modelValue)
  const displayValue = ref(props.modelValue?.toString() || '')
  const timeoutId = ref(null)

  // Vue Concept: Pirate behavior state management
  const isPirateMode = ref(false)
  const pirateTimeoutId = ref(null)
  const showPirateMessage = ref(false)

  // Vue Concept: Sync with parent component's v-model
  // Parse string input to number for parent component
  watch(() => props.modelValue, (newValue) => {
    if (newValue === null || newValue === undefined) {
      internalValue.value = newValue
      displayValue.value = newValue?.toString() || ''
      isPirateMode.value = false
      showPirateMessage.value = false
    } else {
      internalValue.value = newValue
      displayValue.value = newValue?.toString() || ''
    }
  }, { immediate: true })

  const handleNumberInput = (event) => {
    // Vue Concept: preventDefault to control input behavior manually
    // We manage the input value through reactive state
    event.preventDefault()

    const inputValue = event.target.value
    const numericValue = inputValue === '' ? null : parseFloat(inputValue)

    // Clear existing timeouts
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
      timeoutId.value = null
    }
    if (pirateTimeoutId.value) {
      clearTimeout(pirateTimeoutId.value)
      pirateTimeoutId.value = null
    }

    switch (props.behaviorKind) {
      case 'regular':
        handleRegularBehavior(numericValue, inputValue)
        break
      case 'shifty':
        handleShiftyBehavior(numericValue, inputValue)
        break
      case 'pirate':
        handlePirateBehavior(numericValue, inputValue)
        break
      default:
        handleRegularBehavior(numericValue, inputValue)
    }
  }

  // Regular behavior: 0.5s delay before value updates
  const handleRegularBehavior = (numericValue, inputValue) => {
    // Update display immediately for responsive UI
    displayValue.value = inputValue

    timeoutId.value = setTimeout(() => {
      internalValue.value = numericValue
      emit('update:modelValue', numericValue)
    }, 500)
  }

  // Shifty behavior: Changes value by +1/-1 AND changes decimal formatting
  const handleShiftyBehavior = (numericValue, inputValue) => {
    // Update display immediately
    displayValue.value = inputValue

    timeoutId.value = setTimeout(() => {
      if (numericValue !== null && !isNaN(numericValue)) {
        // Vue Concept: Generate random modifications
        // +1 or -1 randomly, and random decimal places (0-3)
        const valueModification = Math.random() < 0.5 ? 1 : -1
        const modifiedValue = numericValue + valueModification

        const randomDecimalPlaces = Math.floor(Math.random() * 4) // 0-3 decimal places
        const formattedValue = modifiedValue.toFixed(randomDecimalPlaces)
        const finalValue = parseFloat(formattedValue)

        // Update both internal value and display formatting
        internalValue.value = finalValue
        displayValue.value = formattedValue
        emit('update:modelValue', finalValue)
      } else {
        // Handle invalid input
        internalValue.value = numericValue
        emit('update:modelValue', numericValue)
      }
    }, 200)
  }

  // Vue Concept: Pirate behavior - replaces input with "AARRRGH"
  const handlePirateBehavior = (numericValue, inputValue) => {
    // If already in pirate mode, ignore further input
    if (isPirateMode.value) {
      return
    }

    // Update display immediately for responsive UI
    displayValue.value = inputValue

    // If user is typing numbers, activate pirate mode
    if (inputValue && /\d/.test(inputValue)) {
      showPirateMessage.value = true

      // Give user a moment to see their input, then pirate takeover
      pirateTimeoutId.value = setTimeout(() => {
        activatePirateMode()
      }, 1200) // 1.2 seconds to let user see what they typed
    } else {
      // Handle non-numeric input normally
      internalValue.value = numericValue
      emit('update:modelValue', numericValue)
    }
  }

  // Vue Concept: Pirate mode activation
  const activatePirateMode = () => {
    isPirateMode.value = true
    displayValue.value = 'AARRRGH'
    internalValue.value = 'AARRRGH'
    showPirateMessage.value = true
    emit('update:modelValue', 'AARRRGH')
  }

  // Vue Concept: Computed-like getter for template binding
  // Returns current display value for input field
  const getCurrentDisplayValue = () => {
    return displayValue.value
  }

  // Helper to check if current value is valid number
  const isValidNumber = () => {
    return internalValue.value !== null && !isNaN(internalValue.value)
  }

  // Vue Concept: Getter for pirate state (for styling and messages)
  const getIsPirateMode = () => {
    return isPirateMode.value
  }

  const getShowPirateMessage = () => {
    return showPirateMessage.value
  }

  // Vue Concept: Return reactive values and functions for component use
  return {
    handleNumberInput,
    getCurrentDisplayValue,
    isValidNumber,
    getIsPirateMode,
    getShowPirateMessage
  }
}
