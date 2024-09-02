import { RequestHandler } from 'express'
import z from 'zod'

import { Request } from '../schemas/rental.schema'
import * as rentalServices from '../services/rental.services'

export const createRental: RequestHandler<
  any,
  any,
  z.infer<typeof Request.Body.CreateRental>
> = (request, response) => {
  return rentalServices
    .createRental(request.body.persona, request.body.property)
    .then(() => response.sendStatus(201))
}

export const fetchRentals: RequestHandler<
  any,
  any,
  any,
  z.infer<typeof Request.Query.FetchRentals>
> = async (request, response) => {
  return await rentalServices
    .fetchRentals(request.query)
    .then(rentals => response.status(200).json(rentals))
}

export const fetchRental: RequestHandler = (request, response) => {
  return response.status(200).json()
}

export const patchRental: RequestHandler<
  any,
  any,
  z.infer<typeof Request.Body.PatchRental>
> = (request, response) => {
  throw new Error('Not Implemented')
}

export const deleteRental: RequestHandler = (request, response) => {
  throw new Error('Not Implemented')
}