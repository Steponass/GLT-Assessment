<template>
  <div class="intro-container">
    <div class="intro-content">
      <header class="intro-header">
        <h1 class="intro-title">Skills Assessment</h1>
        <h6 class="intro-subtitle">
          Evaluate your abilities across multiple skill areas
        </h6>
      </header>

      <section class="intro-description">
        <p class="description-text">
          This comprehensive assessment evaluates your skills across seven key areas:
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
            The assessment contains 26 questions across 5 sections
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
  margin-block: var(--space-16-24px);
}


.skills-list {
  /* list-style: none; */
  list-style: decimal inside;
  margin-block: var(--space-8-12px) var(--space-24-32px);
}


.instructions-title {
  text-align: center;
}

.instructions-list {
  list-style: crown inside;
  margin-block: var(--space-8-12px) var(--space-24-32px);
}

@counter-style crown {
  system: cyclic;
  symbols: "\1F98B";
  suffix: " ";
  speak-as: bullets;
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
  @media (hover: hover)  {
    &:hover {
    background-color: var(--clr-stroke-strong);
  }
  }
}
</style>
