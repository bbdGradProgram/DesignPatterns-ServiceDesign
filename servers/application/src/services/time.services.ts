export const fetchDate = () => fetch(
  'api.zeus.projects.bbdgrad.com/date',
  { method: 'GET' }
)
  .then(response => response.json())
  .then(({ date }) => new Date(date.replaceAll('|', '-')))
