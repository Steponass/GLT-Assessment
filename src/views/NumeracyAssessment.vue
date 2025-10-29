<template>
  <div class="assessment">
    <h1 class="assessment-title">Numeracy Assessment</h1>
    <p class="assessment-description">
      Test your mathematical reasoning and problem-solving skills.
    </p>

    <form class="questions-container" @submit.prevent="handleSubmit">
      <div v-for="(question, index) in questionsToDisplay" :key="question.id" class="question-block">
        <div class="question-header">
          <h2 class="question-number">{{ index + 1 }}</h2>
          <p class="question-text">{{ question.text }}</p>
        </div>

        <div class="question-input">
          <InputRadio v-if="question.type === 'radio'" v-model="answers[question.id]" :options="question.options"
            :behavior-kind="question.behaviorKind" :name="`question-${question.id}`" />

          <InputCheckbox v-else-if="question.type === 'checkbox'" v-model="answers[question.id]"
            :options="question.options" :behavior-kind="question.behaviorKind" :name="`question-${question.id}`" />

          <InputNumber v-else-if="question.type === 'number'" v-model="answers[question.id]"
            :behavior-kind="question.behaviorKind" :name="`question-${question.id}`"
            :placeholder="question.placeholder || 'Number'" />
        </div>
      </div>

      <button type="submit" :disabled="!allQuestionsAnswered">
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

const router = useRouter()
const assessmentStore = useAssessmentStore()

const answers = reactive({
  q1: '', // Radio
  q2: '', // Radio
  q3: [], // Checkbox
  q4: null, // Number
  q5: null, // Number
})

// Vue: Complex validation for mixed question types
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

// Vue: Mixed question type data structure
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

// Vue: Computed property for template data
const questionsToDisplay = computed(() => baseQuestions)

const handleSubmit = () => {
  if (!allQuestionsAnswered.value) {
    return
  }

  // Persist answers to store and mark section completed
  Object.entries(answers).forEach(([questionId, answer]) => {
    if ((Array.isArray(answer) && answer.length > 0) || (!Array.isArray(answer) && answer !== '' && answer !== null && answer !== undefined)) {
      assessmentStore.saveAnswer('numeracy', questionId, answer)
    }
  })
  assessmentStore.markAssessmentCompleted('numeracy')
  router.push('/assessment/logic')
}
</script>

<style scoped>

</style>
