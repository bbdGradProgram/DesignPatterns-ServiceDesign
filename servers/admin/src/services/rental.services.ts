import * as rentalRepository from '../repositories/rental.repositories'
import { rental as rentalStatuses } from '../constants/statuses'
import * as propertyServices from './property.services'
import * as timeServices from './time.services'

export const fetchRentals = modifier => rentalRepository.fetchRentals(modifier)

export const fetchRental = rental => rentalRepository.fetchRental(rental)

export const addRentals = property => {
  return propertyServices
    .fetchProperty(property)
    .then(property => rentalRepository.insertRentals(property))
}

export const createRental = (persona, property) => {

  return rentalRepository
    .fetchRentals({ limit: property.capacity, status: rentalStatuses.VACANT })
    .then(rentals => {
      if (rentals.length > property.capacity) throw new Error('Error fetching rentals')

      if (rentals.length === property.capacity) return rentals

      const rentalsPromise = addRentals(property.capacity)
        .then(() => rentalRepository.fetchRentals({
          limit: property.capacity,
          status: rentalStatuses.VACANT,
        }))

      return Promise.all([rentalsPromise, timeServices.fetchDate()])
    })
    .then(async rentals => {

      if (rentals.length < property.capacity) {
        rentals = await addRentals(property.capacity)
          .then(() => rentalRepository.fetchRentals({
            limit: property.capacity,
            status: rentalStatuses.VACANT,
          }))
      }

      // Create debit order

      const startDate = new Date(await timeServices.fetchDate())
      const endDate = new Date(startDate)

      endDate.setFullYear(startDate.getFullYear() + 1)

      return rentalRepository.occupyRentalsInsertLeases(
        rentals,
        rentals.map(r => ({
          rentalId: r.id,
          tenantId: persona.id,
          startDate: startDate.toLocaleDateString('en-CA'),
          endDate: endDate.toLocaleDateString('en-CA'),
          rentAmount: r.cost,
        }))
      )
    })
}

export const updateRental = rental => {
  return rentalRepository.updateRental(rental)
}