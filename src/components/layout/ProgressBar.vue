<template>
  <div class="progress-bar-container">
    <div class="progress-bar-track">
      <div class="progress-bar-fill" :style="{ width: `${percentage}%` }">
        <p class="progress-bar-text">Progress&nbsp;{{ percentage }}%</p>
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
.progress-bar-container {
  opacity: 1;
  transition: opacity 0.8s ease;
  @starting-style {
    opacity: 0;
  }
}

.progress-bar-track {
  width: 100%;
  background-color: var(--clr-secondary);
  height: var(--space-32px);
  align-content: center;
}

.progress-bar-fill {
  background-color: var(--clr-primary);
  display: flex;
  color: white;
  padding-block: 4px;
  transition: width 0.3s ease;
  border-radius: 0 4px 4px 0;
}

.progress-bar-text {
  margin-left: 16px;
}
</style>
