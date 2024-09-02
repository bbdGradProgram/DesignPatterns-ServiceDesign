export const fetchDate = () => fetch(`https://api.zeus.projects.bbdgrad.com/date?time=${new Date().getTime()}`)
  .then(response => response.json())
  .then(({ date }) => new Date(date.replace(/\|/g, '-')))