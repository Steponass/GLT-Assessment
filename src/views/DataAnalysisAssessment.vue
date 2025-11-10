<template>
  <div class="assessment">
    <h1 class="assessment-title">Data Analysis Assessment</h1>
    <p class="assessment-description">
      Lick that data clean off that table.
    </p>

    <form class="questions-container" @submit.prevent="handleSubmit">
      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">1</h2>
          <div class="question-content">
            <div class="question-graph">
              <img src="/images/Pirates-and-global-warming.jpg"
                alt="Graph showing correlation between pirate population and global temperature"
                class="analysis-graph" />
            </div>
            <p class="question-text">
              Based on the pirate-temperature data, how many pirates do we need to bring global temperatures back to pre-industrial levels?
            </p>
          </div>
        </div>

        <div class="question-input">
          <InputNumber v-model="answers.q1" behavior-kind="pirate" placeholder="Number of pirates needed"
            name="pirate-analysis" />
        </div>
      </div>

      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">2</h2>
          <div class="question-content">
            <div class="question-graph">
              <img src="/images/Female-height.webp"
                alt="Graph comparing female heights between different countries including Latvia and India"
                class="analysis-graph" />
            </div>
            <p class="question-text">The height difference between Latvia and India suggests:</p>
          </div>
        </div>

        <div class="question-input">
          <InputRadio v-model="answers.q2" :options="heightAnalysisOptions" behavior-kind="shifty"
            name="height-analysis" />
        </div>
      </div>

      <div class="question-block drag-drop-question">
        <div class="question-header">
          <h2 class="question-number">3</h2>
          <p class="question-text">Categorize these data points by reliability:</p>
        </div>

        <div class="question-input">
          <DragDrop v-model="dataReliabilityAnswer" :items="reliabilityDataPoints" :categories="reliabilityCategories"
            behavior-kind="shifty" />
        </div>
      </div>

      <button type="submit" class="submit-button" :disabled="!allQuestionsAnswered">
        Continue to Behavioral Assessment
      </button>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAssessmentStore } from '@/stores/assessmentStore'
import InputRadio from '@/components/assessment/inputRadio/InputRadio.vue'
import InputNumber from '@/components/assessment/inputNumber/InputNumber.vue'
import DragDrop from '@/components/assessment/dragDrop/DragDrop.vue'

const router = useRouter()
const assessmentStore = useAssessmentStore()

const answers = reactive({
  q1: null, // Number input (will be replaced with "ARRRGH")
  q2: '', // Radio selection
})

// Vue: Separate reactive state for drag & drop
// DragDrop needs object structure with categories as keys
// Use ref so v-model updates replace the object as needed by the component
const dataReliabilityAnswer = ref({
  Trustworthy: [],
  Questionable: [],
  Fiction: [],
})

const allQuestionsAnswered = computed(() => {
  const q1Complete = answers.q1 !== null && answers.q1 !== undefined && answers.q1 !== ''

  const q2Complete = answers.q2 !== ''

  // Q3: All items must be categorized
  const dragDropComplete = reliabilityDataPoints.every((item) =>
    Object.values(dataReliabilityAnswer.value).some((category) => category.includes(item)),
  )

  return q1Complete && q2Complete && dragDropComplete
})

// Vue: Static data as reactive references
// Options for Question 2 - Height Analysis
const heightAnalysisOptions = [
  { value: 'doorways', text: 'India saves money on doorways' },
  { value: 'gravity', text: 'Different gravitational fields' },
  { value: 'wifi', text: 'Latvia has better Wi-Fi reception' },
  { value: 'genetics-nutrition', text: 'Impacts of genetics and nutrition' },
]

// Categories for Question 3 - Data Reliability
const reliabilityCategories = ['Trustworthy', 'Questionable', 'Fiction']

// Data points to categorize for Question 3
const reliabilityDataPoints = [
  'Your screen time report',
  'Calorie counts on restaurant menus',
  'Dating app user photos',
  'Your boss saying “We\'re like a family here”',
  'Social media engagement metrics',
  "Your step counter when you're driving",
  'Restaurant reviews that are exactly 5 stars or 1 star',
  'Your friend who "doesn\'t like drama"',
  'Terms and Conditions everyone “read and agreed to”',
]

const handleSubmit = () => {
  if (!allQuestionsAnswered.value) {
    console.log('Please complete all questions')
    return
  }

  // Persist answers and mark completed
  Object.entries(answers).forEach(([questionId, answer]) => {
    if (answer !== '' && answer !== null && answer !== undefined) {
      assessmentStore.saveAnswer('dataAnalysis', questionId, answer)
    }
  })
  // DragDrop modeled answer
  assessmentStore.saveAnswer('dataAnalysis', 'q3', dataReliabilityAnswer.value)
  assessmentStore.markAssessmentCompleted('dataAnalysis')

  router.push('/assessment/situational')
}
</script>

<style scoped>
.question-block.drag-drop-question {
  grid-template-columns: 1fr;
}

.question-graph {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-12px);
  width: min(800px, 100%);
}

.drag-drop-question .question-input {
  max-width: none;
  margin-top: var(--space-16px);
}

@media (max-width: 768px) {

  .analysis-graph {
    max-height: 300px;
  }
}
</style>
