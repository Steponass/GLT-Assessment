<template>
  <div class="splash-container">
    <img class="glt_logo" src="/lamp_13806789.png" />
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
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: var(--space-16px);
  background-color: var(--clr-background);
}

.glt_logo {
  width: 200px;
  transition: transform 10s ease-in-out, opacity 0.3s ease;
  transform: perspective(300px) rotateX(0deg) translateZ(-100px) scale(1);
  transform-style: preserve-3d;

  @starting-style {
    transform: perspective(200px) scale(0.01) rotateX(90deg);
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