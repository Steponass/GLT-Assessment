<template>
  <div class="data-analysis-assessment">
    <h1 class="assessment-title">Data Analysis Assessment</h1>
    <p class="assessment-description">
      Analyze data patterns and evaluate the reliability of different information sources.
    </p>

    <form class="questions-container" @submit.prevent="handleSubmit">
      <!-- Question 1: Pirate Temperature Analysis -->
      <div class="question-block with-graph">
        <div class="question-header">
          <h2 class="question-number">1</h2>
          <div class="question-content">
            <div class="question-graph">
              <img src="/images/Pirates-and-global-warming.jpg"
                alt="Graph showing correlation between pirate population and global temperature"
                class="analysis-graph" />
            </div>
            <p class="question-text">
              Based on the pirate-temperature data, how many pirates do we need to bring global
              temperatures back to pre-industrial levels?
            </p>
          </div>
        </div>

        <div class="question-input">
          <!-- Vue Concept: Using InputNumber with pirate behavior -->
          <InputNumber v-model="answers.q1" behavior-kind="pirate" placeholder="Number of pirates needed"
            name="pirate-analysis" />
        </div>
      </div>

      <!-- Question 2: Height Difference Analysis -->
      <div class="question-block with-graph">
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

      <!-- Question 3: Data Reliability Categorization -->
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

// Initialize router and store
const router = useRouter()
const assessmentStore = useAssessmentStore()

// Vue Concept: Different answer types for different question types
// Q1: number or string (AARRRGH), Q2: string (radio)
const answers = reactive({
  q1: null, // Number input (will be replaced with "AARRRGH" by pirate behavior)
  q2: '', // Radio selection
})

// Vue Concept: Separate reactive state for drag & drop
// DragDrop needs object structure with categories as keys
// Use ref so v-model updates replace the object as needed by the component
const dataReliabilityAnswer = ref({
  Trustworthy: [],
  Questionable: [],
  Fiction: [],
})

// Vue Concept: Complex validation for mixed question types
// Each question type has different completion criteria
const allQuestionsAnswered = computed(() => {
  // Q1: Accept either number or "AARRRGH" pirate text
  const q1Complete = answers.q1 !== null && answers.q1 !== undefined && answers.q1 !== ''

  // Q2: Radio must be selected
  const q2Complete = answers.q2 !== ''

  // Q3: All items must be categorized
  const dragDropComplete = reliabilityDataPoints.every((item) =>
    Object.values(dataReliabilityAnswer.value).some((category) => category.includes(item)),
  )

  return q1Complete && q2Complete && dragDropComplete
})

// Vue Concept: Static data as reactive references
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
  'Social media engagement metrics',
  "Your step counter when you're driving",
  'Restaurant reviews that are exactly 5 stars or 1 star',
  'Your boss saying "We\'re like a family here"',
  'Your friend who "doesn\'t like drama"',
  'Terms and Conditions everyone "read and agreed to"',
]

// Form submission handler
const handleSubmit = () => {
  if (!allQuestionsAnswered.value) {
    console.log('Please complete all questions')
    return
  }

  // Vue Concept: Combine different answer formats for submission
  const completedAssessment = {
    pirateAnalysis: answers.q1,
    heightAnalysis: answers.q2,
    dataReliability: dataReliabilityAnswer.value,
  }

  console.log('Data Analysis Assessment Completed:', completedAssessment)

  // Persist answers and mark completed
  Object.entries(answers).forEach(([questionId, answer]) => {
    if (answer !== '' && answer !== null && answer !== undefined) {
      assessmentStore.saveAnswer('dataAnalysis', questionId, answer)
    }
  })
  // DragDrop modeled answer
  assessmentStore.saveAnswer('dataAnalysis', 'q3', dataReliabilityAnswer.value)
  assessmentStore.markAssessmentCompleted('dataAnalysis')

  // Navigate to next assessment
  router.push('/assessment/situational')
}
</script>

<style scoped>
.data-analysis-assessment {
  width: min(1200px, 95%);
  margin: 0 auto;
  padding-block: var(--space-12-16px);
}

.assessment-title {
  text-align: center;
  margin-bottom: var(--space-16-24px);
  font-size: var(--fontsize-h2);
  color: var(--clr-text-primary);
}

.assessment-description {
  text-align: center;
  margin-bottom: var(--space-24-32px);
  color: var(--clr-text-secondary);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.questions-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-32-48px);
}

.question-block {
  display: grid;
  gap: var(--space-16-24px);
  padding: var(--space-24-32px);
  border: 1px solid var(--clr-border-light);
  border-radius: 12px;
  background-color: var(--clr-background-secondary);
}

/* Vue Concept: Different layouts for different question types */

.question-block.drag-drop-question {
  grid-template-columns: 1fr;
}

.question-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-16px);
}

.question-number {
  font-size: var(--fontsize-h3);
  font-weight: bold;
  color: var(--clr-primary);
  margin: 0;
  flex-shrink: 0;
}

.question-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-16px);
  width: 100%;
}

.question-graph {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-12px);
}

.analysis-graph {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  border: 1px solid var(--clr-border-light);
  box-shadow: var(--shadow-elevation-1);
}

.question-text {
  font-size: var(--fontsize-body);
  line-height: 1.5;
  color: var(--clr-text-primary);
  margin: 0;
}

.question-input {
  justify-self: start;
  width: 100%;
  max-width: 400px;
}

/* Vue Concept: Special styling for drag-drop question */
.drag-drop-question .question-input {
  max-width: none;
  margin-top: var(--space-16px);
}

.submit-button {
  background-color: var(--clr-primary);
  color: white;
  padding: var(--space-12-16px) var(--space-32-48px);
  border: none;
  border-radius: var(--border-radius-small);
  font-size: var(--fontsize-body);
  cursor: pointer;
  transition: background-color 0.2s ease;
  align-self: center;
  margin-top: var(--space-24px);
}

.submit-button:hover:not(:disabled) {
  background-color: var(--clr-primary-dark);
}

.submit-button:disabled {
  background-color: var(--clr-background-disabled);
  cursor: not-allowed;
}

/* Vue Concept: Responsive design for different screen sizes */
@media (max-width: 768px) {
  .question-block.with-graph {
    grid-template-columns: 1fr;
  }

  .question-header {
    flex-direction: column;
    gap: var(--space-8px);
  }

  .question-number {
    align-self: flex-start;
  }

  .analysis-graph {
    max-height: 200px;
  }
}
</style>
