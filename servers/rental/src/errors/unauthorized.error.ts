import { ResponseError } from '../types/error'

export class UnauthorizedError extends ResponseError {
  status = 401

  constructor () {
    super('Unauthorized')
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }

  serialize(): { message: string } {
    return { message: 'Unauthorized' }
  }
}