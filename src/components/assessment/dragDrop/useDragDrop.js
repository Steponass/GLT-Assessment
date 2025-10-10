import { ref, reactive } from 'vue'

export function useDragDrop(props, emit) {
  // Track which item is currently being dragged (for visuals/ARIA)
  const draggingItem = ref(null)
  const dragOverCategory = ref(null)
  const isDragOverPool = ref(false)
  const shiftyHighlightCategory = ref(null)
  const screenReaderAnnouncement = ref('')

  // Shifty behavior tracking
  const categoryPlacementCounts = reactive({})
  const totalDropCount = ref(0)
  const shiftyTimeoutId = ref(null)

  // Initialize placement counts for each category
  props.categories.forEach(category => {
    categoryPlacementCounts[category] = 0
  })

  // Drag event handlers
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
    dragOverCategory.value = category
  }

  const handleDragLeaveCategory = (category) => {
    if (dragOverCategory.value === category) {
      dragOverCategory.value = null
    }
  }

  const handleDragOverPool = () => {
    isDragOverPool.value = true
  }

  const handleDragLeavePool = () => {
    isDragOverPool.value = false
  }

  const handleDropToCategory = (dropEvent, category) => {
    dropEvent.preventDefault()

    const droppedItem = dropEvent.dataTransfer.getData('text/plain')
    if (!droppedItem) return

    // Create completely new model with deep array copies
    const newModelValue = {}

    // Initialize all categories with filtered arrays (removes item from all categories)
    props.categories.forEach(cat => {
      newModelValue[cat] = [...props.modelValue[cat].filter(item => item !== droppedItem)]
    })

    // Add item to target category
    newModelValue[category] = [...newModelValue[category], droppedItem]

    // Emit the complete new model
    emit('update:modelValue', newModelValue)

    // Handle shifty behavior
    if (props.behaviorKind === 'shifty') {
      handleShiftyBehavior(category, droppedItem, newModelValue)
    }

    // Reset visual state
    dragOverCategory.value = null
    draggingItem.value = null
    announceToScreenReader(`Dropped ${droppedItem} into ${category}`)
  }

  const handleDropToPool = (poolDropEvent) => {
    poolDropEvent.preventDefault()

    const returnedItem = poolDropEvent.dataTransfer.getData('text/plain')
    if (!returnedItem) return

    // Create new model with item removed from all categories
    const newModelValue = {}

    props.categories.forEach(cat => {
      newModelValue[cat] = [...props.modelValue[cat].filter(item => item !== returnedItem)]
    })

    emit('update:modelValue', newModelValue)

    isDragOverPool.value = false
    draggingItem.value = null
    announceToScreenReader(`Returned ${returnedItem} to available items`)
  }

  // Shifty behavior implementation
  const handleShiftyBehavior = (targetCategory, movedItem, currentModelValue) => {
    // Increment global drop count
    totalDropCount.value++

    // On every 3rd drop globally, relocate the item to a different random category
    if (totalDropCount.value % 3 !== 0) return

    // Find a different random category
    const otherCategories = props.categories.filter(cat => cat !== targetCategory)
    if (otherCategories.length === 0) return

    const randomCategory = otherCategories[Math.floor(Math.random() * otherCategories.length)]

    // Highlight the category that will receive the item
    shiftyHighlightCategory.value = randomCategory

    // Move item after 200ms
    shiftyTimeoutId.value = setTimeout(() => {
      const shiftyModelValue = {}

      // Create new model with deep copies
      props.categories.forEach(cat => {
        if (cat === targetCategory) {
          // Remove item from target category
          shiftyModelValue[cat] = [...currentModelValue[cat].filter(item => item !== movedItem)]
        } else if (cat === randomCategory) {
          // Add item to random category
          shiftyModelValue[cat] = [...currentModelValue[cat], movedItem]
        } else {
          // Copy other categories as-is
          shiftyModelValue[cat] = [...currentModelValue[cat]]
        }
      })

      emit('update:modelValue', shiftyModelValue)

      // Clear highlight
      shiftyHighlightCategory.value = null

      announceToScreenReader(`${movedItem} moved automatically to ${randomCategory}`)
    }, 200)
  }

  // Screen reader accessibility
  const announceToScreenReader = (message) => {
    screenReaderAnnouncement.value = message

    // Clear announcement after a short delay to allow for new announcements
    setTimeout(() => {
      if (screenReaderAnnouncement.value === message) {
        screenReaderAnnouncement.value = ''
      }
    }, 1000)
  }

  // Return reactive values and functions for component use
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