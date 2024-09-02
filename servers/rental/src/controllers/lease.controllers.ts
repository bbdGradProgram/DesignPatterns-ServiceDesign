import { RequestHandler } from 'express'
import z from 'zod'

import { Request } from '../schemas/lease.schemas'
import * as leaseServices from '../services/lease.services'

export const fetchLeases: RequestHandler<
  any,
  any,
  any,
  z.infer<typeof Request.Query.FetchLeases>
> = async (request, response) => {
  return await leaseServices
    .fetchLeases(request.query)
    .then(leases => response.status(200).json(leases))
}

export const fetchLease: RequestHandler = (request, response) => {
  throw new Error('Not Implemented')
}

export const patchLease: RequestHandler<
  any,
  any,
  z.infer<typeof Request.Body.PatchLease>
> = (request, response) => {
  throw new Error('Not Implemented')
}