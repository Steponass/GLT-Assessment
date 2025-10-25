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
    background-color: var(--clr-secondary);
  }

  a {
    font-weight: 600;
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }

</style>
