<script>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useAssessmentStore } from '@/stores/assessmentStore'
import ProgressBar from '@/components/layout/ProgressBar.vue';

console.log("So Danske Bank divested from Bank Hapoalim in 2024, then invested again in 2024? Jesus are these guys sneaky AF.")

export default {
  name: 'App',

  components: {
    AppHeader,
    AppFooter,
    ProgressBar
  },

  setup() {
    const assessmentStore = useAssessmentStore()
    const route = useRoute()
    const isSummary = computed(() => route.name === 'summary')
    const isIntro = computed(() => route.name === 'intro')

    onMounted(() => {
      assessmentStore.loadPersistedState()
    })

    return {
      isSummary,
      isIntro
    }
  }
}
</script>

<template>
  <div id="app">
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
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
