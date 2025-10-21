<template>
  <header class="app-header">
    <div class="header-logo">
      <img src="/lamp_13806789.png" alt="">
    <h1 class="header-title">GLT</h1>
  </div>
    <p><strong>{{ formattedCount }}</strong> users have completed this today.</p>
  </header>

</template>

<script>

export default {
  name: 'AppHeader',
  data() {
    return {
      usersCompletedToday: 0
    }
  },
  computed: {
    formattedCount() {
      return this.usersCompletedToday.toLocaleString()
    }
  },
  beforeMount() {
    const min = 912
    const max = 1835
    this.usersCompletedToday = Math.floor(Math.random() * (max - min + 1)) + min
  }
}
</script>

<style scoped>
.app-header {
  padding-block: var(--space-8px);
  padding-inline: var(--space-12px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: colorShift 20s infinite;
}

.header-logo {
  display: flex;
  gap: var(--space-8-12px);
}

.header-logo img {
  max-height: 40px;
}

.header-title {
  font-size: var(--fontsize-h4);
  font-weight: 700;
}

@keyframes colorShift {
  0% {
    background-color: #f3eded;
  }

  50% {
    background-color: #e9e1e1;
  }

  100% {
    background-color: #f5f1f1;
  }
}
</style>
