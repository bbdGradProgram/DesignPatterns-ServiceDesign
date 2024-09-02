import pool from "../database"

export const fetchLeases = modifier => {
  let { limit, page, sortBy, order } = modifier
  const parameters: (string | number)[] = []

  limit = limit ?? 10
  page = page ?? 1
  let offset = (page - 1) * limit
  sortBy = ['id', 'rentalid', 'tenantid', 'startdate', 'enddate', 'propertyid', 'status'].includes(sortBy)
    ? sortBy
    : 'id'
  order = order?.toLocaleUpperCase()
  order = ['ASC', 'DESC'].includes(order) ? order : 'ASC'

  let query = `
    SELECT
      l.id,
      l.rentalid AS rentalId,
      l.tenantid AS tenantId,
      l.startdate AS startDate,
      l.enddate AS endDate,
      l.rentamount AS rentAmount,
      r.propertyid AS propertyId
    FROM rap.leases l
    INNER JOIN rap.rentals r
    ON l.rentalid = r.id
  `

  query += `
    ORDER BY ${sortBy} ${order}
    LIMIT $${parameters.length + 1}
    OFFSET $${parameters.length + 2}
  `

  parameters.push(limit, offset)

  return pool
    .query(query, parameters)
    .then(response => response.rows)
}

export const insertLeases = async leases => {
  const query = `
    INSERT INTO rap.leases l (
      l.rentalId,
      l.tenantId,
      l.startDate,
      l.endDate,
      l.rentAmount
    )
    VALUES ($1, $2, $3, $4, $5)
  `

  try {
    await pool.query('BEGIN')

    for (const lease of leases) {
      await pool.query(
        query,
        [
          lease.rentalId,
          lease.tenantId,
          lease.startDate,
          lease.endDate,
          lease.rentAmount,
        ]
      )
    }

    await pool.query('COMMIT')
  } catch (error) {
    await pool.query('ROLLBACK')
  }
}