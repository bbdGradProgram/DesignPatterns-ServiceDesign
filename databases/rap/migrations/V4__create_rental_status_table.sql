CREATE TABLE rap.rentalStatuses (
  id SERIAL PRIMARY KEY NOT NULL,
  description TEXT NOT NULL
);

ALTER SEQUENCE rap.rentalstatuses_id_seq RESTART WITH 1;

ALTER TABLE rap.rentals
ADD CONSTRAINT fk_rentalStatus
FOREIGN KEY (statusId) 
REFERENCES rap.rentalStatuses(id);