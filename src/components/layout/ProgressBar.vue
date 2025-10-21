<template>
  <div class="progress-bar-container">
    <div class="progress-bar-track">
      <div class="progress-bar-fill" :style="{ width: `${percentage}%` }">
        <div class="progress-header">
      <span class="progress-label">Progress</span>
      <span class="progress-percentage">{{ percentage }}%</span>
    </div>
      
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAssessmentStore } from '@/stores/assessmentStore'

export default {
  name: 'ProgressBar',

  setup() {
    const assessmentStore = useAssessmentStore()
    const percentage = computed(() => {
      const raw = Number(assessmentStore.getOverallProgressPercentage || 0)
      if (Number.isNaN(raw)) return 0
      if (raw < 0) return 0
      if (raw > 100) return 100
      return raw
    })

    return {
      percentage
    }
  }
}
</script>

<style scoped>

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.progress-bar-track {
  width: 100%;
  background-color: var(--clr-secondary);
  height: var(--space-24px);
}

.progress-bar-fill {
  background-color: var(--clr-primary);
  height: var(--space-24px);
  transition: width 0.3s ease;
}
</style>
