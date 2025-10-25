<template>
  <div class="intro-outro-container">
    <div class="intro-outro-content">
      <div class="intro-outro-title">
        <h1>Skill Assessment</h1>
        <h6>
          Evaluate your abilities across multiple skill areas
        </h6>
      </div>

      <section class="intro-description">
        <p class="description-text">
          This comprehensive assessment evaluates your skills across five key areas:
        </p>

        <ol class="skills-list">
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
            <strong>Data Analysis</strong> - Interpreting and analyzing information
          </li>
          <li class="skill-item">
            <strong>Situational Judgement</strong> - Decision-making in various scenarios
          </li>
        </ol>
      </section>

      <section class="intro-instructions">
        <h3 class="instructions-title">Instructions</h3>
        <ul class="instructions-list">
          <li class="instruction-item">
            The assessment contains {{ assessmentStore.totalQuestions }} questions across 5 sections
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
        <button class="start-button" @click="startAssessment" :disabled="isStarting">
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

    // Get the appropriate assessment route to navigate to
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

      // If all assessments are completed, go to summary
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
  list-style: inside;
  margin-block: var(--space-8-12px) var(--space-24-32px);
}



.intro-actions {
  text-align: center;
}

.start-button {
  border: none;
  cursor: pointer;
  background-color: var(--clr-primary);
  color: white;
  padding: var(--space-12px) var(--space-16px);
  transition: all 0.2s ease;
  margin-block-end: var(--space-32px);

  @media (hover: hover) {
    &:hover {
      background-color: var(--clr-stroke-strong);
    }
  }
}
</style>
