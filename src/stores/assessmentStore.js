import { defineStore } from 'pinia'

// Default state for initialization
const defaultState = {
  currentAssessmentRoute: 'personality',
  assessmentProgress: {
    personality: { completed: false, currentQuestion: 1, answers: {} },
    numeracy: { completed: false, currentQuestion: 1, answers: {} },
    logic: { completed: false, currentQuestion: 1, answers: {} },
    dataAnalysis: { completed: false, currentQuestion: 1, answers: {} },
    situational: { completed: false, currentQuestion: 1, answers: {} }
  },
  assessmentStartTime: null,
  isAssessmentCompleted: false,
  totalQuestions: 24
}

// Load state from localStorage
const loadStateFromStorage = () => {
  try {
    const savedState = localStorage.getItem('assessmentStore')
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      // Merge with default state to ensure all properties exist
      return { ...defaultState, ...parsedState }
    }
  } catch (error) {
    console.warn('Failed to load assessment state from localStorage:', error)
  }
  return defaultState
}

export const useAssessmentStore = defineStore('assessment', {
  state: () => loadStateFromStorage(),

  getters: {
    getCurrentAssessmentProgress: (state) => {
      return state.assessmentProgress[state.currentAssessmentRoute]
    },

    getCompletedQuestionsCount: (state) => {
      return Object.values(state.assessmentProgress).reduce((total, assessment) => {
        return total + Object.keys(assessment.answers).length
      }, 0)
    },

    getOverallProgressPercentage: (state) => {
      const completedQuestions = Object.values(state.assessmentProgress).reduce((total, assessment) => {
        return total + Object.keys(assessment.answers).length
      }, 0)
      return Math.round((completedQuestions / state.totalQuestions) * 100)
    },

    getAvailableAssessmentRoutes: (state) => {
      const routes = ['personality', 'numeracy', 'logic', 'dataAnalysis', 'situational']
      const currentIndex = routes.indexOf(state.currentAssessmentRoute)
      return routes.slice(0, currentIndex + 1)
    }
  },

  actions: {
    // Save current state to localStorage
    saveState() {
      try {
        const stateToSave = {
          currentAssessmentRoute: this.currentAssessmentRoute,
          assessmentProgress: this.assessmentProgress,
          assessmentStartTime: this.assessmentStartTime,
          isAssessmentCompleted: this.isAssessmentCompleted,
          totalQuestions: this.totalQuestions
        }
        localStorage.setItem('assessmentStore', JSON.stringify(stateToSave))
      } catch (error) {
        console.warn('Failed to save assessment state to localStorage:', error)
      }
    },

    setCurrentAssessmentRoute(routeName) {
      this.currentAssessmentRoute = routeName
      this.saveState()
    },

    setCurrentQuestion(assessmentRoute, questionNumber) {
      if (this.assessmentProgress[assessmentRoute]) {
        this.assessmentProgress[assessmentRoute].currentQuestion = questionNumber
        this.saveState()
      }
    },

    saveAnswer(assessmentRoute, questionNumber, answer) {
      if (this.assessmentProgress[assessmentRoute]) {
        this.assessmentProgress[assessmentRoute].answers[questionNumber] = answer
        this.saveState()
      }
    },

    markAssessmentCompleted(assessmentRoute) {
      if (this.assessmentProgress[assessmentRoute]) {
        this.assessmentProgress[assessmentRoute].completed = true
        this.saveState()
      }
    },

    startAssessment() {
      this.assessmentStartTime = Date.now()
      this.saveState()
    },

    completeAllAssessments() {
      this.isAssessmentCompleted = true
      this.saveState()
    },

    // Clear all saved data (useful for testing or reset functionality)
    clearSavedState() {
      try {
        localStorage.removeItem('assessmentStore')
        // Reset to default state
        Object.assign(this, defaultState)
      } catch (error) {
        console.warn('Failed to clear assessment state from localStorage:', error)
      }
    }
  }
})
