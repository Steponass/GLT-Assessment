<template>
  <footer>
    <p><strong>GLT</strong> Assessments</p>
    <p>Powered by <a href="https://rushiq.netlify.app/" target="_blank" rel="noopener noreferrer">RushIQ</a></p>
  </footer>

</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
  footer {
    padding-inline: var(--space-8-12px);
    padding-block: var(--space-8-12px);
    width: 100%;
    display: flex;
    justify-content: space-between;
    animation: colorShift 20s infinite;
  }

  a {
    font-weight: 600;
    text-decoration: underline;
    &:hover {
      text-decoration: none;
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
