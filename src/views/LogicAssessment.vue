<template>
  <div class="assessment">
    <h1 class="assessment-title">Logic & Pattern Recognition</h1>
    <p class="assessment-description">
      Just get on with it, Einstein.
    </p>

    <form class="questions-container" @submit.prevent="handleSubmit">
      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">1</h2>
          <p class="question-text">
            Meeting productivity sequence: 100%, 73%, 46%, 19%, ?
          </p>
        </div>

        <InputNumber v-model="answers.q1" :behavior-kind="getQuestionBehavior('q1')" placeholder=""
          class="question-input" />
      </div>

      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">2</h2>
          <p class="question-text">
            Check all the logical fallacies you use daily:
          </p>
        </div>

        <InputCheckbox v-model="answers.q2" :options="logicalFallaciesOptions"
          :behavior-kind="getQuestionBehavior('q2')" name="logical-fallacies" class="question-input" />
      </div>

      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">3</h2>
          <p class="question-text">
            Which doesn't belong:
          </p>
        </div>

        <InputRadio v-model="answers.q3" :options="oddOneOutOptions" :behavior-kind="getQuestionBehavior('q3')"
          name="odd-one-out" class="question-input" />
      </div>

      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">4</h2>
          <p class="question-text">
            If you speak up in meetings, you're "difficult." If you stay quiet, you're "not engaged." Therefore, you
            are…
          </p>
        </div>

        <InputText v-model="answers.q4" behavior-kind="toxic" :toxic-replacements="paradoxAutocompleteOptions"
          placeholder="Complete the logic…" class="question-input" />
      </div>

      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">5</h2>
          <p class="question-text">
            Mandatory fun is to enjoyment as team building is to:
          </p>
        </div>

        <InputRadio v-model="answers.q5" :options="analogyOptions" :behavior-kind="getQuestionBehavior('q5')"
          name="analogy" class="question-input" />
      </div>

      <button type="submit" class="submit-button" :disabled="!allQuestionsAnswered">
        Submit Yourself
      </button>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAssessmentStore } from '@/stores/assessmentStore'
import InputRadio from '@/components/assessment/inputRadio/InputRadio.vue'
import InputText from '@/components/assessment/inputText/InputText.vue'
import InputNumber from '@/components/assessment/inputNumber/InputNumber.vue'
import InputCheckbox from '@/components/assessment/inputCheckbox/InputCheckbox.vue'

const router = useRouter()
const assessmentStore = useAssessmentStore()

const answers = reactive({
  q1: null,
  q2: [],
  q3: '',
  q4: '',
  q5: ''
})

// Question behavior patterns - mixing different behaviors for testing
const questionBehaviors = {
  q1: 'shifty',    // Pattern recognition with delay
  q2: 'shifty',     // Logical fallacies with shifting selections
  q3: 'shifty',    // Odd one out with delay
  q4: 'toxic',      // Paradox with autocomplete (uses InputText toxic behavior)
  q5: 'shifty'     // Analogy with delay
}

// Vue: Computed property for form validation
const allQuestionsAnswered = computed(() => {
  return (
    answers.q1 !== null && answers.q1 !== undefined && !isNaN(answers.q1) &&
    Array.isArray(answers.q2) && answers.q2.length > 0 &&
    answers.q3 !== '' &&
    answers.q4 !== '' &&
    answers.q5 !== ''
  )
})

// Helper function to get behavior for each question
// INCONSISTENT WITH PREVIOUS 2 ASS.ESSMENTS
const getQuestionBehavior = (questionId) => {
  return questionBehaviors[questionId] || 'regular'
}

// Question 2: Logical fallacies options
const logicalFallaciesOptions = [
  { value: 'ignore', text: 'If I ignore it, it will go away' },
  { value: 'figured_out', text: 'Everyone else seems to have it figured out' },
  { value: 'different', text: 'This time is different' },
  { value: 'not_apply', text: "Other people's problems don't apply to me" }
]

// Question 3: Odd one out options
const oddOneOutOptions = [
  { value: 'performance_review', text: 'Performance review' },
  { value: 'root_canal', text: 'Root canal' },
  { value: 'colonoscopy', text: 'Colonoscopy' },
  { value: 'team_building', text: 'Team building retreat' }
]

// Question 4: Autocomplete options for toxic behavior
const paradoxAutocompleteOptions = [
  "uncooperative",
  "paranoid",
  "overreacting",
  "hostile",
  "recalcitrant"
]

// Question 5: Analogy completion options
const analogyOptions = [
  { value: 'collaboration', text: 'Collaboration' },
  { value: 'awkward_bonding', text: 'Awkward bonding' },
  { value: 'trust_building', text: 'Trust building' },
  { value: 'skill_development', text: 'Skill development' }
]

const handleSubmit = () => {
  if (!allQuestionsAnswered.value) {
    return
  }

  Object.entries(answers).forEach(([questionId, answer]) => {
    if ((Array.isArray(answer) && answer.length > 0) || (!Array.isArray(answer) && answer !== '' && answer !== null && answer !== undefined)) {
      assessmentStore.saveAnswer('logic', questionId, answer)
    }
  })
  assessmentStore.markAssessmentCompleted('logic')
  router.push('/assessment/data-analysis')
}
</script>

<style></style>
