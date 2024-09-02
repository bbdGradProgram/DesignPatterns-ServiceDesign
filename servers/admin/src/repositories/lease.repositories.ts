import pool from "../database"

export const fetchLeases = ({ limit, page, sortBy, order, status }) => {
  const parameters: (string | number)[] = []

  limit = limit ?? 10
  page = page ?? 1
  let offset = (page - 1) * limit
  sortBy = ['id', 'propertyId', 'cost', 'status'].includes(sortBy)
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
      r.propertyid AS propertyId,
      rs.description AS rentalStatus
    FROM rap.leases l
    INNER JOIN rap.rentals r
    ON l.rentalid = r.id
    INNER JOIN rap.rentalStatuses rs
    ON r.statusid = rs.id
  `

  if (status?.length) {
    query += `WHERE rs.description = $${parameters.length + 1}`
    parameters.push(status)
  }

  query += `
    ORDER BY ${sortBy} ${order}
    LIMIT $${parameters.length + 1}
    OFFSET $${parameters.length + 2}
  `

  parameters.push(limit, offset)

  return pool.query(query, parameters).then(response => response.rows)
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

  pool.query('BEGIN')
    .then(async () => {
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
    })
    .then(() => pool.query('COMMIT'))
    .catch(error => pool.query('ROLLBACK')
      .then(() => {
        throw new Error('Error creating rental')
      })
    )
}


export const fetchLease = lease => {
  const query = `
    SELECT
      l.id,
      l.rentalid AS rentalId,
      l.tenantid AS tenantId,
      l.startdate AS startDate,
      l.enddate AS endDate,
      l.rentamount AS rentAmount,
      r.propertyid AS propertyId,
      rs.description AS rentalStatus
    FROM rap.leases l
    INNER JOIN rap.rentals r
    ON l.rentalid = r.id
    INNER JOIN rap.rentalStatuses rs
    ON r.statusid = rs.id
    WHERE l.id = $1
  `

  return pool.query(query, [lease.id]).then(response => response.rows[0])
}