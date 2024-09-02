import pool from "../database"

export const fetchRentals = modifier => {
  let { limit, page, sortBy, order, status } = modifier
  const parameters: (string | number)[] = []

  limit = limit ?? 10
  page = page ?? 1
  let offset = (page - 1) * limit
  sortBy = ['id', 'propertyId', 'cost', 'status'].includes(sortBy)
    ? sortBy
    : 'id'
  order = order?.toLocaleUpperCase()
  order = ['ASC', 'DESC'].includes(order) ? order : 'ASC'
  status = status?.toLocaleUpperCase()

  let query = `
    SELECT  
      r.id,
      r.propertyid AS propertyId,
      r.cost,
      rs.description AS status
    FROM rap.rentals r
    INNER JOIN rap.rentalstatuses rs
    ON r.statusid = rs.id
  `

  if (status) {
    query += `WHERE rs.description = $${parameters.length + 1}`
    parameters.push(status)
  }

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

export const fetchRental = id => {
  const query = `
    SELECT  
      r.id,
      r.propertyid AS propertyId,
      r.cost,
      rs.description AS status
    FROM rap.rentals r
    INNER JOIN rap.rentalstatuses rs
    ON r.statusid = rs.id
    WHERE r.id = $1
  `

  return pool.query(query, [id]).then(response => response.rows)
}

export const insertRentals = (propertyId, quantity) => {
  const query = `
    DO $$
      DECLARE
        index INTEGER;
      BEGIN
        FOR index 1..$1 LOOP 
          INSERT INTO rap.rentals (propertyId, status) VALUES
            ($2, 1);
        END LOOP;
      END
    $$;
  `

  return pool.query(query, [quantity, propertyId])
}

export const occupyRentalsInsertLeases = async (rentals, leases) => {
  const rentalQuery = `
    UPDATE rap.rentals r
    SET statusid = 2
    WHERE r.id = ANY($1::INT[])
  `

  const leaseQuery = `
    INSERT INTO rap.leases (
      rentalid,
      tenantid,
      startdate,
      enddate,
      rentamount
    )
    VALUES ($1, $2, $3, $4, $5)
  `

  try {
    await pool.query('BEGIN')

    for (const lease of leases) {
      await pool.query(
        leaseQuery,
        [
          lease.rentalId,
          lease.tenantId,
          lease.startDate,
          lease.endDate,
          lease.rentAmount,
        ]
      )
    }

    await pool.query(rentalQuery, [rentals.map(r => r.id)])

    await pool.query('COMMIT')
  } catch (error) {
    await pool.query('ROLLBACK')
  }
}