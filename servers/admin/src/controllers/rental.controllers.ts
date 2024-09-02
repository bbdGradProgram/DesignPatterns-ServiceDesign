import { RequestHandler } from 'express'

import * as rentalServices from '../services/rental.services'


export const addRental: RequestHandler<
  any,
  any,
  any
> = (request, response) => {
  const persona = {
    id: request.body.personaId,
  }

  const property = {
    capacity: request.body.numUnits,
  }

  return rentalServices
    .createRental(persona, property)
    .then(() => response.sendStatus(201))
}

export const postRental: RequestHandler<
  any,
  any,
  any
> = (request, response) => {
  const persona = {
    id: request.body.personaId,
  }

  const property = {
    capacity: request.body.numUnits,
  }

  if (request.query.type === 'add') {
    return rentalServices.addRentals(property)
      .then(() => response.sendStatus(201))
  }

  return rentalServices
    .createRental(persona, property)
    .then(() => response.sendStatus(201))
}

export const fetchRentals: RequestHandler<
  any,
  any,
  any,
  any
> = async (request, response) => {
  return rentalServices.fetchRentals(request.query)
    .then(rentals => response.status(200).json(rentals))
}

export const fetchRental: RequestHandler = (request, response) => {
  return rentalServices.fetchRental({ id: request.params.id })
    .then(rental => response.status(200).json(rental))
}

export const patchRental: RequestHandler<
  any,
  any,
  any
> = (request, response) => {
  const rental = {
    id: request.params.id,
    cost: request.body.cost,
    statusId: request.body.statusId,
  }

  return rentalServices.updateRental(rental)
    .then(rental => response.status(200).json(rental))
}