<template>
  <div class="intro-outro-container">
    <div class="intro-outro-content">
      <div class="intro-outro-title">
        <h1>Congratulations!</h1>
        <h6>Your score is higher than <strong>{{ betterThanHowmany }} of other candidates!</strong></h6>
        <p>You really showed them!</p>
      </div>


      <section class="personality_profile_container">
        <div class="personality_title_container">
          <h4>Your Personality Profile<sup>©</sup> is:</h4>
          <h5 class="personality_title">{{ userPersonalityProfile.title }}</h5>
          <p>{{ userPersonalityProfile.description }}</p>
        </div>

        <h5>Strengths:</h5>
        <ul class="summary-list">
          <li v-for="strength in userPersonalityProfile.strengths" :key="strength">{{ strength }}</li>
        </ul>

        <h5>Opportunities for Growth:</h5>
        <ul class="summary-list">
          <li v-for="opportunity in userPersonalityProfile.opportunities" :key="opportunity">{{ opportunity }}</li>
        </ul>

        <h5>Recommended Role:</h5>
        <p>{{ userPersonalityProfile.recommendedRole }}</p>

        <p class="in-touch-shortly">We'll be in touch with you shortly with a generic “Not this time honey, but we are sooo impressed” email.</p>
      </section>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { selectRandomPersonalityProfile } from '@/data/personalityProfiles.js'

const userPersonalityProfile = ref(selectRandomPersonalityProfile())

export default {
  setup() {
    // Generate a random percentage between 2 and 12
    const betterThanHowmany = computed(() => {
      const min = 2
      const max = 12
      const percentage = Math.floor(Math.random() * (max - min + 1)) + min
      return `${percentage}%`
    })

    return {
      betterThanHowmany,
      userPersonalityProfile
    }
  }
}
</script>

<style scoped>
.intro-outro-container {
  display: flex;
  justify-content: center;
  padding-block: var(--space-8-12px);
  padding-inline: var(--space-16px);
}

.intro-outro-content {
  max-width: 60ch;
}

.intro-outro-title {
  text-align: center;
  margin-block: var(--space-16-24px);
}

.personality_profile_container {
  margin-inline: var(--space-16px);
}

.personality_title_container {
  text-align: center;
  margin-block: var(--space-16px);
}

.personality_title {
  font-weight: 700;
  text-transform: uppercase;
  margin-block-end: var(--space-8-12px);
}

.summary-list {
  list-style: inside;
  margin-block: var(--space-8-12px) var(--space-16-24px);
}

.in-touch-shortly {
  margin-block-start: var(--space-16-24px);
}
</style>
