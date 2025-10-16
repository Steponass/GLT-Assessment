<template>
  <div>
    <h1>Congratulations!</h1>
    <h2>Your score is higher than <strong>{{ betterThanHowmany }} candidates!</strong></h2>
  </div>

  <div>
    <h2>Your Personality Profile ©️ is:</h2>
    <h3>{{ userPersonalityProfile.title }}</h3>
    <p>{{ userPersonalityProfile.description }}</p>

    <h4>Strengths:</h4>
    <ul>
      <li v-for="strength in userPersonalityProfile.strengths" :key="strength">{{ strength }}</li>
    </ul>

    <h4>Opportunities for Growth:</h4>
    <ul>
      <li v-for="opportunity in userPersonalityProfile.opportunities" :key="opportunity">{{ opportunity }}</li>
    </ul>

    <h4>Recommended Role:</h4>
    <p>{{ userPersonalityProfile.recommendedRole }}</p>
  </div>
</template>

<script>
import { computed, ref } from 'vue'

const personalityProfiles = [
  {
    id: 'highCompliance',
    title: "The Yes-Person Extraordinaire",
    description: "Your remarkable ability to agree with everything while contributing nothing makes you perfect middle management material.",
    strengths: ["Never rocks the boat", "Excellent at looking busy", "Master of corporate speak"],
    opportunities: ["Could be more passive", "Needs to lower expectations further"],
    recommendedRole: "Deputy Assistant to the Regional Manager"
  },
  {
    id: 'moderateResistance',
    title: "The Quiet Questioner",
    description: "You show dangerous signs of independent thought. We recommend immediate remedial training.",
    strengths: ["Occasionally has ideas", "Sometimes asks 'why'"],
    opportunities: ["Too much critical thinking", "Insufficient acceptance of status quo"],
    recommendedRole: "Permanent Intern (with 10 years experience required)"
  },
  {
    id: 'toxicPositivity',
    title: "The Corporate Cheerleader",
    description: "Your aggressive enthusiasm and mandatory fun attitude makes everyone deeply uncomfortable, which is perfect for Human Resources.",
    strengths: ["Forces team bonding", "Calls meetings 'opportunities'", "Genuinely enjoys icebreakers"],
    opportunities: ["Not enough pizza parties", "Could use more motivational posters"],
    recommendedRole: "Chief Happiness Officer (unpaid position)"
  }
]

// Function to randomly select a personality profile
const selectRandomPersonalityProfile = () => {
  const randomIndex = Math.floor(Math.random() * personalityProfiles.length)
  return personalityProfiles[randomIndex]
}

// In your SummaryView component
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

<style scoped></style>