import { ref, reactive } from 'vue'

export function useDragDrop(props, emit) {
  // Vue Concept: Reactive state management
  const draggingItem = ref(null)
  const dragOverCategory = ref(null)
  const isDragOverPool = ref(false)
  const shiftyHighlightCategory = ref(null)
  const screenReaderAnnouncement = ref('')

  // Shifty behavior tracking
  const categoryPlacementCounts = reactive({})
  const shiftyTimeoutId = ref(null)

  // Initialize placement counts for each category
  props.categories.forEach(category => {
    categoryPlacementCounts[category] = 0
  })

  // Vue Concept: Drag event handlers
  const handleDragStart = (draggedItem) => {
    draggingItem.value = draggedItem
    announceToScreenReader(`Picked up ${draggedItem}`)
  }

  const handleDragEnd = () => {
    draggingItem.value = null
    dragOverCategory.value = null
    isDragOverPool.value = false

    // Clear any pending shifty timeouts
    if (shiftyTimeoutId.value) {
      clearTimeout(shiftyTimeoutId.value)
      shiftyTimeoutId.value = null
    }
  }

  const handleDragOverCategory = (category) => {
    if (draggingItem.value) {
      dragOverCategory.value = category
    }
  }

  const handleDragLeaveCategory = (category) => {
    if (dragOverCategory.value === category) {
      dragOverCategory.value = null
    }
  }

  const handleDragOverPool = () => {
    if (draggingItem.value) {
      isDragOverPool.value = true
    }
  }

  const handleDragLeavePool = () => {
    isDragOverPool.value = false
  }

  const handleDropToCategory = (dropEvent, category) => {
    dropEvent.preventDefault()

    const droppedItem = dropEvent.dataTransfer.getData('text/plain')
    if (!droppedItem || !draggingItem.value) return

    // Create new model value with item added to category
    const newModelValue = { ...props.modelValue }

    // Remove item from all categories first
    Object.keys(newModelValue).forEach(cat => {
      newModelValue[cat] = newModelValue[cat].filter(existingItem => existingItem !== droppedItem)
    })

    // Add item to target category
    newModelValue[category] = [...newModelValue[category], droppedItem]

    // Emit update
    emit('update:modelValue', newModelValue)

    // Handle shifty behavior
    if (props.behaviorKind === 'shifty') {
      handleShiftyBehavior(category, droppedItem, newModelValue)
    }

    // Reset drag state
    dragOverCategory.value = null
    announceToScreenReader(`Dropped ${droppedItem} into ${category}`)
  }

  const handleDropToPool = (poolDropEvent) => {
    poolDropEvent.preventDefault()

    const returnedItem = poolDropEvent.dataTransfer.getData('text/plain')
    if (!returnedItem || !draggingItem.value) return

    // Create new model value with item removed from all categories
    const newModelValue = { ...props.modelValue }

    Object.keys(newModelValue).forEach(cat => {
      newModelValue[cat] = newModelValue[cat].filter(existingItem => existingItem !== returnedItem)
    })

    emit('update:modelValue', newModelValue)

    isDragOverPool.value = false
    announceToScreenReader(`Returned ${returnedItem} to available items`)
  }

  // Vue Concept: Shifty behavior implementation
  const handleShiftyBehavior = (targetCategory, movedItem, currentModelValue) => {
    // Increment placement count for this category
    categoryPlacementCounts[targetCategory]++

    // Check if this is the 3rd item placed in this category
    if (categoryPlacementCounts[targetCategory] % 3 === 0) {
      // Reset counter for this category
      categoryPlacementCounts[targetCategory] = 0

      // Find a different random category
      const otherCategories = props.categories.filter(cat => cat !== targetCategory)
      if (otherCategories.length === 0) return

      const randomCategory = otherCategories[Math.floor(Math.random() * otherCategories.length)]

      // Highlight the category that will receive the item
      shiftyHighlightCategory.value = randomCategory

      // Move item after 200ms
      shiftyTimeoutId.value = setTimeout(() => {
        const shiftyModelValue = { ...currentModelValue }

        // Remove item from target category
        shiftyModelValue[targetCategory] = shiftyModelValue[targetCategory].filter(existingItem => existingItem !== movedItem)

        // Add to random category
        shiftyModelValue[randomCategory] = [...shiftyModelValue[randomCategory], movedItem]

        emit('update:modelValue', shiftyModelValue)

        // Clear highlight
        shiftyHighlightCategory.value = null

        announceToScreenReader(`${movedItem} moved automatically to ${randomCategory}`)
      }, 200)
    }
  }

  // Vue Concept: Screen reader accessibility
  const announceToScreenReader = (message) => {
    screenReaderAnnouncement.value = message

    // Clear announcement after a short delay to allow for new announcements
    setTimeout(() => {
      if (screenReaderAnnouncement.value === message) {
        screenReaderAnnouncement.value = ''
      }
    }, 1000)
  }

  // Vue Concept: Return reactive values and functions for component use
  return {
    draggingItem,
    dragOverCategory,
    isDragOverPool,
    shiftyHighlightCategory,
    screenReaderAnnouncement,
    handleDragStart,
    handleDragEnd,
    handleDragOverCategory,
    handleDragLeaveCategory,
    handleDragOverPool,
    handleDragLeavePool,
    handleDropToCategory,
    handleDropToPool
  }
}
