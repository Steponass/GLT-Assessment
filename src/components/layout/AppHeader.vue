<template>
  <header class="app-header">
    <div class="header-container">
      <div class="header-top">
        <h1 class="header-title">
          Skill Assessment
        </h1>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader'
}
</script>

<style scoped>
.app-header {

  position: relative;
  z-index: 10;
  /* Shifty behavior: slowly shifts color */
  animation: colorShift 90s infinite;
}

.header-container {
  padding: 1rem 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-title {
  font-size: var(--fontsize-h4);
  font-weight: 700;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@keyframes colorShift {
  0% { background-color: #f3eded; }
  50% { background-color: #e9e1e1; }
  100% { background-color: #f5f1f1; }
}
</style>
