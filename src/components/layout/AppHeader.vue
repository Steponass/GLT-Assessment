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
  animation: colorShift 25s infinite;
}

.header-logo img {
  max-height: 40px;
  margin-inline-end: var(--space-12-16px);
  animation: skewingShit 20s infinite;
}

.completed_today {
  text-align: end;
  line-height: 1.1;
}

@keyframes skewingShit {
  0% {
    transform: skew(0);
  }
  25% {
    transform: skew(3deg, 3deg);
  }
  50% {
    transform: skew(0);
  }
  75% {
    transform: skew(-3deg, -3deg);
  }
  100% {
    transform: skew(0);
  }
}

@keyframes colorShift {
  0% {
    background-color: hsl(38, 24%, 90%);
  }

  17% {
    background-color: hsl(38, 14%, 90%);
  }

  34% {
    background-color: hsl(38, 4%, 92%);
  }

  51% {
    background-color: hsl(0, 0%, 90%);
  }

  68% {
    background-color: hsl(38, 4%, 92%);
  }

  84% {
    background-color: hsl(38, 14%, 90%);
  }

  100% {
    background-color: hsl(38, 24%, 90%);
  }

}
</style>
