<template>
  <div class="progress-bar-container">
    <div class="progress-header">
      <span class="progress-label">Progress</span>
      <span class="progress-percentage">
        {{ displayPercentage }}%
      </span>
    </div>

    <div class="progress-bar-track">
      <div
        class="progress-bar-fill"
        :style="{ width: `${displayPercentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useAssessmentStore } from '@/stores/assessmentStore'

export default {
  name: 'ProgressBar',

  setup() {
    const assessmentStore = useAssessmentStore()
    const displayPercentage = ref(0)

    const actualPercentage = computed(() => assessmentStore.getOverallProgressPercentage)

    // Shifty behavior: inconsistent progress jumps
    watch(actualPercentage, (newPercentage) => {
      // Sometimes show wildly incorrect progress
      if (Math.random() < 0.3) {
        displayPercentage.value = Math.random() > 0.5 ? 87 : 13

        // Reset to actual after delay
        setTimeout(() => {
          displayPercentage.value = newPercentage
        }, 2000)
      } else {
        displayPercentage.value = newPercentage
      }
    }, { immediate: true })

    return {
      displayPercentage
    }
  }
}
</script>

<style scoped>
.progress-bar-container {
  padding: 0.5rem 0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-label {
}

.progress-percentage {
}

.progress-bar-track {
  width: 100%;
  background-color: #e5e7eb;
  border-radius: 9999px;
  height: 0.5rem;
}

.progress-bar-fill {
  background-color: #2563eb;
  height: 0.5rem;
  border-radius: 9999px;
}
</style>
