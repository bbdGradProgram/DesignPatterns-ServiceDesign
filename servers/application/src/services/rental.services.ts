import * as rentalRepository from '../repositories/rental.repositories'
import * as propertyServices from './property.services'
import * as bankingServices from './banking.services'
import * as personaServices from './persona.services'
import { rental as rentalStatuses } from '../constants/statuses'
import * as timeServices from './time.services'

export const addRentals = capacity => {
  return propertyServices
    .fetchProperty(capacity)
    .then((property: any) => property.id)
    .then(id => rentalRepository.insertRentals(id, capacity))
}

export const createRental = (persona, property) => {
  return rentalRepository.fetchRentals({ limit: property.capacity, status: rentalStatuses.VACANT })
    .then(async rentals => {
      if (rentals.length > property.capacity) throw new Error('Error fetching rentals')

      if (rentals.length === property.capacity) return rentals

      return addRentals(property.capacity)
        .then(() => rentalRepository.fetchRentals({
          limit: property.capacity,
          status: rentalStatuses.VACANT,
        }))
    })
    .then(rentals => Promise.all([Promise.resolve(rentals), timeServices.fetchDate()]))
    .then(parameters => {
      const rentals = parameters[0]
      const startDate = parameters[1]
      const endDate = startDate

      endDate.setFullYear(startDate.getFullYear() + 1)

      const amount = rentals.reduce((previous, current) => {
        return previous + current.cost
      }, 0)

      return bankingServices.createDebitOrder({
        amountInMibiDough: amount,
        personaId: persona.id,
        dayInMonth: 25,
        endsAt: endDate, // Ensure that this is a string
        recipient: {
          bankId: 1001,
          accountId: 'rental-estate-agent', // TODO: Confirm
        },
      })
      .then(() => ({ rentals, startDate, endDate }))
    })
    .then(({ rentals, startDate, endDate }) => {
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
    .catch(error => Promise.all([
      personaServices.confirmRental({ persona, success: false }),
      propertyServices.confirmProperty({ persona, property, success: false }),
    ]))
}