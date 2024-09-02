import * as leaseRepository from '../repositories/lease.repository'

export const fetchLeases = modifier => leaseRepository.fetchLeases(modifier)