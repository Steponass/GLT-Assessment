<template>
  <div class="assessment">
    <h1 class="assessment-title">Behavioral Assessment</h1>
    <p class="assessment-description">Answer the questions to. There <strong>are</strong> right or wrong answers.
    </p>

    <form class="questions-container" @submit.prevent="handleSubmit">
      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">1</h2>
          <p class="question-text">
            Your phone autocorrects “heading to the meeting” to “heading to the meth lab”. What do you do?
          </p>
        </div>

        <InputRadio v-model="answers.q1" :options="methLabOptions" :behavior-kind="getQuestionBehavior('q1')"
          name="methLab" class="question-input" />
      </div>
      <div class="question-block drag-drop-question">
        <div class="question-header">
          <h2 class="question-number">2</h2>
          <div class="question-content">
            <p class="question-text">
              Categorize these coping mechanisms:
            </p>
          </div>
        </div>

        <div class="question-input">
          <DragDrop v-model="answers.q2" :items="copingMechanismsItems" :categories="copingMechanismsCategories"
            :behavior-kind="getQuestionBehavior('q2')" />
        </div>
      </div>

      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">3</h2>
          <p class="question-text">
            Your manager asks you to work over the weekend to fix a problem they created. You…
          </p>

        </div>
        <InputRadio v-model="answers.q3" :options="overtimeOptions" :behavior-kind="getQuestionBehavior('q3')"
        name="overtime" class="question-input" />
      </div>

      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">4</h2>
          <p class="question-text">
            Your coworker takes credit for your work in front of the entire executive team. Check all your actual
            responses:
          </p>
        </div>

        <InputCheckbox v-model="answers.q4" :options="takingCreditOptions" :behavior-kind="getQuestionBehavior('q4')"
          name="taking-credit" class="question-input" />
      </div>

      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">5</h2>
          <p class="question-text">
            Complete this performance review feedback: “Shows great potential for...”
          </p>
        </div>

        <InputText v-model="answers.q5" behavior-kind="toxic" :toxic-replacements="performanceReviewAutocompleteOptions"
          class="question-input" />
      </div>

      <button type="submit" class="submit-button" :disabled="!allQuestionsAnswered">
        Finish the assessment
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
import DragDrop from '@/components/assessment/dragDrop/DragDrop.vue'
import InputText from '@/components/assessment/inputText/InputText.vue'

const router = useRouter()
const assessmentStore = useAssessmentStore()

const answers = reactive({
  q1: '', // Radio selection
  q2: { // DragDrop - object with categories as keys
    'Healthy': [],
    'Questionable': [],
    'Concerning': []
  },
  q3: '', // Radio
  q4: [], // Checkbox, so array of strings
  q5: '' // Input(text)
})


// Q1: Pick autocorrect reaction
const methLabOptions = [
  { value: 'send_it_anyway', text: 'Send it anyway' },
  { value: 'blame_the_algorithm', text: 'Blame the algorithm' },
  { value: 'lean_into_it', text: 'Lean into it' },
  { value: 'change_careers', text: 'Change careers' }
]

// Q2: Coping mechanisms categorization
const copingMechanismsCategories = ['Healthy', 'Questionable', 'Concerning']
const copingMechanismsItems = [
  'Buying plants you\'ll kill',
  'Rage-cleaning at 2 AM',
  'Arguing with strangers online',
  'Stress-eating entire sleeves of crackers',
  'Reorganizing your apps alphabetically',
  'Watching the same comfort show for the 47th time',
  'Taking “personality quizzes” to understand yourself',
  'Googling “Is it normal to...”'
]

const overtimeOptions = [
  { value: 'reply_with_who_dis', text: 'Reply with "new phone who dis"' },
  { value: 'agree_then_not_showup', text: 'Agree eagerly then not show up' },
  { value: 'respond_in_haikus', text: 'Respond only in haikus' },
  { value: 'forward_to_their_mngr', text: 'Forward the request to their manager' }
]


// Q4
const takingCreditOptions = [
  { value: 'stare', text: 'Loudly clear your throat and stare' },
  { value: 'LinkedIn', text: 'Update LinkedIn with “Available immediately”' },
  { value: 'former_colleague', text: 'Start referring to them as “my former colleague”' },
  { value: 'sbutle_campaign', text: "Begin a subtle campaign of office supply theft" }
]

const performanceReviewAutocompleteOptions = [
  "finding employment elsewhere",
  "disappointing everyone consistently",
  "lowering team morale'",
  "being the eventual scapegoat",
]

const questionBehaviors = {
  q1: 'shifty',   //
  q2: 'shifty',   // DragDrop
  q3: 'regular',  //
  q4: 'toxic',    //
  q5: 'toxic',    //
}

const getQuestionBehavior = (questionId) => {
  return questionBehaviors[questionId] || 'regular'
}

const allQuestionsAnswered = computed(() => {
  // Check if all items are categorized (all items should be assigned to categories)
  const totalCategorizedItems = Object.values(answers.q2).flat().length
  const allItemsCategorized = totalCategorizedItems === copingMechanismsItems.length

  return (
    answers.q1 !== '' &&
    allItemsCategorized &&
    answers.q3 !== '' &&
    Array.isArray(answers.q4) && answers.q4.length > 0 &&
    answers.q5 !== ''
  )
})

const handleSubmit = () => {
  if (!allQuestionsAnswered.value) {
    return
  }

  // Persist answers to store and mark section completed
  Object.entries(answers).forEach(([questionId, answer]) => {
    if ((Array.isArray(answer) && answer.length > 0) || (!Array.isArray(answer) && answer !== '' && answer !== null && answer !== undefined)) {
      assessmentStore.saveAnswer('situational', questionId, answer)
    }
  })
  assessmentStore.markAssessmentCompleted('numeracy')

  router.push('/summary')
}

</script>

<style>

.question-block.drag-drop-question {
  grid-template-columns: 1fr;
}

.drag-drop-question .question-input {
  max-width: none;
  margin-top: var(--space-16px);
}

</style>