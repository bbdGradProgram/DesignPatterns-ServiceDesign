export const createDebitOrder = order => {
  return fetch(
    'api.commercialbank.project.bbdgrad.com',
    {
      method: 'POST',
      body: order,
    }
  )
}