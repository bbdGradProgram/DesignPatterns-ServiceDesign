CREATE TABLE rap.leases (
  id SERIAL PRIMARY KEY NOT NULL,
  rentalId INT NOT NULL,
  tenantId INT NOT NULL,
  startDate TEXT NOT NULL,
  endDate TEXT NOT NULL,
  rentAmount BIGINT NOT NULL
);

ALTER SEQUENCE rap.leases_id_seq RESTART WITH 1;