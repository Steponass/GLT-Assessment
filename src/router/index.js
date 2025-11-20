import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    redirect: '/intro'
  },
  {
    path: '/intro',
    name: 'intro',
    component: () => import('@/views/IntroView.vue')
  },
  {
    path: '/assessment/personality',
    name: 'personality-assessment',
    component: () => import('@/views/PersonalityAssessment.vue')
  },
  {
    path: '/assessment/numeracy',
    name: 'numeracy-assessment',
    component: () => import('@/views/NumeracyAssessment.vue')
  },
  {
    path: '/assessment/logic',
    name: 'logic-assessment',
    component: () => import('@/views/LogicAssessment.vue')
  },
  {
    path: '/assessment/data-analysis',
    name: 'data-analysis-assessment',
    component: () => import('@/views/DataAnalysisAssessment.vue')
  },
  {
    path: '/assessment/situational',
    name: 'situational-assessment',
    component: () => import('@/views/SituationalAssessment.vue')
  },
  {
    path: '/summary',
    name: 'summary',
    component: () => import('@/views/SummaryView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard for linear flow
router.beforeEach((to, from, next) => {
  // Allow navigation to intro and summary always
  if (to.name === 'intro' || to.name === 'summary') {
    next()
    return
  }

  next()
})

export default router
