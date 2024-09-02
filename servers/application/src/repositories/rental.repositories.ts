import pool from "../database"

export const fetchRentals = ({ limit, status }) => {
  const query = `
    SELECT  
      r.id,
      r.propertyid AS propertyId,
      r.cost,
      rs.description AS status
    FROM rap.rentals r
    INNER JOIN rap.rentalstatuses rs
    ON r.statusid = rs.id
    LIMIT $1
  `

  return pool.query(query, [limit]).then(response => response.rows)
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