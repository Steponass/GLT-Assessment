<template>
  <div class="assessment">
    <h1 class="assessment-title">Personality Assessment</h1>
    <p class="assessment-description">
      Respond to each statement based on how much you agree or disagree.
    </p>

    <form class="questions-container" @submit.prevent="handleSubmit">
      <div v-for="(question, index) in questionsToDisplay" :key="question.id" class="question-block">
        <div class="question-header">
          <h2 class="question-number">{{ index + 1 }}</h2>
          <p class="question-text">{{ getQuestionText(question) }}</p>
        </div>

        <!-- Vue: v-model creates two-way binding automatically -->
        <InputRadio :ref="el => radioRefs[question.id] = el" v-model="answers[question.id]"
          :options="likertScaleOptions" :behavior-kind="question.behaviorKind" :name="`question-${question.id}`"
          class="question-input" />
      </div>

      <button type="submit" :disabled="!allQuestionsAnswered">
        Submit
      </button>
    </form>

  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAssessmentStore } from '@/stores/assessmentStore'
import InputRadio from '@/components/assessment/inputRadio/InputRadio.vue'

const router = useRouter()
const assessmentStore = useAssessmentStore()

const radioRefs = ref({})

// Vue: reactive() vs ref() for complex objects
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

// Vue: Computed properties for derived state
const allQuestionsAnswered = computed(() => {
  return Object.values(answers).every(answer => answer !== '')
})

const baseQuestions = [
  {
    id: 'q1',
    text: 'My life is not turning out the way I expected it to.',
    behaviorKind: 'regular'
  },
  {
    id: 'q2',
    text: 'People talk about me behind my back.',
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
    behaviorKind: 'regular'
  },
  {
    id: 'q5',
    text: 'I am easily manipulated by others.',
    alteredText: 'I am so weak that anyone can control me.',
    behaviorKind: 'shifty'
  }
]

const toxicQuestionFirstSubmission = reactive({
  q3: false, // Track if q3 (toxic) has been submitted once
})

const getQuestionText = (question) => {
  if (question.behaviorKind === 'toxic' && questionStates[question.id].hasBeenAnswered) {
    return question.alteredText || question.text
  }
  return question.text
}

const questionsToDisplay = computed(() => baseQuestions)

const likertScaleOptions = [
  { value: '1', text: 'Strongly Disagree' },
  { value: '2', text: 'Disagree' },
  { value: '3', text: 'Neutral' },
  { value: '4', text: 'Agree' },
  { value: '5', text: 'Strongly Agree' }
]

// Form submission handler
// Vue: Event handlers in Vue don't need useCallback optimization

const handleSubmit = () => {
  // Check if any toxic questions haven't had their first submission yet
  const hasPendingToxicFirstSubmission = baseQuestions.some(question => {
    if (question.behaviorKind === 'toxic') {
      return answers[question.id] !== '' && !toxicQuestionFirstSubmission[question.id]
    }
    return false
  })

  // If there are toxic questions that need their first submission trigger
  if (hasPendingToxicFirstSubmission) {
    clearToxicInputsAndChangeText()
    return
  }

  // Normal validation check for remaining questions
  if (!allQuestionsAnswered.value) {
    // This would only trigger if non-toxic questions are incomplete
    return
  }

  // Persist answers to store and mark section completed
  Object.entries(answers).forEach(([questionId, answer]) => {
    if (answer !== '') {
      assessmentStore.saveAnswer('personality', questionId, answer)
    }
  })
  assessmentStore.markAssessmentCompleted('personality')

  // All questions properly answered (including toxic after their reset)
  router.push('/assessment/numeracy')
}

const clearToxicInputsAndChangeText = () => {
  baseQuestions.forEach(question => {
    if (question.behaviorKind === 'toxic' && answers[question.id] !== '') {
      // Mark this toxic question as having had its first submission
      toxicQuestionFirstSubmission[question.id] = true

      // Clear the answer
      answers[question.id] = ''

      // Trigger question text change
      questionStates[question.id].hasBeenAnswered = true

      // Clear the radio component's internal state
      const radioComponent = radioRefs.value[question.id]
      if (radioComponent && radioComponent.clearToxicSelection) {
        radioComponent.clearToxicSelection()
      }
    }
  })
}

</script>

<style>
.question-number {
  font-size: var(--fontsize-h4);
}
</style>
