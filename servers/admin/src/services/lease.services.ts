import * as leaseRepository from '../repositories/lease.repositories'

export const fetchLeases = modifier => {
  return leaseRepository.fetchLeases(modifier)
}

export const fetchLease = lease => {
  return leaseRepository.fetchLease(lease)
}