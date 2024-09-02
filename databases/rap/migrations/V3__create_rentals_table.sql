CREATE TABLE rap.rentals (
  id SERIAL PRIMARY KEY NOT NULL,
  propertyId BIGINT NOT NULL,
  cost BIGINT NOT NULL,
  statusId INT NOT NULL
);

ALTER SEQUENCE rap.rentals_id_seq RESTART WITH 1;

ALTER TABLE rap.leases
ADD CONSTRAINT fk_rental
FOREIGN KEY (rentalId) 
REFERENCES rap.rentals(id);