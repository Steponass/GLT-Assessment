<script>
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import SplashScreen from '@/components/layout/SplashScreen.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useAssessmentStore } from '@/stores/assessmentStore'
import ProgressBar from '@/components/layout/ProgressBar.vue';

console.log("So Danske Bank divested from Bank Hapoalim in 2024, then invested again in 2024? Sneaky mfs 😂")

export default {
  name: 'App',

  components: {
    SplashScreen,
    AppHeader,
    AppFooter,
    ProgressBar
  },

  setup() {
    const assessmentStore = useAssessmentStore()
    const route = useRoute()
    const isSummary = computed(() => route.name === 'summary')
    const isIntro = computed(() => route.name === 'intro')
    const showSplash = ref(true)

    const handleCloseSplash = () => {
      showSplash.value = false
    }

    onMounted(() => {
      assessmentStore.loadPersistedState()
    })

    return {
      isSummary,
      isIntro,
      showSplash,
      handleCloseSplash
    }
  }
}
</script>

<template>
  <div id="app">
    <Transition name="splash">
      <SplashScreen v-if="showSplash && isIntro" @close="handleCloseSplash" />
    </Transition>
    <AppHeader />
    <ProgressBar v-if="!isSummary && !isIntro" />
    <main>
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>

<style>
@import './styles/reset.css';
@import './styles/fonts.css';
@import './styles/properties.css';

#app {
  min-height: 100vh;
  width: 100vw;
  background-color: var(--clr-background);
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

main {
  flex: 1;
}

.assessment {
  width: min(1024px, 95%);
  margin: 0 auto;
  padding-block: var(--space-12-16px);
}

.assessment-title {
  text-align: center;
  margin-bottom: var(--space-16-24px);
  font-size: var(--fontsize-h2);
}

.assessment-description {
  margin-bottom: var(--space-8-12px);
}

.questions-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-24-32px);
}

.question-header {
  display: flex;
  align-items: center;
  align-content: center;
  gap: var(--space-12px);
}

.question-number {
  font-size: var(--fontsize-h4);
  font-weight: bold;
  color: var(--clr-primary);
}

.question-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-12-16px);
  padding: var(--space-8-12px);
  transition: all 0.3s ease;

  @media (hover: hover) {
    &:hover {
      box-shadow: 0 2px 3px hsla(0, 0%, 0%, 0.411);
    }
  }
}

button {
  width: min(320px, 80%);
  margin-inline: auto;
  border: none;
  cursor: pointer;
  background-color: var(--clr-primary);
  color: white;
  padding: var(--space-12px) var(--space-16px);
  transition: all 0.2s ease;
  margin-block-end: var(--space-32px);
  font-weight: 500;

  @media (hover: hover) {
    &:hover {
      background-color: var(--clr-stroke-strong);
    }
  }

  &:active {
    transform: translateY(2px);
  }

  &:disabled {
    background-color: var(--clr-stroke-weak);
  }
}

.stack>*+* {
  margin-block-start: var(--space-8-12px);
}

.stack> :nth-child(2) {
  margin-block-end: auto;
}

/* Splash screen transition */
.splash-enter-active,
.splash-leave-active {
  transition: opacity 0.4s ease;
}

.splash-enter-from,
.splash-leave-to {
  opacity: 0;
}

</style>
