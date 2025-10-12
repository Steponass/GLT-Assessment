<template>
  <div class="situational-assessment">
    <h1 class="assessment-title">Behavioral Assessment</h1>
    <p class="assessment-description">Answer the questions to align with your actual self. There are no right or wrong
      answers.
    </p>


    <form class="questions-container" @submit.prevent="handleSubmit">
      <!-- Q1 - Phone autocorrect (Radio)-->
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

      <!-- Q2 - Coping mechanisms (DragDrop)-->
      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">2</h2>
          <p class="question-text">
            Categorize these coping mechanisms:
          </p>
        </div>

        <DragDrop v-model="answers.q2" :items="copingMechanismsItems" :categories="copingMechanismsCategories"
          :behavior-kind="getQuestionBehavior('q2')" class="question-input" />

      </div>

      <!-- Q3 - Overtime - Radio -->
      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">3</h2>
          <p class="question-text">
            Your manager asks you to work over the weekend to fix a problem they created. You…
          </p>
          <InputRadio v-model="answers.q3" :options="overtimeOptions"
            :behavior-kind="getQuestionBehavior('q3')" name="overtime" class="question-input" />
        </div>
      </div>

      <!-- Q4 - Taking credit - Checkbox -->
      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">4</h2>
          <p class="question-text">
            Your coworker takes credit for your work in front of the entire executive team. Check all your actual
            responses:
          </p>
        </div>

        <InputCheckbox 
        v-model="answers.q4" 
        :options="takingCreditOptions" 
        :behavior-kind="getQuestionBehavior('q4')"
        name="taking-credit" 
        class="question-input" />
      </div>

      <button type="submit" class="submit-button" :disabled="!allQuestionsAnswered">
        Finish the assessment
      </button>
    </form>
  </div>

  <!-- Question 5: Performance Review - Text-->
  <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">5</h2>
          <p class="question-text">
            Complete this performance review feedback: “Shows great potential for...”
          </p>
        </div>

        <InputText
          v-model="answers.q5"
          behavior-kind="toxic"
          :toxic-replacements="performanceReviewAutocompleteOptions"
          class="question-input"
        />
      </div>

</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import InputRadio from '@/components/assessment/inputRadio/InputRadio.vue'
import InputCheckbox from '@/components/assessment/inputCheckbox/InputCheckbox.vue'
import DragDrop from '@/components/assessment/dragDrop/DragDrop.vue'
import InputText from '@/components/assessment/inputText/InputText.vue'

const router = useRouter()

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


// Track toxic question first submissions
const toxicQuestionFirstSubmission = reactive({
  q4: false,
  q5: false
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
  'Taking "personality quizzes" to understand yourself',
  'Googling "Is it normal to..."'
]

const overtimeOptions = [
  { value: 'reply_with_who_dis', text: 'Reply with "new phone who dis"' },
  { value: 'agree_then_not_showup', text: 'Agree enthusiastically then not show up' },
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

// Form submission handler
const handleSubmit = () => {
  // Check if any toxic questions haven't had their first submission yet
  const hasPendingToxicFirstSubmission = Object.keys(questionBehaviors).some(questionId => {
    if (questionBehaviors[questionId] === 'toxic') {
      return answers[questionId] !== '' && !toxicQuestionFirstSubmission[questionId]
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
    console.log('Please complete all questions')
    return
  }

  // All questions properly answered (including toxic after their reset)
  router.push('/summary')
}

const clearToxicInputsAndChangeText = () => {
  Object.keys(questionBehaviors).forEach(questionId => {
    if (questionBehaviors[questionId] === 'toxic' && answers[questionId] !== '') {
      // Mark this toxic question as having had its first submission
      toxicQuestionFirstSubmission[questionId] = true

      // Clear the answer
      answers[questionId] = ''
    }
  })
}

</script>

<style>
.situational-assessment {
  width: min(1200px, 95%);
  margin-inline: auto;
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
  gap: var(--space-24-32px);
}

.question-block {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-12-16px);
  padding: var(--space-16-24px);
  background-color: var(--clr-background-secondary);
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--clr-border-light);
}

.question-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-8px);
}

.question-number {
  font-size: var(--fontsize-h4);
  color: var(--clr-primary);
  font-weight: 600;
  margin: 0;
}

.question-text {
  font-size: var(--fontsize-body);
  color: var(--clr-text-primary);
  line-height: 1.5;
  margin: 0;
}

.question-input {
  justify-self: start;
  width: 100%;
  max-width: 500px;
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

/* Dragndrop */


.question-block.drag-drop-question {
  grid-template-columns: 1fr;
}

.drag-drop-question .question-input {
  max-width: none;
  margin-top: var(--space-16px);
}
</style>