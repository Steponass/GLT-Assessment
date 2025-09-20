<template>
  <div class="timer-container">
    <div class="timer-display">
      <span class="timer-label">Time:</span>
      <span class="timer-value">{{ formattedTime }}</span>
    </div>

    <div v-if="showManipulativeMessage" class="timer-message">
      {{ manipulativeMessage }}
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAssessmentStore } from '@/stores/assessmentStore'

export default {
  name: 'AssessmentTimer',

  setup() {
    const assessmentStore = useAssessmentStore()
    const currentTime = ref(0)
    const timerInterval = ref(null)
    const showManipulativeMessage = ref(false)
    const messageTimeout = ref(null)

    const formattedTime = computed(() => {
      const minutes = Math.floor(currentTime.value / 60)
      const seconds = currentTime.value % 60
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    })

    const manipulativeMessage = computed(() => {
      const percentage = Math.floor(Math.random() * 20) + 75 // 75-95%
      return `${percentage}% of applicants completed sooner than ${formattedTime.value}`
    })

    const calculateTimerSpeed = () => {
      const progressPercentage = assessmentStore.getOverallProgressPercentage

      // Timer gets quicker as assessment progresses (shifty behavior)
      if (progressPercentage > 75) {
        return 800 // Much faster
      } else if (progressPercentage > 50) {
        return 900 // Faster
      } else if (progressPercentage > 25) {
        return 950 // Slightly faster
      }

      return 1000 // Normal speed
    }

    const startTimer = () => {
      const updateTimer = () => {
        currentTime.value++

        // Show manipulative message occasionally
        if (currentTime.value > 30 && Math.random() < 0.02) {
          showManipulativeMessage.value = true

          if (messageTimeout.value) {
            clearTimeout(messageTimeout.value)
          }

          messageTimeout.value = setTimeout(() => {
            showManipulativeMessage.value = false
          }, 5000)
        }

        // Restart timer with new speed (shifty behavior)
        const newSpeed = calculateTimerSpeed()
        clearInterval(timerInterval.value)
        timerInterval.value = setInterval(updateTimer, newSpeed)
      }

      timerInterval.value = setInterval(updateTimer, calculateTimerSpeed())
    }

    const stopTimer = () => {
      if (timerInterval.value) {
        clearInterval(timerInterval.value)
        timerInterval.value = null
      }

      if (messageTimeout.value) {
        clearTimeout(messageTimeout.value)
        messageTimeout.value = null
      }
    }

    onMounted(() => {
      if (assessmentStore.assessmentStartTime) {
        const elapsed = Math.floor((Date.now() - assessmentStore.assessmentStartTime) / 1000)
        currentTime.value = elapsed
      }

      startTimer()
    })

    onUnmounted(() => {
      stopTimer()
    })

    return {
      formattedTime,
      showManipulativeMessage,
      manipulativeMessage
    }
  }
}
</script>

<style scoped>
.timer-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: relative;
}

.timer-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.timer-label {
}

.timer-value {
  min-width: 4rem;
  text-align: right;
}

.timer-message {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  color: #92400e;
  white-space: nowrap;
  animation: slideIn 0.3s ease-out;
  z-index: 10;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
