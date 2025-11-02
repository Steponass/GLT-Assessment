<template>
  <div class="intro-outro-container">
    <div class="intro-outro-content">
      <div class="intro-outro-title">
        <h1>Skill Assessment</h1>
      </div>

      <section class="intro-description">
        <p class="description-text">
          This comprehensive assessment evaluates your skills across five key areas:
        </p>

        <ol class="skills-list stack">
          <li>
            <strong>Personality:</strong> Understanding your work style and preferences
          </li>
          <li>
            <strong>Numeracy:</strong> Mathematical reasoning and problem solving
          </li>
          <li>
            <strong>Logic & Pattern Recognition:</strong> Abstract thinking abilities
          </li>
          <li>
            <strong>Data Analysis:</strong> Interpreting and analyzing information
          </li>
          <li>
            <strong>Situational Judgement:</strong> Decision-making in various scenarios
          </li>
        </ol>
      </section>

      <section class="intro-instructions">
        <h3 class="instructions-title">Instructions</h3>
        <ul class="instructions-list stack">
          <li>
            The assessment contains {{ assessmentStore.totalQuestions }} questions across 5 sections
          </li>
          <li>
            Sections must be completed in order
          </li>
          <li>
            Your progress will be automatically saved
          </li>
        </ul>
      </section>

      <div class="intro-actions">
        <button @click="startAssessment" :disabled="isStarting">
          {{ isStarting ? 'Starting...' : buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAssessmentStore } from '@/stores/assessmentStore'

export default {
  name: 'IntroView',

  setup() {
    const router = useRouter()
    const assessmentStore = useAssessmentStore()
    const isStarting = ref(false)

    // Check if assessment has been started (has any answers or start time)
    const hasStartedAssessment = computed(() => {
      return assessmentStore.assessmentStartTime !== null ||
        assessmentStore.getCompletedQuestionsCount > 0
    })

    // Button text based on assessment state
    const buttonText = computed(() => {
      return hasStartedAssessment.value ? 'Resume Assessment' : 'Begin Assessment'
    })

    // Get the right assessment route to navigate to
    const getAssessmentRoute = () => {
      if (!hasStartedAssessment.value) {
        return '/assessment/personality'
      }

      // Find the first incomplete assessment
      const assessmentOrder = ['personality', 'numeracy', 'logic', 'dataAnalysis', 'situational']
      const routeMap = {
        personality: '/assessment/personality',
        numeracy: '/assessment/numeracy',
        logic: '/assessment/logic',
        dataAnalysis: '/assessment/data-analysis',
        situational: '/assessment/situational'
      }

      for (const assessment of assessmentOrder) {
        if (!assessmentStore.assessmentProgress[assessment].completed) {
          return routeMap[assessment]
        }
      }

      // If all assessments completed, go to summary
      return '/summary'
    }

    const startAssessment = async () => {
      isStarting.value = true

      try {
        // Only start assessment if it hasn't been started before
        if (!hasStartedAssessment.value) {
          assessmentStore.startAssessment()
          assessmentStore.setCurrentAssessmentRoute('personality')
        }

        await new Promise(resolve => setTimeout(resolve, 500))

        const targetRoute = getAssessmentRoute()
        await router.push(targetRoute)
      } catch (error) {
        console.error('Failed to start assessment:', error)
        isStarting.value = false
      }
    }

    return {
      isStarting,
      startAssessment,
      assessmentStore,
      buttonText,
      hasStartedAssessment
    }
  }
}
</script>

<style scoped>
.intro-outro-container {
  display: flex;
  justify-content: center;
  padding-block: var(--space-8-12px);
  padding-inline: var(--space-16px);
}

.intro-outro-content {
  max-width: 67ch;
}

.intro-outro-title {
  text-align: center;
  margin-block: var(--space-16-24px);
}

.intro-outro-title h6 {
  margin-top: var(--space-12px);
  color: var(--clr-text-weak);
}

.intro-description,
.intro-instructions {
  padding-top: var(--space-12px);
}

.skills-list {
  list-style: decimal inside;
  margin-block: var(--space-8-12px) var(--space-24-32px);
}

.instructions-title {
  text-align: center;
}

.instructions-list {
  list-style: inside square;
  margin-block: var(--space-8-12px) var(--space-24-32px);
}

.intro-actions {
  text-align: center;
}
</style>
