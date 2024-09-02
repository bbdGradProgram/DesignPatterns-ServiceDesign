export const confirmRental = ({ persona, success }) => fetch(
  'api.persona.projects.bbdgrad.com/api/rentHouseSuccess',
  {
    body: JSON.stringify({
      personaId: persona.id,
      isSuccess: success,
    })
  }
)