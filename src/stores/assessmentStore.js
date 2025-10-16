import { defineStore } from 'pinia'

export const useAssessmentStore = defineStore('assessment', {
  state: () => ({
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
    totalQuestions: 26
  }),

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
    setCurrentAssessmentRoute(routeName) {
      this.currentAssessmentRoute = routeName
    },

    setCurrentQuestion(assessmentRoute, questionNumber) {
      if (this.assessmentProgress[assessmentRoute]) {
        this.assessmentProgress[assessmentRoute].currentQuestion = questionNumber
      }
    },

    saveAnswer(assessmentRoute, questionNumber, answer) {
      if (this.assessmentProgress[assessmentRoute]) {
        this.assessmentProgress[assessmentRoute].answers[questionNumber] = answer
      }
    },

    markAssessmentCompleted(assessmentRoute) {
      if (this.assessmentProgress[assessmentRoute]) {
        this.assessmentProgress[assessmentRoute].completed = true
      }
    },

    startAssessment() {
      this.assessmentStartTime = Date.now()
    },

    completeAllAssessments() {
      this.isAssessmentCompleted = true
    }
  }
})
