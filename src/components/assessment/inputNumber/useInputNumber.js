import { ref, watch } from 'vue'

export function useInputNumber(props, emit) {
  // Vue Concept: Number input requires careful type handling
  // Store both internal value and display value for different behaviors
  const internalValue = ref(props.modelValue)
  // Don't initialize displayValue with "NaN" if modelValue is NaN
  const getSafeDisplayValue = (value) => {
    if (value === null || value === undefined) return ''
    if (typeof value === 'number' && Number.isNaN(value)) return ''
    return value.toString()
  }
  const displayValue = ref(getSafeDisplayValue(props.modelValue))
  const timeoutId = ref(null)
  const validationError = ref('')

  // Vue Concept: Pirate behavior state management
  const isPirateMode = ref(false)
  const pirateTimeoutId = ref(null)
  const showPirateMessage = ref(false)

  // Vue Concept: Shifty behavior state management
  const shiftyIntervalId = ref(null)
  const shiftyIterationCount = ref(0)

  // Vue Concept: Sync with parent component's v-model
  // Parse string input to number for parent component
  watch(() => props.modelValue, (newValue) => {
    // Don't sync if the value is NaN (invalid state) - keep current display value
    if (typeof newValue === 'number' && Number.isNaN(newValue)) {
      // Don't update displayValue - let user continue typing
      return
    }

    if (newValue === null || newValue === undefined) {
      internalValue.value = newValue
      displayValue.value = ''
      isPirateMode.value = false
      showPirateMessage.value = false
      validationError.value = ''
    } else {
      internalValue.value = newValue
      displayValue.value = getSafeDisplayValue(newValue)
      validationError.value = ''
    }
  }, { immediate: true })

  const handleNumberInput = (event) => {
    // Vue Concept: preventDefault to control input behavior manually
    // We manage the input value through reactive state
    event.preventDefault()

    const inputValue = event.target.value
    const numericValue = inputValue === '' ? null : parseFloat(inputValue)

    // Update validation state immediately on input
    runValidation(numericValue, inputValue)

    // Clear existing timeouts and intervals
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
      timeoutId.value = null
    }
    if (pirateTimeoutId.value) {
      clearTimeout(pirateTimeoutId.value)
      pirateTimeoutId.value = null
    }
    if (shiftyIntervalId.value) {
      clearInterval(shiftyIntervalId.value)
      shiftyIntervalId.value = null
      shiftyIterationCount.value = 0
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
      // Only emit if valid (or empty)
      if (!validationError.value) {
        internalValue.value = numericValue
        emit('update:modelValue', numericValue)
      }
    }, 500)
  }

  // Shifty behavior: Continuously shifts value randomly between -9 and +199 for 10 iterations
  const handleShiftyBehavior = (numericValue, inputValue) => {
    // Update display immediately
    displayValue.value = inputValue

    timeoutId.value = setTimeout(() => {
      if (!validationError.value && numericValue !== null && !isNaN(numericValue)) {
        // Reset iteration counter for new input
        shiftyIterationCount.value = 0

        // Start interval that runs 10 times
        shiftyIntervalId.value = setInterval(() => {
          shiftyIterationCount.value++

          if (shiftyIterationCount.value <= 10) {
            // Vue Concept: Generate random modifications between -9 and +199
            const valueModification = Math.floor(Math.random() * 109) - 49 // Range: -49 to +99
            const currentValue = internalValue.value !== null ? internalValue.value : numericValue
            const modifiedValue = currentValue + valueModification

            const randomDecimalPlaces = Math.floor(Math.random() * 4) // 0-3 decimal places
            const formattedValue = modifiedValue.toFixed(randomDecimalPlaces)
            const finalValue = parseFloat(formattedValue)

            // Update both internal value and display formatting
            internalValue.value = finalValue
            displayValue.value = formattedValue
            emit('update:modelValue', finalValue)
          } else {
            // Stop after 10 iterations
            clearInterval(shiftyIntervalId.value)
            shiftyIntervalId.value = null
            shiftyIterationCount.value = 0
          }
        }, 200)
      } else {
        // Handle invalid input - don't emit NaN, keep previous valid value
        // Don't update internalValue or emit for invalid input
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
      // Handle non-numeric input - don't emit NaN, keep previous valid value
      // Don't update internalValue or emit for invalid input
    }
  }

  // Vue Concept: Pirate mode activation
  const activatePirateMode = () => {
    isPirateMode.value = true
    displayValue.value = 'ARRRGH!'
    internalValue.value = 'ARRRGH!'
    showPirateMessage.value = true
    emit('update:modelValue', 'ARRRGH!')
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

  // Validation logic for number, min/max and step
  const runValidation = (numericValue, rawInput) => {
    // Reset first
    validationError.value = ''

    // Allow empty input
    if (rawInput === '' || rawInput === null || rawInput === undefined) {
      return
    }

    // Reject non-numeric
    if (numericValue === null || Number.isNaN(numericValue)) {
      validationError.value = 'Please enter a valid number.'
      return
    }

    // Min/Max checks
    if (typeof props.min === 'number' && numericValue < props.min) {
      validationError.value = `Value must be ≥ ${props.min}.`
      return
    }
    if (typeof props.max === 'number' && numericValue > props.max) {
      validationError.value = `Value must be ≤ ${props.max}.`
      return
    }

    // Step check (align to min when provided, otherwise 0)
    const step = props.step
    if (step !== 'any') {
      const base = typeof props.min === 'number' ? props.min : 0
      const remainder = Math.abs((numericValue - base) % step)
      const epsilon = 1e-9
      if (remainder > epsilon && Math.abs(remainder - step) > epsilon) {
        validationError.value = `Value must align to step of ${step}.`
        return
      }
    }
  }

  const getValidationError = () => validationError.value

  // Vue Concept: Getter for pirate state (for styling and messages)
  const getIsPirateMode = () => {
    return isPirateMode.value
  }

  const getShowPirateMessage = () => {
    return showPirateMessage.value
  }

  // Vue: Return reactive values and functions for component use
  return {
    handleNumberInput,
    getCurrentDisplayValue,
    isValidNumber,
    getValidationError,
    getIsPirateMode,
    getShowPirateMessage
  }
}
