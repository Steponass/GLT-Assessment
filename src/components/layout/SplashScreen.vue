<template>
  <div class="splash-container">
    <img class="glt_logo" src="/lamp-svgrepo-com-1024px.png" />
    <div class="splash-title">
      <h1>GLT Assessment</h1>
      <h6>
        Evaluate your abilities across multiple skill areas
      </h6>
    </div>
    <button @click="handleCloseSplash">
      Start
    </button>
  </div>
</template>

<script>
export default {
  name: 'SplashScreen',
  methods: {
    handleCloseSplash() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.splash-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--space-16px);
  background-color: var(--clr-background);
  z-index: 1;
}

.glt_logo {
  width: 200px;
  transition: transform 10s cubic-bezier(.92, -0.2, .1, 1.15), opacity 0.3s ease;
  transform: perspective(300px) scale(1) translateY(0) rotateX(10deg) rotateZ(3deg);
  transform-style: preserve-3d;

  @starting-style {
    transform: perspective(1px) translateY(200px) scale(0.01) rotateX(-40deg);
  }
}

.splash-title {
  display: flex;
  flex-direction: column;
  gap: var(--space-12px);
  margin-bottom: var(--space-32px);
}

h6 {
  color: var(--clr-text-weak);
}
</style>