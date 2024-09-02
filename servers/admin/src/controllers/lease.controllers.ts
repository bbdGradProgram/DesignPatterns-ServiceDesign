import { RequestHandler } from 'express'

import * as leaseServices from '../services/lease.services'

export const fetchLeases: RequestHandler<
  any,
  any,
  any,
  any
> = async (request, response) => {
  return leaseServices
    .fetchLeases(request.query)
    .then(leases => response.status(200).json(leases))
}

export const fetchLease: RequestHandler<
  any,
  any,
  any,
  any
> = async (request, response) => {
  return leaseServices
    .fetchLease({ id: request.params.id })
    .then(lease => response.status(200).json(lease))
}