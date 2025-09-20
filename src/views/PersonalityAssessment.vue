<template>
  <div class="personality-assessment">
      <h1 class="assessment-title">Personality Assessment</h1>
      <p class="assessment-description">
        Please respond to each statement based on how much you agree or disagree.
      </p>

    <form class="questions-container" @submit.prevent="handleSubmit">
      <div
        v-for="(question, index) in questionsToDisplay"
        :key="question.id"
        class="question-block"
      >
        <div class="question-header">
          <h2 class="question-number">Question {{ index + 1 }}</h2>
          <p class="question-text">{{ question.text }}</p>
        </div>

        <div class="scale-labels">
          <span class="scale-label">Strongly Disagree</span>
          <span class="scale-label">Disagree</span>
          <span class="scale-label">Neutral</span>
          <span class="scale-label">Agree</span>
          <span class="scale-label">Strongly Agree</span>
        </div>

        <!-- Vue: v-model creates two-way binding automatically -->
        <!-- This is much simpler than React's value + onChange pattern -->
        <InputRadio
          v-model="answers[question.id]"
          :options="likertScaleOptions"
          :behavior-kind="question.behaviorKind"
          :name="`question-${question.id}`"
          class="question-input"
        />
      </div>

        <button
          type="submit"
          class="submit-button"
          :disabled="!allQuestionsAnswered"
        >
          Submit
        </button>
    </form>

  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import InputRadio from '@/components/assessment/inputRadio/InputRadio.vue'

// Initialize router for navigation
const router = useRouter()

// Vue Concept: reactive() vs ref() for complex objects
// reactive() is better for objects with multiple properties that change together
// ref() is better for primitives or when you need to replace the entire object
const answers = reactive({
  q1: '',
  q2: '',
  q3: '',
  q4: '',
  q5: ''
})

// Track which questions have been answered (for toxic behavior)
const questionStates = reactive({
  q1: { hasBeenAnswered: false },
  q2: { hasBeenAnswered: false },
  q3: { hasBeenAnswered: false },
  q4: { hasBeenAnswered: false },
  q5: { hasBeenAnswered: false }
})

// Vue Concept: Computed properties for derived state
// This automatically updates whenever answers change - no dependencies needed!
const allQuestionsAnswered = computed(() => {
  return Object.values(answers).every(answer => answer !== '')
})

const baseQuestions = [
  {
    id: 'q1',
    text: 'My life is not turning out the way I expected it to.',
    alteredText: 'My life is a complete disappointment and failure.',
    behaviorKind: 'regular' // You can change these as needed
  },
  {
    id: 'q2',
    text: 'People talk about me behind my back.',
    alteredText: 'Everyone gossips about how pathetic I am.',
    behaviorKind: 'shifty'
  },
  {
    id: 'q3',
    text: 'I sometimes waste time.',
    alteredText: 'I waste everyone\'s time.',
    behaviorKind: 'toxic'
  },
  {
    id: 'q4',
    text: 'I am uncertain of my worth.',
    alteredText: 'I am completely worthless and everyone knows it.',
    behaviorKind: 'regular'
  },
  {
    id: 'q5',
    text: 'I am easily manipulated by others.',
    alteredText: 'I am so weak that anyone can control me.',
    behaviorKind: 'toxic' // Another toxic question for demonstration
  }
]

// Vue: Computed property that depends on multiple reactive sources
const questionsToDisplay = computed(() => {
  return baseQuestions.map(question => {
    // For toxic questions, show altered text after the user has answered
    if (question.behaviorKind === 'toxic' && answers[question.id] !== '') {
      return {
        ...question,
        text: question.alteredText
      }
    }
    return question
  })
})

// Likert scale options (1-5 scale as specified)
const likertScaleOptions = [
  { value: '1', text: '1' },
  { value: '2', text: '2' },
  { value: '3', text: '3' },
  { value: '4', text: '4' },
  { value: '5', text: '5' }
]

// Form submission handler
// Vue Concept: Event handlers in Vue don't need useCallback optimization
const handleSubmit = () => {
  // Redirect to numeracy assessment - this is a fake form so no data processing needed
  router.push('/assessment/numeracy')
}

// Vue Concept: Watchers for side effects
// We can watch for answer changes to update question states

// Watch for changes in answers to track which questions have been answered
watch(answers, (newAnswers) => {
  Object.keys(newAnswers).forEach(questionId => {
    if (newAnswers[questionId] !== '' && !questionStates[questionId].hasBeenAnswered) {
      questionStates[questionId].hasBeenAnswered = true
    }
  })
}, { deep: true }) // deep: true watches nested properties in objects
</script>

<style scoped>
.personality-assessment {
  width: min (1024px, 95%);
  margin: 0 auto;
  padding: 2rem;
}

.assessment-title {
  margin-bottom: 1rem;
}

.assessment-description {
}

.questions-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.question-block {
}

.question-header {
  margin-bottom: 1.5rem;
}

.question-number {
}

.question-text {
}

.scale-labels {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
  text-align: center;
}

.scale-label {
}

.question-input {
  margin-top: 1rem;
}

.submit-button {
  background-color: var(--clr-primary);
  color: white;
  padding: var(--space-12-16px) var(--space-32-48px);
  border: none;
  cursor: pointer;
}

</style>
