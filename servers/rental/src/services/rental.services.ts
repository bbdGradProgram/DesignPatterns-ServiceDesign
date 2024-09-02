import * as rentalRepository from '../repositories/rental.repository'
import * as propertyRepository from '../repositories/property.repository'
import { rental as rentalStatuses } from '../constants/statuses'

export const fetchRentals = modifier => rentalRepository.fetchRentals(modifier)

export const fetchRental = rental => rentalRepository.fetchRental(rental)

export const addRentals = capacity => {
  return propertyRepository
    .fetchProperty(capacity)
    .then((property: any) => property.id)
    .then(id => rentalRepository.insertRentals(id, capacity))
}

export const createRental = (persona, property) => {
  return rentalRepository
    .fetchRentals({ limit: property.capacity, status: rentalStatuses.VACANT })
    .then(async rentals => {
      // TODO: Add rentals
      // if (rentals.length < capacity) {
      //   addRentals(capacity)
      // }

      // TODO: Create debit order

      // TODO: Fetch time
      const startDate = new Date()
      const endDate = new Date()

      endDate.setFullYear(startDate.getFullYear() + 1)

      return rentalRepository.occupyRentalsInsertLeases(
        rentals,
        rentals.map(r => ({
          rentalId: r.id,
          tenantId: persona.id,
          startDate,
          endDate,
          rentAmount: r.cost,
        }))
      )
    })
}

export const vacateRental = rental => {
  throw new Error('Not Implemented')
}