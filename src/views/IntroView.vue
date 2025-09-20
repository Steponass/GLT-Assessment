<template>
  <div class="intro-container">
    <div class="intro-content">
      <header class="intro-header">
        <h1 class="intro-title">Skills Assessment</h1>
        <p class="intro-subtitle">
          Evaluate your abilities across multiple skill areas
        </p>
      </header>

      <section class="intro-description">
        <p class="description-text">
          This comprehensive assessment evaluates your skills across seven key areas:
        </p>

        <ul class="skills-list">
          <li class="skill-item">
            <strong>Personality</strong> - Understanding your work style and preferences
          </li>
          <li class="skill-item">
            <strong>Numeracy</strong> - Mathematical reasoning and problem solving
          </li>
          <li class="skill-item">
            <strong>Logic & Pattern Recognition</strong> - Abstract thinking abilities
          </li>
          <li class="skill-item">
            <strong>Literacy & Communication</strong> - Reading comprehension and verbal skills
          </li>
          <li class="skill-item">
            <strong>Data Analysis</strong> - Interpreting and analyzing information
          </li>
          <li class="skill-item">
            <strong>Situational Judgement</strong> - Decision-making in various scenarios
          </li>
        </ul>
      </section>

      <section class="intro-instructions">
        <h2 class="instructions-title">Instructions</h2>
        <ul class="instructions-list">
          <li class="instruction-item">
            The assessment contains 32 questions across 7 sections
          </li>
          <li class="instruction-item">
            You can navigate freely within each section
          </li>
          <li class="instruction-item">
            Sections must be completed in order
          </li>
          <li class="instruction-item">
            Your progress will be automatically saved
          </li>
        </ul>
      </section>

      <div class="intro-actions">
        <button
          class="start-button"
          @click="startAssessment"
          :disabled="isStarting"
        >
          {{ isStarting ? 'Starting...' : 'Begin Assessment' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAssessmentStore } from '@/stores/assessmentStore'

export default {
  name: 'IntroView',

  setup() {
    const router = useRouter()
    const assessmentStore = useAssessmentStore()
    const isStarting = ref(false)

    const startAssessment = async () => {
      isStarting.value = true

      try {
        assessmentStore.startAssessment()
        assessmentStore.setCurrentAssessmentRoute('personality')

        await new Promise(resolve => setTimeout(resolve, 500))

        await router.push('/assessment/personality')
      } catch (error) {
        console.error('Failed to start assessment:', error)
        isStarting.value = false
      }
    }

    return {
      isStarting,
      startAssessment
    }
  }
}
</script>

<style scoped>
.intro-container {
  display: flex;
  justify-content: center;
}

.intro-content {
  max-width: 42rem;
  width: 100%;
}

.intro-header {
  text-align: center;
}

.intro-title {
  margin: 0;
}

.intro-subtitle {
  margin: 0;
}

.skills-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.instructions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.intro-actions {
  text-align: center;
}

.start-button {
  border: none;
  cursor: pointer;
}

.start-button:disabled {
  cursor: not-allowed;
}
</style>
