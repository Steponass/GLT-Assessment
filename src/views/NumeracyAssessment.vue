<template>
  <div class="numeracy-assessment">
    <h1 class="assessment-title">Numeracy Assessment</h1>
    <p class="assessment-description">
      Test your mathematical reasoning and problem-solving skills with these practical scenarios.
    </p>

    <form class="questions-container" @submit.prevent="handleSubmit">
      <div v-for="(question, index) in questionsToDisplay" :key="question.id" class="question-block"
        :class="{ 'checkbox-question': question.type === 'checkbox' }">
        <div class="question-header">
          <h2 class="question-number">{{ index + 1 }}</h2>
          <p class="question-text">{{ question.text }}</p>
        </div>

        <!-- Vue Concept: Dynamic component rendering based on question type -->
        <!-- Each question can use different input components based on its requirements -->
        <div class="question-input">
          <!-- Radio Button Questions -->
          <InputRadio v-if="question.type === 'radio'" v-model="answers[question.id]" :options="question.options"
            :behavior-kind="question.behaviorKind" :name="`question-${question.id}`" />

          <!-- Checkbox Questions -->
          <InputCheckbox v-else-if="question.type === 'checkbox'" v-model="answers[question.id]"
            :options="question.options" :behavior-kind="question.behaviorKind" :name="`question-${question.id}`" />

          <!-- Number Input Questions -->
          <InputNumber v-else-if="question.type === 'number'" v-model="answers[question.id]"
            :behavior-kind="question.behaviorKind" :name="`question-${question.id}`"
            :placeholder="question.placeholder || 'Number'" />
        </div>
      </div>

      <button type="submit" class="submit-button" :disabled="!allQuestionsAnswered">
        Submit
      </button>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAssessmentStore } from '@/stores/assessmentStore'
import InputRadio from '@/components/assessment/inputRadio/InputRadio.vue'
import InputCheckbox from '@/components/assessment/inputCheckbox/InputCheckbox.vue'
import InputNumber from '@/components/assessment/inputNumber/InputNumber.vue'

// Initialize router for navigation
const router = useRouter()
const assessmentStore = useAssessmentStore()

// Vue Concept: Different answer types for different question types
// Radio: string, Checkbox: array, Number: number
const answers = reactive({
  q1: '', // Radio
  q2: '', // Radio
  q3: [], // Checkbox
  q4: null, // Number
  q5: null, // Number
})

// Vue Concept: Complex validation for mixed question types
// Each question type has different "answered" criteria
const allQuestionsAnswered = computed(() => {
  return Object.entries(answers).every(([questionId, answer]) => {
    const question = baseQuestions.find(q => q.id === questionId)

    switch (question?.type) {
      case 'radio':
        return answer !== ''
      case 'checkbox':
        return Array.isArray(answer) && answer.length > 0
      case 'number':
        return answer !== null && answer !== undefined && !isNaN(answer)
      default:
        return false
    }
  })
})

// Vue Concept: Mixed question type data structure
// Each question specifies its component type and specific props
const baseQuestions = [
  {
    id: 'q1',
    type: 'radio',
    text: 'If Karen complains to 3 managers per day and each complaint takes 47 minutes, how many days until she becomes the manager?',
    options: [
      { value: 'never', text: 'Never' },
      { value: '47days', text: '47 days' },
      { value: 'already', text: 'She already is the manager' },
      { value: 'math-cannot', text: 'Mathematics cannot solve Karen' }
    ],
    behaviorKind: 'shifty'
  },
  {
    id: 'q2',
    type: 'radio',
    text: 'A train leaves Chicago at 3 PM traveling 60 mph. Another train leaves New York at 4 PM traveling 75 mph. When will you admit you don\'t care about these trains?',
    options: [
      { value: 'immediately', text: 'Immediately' },
      { value: 'after-therapy', text: 'After therapy' },
      { value: 'trains-sentience', text: 'When the trains achieve sentience' },
      { value: 'i-am-train', text: 'I am the train' }
    ],
    behaviorKind: 'regular'
  },
  {
    id: 'q3',
    type: 'checkbox',
    text: 'Check all the mathematical concepts that describe your love life:',
    options: [
      { value: 'imaginary', text: 'Imaginary numbers' },
      { value: 'infinite-loop', text: 'Infinite loop' },
      { value: 'undefined', text: 'Undefined' },
      { value: 'negative-correlation', text: 'Negative correlation' },
      { value: 'statistical-outlier', text: 'Statistical outlier' },
      { value: 'margin-error', text: 'Margin of error' },
      { value: 'null-hypothesis', text: 'Null hypothesis' },
      { value: 'exponential-decay', text: 'Exponential decay' },
      { value: 'random-variable', text: 'Random variable' }
    ],
    behaviorKind: 'toxic'
  },
  {
    id: 'q4',
    type: 'number',
    text: 'If "synergy" gets mentioned 14 times per meeting and you attend 6 meetings weekly, how many times monthly do you die inside?',
    behaviorKind: 'shifty'
  },
  {
    id: 'q5',
    type: 'number',
    text: 'You listen to coworker complaints for 45 minutes daily at your $28/hour salary. What\'s the weekly cost?',
    behaviorKind: 'shifty'
  }
]

// Vue Concept: Computed property for template data
const questionsToDisplay = computed(() => baseQuestions)

// Form submission handler
const handleSubmit = () => {
  if (!allQuestionsAnswered.value) {
    console.log('Please complete all questions')
    return
  }

  console.log('Numeracy Assessment Completed:', answers)
  // Persist answers to store and mark section completed
  Object.entries(answers).forEach(([questionId, answer]) => {
    if ((Array.isArray(answer) && answer.length > 0) || (!Array.isArray(answer) && answer !== '' && answer !== null && answer !== undefined)) {
      assessmentStore.saveAnswer('numeracy', questionId, answer)
    }
  })
  assessmentStore.markAssessmentCompleted('numeracy')
  router.push('/assessment/logic') // Navigate to next assessment
}
</script>

<style scoped>
.numeracy-assessment {
  width: min(1024px, 95%);
  margin: 0 auto;
  padding-block: var(--space-12-16px);
}

.assessment-title {
  text-align: center;
  margin-bottom: var(--space-16-24px);
  font-size: var(--fontsize-h2);
}

.assessment-description {
  text-align: center;
  margin-bottom: var(--space-24-32px);
  color: var(--clr-text-secondary, #666);
}

.questions-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-24-32px);
}

.question-block {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-16-24px);
  align-items: flex-start;
  padding: var(--space-16-24px);
  border: 1px solid var(--clr-border-light, #e0e0e0);
  border-radius: 8px;
  background-color: var(--clr-background-subtle, #fafafa);
}

/* Vue Concept: Dynamic styling based on question type */
/* Checkbox questions need more space due to vertical layout */
.checkbox-question {
  grid-template-columns: 1fr;
  gap: var(--space-12-16px);
}

.checkbox-question .question-input {
  justify-self: start;
  width: 100%;
}

.question-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-12px);
}

.question-number {
  font-size: var(--fontsize-h4);
  font-weight: bold;
  color: var(--clr-primary);
}

.question-text {}

.question-input {
  justify-self: end;
  min-width: 100px;
}

/* Vue Concept: Number input specific styling */
.question-input:has(input[type="number"]) {
  min-width: 200px;
}

.submit-button {
  align-self: center;
  background-color: var(--clr-primary);
  color: white;
  padding: var(--space-12-16px) var(--space-32-48px);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
</style>
