<template>
  <div class="logic-assessment">
    <h1 class="assessment-title">Logic & Pattern Recognition</h1>
    <p class="assessment-description">
      Test your logical reasoning and pattern recognition skills.
    </p>

    <form class="questions-container" @submit.prevent="handleSubmit">
      <!-- Question 1: Pattern Recognition (Number Input) -->
      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">1</h2>
          <p class="question-text">
            Meeting productivity sequence: 100%, 73%, 46%, 19%, ?
          </p>
          <span class="question-hint">(Enter the next number as percentage, e.g., 25)</span>
        </div>

        <InputNumber
          v-model="answers.q1"
          :behavior-kind="getQuestionBehavior('q1')"
          placeholder="Enter percentage"
          class="question-input"
        />
      </div>

      <!-- Question 2: Logical Fallacies (Checkbox) -->
      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">2</h2>
          <p class="question-text">
            Check all the logical fallacies you use daily:
          </p>
        </div>

        <InputCheckbox
          v-model="answers.q2"
          :options="logicalFallaciesOptions"
          :behavior-kind="getQuestionBehavior('q2')"
          name="logical-fallacies"
          class="question-input"
        />
      </div>

      <!-- Question 3: Odd One Out (Radio) -->
      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">3</h2>
          <p class="question-text">
            Which doesn't belong:
          </p>
        </div>

        <InputRadio
          v-model="answers.q3"
          :options="oddOneOutOptions"
          :behavior-kind="getQuestionBehavior('q3')"
          name="odd-one-out"
          class="question-input"
        />
      </div>

      <!-- Question 4: Logical Paradox (Text with autocomplete) -->
      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">4</h2>
          <p class="question-text">
            If you speak up in meetings, you're "difficult." If you stay quiet, you're "not engaged."
            You must either speak up or stay quiet. Therefore:
          </p>
        </div>

        <InputText
          v-model="answers.q4"
          behavior-kind="toxic"
          :toxic-replacements="paradoxAutocompleteOptions"
          placeholder="Complete the logic..."
          class="question-input"
        />
      </div>

      <!-- Question 5: Fibonacci Pattern (Number Input) -->
      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">5</h2>
          <p class="question-text">
            Workload assignment pattern - if person A can handle 5 tasks, person B handles 8 tasks,
            and person C handles 13 tasks, how many tasks does person D (the intern) handle?
          </p>
          <span class="question-hint">(Enter a number)</span>
        </div>

        <InputNumber
          v-model="answers.q5"
          :behavior-kind="getQuestionBehavior('q5')"
          placeholder="Number of tasks"
          class="question-input"
        />
      </div>

      <!-- Question 6: Analogy (Radio) -->
      <div class="question-block">
        <div class="question-header">
          <h2 class="question-number">6</h2>
          <p class="question-text">
            Mandatory fun is to enjoyment as team building is to:
          </p>
        </div>

        <InputRadio
          v-model="answers.q6"
          :options="analogyOptions"
          :behavior-kind="getQuestionBehavior('q6')"
          name="analogy"
          class="question-input"
        />
      </div>

      <button
        type="submit"
        class="submit-button"
        :disabled="!allQuestionsAnswered"
      >
        Continue to Literacy Assessment
      </button>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import InputRadio from '@/components/assessment/inputRadio/InputRadio.vue'
import InputText from '@/components/assessment/inputText/InputText.vue'
import InputNumber from '@/components/assessment/inputNumber/InputNumber.vue'
import InputCheckbox from '@/components/assessment/inputCheckbox/InputCheckbox.vue'

// Initialize router for navigation
const router = useRouter()

// Vue Concept: reactive() for complex state objects
// Since we have multiple questions with different answer types
const answers = reactive({
  q1: '', // Meeting productivity pattern (number)
  q2: [], // Logical fallacies (array of strings)
  q3: '', // Odd one out (string)
  q4: '', // Logical paradox (string)
  q5: '', // Fibonacci sequence (number)
  q6: ''  // Analogy (string)
})

// Question behavior patterns - mixing different behaviors for testing
const questionBehaviors = {
  q1: 'shifty',    // Pattern recognition with delay
  q2: 'shifty',     // Logical fallacies with shifting selections
  q3: 'shifty',    // Odd one out with delay
  q4: 'toxic',      // Paradox with autocomplete (uses InputText toxic behavior)
  q5: 'shifty',     // Fibonacci with changing values
  q6: 'shifty'     // Analogy with delay
}

// Vue Concept: Computed property for form validation
const allQuestionsAnswered = computed(() => {
  return (
    answers.q1 !== '' &&
    Array.isArray(answers.q2) && answers.q2.length > 0 &&
    answers.q3 !== '' &&
    answers.q4 !== '' &&
    answers.q5 !== '' &&
    answers.q6 !== ''
  )
})

// Helper function to get behavior for each question
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
  "You're wrong",
  "Drama queen",
  "Paranoid",
  "Overreacting",
  "Making things up",
  "You're hostile"
]

// Question 6: Analogy completion options
const analogyOptions = [
  { value: 'collaboration', text: 'Collaboration' },
  { value: 'awkward_bonding', text: 'Awkward bonding' },
  { value: 'trust_building', text: 'Trust building' },
  { value: 'skill_development', text: 'Skill development' }
]

// Form submission handler
const handleSubmit = () => {
  if (!allQuestionsAnswered.value) {
    return
  }

  // Log answers for debugging (remove in production)
  console.log('Logic Assessment Answers:', answers)

  // Navigate to next assessment
  router.push('/assessment/literacy')
}
</script>

<style scoped>
.logic-assessment {
  width: min(1024px, 95%);
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
  font-size: var(--fontsize-body);
  color: var(--clr-text-secondary);
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

</style>
