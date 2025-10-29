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
    id: 'toxicPositivity',
    title: "The Corporate Cheerleader",
    description: "Your aggressive enthusiasm and mandatory fun attitude makes everyone deeply uncomfortable, which is perfect for Human Resources.",
    strengths: ["Forces team bonding", "Calls meetings 'opportunities'", "Genuinely enjoys icebreakers"],
    opportunities: ["Not enough pizza parties", "Could use more motivational posters"],
    recommendedRole: "Chief Happiness Officer"
  },
  {
    id: 'busyDoingNothing',
    title: "The Theatrical Busybody",
    description: "You've mastered the art of looking overwhelmed while accomplishing nothing. Your calendar is full of meetings about meetings.",
    strengths: ["Types loudly", "Sighs professionally", "Always 'slammed' but available for coffee"],
    opportunities: ["Could complain more about workload", "Not enough visible stress"],
    recommendedRole: "Senior Coordinator of Coordination"
  },
  {
    id: 'processObsessed',
    title: "The Process Evangelist",
    description: "You create 47-step workflows for tasks that take 5 minutes. Your forms have forms. Excellence through bureaucracy.",
    strengths: ["Documents everything twice", "Meeting minutes include bathroom breaks", "Can make coffee require approval"],
    opportunities: ["Only has 73 templates", "Some processes still efficient"],
    recommendedRole: "Senior Process Procedure Manager"
  },
  {
    id: 'buzzwordNinja',
    title: "The Synergy Sorcerer",
    description: "You speak entirely in LinkedIn posts. Your vocabulary is 73% buzzwords. Nobody knows what you do, including you.",
    strengths: ["Leverages paradigm shifts", "Disrupts verticals", "Circles back to square one"],
    opportunities: ["Occasional use of real words", "Not enough acronyms"],
    recommendedRole: "Chief Ideation Catalyst"
  },
  {
    id: 'creditVampire',
    title: "The Glory Hound",
    description: "Your talent for being absent during work but present during praise is unmatched. 'We' do the work, 'I' take the credit.",
    strengths: ["Arrives for photos only", "Expert at 'building on' others' ideas", "CC's boss on successes only"],
    opportunities: ["Sometimes accidentally contributes", "Could steal more subtly"],
    recommendedRole: "Executive Victory Lap Specialist"
  },
  {
    id: 'perpetualVictim',
    title: "The Professional Martyr",
    description: "Nobody understands how hard you have it. Your suffering is unique and constant. Everything happens TO you.",
    strengths: ["Olympic-level sighing", "Weaponizes guilt", "Makes every issue personal"],
    opportunities: ["Occasional accountability", "Could play victim louder"],
    recommendedRole: "Chief Suffering Officer"
  }
]

// Function to randomly select a personality profile
export const selectRandomPersonalityProfile = () => {
  const randomIndex = Math.floor(Math.random() * personalityProfiles.length)
  return personalityProfiles[randomIndex]
}

export default personalityProfiles