<template>
  <header class="app-header">
    <div class="header-logo">
      <a rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/Danske_Bank_money_laundering_scandal"><img src="/lamp_13806789.png" alt="GLT assessments logo"></a>
  </div>
    <p class="completed_today"><strong>{{ formattedCount }}</strong> users have completed this test today</p>
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
  width: 100%;
  padding-block: var(--space-8px);
  padding-inline: var(--space-16px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: colorShift 20s infinite;
}

.header-logo img {
  max-height: 40px;
  margin-inline-end: var(--space-12-16px);
}

.completed_today {
  text-align: end;
  line-height: 1.1;
}

@keyframes colorShift {
  0% {
    background-color: hsl(0, 20%, 94%);
  }

  50% {
    background-color: hsl(0, 15%, 90%);
  }

  100% {
    background-color: hsl(0, 17%, 95%);
  }
}
</style>
