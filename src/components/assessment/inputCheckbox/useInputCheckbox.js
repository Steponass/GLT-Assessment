import { ref, watch } from 'vue'

export function useInputCheckbox(props, emit) {
  // Vue: Array-based selectedValues for multiple selections
  // Unlike InputRadio's single selectedValue, checkboxes need array state
  const selectedValues = ref([...props.modelValue])
  const checkInteractionCount = ref(0)
  const timeoutIds = ref(new Map()) // Multiple simultaneous timeouts possible

  // Vue: Map-based state for efficient label management
  // Using Map provides O(1) lookups and easier state management than objects
  const labelStates = ref(new Map())
  const originalLabels = ref(new Map())

  // Initialize labels when options change
  const initializeLabels = () => {
    labelStates.value.clear()
    originalLabels.value.clear()
    props.options.forEach(option => {
      originalLabels.value.set(option.value, option.text)
      labelStates.value.set(option.value, option.text)
    })
  }

  // Vue: Sync with parent component's v-model
  // Watch for external changes and update internal state
  watch(() => props.modelValue, (newValue) => {
    selectedValues.value = [...newValue]
  }, { immediate: true })

  // Vue: Watch for options changes to reinitialize labels
  // Immediate: true runs on component mount
  watch(() => props.options, initializeLabels, { immediate: true })

  const handleCheckboxChange = (event) => {
    // Vue: Always preventDefault for manual state control
    // We control visual state through reactive selectedValues, not native input state
    event.preventDefault()

    const value = event.target.value
    const shouldBeChecked = !selectedValues.value.includes(value) // Toggle logic

    // Clear existing timeout for this specific checkbox
    if (timeoutIds.value.has(value)) {
      clearTimeout(timeoutIds.value.get(value))
      timeoutIds.value.delete(value)
    }

    switch (props.behaviorKind) {
      case 'regular':
        handleRegularBehavior(value, shouldBeChecked)
        break
      case 'shifty':
        handleShiftyBehavior(value, shouldBeChecked)
        break
      case 'toxic':
        handleToxicBehavior(value, shouldBeChecked)
        break
      default:
        handleRegularBehavior(value, shouldBeChecked)
    }
  }

  // Regular behavior: 0.5s delay before checkbox state change registers
  const handleRegularBehavior = (value, shouldBeChecked) => {
    const timeoutId = setTimeout(() => {
      updateSelectedValues(value, shouldBeChecked)
      timeoutIds.value.delete(value)
    }, 500)
    timeoutIds.value.set(value, timeoutId)
  }

  // Shifty behavior: First 2 checks get unchecked after 1s, then normal behavior
  const handleShiftyBehavior = (value, shouldBeChecked) => {
    if (checkInteractionCount.value < 2 && shouldBeChecked) {
      // First 2 times checking any box in the group - it will get unchecked after 1s
      updateSelectedValues(value, true) // Show checked immediately
      checkInteractionCount.value++

      const timeoutId = setTimeout(() => {
        updateSelectedValues(value, false) // Uncheck after 1s
        timeoutIds.value.delete(value)
      }, 800)
      timeoutIds.value.set(value, timeoutId)
    } else {
      // Normal behavior after 2 checks, or it's an uncheck
      updateSelectedValues(value, shouldBeChecked)
    }
  }

  // Toxic behavior: First 2 checks trigger permanent label swaps, then normal functionality
  const handleToxicBehavior = (value, shouldBeChecked) => {
    if (checkInteractionCount.value < 2 && shouldBeChecked) {
      // First 2 times checking any box in the group - swap labels permanently
      swapLabelsWithRandomOption(value)
      checkInteractionCount.value++
    }

    // Selection functionality works normally
    updateSelectedValues(value, shouldBeChecked)
  }

  // Vue Concept: Centralized state update function
  // Keeps selectedValues and parent v-model in sync
  const updateSelectedValues = (value, shouldBeChecked) => {
    let newValues = [...selectedValues.value]

    if (shouldBeChecked) {
      if (!newValues.includes(value)) {
        newValues.push(value)
      }
    } else {
      newValues = newValues.filter(v => v !== value)
    }

    selectedValues.value = newValues
    emit('update:modelValue', newValues)
  }

  // Toxic behavior helper: Permanently swap labels between triggered checkbox and random other
  const swapLabelsWithRandomOption = (triggeredValue) => {
    const otherOptions = props.options.filter(option => option.value !== triggeredValue)

    if (otherOptions.length > 0) {
      const randomOption = otherOptions[Math.floor(Math.random() * otherOptions.length)]

      // Get current labels for both checkboxes
      const triggeredCurrentLabel = labelStates.value.get(triggeredValue)
      const randomCurrentLabel = labelStates.value.get(randomOption.value)

      // Permanently swap the labels
      labelStates.value.set(triggeredValue, randomCurrentLabel)
      labelStates.value.set(randomOption.value, triggeredCurrentLabel)
    }
  }

  // Public API functions for component use

  // Get current display text for a checkbox (may be swapped in toxic mode)
  const getDisplayText = (value) => {
    return labelStates.value.get(value) || ''
  }

  // Check if a specific value is currently selected
  const isChecked = (value) => {
    return selectedValues.value.includes(value)
  }

  // Vue Concept: Return reactive values and functions for component use
  // All returned values will automatically trigger re-renders when they change
  return {
    selectedValues,
    handleCheckboxChange,
    getDisplayText,
    isChecked,
  }
}
