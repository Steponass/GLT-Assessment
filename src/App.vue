<script>
import { onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
// import { useAssessmentStore } from '@/stores/assessmentStore'

export default {
  name: 'App',

  components: {
    AppHeader,
    AppFooter
  },

  setup() {
    // const assessmentStore = useAssessmentStore()

    onMounted(() => {
      // assessmentStore.loadPersistedState()
    })
  }
}
</script>

<template>
  <div id="app">
    <AppHeader />

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
