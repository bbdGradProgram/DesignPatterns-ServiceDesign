import pool from "../database"

export const fetchLeases = modifier => {
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
  `

  return pool.query(query).then(response => response.rows)
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